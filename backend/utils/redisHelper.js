const redisClient = require('../config/client');

// Fetch the latest leaderboard from Redis
const getLatestLeaderboard = async () => {
  const leaderboard = await redisClient.zrevrange('leaderboard', 0, -1, 'WITHSCORES');
  const formattedLeaderboard = [];
  for (let i = 0; i < leaderboard.length; i += 2) {
    formattedLeaderboard.push({
      userName: leaderboard[i],
      userScore: parseInt(leaderboard[i + 1]),
    });
  }
  return formattedLeaderboard;
};

module.exports = {
  getLatestLeaderboard,
};
