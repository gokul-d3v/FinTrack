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

// GetDashboardData fetches stats and recent transactions
func GetDashboardData(c *gin.Context) {
	// In a real app, get UserID from context (set by auth middleware)
	// userID := c.GetString("userID")
	// For now, we'll mock or just fetch all for demo if no auth middleware yet

	// Temporarily simulate a specific user or fetch all
	// To make this work without proper auth middleware yet, we might need to pass userID in query or header
	// OR, for this demo, let's just create a dummy "demo" mode or try to find a user.

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("transactions")

	// 1. Calculate Stats (Balance, Income, Expense)
	// Pipeline to aggregate
	pipeline := mongo.Pipeline{
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: nil},
			{Key: "totalBalance", Value: bson.D{{Key: "$sum", Value: "$amount"}}},
			{Key: "totalIncome", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$gt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
			{Key: "totalExpense", Value: bson.D{{Key: "$sum", Value: bson.D{{Key: "$cond", Value: bson.A{bson.D{{Key: "$lt", Value: bson.A{"$amount", 0}}}, "$amount", 0}}}}}},
		}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
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
		// Default zero values
		responseStats = bson.M{
			"totalBalance": 0,
			"totalIncome":  0,
			"totalExpense": 0,
		}
	}

	// 2. Fetch Recent Transactions
	// Create seed data if empty? (Optional)

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

	c.JSON(http.StatusOK, gin.H{
		"stats":        responseStats,
		"transactions": transactions,
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
	transaction.Date = time.Now()
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
