const redisClient = require('../config/client');
const { getLatestLeaderboard } = require('../utils/redisHelper');

// Fetch the leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getLatestLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Clear the leaderboard (optional functionality)
const clearLeaderboard = async (req, res) => {
  try {
    await redisClient.del('leaderboard');
    req.io.emit('leaderboardUpdate', []); // Emit empty leaderboard after clearing
    res.status(200).json({ message: 'Leaderboard cleared successfully' });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getLeaderboard,
  clearLeaderboard
};
