import { Badge } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';

// Card types
const cardTypes = [
  { name: 'Cat card 😼', id: 1 },
  { name: 'Defuse card 🙅‍♂️', id: 2 },
  { name: 'Shuffle card 🔀', id: 3 },
  { name: 'Exploding kitten card 💣', id: 4 },
  { name: 'Defuse card 🙅‍♂️', id: 5 },
];

// Function to shuffle the array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

const DeckCards = ({ onGameOver }) => {
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null); // Track the active card
  const audioRef = useRef(null); // Reference to audio element

  useEffect(() => {
    // Shuffle the cards when the component mounts
    setCards(shuffleArray([...cardTypes]));
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.src = "/popsound.mp3"; // Ensure the correct path
      audioElement.load(); // Load the audio
    }

    const handleError = () => {
      console.error("Audio failed to load.");
    };

    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('error', handleError);
    };
  }, []);

  const handleDeckClick = () => {
    console.log('Deck clicked!'); // Debugging line
    // Play sound effect on click
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset sound to start
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error);
      });
    }

    // Reveal a card if there are any left
    if (cards.length > 0) {
      const cardToReveal = cards[0]; // Get the first card in the deck
      setActiveCard(cardToReveal); // Set the active card
      setCards(cards.slice(1)); // Remove the revealed card from the deck

      // Handle the revealed card based on its type
      switch (cardToReveal.id) {
        case 1: // Cat card
          console.log("Cat card drawn! It's removed from the deck.");
          break;
        case 4: // Exploding kitten card
          console.log("Exploding kitten card drawn! Game Over.");
          onGameOver(); // Notify that the game is over
          break;
        case 2: // Defuse card
          console.log("Defuse card drawn! This card is removed from the deck.");
          setCards((prevCards) => prevCards.filter(card => card.id !== 2));
          break;
        case 3: // Shuffle card
          console.log("Shuffle card drawn! Restarting the game.");
          setCards(shuffleArray([...cardTypes])); // Restart game with shuffled cards
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="relative h-40 w-full flex flex-col mt-4">
      {/* Audio element for the sound effect */}
      <audio ref={audioRef} />

      {/* Deck of Cards */}
      <div className="relative h-full" onClick={handleDeckClick}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="absolute top-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-24 h-32 flex items-center justify-center text-white cursor-pointer transition-transform transform hover:scale-105"
            style={{
              left: `${index * 30}px`,
              zIndex: cards.length - index,
              transform: `rotate(${index * 5}deg)`,
            }}
          >
            <span className="text-9xl font-bold">?</span> {/* Show a question mark for hidden cards */}
          </div>
        ))}
      </div>

      {/* Revealed Cards Section */}
      <div className="mt-36 flex items-center">
        <h3 className="text-white text-xl font-semibold mr-2">Active Card:</h3>
        <span className="text-gray-300">
          {activeCard ? (
            <span className="flex items-center">
              <span className="mr-2">{activeCard.name}</span>
            </span>
          ) : (
            <span className="italic">No card revealed yet</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default DeckCards;
