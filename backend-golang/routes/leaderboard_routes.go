package routes

import (
	"backend-golang/controllers"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

func SetupLeaderboardRoutes(r *mux.Router, redisClient *redis.Client) {
	r.HandleFunc("/leaderboard", controllers.GetLeaderboard(redisClient)).Methods("GET")
	r.HandleFunc("/leaderboard", controllers.ClearLeaderboard(redisClient)).Methods("DELETE")
}
