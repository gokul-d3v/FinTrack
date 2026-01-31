package routes

import (
	"fintrack-backend/internal/handlers"
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
			auth.GET("/apple", handlers.AppleLogin)
		}

		// Dashboard & Transactions
		api.GET("/dashboard", handlers.GetDashboardData)
		api.GET("/transactions", handlers.GetTransactions)
		api.POST("/transactions", handlers.CreateTransaction)
		api.GET("/seed", handlers.SeedData)

		// Budget
		api.GET("/budget", handlers.GetBudgetOverview)
		api.POST("/budget/category", handlers.CreateBudgetCategory)
	}
}
