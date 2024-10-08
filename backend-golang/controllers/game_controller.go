package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/go-redis/redis/v8"
	"golang.org/x/net/context"
)

// Rename ctx to gameCtx for clarity
var gameCtx = context.Background()

// Get game details
func GetGame(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userName := r.URL.Query().Get("userName")
		if userName == "" {
			http.Error(w, "Username required", http.StatusBadRequest)
			return
		}

		// Fetch game from Redis
		game, err := redisClient.HGetAll(gameCtx, userName).Result()
		if err != nil {
			http.Error(w, "Error fetching game", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(game)
	}
}

// Update game state
func UpdateGame(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var gameData map[string]interface{}
		err := json.NewDecoder(r.Body).Decode(&gameData)
		if err != nil {
			http.Error(w, "Invalid data", http.StatusBadRequest)
			return
		}

		userName := gameData["userName"].(string)
		redisClient.HMSet(gameCtx, userName, gameData)
		json.NewEncoder(w).Encode(gameData)
	}
}

// Reset game
func ResetGame(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userName := r.URL.Query().Get("userName")
		redisClient.HMSet(gameCtx, userName, map[string]interface{}{
			"gameCards":     "[]",
			"hasDefuseCard": "false",
			"activeCard":    nil,
		})
		w.WriteHeader(http.StatusOK)
	}
}
