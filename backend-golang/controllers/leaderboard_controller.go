package controllers

import (
	"encoding/json"
	"net/http"

	"backend-golang/utils"

	"github.com/go-redis/redis/v8"
	"golang.org/x/net/context"
)

var ctx = context.Background()

// Get leaderboard
func GetLeaderboard(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		leaderboard, err := utils.GetLatestLeaderboard(redisClient)
		if err != nil {
			http.Error(w, "Error fetching leaderboard", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(leaderboard)
	}
}

// Clear leaderboard
func ClearLeaderboard(redisClient *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := redisClient.Del(ctx, "leaderboard").Err()
		if err != nil {
			http.Error(w, "Error clearing leaderboard", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
