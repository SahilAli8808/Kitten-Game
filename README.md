# Exploding Kittens Game 🐱💣

A web-based single-player card game built with React, Go, and Redis.

## 🎮 Game Description

Exploding Kittens is an exciting card game where players draw cards from a deck of 5 cards. The objective is to draw all cards without drawing an exploding kitten, unless you have a defuse card!

## 🛠️ Tech Stack

- Frontend:
  - React
  - Redux (state management)
  - Radix UI (component library)
  - TailwindCSS (styling)
- Backend:
  - Go (Golang)
- Database:
  - Redis

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Go (v1.16 or higher)
- Redis (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/SahilAli8808/Kitten-Game.git
cd Kitten-Game
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
go mod download
```

4. Set up environment variables
```bash
# Frontend (.env file in frontend directory)
REACT_APP_API_URL=http://localhost:8080

# Backend (.env file in backend directory)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
PORT=5000
```

### Running the Application

1. Start Redis server
```bash
redis-server
```

2. Start the backend server
```bash
cd backend
go run main.go
```

3. Start the frontend development server
```bash
cd frontend
npm run dev
```

The game should now be running at `http://localhost:3000`

## 🎯 Game Rules

1. Start the game by clicking the "Start Game" button
2. Click on the deck to draw a card
3. Different cards have different effects:
   - Cat card: Safely removed from deck
   - Defuse card: Collected and can be used to defuse one bomb
   - Shuffle card: Restarts the game with 5 new cards
   - Exploding kitten card: Game over (unless you have a defuse card)
4. Win by successfully drawing all 5 cards without losing to an exploding kitten



