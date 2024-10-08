package routes

import (
	"backend-golang/controllers"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

func SetupGameRoutes(r *mux.Router, redisClient *redis.Client) {
	r.HandleFunc("/game", controllers.GetGame(redisClient)).Methods("GET")
	r.HandleFunc("/game", controllers.UpdateGame(redisClient)).Methods("PUT")
	r.HandleFunc("/game", controllers.ResetGame(redisClient)).Methods("DELETE")
}
