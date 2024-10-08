require('dotenv').config();  // Load environment variables
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const gameRoutes = require('./routes/gameRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const redisClient = require('./config/client');

const app = express();
const server = http.createServer(app);
const io = socketIO(server,{
  cors: {
    origin: '*', // Allow all origins
  }
});

app.use(cors(
  {
    origin: '*' // Allow all origins
  }
));
app.use(bodyParser.json());

// WebSocket middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/game', gameRoutes);
app.use('/', leaderboardRoutes);
// Add this route handler for fetching the leaderboard
  
// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('WebSocket connected');
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
