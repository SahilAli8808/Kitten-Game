package utils

import (
	"github.com/go-redis/redis/v8"
	"golang.org/x/net/context"
)

var ctx = context.Background()

func GetLatestLeaderboard(redisClient *redis.Client) ([]map[string]interface{}, error) {
	leaderboard, err := redisClient.ZRevRangeWithScores(ctx, "leaderboard", 0, -1).Result()
	if err != nil {
		return nil, err
	}

	formattedLeaderboard := make([]map[string]interface{}, 0, len(leaderboard)/2)
	for _, entry := range leaderboard {
		formattedLeaderboard = append(formattedLeaderboard, map[string]interface{}{
			"userName":  entry.Member,
			"userScore": entry.Score,
		})
	}
	return formattedLeaderboard, nil
}
