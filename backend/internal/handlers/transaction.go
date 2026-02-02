package handlers

import (
	"context"
	"fintrack-backend/internal/db"
	"fintrack-backend/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetDashboardData fetches stats, recent transactions, and chart data
func GetDashboardData(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("transactions")

	// 1. Calculate Overall Stats (Balance, Income, Expense)
	statsPipeline := mongo.Pipeline{
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: nil},
			{Key: "totalBalance", Value: bson.D{{Key: "$sum", Value: "$amount"}}},
			{Key: "totalIncome", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$gt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
			{Key: "totalExpense", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$lt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
		}}},
	}

	cursor, err := collection.Aggregate(ctx, statsPipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to aggregate stats"})
		return
	}

	var stats []bson.M
	if err = cursor.All(ctx, &stats); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse stats"})
		return
	}

	var responseStats bson.M
	if len(stats) > 0 {
		responseStats = stats[0]
	} else {
		responseStats = bson.M{"totalBalance": 0, "totalIncome": 0, "totalExpense": 0}
	}

	// 2. Fetch Recent Transactions
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "date", Value: -1}})
	findOptions.SetLimit(5)

	cursor, err = collection.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	var transactions []models.Transaction
	if err = cursor.All(ctx, &transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse transactions"})
		return
	}

	// 3. Monthly Stats (Last 6 Months)
	sixMonthsAgo := time.Now().AddDate(0, -6, 0)
	monthlyPipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "date", Value: bson.D{{Key: "$gte", Value: sixMonthsAgo}}}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: bson.D{
				{Key: "year", Value: bson.D{{Key: "$year", Value: "$date"}}},
				{Key: "month", Value: bson.D{{Key: "$month", Value: "$date"}}},
			}},
			{Key: "income", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$gt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
			{Key: "expense", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$lt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
		}}},
		{{Key: "$sort", Value: bson.D{{Key: "_id.year", Value: 1}, {Key: "_id.month", Value: 1}}}},
	}

	cursor, _ = collection.Aggregate(ctx, monthlyPipeline)
	var monthlyStats []bson.M
	cursor.All(ctx, &monthlyStats)

	// 4. Category Stats (Expenses only)
	categoryPipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "amount", Value: bson.D{{Key: "$lt", Value: 0}}}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$category"},
			{Key: "value", Value: bson.D{{Key: "$sum", Value: "$amount"}}},
		}}},
		{{Key: "$sort", Value: bson.D{{Key: "value", Value: 1}}}}, // Sort by largest expense (most negative)
	}

	cursor, _ = collection.Aggregate(ctx, categoryPipeline)
	var categoryStats []bson.M
	cursor.All(ctx, &categoryStats)

	// 5. Daily Stats (Last 7 Days)
	sevenDaysAgo := time.Now().AddDate(0, 0, -7)
	dailyPipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "date", Value: bson.D{{Key: "$gte", Value: sevenDaysAgo}}}}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: bson.D{
				{Key: "year", Value: bson.D{{Key: "$year", Value: "$date"}}},
				{Key: "month", Value: bson.D{{Key: "$month", Value: "$date"}}},
				{Key: "day", Value: bson.D{{Key: "$dayOfMonth", Value: "$date"}}},
			}},
			{Key: "income", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$gt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
			{Key: "expense", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$lt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
		}}},
		{{Key: "$sort", Value: bson.D{{Key: "_id.year", Value: 1}, {Key: "_id.month", Value: 1}, {Key: "_id.day", Value: 1}}}},
	}

	cursor, _ = collection.Aggregate(ctx, dailyPipeline)
	var dailyStats []bson.M
	cursor.All(ctx, &dailyStats)

	c.JSON(http.StatusOK, gin.H{
		"stats":         responseStats,
		"transactions":  transactions,
		"monthlyStats":  monthlyStats,
		"categoryStats": categoryStats,
		"dailyStats":    dailyStats,
	})
}

// CreateTransaction adds a new transaction
func CreateTransaction(c *gin.Context) {
	var transaction models.Transaction
	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transaction.ID = primitive.NewObjectID()
	if transaction.Date.IsZero() {
		transaction.Date = time.Now()
	}
	transaction.CreatedAt = time.Now()

	// Determine type based on amount if not set
	if transaction.Type == "" {
		if transaction.Amount >= 0 {
			transaction.Type = "income"
		} else {
			transaction.Type = "expense"
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("transactions")
	_, err := collection.InsertOne(ctx, transaction)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	c.JSON(http.StatusCreated, transaction)
}

// GetTransactions fetches all transactions
func GetTransactions(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("transactions")

	findOptions := options.Find()
	findOptions.SetSort(bson.D{{Key: "date", Value: -1}})

	cursor, err := collection.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	var transactions []models.Transaction
	if err = cursor.All(ctx, &transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse transactions"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

// SeedData inserts some dummy data for testing
func SeedData(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("transactions")

	// Check if data exists
	count, _ := collection.CountDocuments(ctx, bson.M{})
	if count > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Data already seeded"})
		return
	}

	dummyData := []interface{}{
		models.Transaction{ID: primitive.NewObjectID(), Description: "Monthly Salary", Category: "Income", Amount: 5200.00, Type: "income", Date: time.Now()},
		models.Transaction{ID: primitive.NewObjectID(), Description: "Apple Store", Category: "Electronics", Amount: -1200.00, Type: "expense", Date: time.Now().AddDate(0, 0, -1)},
		models.Transaction{ID: primitive.NewObjectID(), Description: "Starbucks", Category: "Food & Drink", Amount: -12.50, Type: "expense", Date: time.Now().AddDate(0, 0, -1)},
		models.Transaction{ID: primitive.NewObjectID(), Description: "Shell Gas", Category: "Transport", Amount: -45.00, Type: "expense", Date: time.Now().AddDate(0, 0, -1)},
		models.Transaction{ID: primitive.NewObjectID(), Description: "Netflix", Category: "Entertainment", Amount: -15.99, Type: "expense", Date: time.Now().AddDate(0, 0, -2)},
	}

	_, err := collection.InsertMany(ctx, dummyData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Seed data created"})
}
