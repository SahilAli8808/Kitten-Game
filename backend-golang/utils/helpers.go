package utils

import "math/rand"

var CHARACTERS = []string{
	"Cat card 😼",
	"Defuse card 🙅‍♂️",
	"Shuffle card 🔀",
	"Exploding kitten card 💣",
}

func GenerateRandomCards() []string {
	randomDeck := make([]string, 0, 5)
	for i := 0; i < 5; i++ {
		index := rand.Intn(len(CHARACTERS))
		randomDeck = append(randomDeck, CHARACTERS[index])
	}
	return randomDeck
}
