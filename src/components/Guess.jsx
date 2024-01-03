import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";



const Guess = () => {
  const [player, setPlayer] = useState(null);
  const [position, setPosition] = useState(null);
  const [playerImg, setPlayerImg] = useState(null);
  const [jersey, setJersey] = useState(null);
  const [college, setCollege] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [consecutiveCorrectGuesses, setConsecutiveCorrectGuesses] = useState(0);

  useEffect(() => {
    fetchRandomPlayer();
  }, [isCorrectGuess]); // Trigger a new player fetch when isCorrectGuess changes

  // Function to fetch a random player
  const fetchRandomPlayer = async () => {
    try {
      // Generate a random number to determine the position group
      const positionGroupRandom = Math.random();
      let positionGroupIndex = 0; // Default to offensive players
  
      if (positionGroupRandom < 0.45) {
        positionGroupIndex = 0; // 45% chance for offensive players
      } else if (positionGroupRandom < 0.9) {
        positionGroupIndex = 1; // 45% chance for defensive players
      } else {
        positionGroupIndex = 2; // 10% chance for special teams
      }
  
      let randomTeam = Math.floor(Math.random() * 32) + 1; // Generate a random number between 1 and 32
  
      // Fetch the team roster data based on position group
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${randomTeam}/roster`);
      const data = await response.json();
  
      // Extract player information
      const itemsArray = data.athletes[positionGroupIndex]['items'];
      const randomIndex = Math.floor(Math.random() * itemsArray.length);
  
      const randomPlayer = itemsArray[randomIndex];

      console.log(randomPlayer)
  
      if (randomPlayer.displayName || randomPlayer.fullName) {
        // If fullName is defined, set the player information
        setPlayer(randomPlayer.displayName);
        setCollege([randomPlayer.college.name, randomPlayer.college.shortName, randomPlayer.college.abbrev]);
        setPosition(randomPlayer.position.abbreviation);
        setJersey(randomPlayer.jersey);
        setPlayerImg(randomPlayer.headshot['href']);
        setIsCorrectGuess(false); // Reset the guess status
      } else {
        // If fullName is undefined, call fetchRandomPlayer again to load a different player
        fetchRandomPlayer();
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  const handleGuess = () => {
    const userGuessLowerCase = userGuess.toLowerCase();
    const collegeInfoLowerCase = college.map((info) => info.toLowerCase());
  
    if (collegeInfoLowerCase.includes(userGuessLowerCase)) {
      setIsCorrectGuess(true);
      setConsecutiveCorrectGuesses(consecutiveCorrectGuesses + 1);
      
      // Clear the input field
      setUserGuess('');
  
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.displayName);
  
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const currentCount = docSnapshot.data().collegesGuessed;
              // Ensure currentCount is a number, if not, initialize to 0
              const validCount = typeof currentCount === 'number' ? currentCount : 0;
              const updatedData = { collegesGuessed: validCount + 1 };
              updateDoc(userDocRef, updatedData);
            } else {
              const initialData = { collegesGuessed: 1 };
              setDoc(userDocRef, initialData);
            }
          })
          .catch((error) => {
            console.error('Error updating user data:', error);
          });
      }
    } else {
      setIsCorrectGuess(false);
    }
  };
  
  
  
  

  // Function to reset the game
  const resetGame = () => {
    fetchRandomPlayer();
    setIsCorrectGuess(false);
    setConsecutiveCorrectGuesses(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-center text-3xl font-semibold mb-8">Guess the College</h1>
        <div className="bg-gray-800 p-4 mx-auto rounded-lg max-w-md shadow-md text-center">
          <img src={playerImg} alt="Player" className="w-64 mx-auto mb-4" />
          <h1 className="text-gray-200 text-2xl font-semibold">{player}</h1>
          <div className="flex justify-center mt-4">
            <div className="bg-gray-900 p-2 mx-2 rounded text-gray-400">
              <p>Position</p>
              <p className="font-semibold text-2xl">{position}</p>
            </div>
            <div className="bg-gray-900 p-2 mx-2 rounded text-gray-400">
              <p>Number</p>
              <p className="font-semibold text-2xl">{jersey}</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Enter your guess"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="mt-4 text-black px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-400 w-full"
          />
          {isCorrectGuess ? (
            <div>
              <p className="mt-4 text-green-400">Your guess is correct! Loading a new player...</p>
            </div>
          ) : (
            <div className="flex justify-center mt-4 space-x-4">
              <button onClick={handleGuess} className="bg-blue-500 hover:bg-blue-600 text-gray-200 px-4 py-2 rounded-lg focus:outline-none">
                Guess
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-gray-200 px-4 py-2 rounded-lg focus:outline-none" onClick={resetGame}>
                Give Up
              </button>
            </div>
          )}
          <p className="mt-4 font-bold text-5xl">{consecutiveCorrectGuesses}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
  
  
};

export default Guess;
