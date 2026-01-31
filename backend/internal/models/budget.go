package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BudgetCategory struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Name      string             `bson:"name" json:"name"`             // Matches Transaction.Category
	Limit     float64            `bson:"limit" json:"limit"`           // Budget limit amount
	Icon      string             `bson:"icon" json:"icon,omitempty"`   // Icon name for frontend mapping
	Color     string             `bson:"color" json:"color,omitempty"` // Color code/name
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// Response struct for the budget overview API
type BudgetOverviewResponse struct {
	TotalBudget    float64          `json:"totalBudget"`
	SpentSoFar     float64          `json:"spentSoFar"`
	Remaining      float64          `json:"remaining"`
	PercentageUsed float64          `json:"percentageUsed"`
	Categories     []CategoryStatus `json:"categories"`
}

type CategoryStatus struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Limit         float64 `json:"limit"`
	Spent         float64 `json:"spent"`
	Percentage    float64 `json:"percentage"`
	Status        string  `json:"status"` // "ON TRACK", "WARNING", "CRITICAL"
	StatusColor   string  `json:"statusColor"`
	Icon          string  `json:"icon"`
	IconColor     string  `json:"iconColor"`
	IconBg        string  `json:"iconBg"`
	ProgressColor string  `json:"progressColor"`
}
