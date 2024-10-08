package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"backend-golang/config"
	"backend-golang/routes"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Create Redis client
	redisClient := config.NewRedisClient()

	// Create router
	r := mux.NewRouter()

	// Use the routes from other files
	routes.SetupGameRoutes(r, redisClient)
	routes.SetupLeaderboardRoutes(r, redisClient)

	// WebSocket setup
	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("WebSocket Upgrade failed:", err)
			return
		}
		defer conn.Close()

		log.Println("WebSocket connected")

		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Println("WebSocket disconnected:", err)
				break
			}
		}
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), r))
}
