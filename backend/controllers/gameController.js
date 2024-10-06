const redisClient = require('../config/client');

// Function to start a new game
const startGame = async (req, res) => {
  const { username } = req.body;

  // Example: Initialize a new deck for the user
  const deck = ['cat', 'cat', 'defuse', 'shuffle', 'exploding_kitten'];

  try {
    await redisClient.set(username, JSON.stringify(deck));
    res.status(200).json({ message: 'Game started', deck });
  } catch (error) {
    console.error('Error initializing game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to draw a card from the deck
const drawCard = async (req, res) => {
  const { username } = req.body;

  try {
    const deck = await redisClient.get(username);
    if (!deck) {
      return res.status(400).json({ message: 'No active game found for this user.' });
    }

    let cards = JSON.parse(deck);
    const drawnCard = cards.shift(); // Remove the first card (like drawing from a deck)

    // Update the Redis with the remaining deck
    await redisClient.set(username, JSON.stringify(cards));

    // Check game conditions
    if (drawnCard === 'exploding_kitten') {
      return res.status(200).json({ message: 'You lost! You drew an exploding kitten 💣.' });
    }

    if (cards.length === 0) {
      return res.status(200).json({ message: 'You win! No cards left 🎉.' });
    }

    res.status(200).json({ message: `Card drawn: ${drawnCard}`, remainingDeck: cards });
  } catch (error) {
    console.error('Error drawing card:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Export the game controller methods
module.exports = {
  startGame,
  drawCard,
};
