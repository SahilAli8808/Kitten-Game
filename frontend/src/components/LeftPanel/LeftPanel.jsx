import { Button, Callout } from '@radix-ui/themes';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import io from 'socket.io-client';
import { ArrowRightIcon, InfoCircledIcon }  from "@radix-ui/react-icons"

const API_BASE_URL = 'http://localhost:5000';
const socket = io(API_BASE_URL);

const cardTypes = {
  'Cat card 😼': { type: 'cat' },
  'Defuse card 🙅‍♂️': { type: 'defuse' },
  'Shuffle card 🔀': { type: 'shuffle' },
  'Exploding kitten card 💣': { type: 'bomb' },
};

const LeftPanel = () => {
  const [username, setUsername] = useState(() => localStorage.getItem('gameUsername') || '');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [defuseCards, setDefuseCards] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  // Load saved game state when component mounts
  useEffect(() => {
    const savedUsername = localStorage.getItem('gameUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsConfirmed(true);
      loadGameState(savedUsername);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Socket connection for leaderboard updates
  useEffect(() => {
    socket.on('leaderboardUpdate', (leaderboard) => {
      console.log('Leaderboard updated:', leaderboard);
    });

    // handleGameWon();

    return () => {
      socket.off('leaderboardUpdate');
    };
  }, []);

  const loadGameState = async (userToLoad) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/game?userName=${userToLoad}`);
      const { gameCards, score: userScore, hasDefuseCard, activeCard: lastActiveCard } = response.data;
      
      setCards(gameCards);
      setScore(parseInt(userScore) || 0);
      setDefuseCards(hasDefuseCard === 'true' ? 1 : 0);
      setActiveCard(lastActiveCard || null);
      
      if (gameCards.length === 0) {
        await initializeGame(userToLoad);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
      toast.error('Failed to load game state');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameState = async (newState) => {
    try {
      await axios.put(`${API_BASE_URL}/game`, {
        userName: username,
        ...newState
      });
    } catch (error) {
      console.error('Error saving game state:', error);
      toast.error('Failed to save game state');
    }
  };

  // create new cards for the game
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




  const initializeGame = async (userToInitialize = username) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game?userName=${userToInitialize}`);

      const { gameCards } = response.data;
      
      const newState = {
        gameCards,
        score: 0,
        hasDefuseCard: 'false',
        activeCard: null
      };
      
      setCards(gameCards);
      setScore(0);
      setDefuseCards(0);
      setActiveCard(null);
      
      await saveGameState(newState);
    } catch (error) {
      console.error('Error initializing game:', error);
      toast.error('Failed to initialize game');
    }
  };

  const shuffleGame = async (userToInitialize = username) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game?userName=${userToInitialize}`);

      const gameCards  = generateRandomCards();
      console.log(gameCards);
      
      const newState = {
        gameCards,
        // score: 0,
        hasDefuseCard: 'false',
        activeCard: null
      };
      
      setCards(gameCards);
      setActiveCard(null);
      
      await saveGameState(newState);
    } catch (error) {
      console.error('Error initializing game:', error);
      toast.error('Failed to initialize game');
    }
  };

  const handleStartGames = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username!");
      return;
    }
    localStorage.setItem('gameUsername', username);
    setIsConfirmed(true);
    await loadGameState(username);
    toast.success(`Welcome back, ${username}! Your game has been loaded.`);
  };

  const handleStartGame = async () => {
    await shuffleGame();
    toast.success("New game started! Good luck!");
  };

  //won the game 
  function handleGameWon() {
    if (cards.length === 0) {
      alert("You've won! your score is 10 would you like to play again?");
      // shuffleGame();
      return;
    }
  }

  const handleCardReveal = async () => {
    if (cards.length === 0) {
      toast.success("You've won! All cards revealed safely!");
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }

    const currentCard = cards[0];
    const remainingCards = cards.slice(1);
    setActiveCard(currentCard);

    let newState = {
      gameCards: remainingCards,
      activeCard: currentCard,
      hasDefuseCard: defuseCards > 0 ? 'true' : 'false',
      score
    };

    switch (cardTypes[currentCard]?.type) {
      case 'cat':
        newState.score = score + 1;
        setScore(prev => prev + 1);
        toast.success("Cat card! +1 point");
        break;
      case 'defuse':
        setDefuseCards(prev => prev + 1);
        newState.hasDefuseCard = 'true';
        toast.success("Defuse card obtained!");
        break;
      case 'bomb':
        if (defuseCards > 0) {
          setDefuseCards(prev => prev - 1);
          newState.hasDefuseCard = 'false';
          toast.success("Bomb defused! Close call!");
        } else {
          toast.error("💣 BOOM! Game Over!");
          setTimeout(() => handleStartGame(), 2000);
          alert("💣 BOOM! Game Over! You loose the Game..Would you like to play again?");
          return;
        }
        break;
      case 'shuffle':
        toast.success("Shuffling deck...");

        
        setTimeout(() => {
          shuffleGame();
        }, 1000);
        return;
    }

    setCards(remainingCards);
    await saveGameState(newState);
  };

  const handleLogout = () => {
    localStorage.removeItem('gameUsername');
    setUsername('');
    setIsConfirmed(false);
    setCards([]);
    setActiveCard(null);
    setDefuseCards(0);
    setScore(0);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">
      <div className="text-white text-xl">Loading your game...</div>
    </div>;
  }

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg w-auto">
      <h2 className="text-3xl font-bold mb-2">Exploding Kitten Game</h2>
  
      <p className="mb-4">
        {isConfirmed ? `Welcome , ${username}!` : 'Enter your username to continue your game!'}
      </p>

      {!isConfirmed ? (
        <div className="mb-4 w-full flex space-x-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2"
          />
          <Button onClick={handleStartGames}>
            Start Game <ArrowRightIcon />
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-2">
            {/* <Button onClick={handleStartGame} className="px-4 py-2">
              New Game
            </Button> */}
            <Button onClick={handleLogout} className="px-4 py-2">
              Exit Game
            </Button>
          </div> 
          <div className="flex space-x-4">
            <h3 className="text-white text-xl font-semibold ml-3">Score: {score}</h3>
            <h3 className="text-white text-xl font-semibold">Defuse Cards: {defuseCards}</h3>
          </div>
        </div>
      )}

      {isConfirmed && (
        <>
          {/* <h6 className="text-md text-white font-bold mb-2">Tap on the deck to reveal the card</h6> */}
          <Callout.Root>
	<Callout.Icon>
		<InfoCircledIcon />
	</Callout.Icon>
	<Callout.Text>
  Tap on the deck to reveal the card
	</Callout.Text>
</Callout.Root>

          <div className="relative h-40 w-full flex flex-col mt-4">
            <audio ref={audioRef} src="/popsound.mp3" />
            
            <div className="relative h-full" onClick={handleCardReveal}>
  {cards.length > 0 ? (
    cards.map((card, index) => (
      <div
        key={index}
        className="absolute top-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-24 h-32 flex items-center justify-center text-white cursor-pointer transition-transform transform hover:scale-105"
        style={{
          left: `${index * 30}px`,
          zIndex: cards.length - index,
          transform: `rotate(${index * 5}deg)`,
        }}
      >
        <span className="text-4xl font-bold">?</span>
      </div>
    ))
  ) : (
    // Congratulations! You've won the game!
    <div className="">
      <h1 className="text-lg font-bold mb-3">🎉 Congratulations! You Won the Game..</h1>
      <Button onClick={handleStartGame} className="px-4 py-2 mt-4">
        Play Again
      </Button>
    </div>
  )}
</div>


            <div className="mt-36 flex items-center">
              <h3 className="text-white text-xl font-semibold mr-2">Active Card:</h3>
              <span className="text-gray-300">
                {activeCard ? (
                  <span className="flex items-center">
                    <span className="mr-2">{activeCard}</span>
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