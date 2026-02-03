package routes

import (
	"fintrack-backend/internal/handlers"
	"fintrack-backend/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Backend is running"})
		})

		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
			auth.GET("/google", handlers.GoogleLogin)
			auth.GET("/google/callback", handlers.GoogleCallback)
			auth.GET("/apple", handlers.AppleLogin)
		}

		// Protected Routes
		protected := r.Group("/api")
		protected.Use(middleware.AuthMiddleware())
		{
			// Dashboard & Transactions
			protected.GET("/dashboard", handlers.GetDashboardData)
			protected.GET("/transactions", handlers.GetTransactions)
			protected.POST("/transactions", handlers.CreateTransaction)

			// Budget
			protected.GET("/budget", handlers.GetBudgetOverview)
			protected.POST("/budget/category", handlers.CreateBudgetCategory)
			protected.PUT("/budget/category/:id", handlers.UpdateBudgetCategory)
			protected.DELETE("/budget/category/:id", handlers.DeleteBudgetCategory)

			// Goals
			protected.GET("/goals", handlers.GetGoals)
			protected.POST("/goals", handlers.CreateGoal)
			protected.PUT("/goals/:id", handlers.UpdateGoal)
			protected.DELETE("/goals/:id", handlers.DeleteGoal)
		}

		api.GET("/seed", handlers.SeedData) // Keep seed public for now or protect it too
	}
}
