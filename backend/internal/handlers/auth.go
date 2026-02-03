package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"fintrack-backend/internal/db"
	"fintrack-backend/internal/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	"fintrack-backend/internal/auth"
)

func Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Normalize email
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if email exists
	count, err := collection.CountDocuments(ctx, bson.M{"email": input.Email})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking user"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	user := models.User{
		ID:        primitive.NewObjectID(),
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
		return
	}

	// Generate Token
	token, err := auth.GenerateToken(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    user,
		"token":   token,
	})
}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Normalize email
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))

	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		fmt.Println("Login Error: User not found for email:", input.Email) // Debug log
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if user.Provider == "google" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in with Google"})
		return
	}

	fmt.Printf("Login Debug - Stored Hash: %s... (len: %d)\n", user.Password[:10], len(user.Password))
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		fmt.Println("Login Error: Password mismatch for user:", input.Email) // Debug log
		fmt.Printf("Login Error Details: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate Token
	token, err := auth.GenerateToken(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    user,
		"token":   token,
	})
}

var googleOauthConfig *oauth2.Config

func getGoogleOauthConfig() *oauth2.Config {
	if googleOauthConfig == nil {
		googleOauthConfig = &oauth2.Config{
			RedirectURL:  "http://localhost:8080/api/auth/google/callback",
			ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
			Endpoint:     google.Endpoint,
		}
	}
	return googleOauthConfig
}

func GoogleLogin(c *gin.Context) {
	url := getGoogleOauthConfig().AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	token, err := getGoogleOauthConfig().Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Code exchange failed"})
		return
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user info"})
		return
	}
	defer resp.Body.Close()

	content, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read user info"})
		return
	}

	var googleUser struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := json.Unmarshal(content, &googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user info"})
		return
	}

	// Normalize email
	googleUser.Email = strings.ToLower(googleUser.Email)

	// Check if user exists
	collection := db.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = collection.FindOne(ctx, bson.M{"email": googleUser.Email}).Decode(&user)

	if err != nil {
		// Create new user
		newUser := models.User{
			ID:        primitive.NewObjectID(),
			Name:      googleUser.Name,
			Email:     googleUser.Email,
			Provider:  "google",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		_, err = collection.InsertOne(ctx, newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
			return
		}
		user = newUser
	} else {
		// Update provider if not set (merging accounts strictly by email is risky, but common in simple apps)
		// Or if provider is different, might want to handle it. For now, assume it's fine.
		if user.Provider == "" {
			update := bson.M{"$set": bson.M{"provider": "google", "updated_at": time.Now()}}
			collection.UpdateOne(ctx, bson.M{"_id": user.ID}, update)
		}
	}

	// Generate Token
	jwtToken, err := auth.GenerateToken(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating token"})
		return
	}

	// For Google Login, we might want to redirect to frontend with token in query param
	// OR return JSON if this is called via AJAX (but usually it's a redirect flow)
	// Assuming frontend handles the callback or we redirect with token:
	// c.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/auth/callback?token="+token)
	// But current implementation returns JSON:
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    user,
		"token":   jwtToken,
	})
}

func AppleLogin(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Apple Login endpoint"})
}
