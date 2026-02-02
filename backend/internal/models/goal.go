package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Goal struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID        primitive.ObjectID `bson:"user_id" json:"user_id"`
	Name          string             `bson:"name" json:"name"`
	TargetAmount  float64            `bson:"target_amount" json:"target_amount"`
	CurrentAmount float64            `bson:"current_amount" json:"current_amount"`
	Color         string             `bson:"color" json:"color"` // e.g., "bg-blue-500"
	Icon          string             `bson:"icon" json:"icon"`   // e.g., "house"
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`
}
