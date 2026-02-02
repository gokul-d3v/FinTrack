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
)

// GetGoals fetches all goals
func GetGoals(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("goals")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch goals"})
		return
	}

	var goals []models.Goal
	if err = cursor.All(ctx, &goals); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse goals"})
		return
	}

	c.JSON(http.StatusOK, goals)
}

// CreateGoal adds a new goal
func CreateGoal(c *gin.Context) {
	var goal models.Goal
	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	goal.ID = primitive.NewObjectID()
	goal.CreatedAt = time.Now()

	// Default values if missing
	if goal.Color == "" {
		goal.Color = "bg-blue-500"
	}
	if goal.Icon == "" {
		goal.Icon = "savings"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("goals")
	_, err := collection.InsertOne(ctx, goal)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create goal"})
		return
	}

	c.JSON(http.StatusCreated, goal)
}

// UpdateGoal updates a goal (e.g. adding savings)
func UpdateGoal(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var updateData struct {
		CurrentAmount float64 `json:"current_amount"`
	}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("goals")

	update := bson.M{
		"$set": bson.M{"current_amount": updateData.CurrentAmount},
	}

	_, err = collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update goal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Goal updated"})
}

// DeleteGoal removes a goal
func DeleteGoal(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := db.Client.Database("fintrack").Collection("goals")
	_, err = collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete goal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Goal deleted"})
}
