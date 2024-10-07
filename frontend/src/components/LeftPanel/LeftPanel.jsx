import { Button } from '@radix-ui/themes';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

// Card types
const cardTypes = [
  { name: 'Cat card 😼', id: 1, type: 'cat' },
  { name: 'Defuse card 🙅‍♂️', id: 2, type: 'defuse' },
  { name: 'Shuffle card 🔀', id: 3, type: 'shuffle' },
  { name: 'Exploding kitten card 💣', id: 4, type: 'bomb' },
  { name: 'Defuse card 🙅‍♂️', id: 5, type: 'defuse' },
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const LeftPanel = () => {
  const [username, setUsername] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [defuseCards, setDefuseCards] = useState(0);
  const [score, setScore] = useState(0);
  const audioRef = useRef(null);

  const initializeGame = () => {
    setCards(shuffleArray([...cardTypes]));
    setDefuseCards(0);
    setScore(0);
    setActiveCard(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleConfirm = () => {
    if (!username.trim()) {
      toast.error("Please enter a username!");
      return;
    }
    setIsConfirmed(true);
    toast.success(`Game Started...Tap and play card, ${username}!`);
  };

  const handleStartGame = () => {
    initializeGame();
    toast.success("Game restarted! Good luck!");
  };

  const handleCardReveal = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }

    if (cards.length === 0) {
      toast.success("You've won! All cards revealed safely!");
      return;
    }

    const currentCard = cards[0];
    const remainingCards = cards.slice(1);
    setActiveCard(currentCard);

    switch (currentCard.type) {
      case 'cat':
        setScore(prev => prev + 1);
        setCards(remainingCards);
        toast.success("Cat card! +1 point");
        break;
      case 'defuse':
        setDefuseCards(prev => prev + 1);
        setCards(remainingCards);
        toast.success("Defuse card obtained!");
        break;
      case 'bomb':
        if (defuseCards > 0) {
          setDefuseCards(prev => prev - 1);
          setCards(remainingCards);
          toast.warning("Bomb defused! Close call!");
        } else {
          toast.error("💣 BOOM! Game Over!");
          setTimeout(() => handleStartGame(), 2000);
        }
        break;
      case 'shuffle':
        toast.success("Shuffling deck...");
        setTimeout(() => {
          initializeGame();
        }, 1000);
        break;
      default:
        setCards(remainingCards);
    }
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg w-96">
      <h1 className="text-3xl text-white font-bold mb-2">Exploding Kitten Game</h1>
      <p className="text-white mb-4">
        {isConfirmed ? `Welcome, ${username}!` : 'Enter your username to join the fun!'}
      </p>

      {!isConfirmed ? (
        <div className="mb-4 w-full flex space-x-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="flex-grow p-2  border  rounded focus:outline-none focus:ring-2"
          />
          <Button 
            onClick={handleConfirm}
            // className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Game
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={handleStartGame}
            className="px-4 py-2"
          >
            Play Again
          </Button>
          <div className="flex space-x-4">
            <h3 className="text-white text-xl font-semibold">Score: {score}</h3>
            <h3 className="text-white text-xl font-semibold">Defuse Cards: {defuseCards}</h3>
          </div>
        </div>
      )}

      {isConfirmed && (
        <>
          <h6 className="text-md text-white font-bold mb-2">Tap on the deck to reveal the card</h6>
          <div className="relative h-40 w-full flex flex-col mt-4">
            <audio ref={audioRef} src="/popsound.mp3" />
            
            <div className="relative h-full" onClick={handleCardReveal}>
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
                  <span className="text-4xl font-bold">?</span>
                </div>
              ))}
            </div>

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
        </>
      )}
    </div>
  );
};

export default LeftPanel;