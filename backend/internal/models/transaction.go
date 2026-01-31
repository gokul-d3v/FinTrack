package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Transaction struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	Date        time.Time          `bson:"date" json:"date"`
	Description string             `bson:"description" json:"description"`
	Category    string             `bson:"category" json:"category"`
	Amount      float64            `bson:"amount" json:"amount"`       // Positive for income, negative for expense
	Type        string             `bson:"type" json:"type"`           // "income" or "expense"
	Icon        string             `bson:"icon,omitempty" json:"icon"` // E.g., "coffee", "shopping-bag"
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}
