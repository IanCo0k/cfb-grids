import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { TwitterShareButton } from 'react-share'; // Import TwitterShareButton



const Guess = () => {
  const [player, setPlayer] = useState(null);
  const [position, setPosition] = useState(null);
  const [playerImg, setPlayerImg] = useState(null);
  const [jersey, setJersey] = useState(null);
  const [college, setCollege] = useState(null);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [consecutiveCorrectGuesses, setConsecutiveCorrectGuesses] = useState(0);

  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState(null);

  const [team, setTeam] = useState(null);

  useEffect(() => {
    // Initialize Firebase Authentication
    const auth = getAuth();

    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
        console.log(currentUser.displayName);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    // Function to update 'views' value in 'guessGame' document
    const updateViews = async () => {
      try {
        const db = getFirestore();
        const gameDocRef = doc(db, 'views', 'guessGame'); // Replace with your actual document ID
        const userDataRef = doc(db, 'users', user.displayName);

        const userDataSnapshot = await getDoc(userDataRef);

        if (userDataSnapshot.exists()) {
          console.log(userDataSnapshot.data().favoriteTeam);
          setTeam(userDataSnapshot.data().favoriteTeam);
          
        } else {
          console.log("User document does not exist. Creating user fields...");

        }


        
        const docSnapshot = await getDoc(gameDocRef);
        
        if (docSnapshot.exists()) {
          const currentViews = docSnapshot.data().views;
          // Ensure currentViews is a number, if not, initialize to 0
          const validViews = typeof currentViews === 'number' ? currentViews : 0;
          const updatedData = { views: validViews + 1 };
          await updateDoc(gameDocRef, updatedData);
        } else {
          // Create the document if it doesn't exist
          const initialData = { views: 1 };
          await setDoc(gameDocRef, initialData);
        }
      } catch (error) {
        console.error('Error updating views:', error);
      }
    };

    // Call the updateViews function when the component mounts
    updateViews();

    const fetchLeaderboard = async () => {
      try {
        const db = getFirestore();
        const streaksDocRef = doc(db, 'streakLeaderboard', 'streaks');
        const streaksDocSnapshot = await getDoc(streaksDocRef);
        const streaksData = streaksDocSnapshot.exists() ? streaksDocSnapshot.data().streaks : [];

        // Sort the streaks data in descending order based on the streak value
        streaksData.sort((a, b) => b.streak - a.streak);

        // Limit to top 5 scores
        const top5 = streaksData.slice(0, 5);

        // Set the leaderboard state
        setLeaderboard(top5);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);


  useEffect(() => {
    fetchRandomPlayer();
  }, [isCorrectGuess]); // Trigger a new player fetch when isCorrectGuess changes

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
      
      // Filter out players that don't have displayName or fullName
      const filteredPlayers = itemsArray.filter(player => player.displayName || player.fullName);
  
      if (filteredPlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredPlayers.length);
        const randomPlayer = filteredPlayers[randomIndex];
  
        console.log(randomPlayer);
  
        // Set the player information
        setPlayer(randomPlayer.displayName || randomPlayer.fullName);
        setCollege([randomPlayer.college.name, randomPlayer.college.shortName, randomPlayer.college.abbrev]);
        setPosition(randomPlayer.position.abbreviation);
        setJersey(randomPlayer.jersey);
        setPlayerImg(randomPlayer.headshot['href']);
        setIsCorrectGuess(false); // Reset the guess status
      } else {
        // If no valid players are found, call fetchRandomPlayer again to load a different player
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
  
  
  
  

  const resetGame = async () => {
    // Fetch the current streaks data
    const db = getFirestore();
    const streaksDocRef = doc(db, 'streakLeaderboard', 'streaks');
  
    try {
      const streaksDocSnapshot = await getDoc(streaksDocRef);
      let streaksData = [];
  
      if (streaksDocSnapshot.exists()) {
        streaksData = streaksDocSnapshot.data().streaks || [];
      }
  
      // Create an object to represent the user's data
      const userData = {
        streak: consecutiveCorrectGuesses,
        favoriteTeam: team,
      };

      console.log(team + " this is the team")
  
      // Add the user's data to the streaks data
      streaksData.push(userData);
  
      // Sort the streaks data in descending order based on the streak value
      streaksData.sort((a, b) => b.streak - a.streak);
  
      // Limit the streaks data to a certain number of top scores (e.g., 10)
      const maxTopScores = 10;
      streaksData = streaksData.slice(0, maxTopScores);
  
      // Update the streaks field in the streakLeaderboard document
      await updateDoc(streaksDocRef, {
        streaks: streaksData,
      });
  
      // Fetch a new random player and reset game-related state
      fetchRandomPlayer();
      setConsecutiveCorrectGuesses(0);
    } catch (error) {
      console.error('Error updating streakLeaderboard:', error);
    }
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
              <TwitterShareButton
              url="https://cfbgrids.com/#/guess"
              title={`I just got a streak of ${consecutiveCorrectGuesses} on @CFBGrids NFL College Guesser. \n\nCan you beat it?\n\n`}
            >
              <button className="bg-blue-400 hover:bg-blue-500 text-gray-200 px-4 py-2 rounded-lg focus:outline-none">
                Tweet Score
              </button>
            </TwitterShareButton>
            </div>
          )}
          <p className='mt-3 font-semibold'>Your Streak</p>
          <p className="mt-2 font-bold text-5xl">{consecutiveCorrectGuesses}</p>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Leaderboard</h2>
            <ul>
              {leaderboard.map((entry, index) => (
                <li key={index} className="flex mx-auto items-center justify-between py-2">
                  <div className="flex w-full justify-center items-center space-x-2">
                    <span className='font-bold text-3xl'>{entry.streak}</span>
                    <img src={entry.favoriteTeam} alt={`Team ${index + 1}`} className="w-12 h-12" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
  
  
};

export default Guess;
