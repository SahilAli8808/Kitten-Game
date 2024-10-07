const redisClient = require('../config/client');
const { generateRandomCards } = require('../utils/index');
const { getLatestLeaderboard } = require('../utils/redisHelper');

// Start or get game details for a user
const getGame = async (req, res) => {
  try {
    const { userName } = req.query;
    if (!userName) return res.status(400).json({ message: "Username required" });

    // Check if the user already exists
    const isMember = await redisClient.exists(userName);

    // Initiate the game if it's a new user
    if (!isMember) {
      const randomCards = generateRandomCards();
      await redisClient.hmset(
        userName,
        'score', 0,
        'gameCards', JSON.stringify(randomCards),
        'hasDefuseCard', 'false',
        'activeCard', null
      );
      await redisClient.zadd('leaderboard', 0, userName);
    }

    const game = await redisClient.hgetall(userName);

    // Emit the latest leaderboard
    const leaderboardLatest = await getLatestLeaderboard();
    req.io.emit('leaderboardUpdate', leaderboardLatest);

    res.status(200).json({
      ...game,
      gameCards: JSON.parse(game.gameCards || '[]'),
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update the game state for a user
const updateGame = async (req, res) => {
  try {
    const { userName, hasDefuseCard, activeCard, score = 0 } = req.body;
    const gameCards = req.body.gameCards || generateRandomCards();

    await redisClient.hmset(
      userName,
      'gameCards', JSON.stringify(gameCards),
      'hasDefuseCard', hasDefuseCard,
      'activeCard', activeCard,
      'score', score
    );

    await redisClient.zadd('leaderboard', score, userName);

    // Emit the latest leaderboard
    const leaderboardLatest = await getLatestLeaderboard();
    req.io.emit('leaderboardUpdate', leaderboardLatest);

    res.status(200).json({ ...req.body, gameCards, score });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Reset the game state for a user
const resetGame = async (req, res) => {
  try {
    const { userName } = req.body;

    await redisClient.hmset(
      userName,
      'gameCards', '[]',
      'hasDefuseCard', 'false',
      'activeCard', null
    );

    const score = await redisClient.hget(userName, 'score');
    await redisClient.zadd('leaderboard', score, userName);

    // Emit the latest leaderboard
    const leaderboardLatest = await getLatestLeaderboard();
    req.io.emit('leaderboardUpdate', leaderboardLatest);

    res.status(200).json({ message: 'Game reset successful' });
  } catch (error) {
    console.error('Error resetting game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  getGame,
  updateGame,
  resetGame
};
