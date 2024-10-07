const CHARACTERS = [
    'Cat card 😼',
    'Defuse card 🙅‍♂️',
    'Shuffle card 🔀',
    'Exploding kitten card 💣',
  ];
  
  const generateRandomCards = () => {
    const randomDeck = [];
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * CHARACTERS.length);
      randomDeck.push(CHARACTERS[index]);
    }
    return randomDeck;
  };
  
  module.exports = {
    generateRandomCards,
  };
  