package main

import (
	"backend-golang/config"
	"backend-golang/routes"
	"fmt"
	"log"
	"net/http"
	"os"

	socketio "github.com/googollee/go-socket.io"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

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

	// Create Socket.IO server
	server := socketio.NewServer(nil)

	// Socket.IO event handlers
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "msg", func(s socketio.Conn, msg string) {
		fmt.Println("message:", msg)
		s.Emit("reply", "got "+msg)
	})

	server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("error:", e)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	go server.Serve()
	defer server.Close()

	// Use the routes from other files
	routes.SetupGameRoutes(r, redisClient)
	routes.SetupLeaderboardRoutes(r, redisClient)

	// Handle Socket.IO
	r.Handle("/socket.io/", server)

	// Create a CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Add your frontend URL
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	// Use the CORS middleware
	handler := c.Handler(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	log.Printf("Server running on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), handler))
}
