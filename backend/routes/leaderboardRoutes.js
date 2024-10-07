const express = require("express");
const router = express.Router();
const { getLeaderboard, clearLeaderboard } = require("../controllers/leaderboardController");

// Route to get the current leaderboard
router.get("/leaderboard", getLeaderboard);

// Optional: Route to clear the leaderboard (for admin purposes)
router.delete("/leaderboard", clearLeaderboard);

module.exports = router;
