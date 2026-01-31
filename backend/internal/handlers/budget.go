package handlers

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"fintrack-backend/internal/db"
	"fintrack-backend/internal/models"
)

// GetBudgetOverview returns the budget summary and category breakdown
func GetBudgetOverview(c *gin.Context) {
	var user models.User
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find the default user (temporary for MVP)
	err := db.Client.Database("fintrack").Collection("users").FindOne(ctx, bson.M{}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	userID := user.ID

	// 1. Get all Budget Categories for this user
	var budgets []models.BudgetCategory
	cursor, err := db.Client.Database("fintrack").Collection("budgets").Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch budgets"})
		return
	}
	if err = cursor.All(ctx, &budgets); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse budgets"})
		return
	}

	// Calculate date range for current month
	now := time.Now()
	currentYear, currentMonth := now.Year(), now.Month()
	startDate := time.Date(currentYear, currentMonth, 1, 0, 0, 0, 0, now.Location())
	endDate := startDate.AddDate(0, 1, 0)

	// If no budgets exist, seed some defaults!
	if len(budgets) == 0 {
		budgets = SeedDefaultBudgets(userID)
	}

	// 2. Get Transactions for the current month (Expenses only)
	var transactions []models.Transaction
	tCursor, err := db.Client.Database("fintrack").Collection("transactions").Find(ctx, bson.M{
		"user_id": userID,
		"date": bson.M{
			"$gte": startDate,
			"$lt":  endDate,
		},
		"type": "expense",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}
	if err = tCursor.All(ctx, &transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse transactions"})
		return
	}

	// 3. Calculate Stats
	totalBudgetLimit := 0.0
	totalSpent := 0.0

	// Map to store spent amount per category
	categorySpent := make(map[string]float64)
	for _, t := range transactions {
		amt := math.Abs(t.Amount)
		categorySpent[t.Category] += amt
		totalSpent += amt
	}

	var categoryStatuses []models.CategoryStatus

	for _, b := range budgets {
		spent := categorySpent[b.Name]
		totalBudgetLimit += b.Limit

		pct := 0.0
		if b.Limit > 0 {
			pct = (spent / b.Limit) * 100
		}

		// Determine Status based on percentage used
		status := "ON TRACK"
		statusColor := "text-green-600"

		if pct >= 100 {
			status = "CRITICAL"
			statusColor = "text-red-600"
		} else if pct >= 80 {
			status = "WARNING"
			statusColor = "text-orange-600"
		}

		// Generate UI colors based on category color
		// Assuming b.Color is like "orange", "blue", etc.
		iconBg := fmt.Sprintf("bg-%s-100", b.Color)
		iconColor := fmt.Sprintf("text-%s-600", b.Color)
		progressColor := fmt.Sprintf("bg-%s-500", b.Color)

		categoryStatuses = append(categoryStatuses, models.CategoryStatus{
			ID:            b.ID.Hex(),
			Name:          b.Name,
			Limit:         b.Limit,
			Spent:         spent,
			Percentage:    math.Round(pct),
			Status:        status,
			StatusColor:   statusColor,
			Icon:          b.Icon,
			IconBg:        iconBg,
			IconColor:     iconColor,
			ProgressColor: progressColor,
		})
	}

	// Overall Percentage
	overallPct := 0.0
	if totalBudgetLimit > 0 {
		overallPct = (totalSpent / totalBudgetLimit) * 100
	}

	response := models.BudgetOverviewResponse{
		TotalBudget:    totalBudgetLimit,
		SpentSoFar:     totalSpent,
		Remaining:      totalBudgetLimit - totalSpent,
		PercentageUsed: math.Round(overallPct),
		Categories:     categoryStatuses,
	}

	c.JSON(http.StatusOK, response)
}

// CreateBudgetCategory adds a new budget category
func CreateBudgetCategory(c *gin.Context) {
	var input models.BudgetCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user (MVP)
	var user models.User
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	db.Client.Database("fintrack").Collection("users").FindOne(ctx, bson.M{}).Decode(&user)

	input.ID = primitive.NewObjectID()
	input.UserID = user.ID
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	// Insert
	_, err := db.Client.Database("fintrack").Collection("budgets").InsertOne(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create budget category"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

func SeedDefaultBudgets(userID primitive.ObjectID) []models.BudgetCategory {
	defaults := []models.BudgetCategory{
		{UserID: userID, Name: "Food", Limit: 800, Icon: "Utensils", Color: "orange"},
		{UserID: userID, Name: "Rent & Housing", Limit: 2400, Icon: "Home", Color: "green"},
		{UserID: userID, Name: "Transport", Limit: 300, Icon: "Bus", Color: "blue"}, // mapped to Plane icon in UI often, or Bus
		{UserID: userID, Name: "Entertainment", Limit: 400, Icon: "Music", Color: "purple"},
		{UserID: userID, Name: "Bills", Limit: 500, Icon: "Zap", Color: "yellow"},
		{UserID: userID, Name: "Shopping", Limit: 600, Icon: "ShoppingBag", Color: "pink"},
	}

	var result []models.BudgetCategory
	ctx := context.TODO()

	for _, b := range defaults {
		b.ID = primitive.NewObjectID()
		b.CreatedAt = time.Now()
		b.UpdatedAt = time.Now()

		_, err := db.Client.Database("fintrack").Collection("budgets").InsertOne(ctx, b)
		if err == nil {
			result = append(result, b)
		}
	}
	return result
}
