import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
import Modal from './components/Modal';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import the functions you need from the SDKs you need
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';
import { FaTrophy } from 'react-icons/fa';


import b1gLogo from './b1g.png';
import pacLogo from './pac.png';
import accLogo from './acc.png';
import secLogo from './sec.png';
import b12Logo from './big12.png';
import mac from './mac.png'
import mwc from './mwc.png';
import aac from './aac.png';
import cusa from './cusa.png';
import sbc from './sbc.png';

import qb from './data/qb';
import rb from './data/rb';
import wr from './data/wr';
import transfers from './data/transfers';
import draft from './data/draft';
import sep20 from './data/sep20';
import teams from './data/teams';
import heisman from './data/heisman';

export default function CFB() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  
const firebaseConfig = {
  apiKey: "AIzaSyAdreRzDSZnBZqCZ21yyv80q8vQRv5dQb0",
  authDomain: "cfb-grids.firebaseapp.com",
  projectId: "cfb-grids",
  storageBucket: "cfb-grids.appspot.com",
  messagingSenderId: "1039307534466",
  appId: "1:1039307534466:web:15d09918f2a3305646049b",
  measurementId: "G-V6ZFJVRZGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

  const [currentUser, setUser] = useState(null); // Store user information

  const [cellPercentages, setCellPercentages] = useState({
    topLeft: 0,
    topMiddle: 0,
    topRight: 0,
    middleLeft: 0,
    middleMiddle: 0,
    middleRight: 0,
    bottomLeft: 0,
    bottomMiddle: 0,
    bottomRight: 0
  });

  const [showTweetButton, setShowTweetButton] = useState(true);
  const [tweetText, setTweetText] = useState();

  const [rarityScore, setRarityScore] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    
    function userSet() {
      // Listen for changes in the user's authentication state
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          // User is signed in
          setUser(currentUser);
        } else {
          // User is signed out
          setUser(null);
        }
      });
    }

    userSet();

  }, []);

  useEffect(() => {
    // Calculate the rarity score based on cellPercentages
    const updatedRarityScore = Object.values(cellPercentages).reduce((total, percentage) => total + percentage, 0);
  
    // Check if any cellPercentage value is equal to 0
    const hasZeroPercentage = Object.values(cellPercentages).some(percentage => percentage === 0);
  
    setShowTweetButton(!hasZeroPercentage);

    if (!hasZeroPercentage) {
      postRarityScore(updatedRarityScore);
    }
  
    setTweetText(`CFB Grids\n\nRarity Score: ${updatedRarityScore.toFixed(2)}\n\n@CFBGrids / cfbgrids.com`);
  
    // Update the rarity score in the state
    setRarityScore(updatedRarityScore.toFixed(2));
  }, [cellPercentages]);

  const postRarityScore = async (score, user) => {
    const db = getFirestore();
  
    try {
      // Reference to the current user's document in the 'users' collection
      const userDocRef = doc(db, 'users', currentUser.displayName);
  
      // Fetch the current user's document
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        // Extract the user's data
        const userData = userDocSnapshot.data();
  
        // Initialize topRarities as an empty array if it doesn't exist
        const topRarities = userData.topRarities || [];
  
        // Append the new score to the user's 'topRarities' array
        const updatedTopRarities = [...topRarities, score];
  
        // Update the 'topRarities' field in the user's document
        await updateDoc(userDocRef, { topRarities: updatedTopRarities });

        const leaderboardRef = doc(db, 'dailyLeaderboard', 'dec29leaders');

      // Fetch current scores data from the database
      const docSnapshot = await getDoc(leaderboardRef);
      const currentScores = docSnapshot.data().scores || [];
      
      // Add new score without limiting the array size
      const updatedScores = [...currentScores, score];
      
      // Write the updated scores back to the database
      await updateDoc(leaderboardRef, { scores: updatedScores });
  
        console.log('Rarity score updated successfully.');
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  
  

  const [topTeam, setTopTeam] = useState('Alabama');
  const [middleTeam, setMiddleTeam] = useState('Florida');
  const [bottomTeam, setBottomTeam] = useState('Texas');

  const [topConference, setTopConference] = useState('Big Ten');
  const [middleConference, setMiddleConference] = useState('MAC');
  const [bottomConference, setBottomConference] = useState('MWC');

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const [playerGrid, setPlayerGrid] = useState({
    topLeftPlayers: [],
    topMiddlePlayers: [],
    topRightPlayers: [],
    middleLeftPlayers: [],
    middleMiddlePlayers: [],
    middleRightPlayers: [],
    bottomLeftPlayers: [],
    bottomMiddlePlayers: [],
    bottomRightPlayers: [],
  });
  const [cellPlayerInfo, setCellPlayerInfo] = useState({});




const getPlayersByOverallAndConference = (data, overallThreshold, targetConference) => {
  const filteredPlayers = [];
  const majorConferences = ['Big Ten', 'Pac-12', 'Pac-10', 'Big 12', 'ACC', 'SEC'];

  for (const player of data) {
    const playerConference = player.collegeConference === 'Pac-10' ? 'Pac-12' : player.collegeConference;

    if (targetConference === 'other') {
      if (majorConferences.includes(playerConference)) {
        continue;
      }
    } else if (targetConference && playerConference !== targetConference) {
      continue;
    }

    if (player.overall && player.overall <= overallThreshold) {
      filteredPlayers.push(player);
    }
  }

  return filteredPlayers;
};

const getTransfer = (position) => {
  const filteredPlayers = [];
  for (const player of transfers) {
    if (player.Position === position) {
      filteredPlayers.push(player);
    }
  }

  return filteredPlayers;
}

const getConference = (position, statType, threshold, conference) => {
  const filteredPlayers = [];
  const datasets = {
    'qb': qb,
    'rb': rb,
    'wr': wr
  };

  const data = datasets[position];

  for (const player of data) {
    if (conference && player.conference !== conference) {
      continue;
    }

    if (player[statType] !== undefined && player[statType] >= threshold) {
      filteredPlayers.push(player);
    }
  }

  return filteredPlayers;
};

const getState = (position, statType, threshold, state) => {
  const filteredPlayers = [];
  const datasets = {
    'qb': qb,
    'rb': rb,
    'wr': wr
  };

  const data = datasets[position];
  
  // Define the teams for each state
  const stateTeams = {
    'Oklahoma': ['Oklahoma', 'Oklahoma State'],
    'Oregon': ['Oregon State', 'Oregon'],
    'Washington': ['Washington', 'Washington State'],
  };

  const allowedTeams = stateTeams[state];

  for (const player of data) {

    if (player[statType] !== undefined && player[statType] >= threshold) {
      // Check if the player's team is in the allowedTeams array
      if (allowedTeams.includes(player.team)) {
        filteredPlayers.push(player);
      }
    }
  }

  return filteredPlayers;
};


const getHeismanPlayers = (conference) => {
  const filteredPlayers = [];

  for (const playerData of heisman) {
    // If a conference is specified, filter players by conference
    if (conference) {
      const schoolConference = getConferenceBySchool(playerData.school);
      if (schoolConference !== conference) {
        continue;
      }
    }
    
    filteredPlayers.push(playerData);
  }

  return filteredPlayers;
};

const getTeam = (position, statType, threshold, team) => {
  const filteredPlayers = [];
  const datasets = {
    'qb': qb,
    'rb': rb,
    'wr': wr,
    'sep20': sep20,
  };

  const data = datasets[position];

  for (const player of data) {
    if (team && player.team !== team) {
      continue;
    }

    if (player[statType] !== undefined && player[statType] >= threshold) {
      filteredPlayers.push(player);
    }
  }

  return filteredPlayers;
};

    
  useEffect(() => {
    setPlayerGrid({
      topLeftPlayers: getConference('qb', 'passesCompleted', 1, topConference),
      topMiddlePlayers: getConference('rb', 'yds', 1, topConference),
      topRightPlayers: getConference('wr', 'yds', 1, topConference),
      middleLeftPlayers: getConference('qb', 'passesCompleted', 1, middleConference),
      middleMiddlePlayers: getConference('rb', 'yds', 1, middleConference),
      middleRightPlayers: getConference('wr', 'yds', 1, middleConference),  
      bottomLeftPlayers: getConference('qb', 'passesCompleted', 1, bottomConference),
      bottomMiddlePlayers: getConference('rb', 'yds', 1, bottomConference),
      bottomRightPlayers: getConference('wr', 'yds', 1, bottomConference),
    });

  }, []);
    


  const handleClick = (event) => {
    const cellId = event.target.id;

    // Prevent changes to finalized cells
    if (finalizedCellPlayers[cellId]) return;
    setFocused(true);
    setActiveCell(cellId);
    setCellPlayerInfo({});
  };


  const getTeamLogoURL = (teamName) => {

    if(teamName === 'Louisiana State'){
      teamName = 'LSU';
    } else if(teamName === 'Texas AM'){
      teamName = 'Texas A&M';
    } else if(teamName === 'Mississippi'){
      teamName = 'Ole Miss';
    } else if(teamName === 'Texas Christian'){
      teamName = 'TCU';
    } else if(teamName === 'Southern California'){
      teamName = 'USC';
    }
    // Find the team by name
    let team = teams.find((t) => t.School === teamName);
    
    // Return the team's logo URL or null if not found
    if(team) {
      return team["Logos[1]"];
    } else {
      console.log(`No team found with name ${teamName}`);
      return null;
    }
  };
  


  const handleDropdownChange = async (playerName) => {
    const playerNameOnly = playerName.split(' (')[0]; // Extract the player's name part
    setSelectedPlayer(playerNameOnly);
    const db = getFirestore();

    const userDocRef = doc(db, 'users', currentUser.displayName);

    const userDocSnapshot = await getDoc(userDocRef);

    if(userDocSnapshot.exists()){
      const userData = userDocSnapshot.data();
      const updatedTotalGuesses = userData.totalGuesses + 1;
      await updateDoc(userDocRef, { totalGuesses: updatedTotalGuesses });
    }
    
    const playerList = playerGrid[`${activeCell}Players`];
    const selectedPlayerInfo = playerList.find((player) => player.player === playerNameOnly);
    
    if (selectedPlayerInfo) {
      setCellPlayerInfo(selectedPlayerInfo);
      setFinalizedCellPlayers(prevState => ({ ...prevState, [activeCell]: selectedPlayerInfo }));
      // Assuming you have a database update function, e.g., updateDatabase(activeCell, selectedPlayerInfo);
      updateDatabase(activeCell, selectedPlayerInfo);
    } else {
      // Player not found, setFocused to false
      setFocused(false);
    }
    
    // Clear the selected player after submission
    setSelectedPlayer('');
    setFocused(false);
  };
  
  

  const updateDatabase = async (activeCell, selectedPlayerInfo) => {
    const db = getFirestore();
    const dailyThresholdsRef = doc(db, 'dailyThresholds', 'dec29');
  
    try {
      // Fetch current data from the database
      const docSnapshot = await getDoc(dailyThresholdsRef);
      const currentData = docSnapshot.data();
  
      // Create a copy of the current data for updates
      const updatedData = { ...currentData };
  
      // Increment the corresponding field and update the map conditionally
      const squareKey = `square${activeCell}`;
      const playerKey = `square${activeCell}Players`;
  
      if (!(squareKey in updatedData)) {
        updatedData[squareKey] = 1;
      } else {
        updatedData[squareKey]++;
      }
  
      if (!(playerKey in updatedData)) {
        updatedData[playerKey] = {};
      }
  
      if (selectedPlayerInfo.player in updatedData[playerKey]) {
        updatedData[playerKey][selectedPlayerInfo.player]++;
      } else {
        updatedData[playerKey][selectedPlayerInfo.player] = 1;
      }
  
      // Calculate the percentage
      const playerGuesses = updatedData[playerKey][selectedPlayerInfo.player];
      const totalGuesses = updatedData[squareKey];
      const percentage = (playerGuesses / totalGuesses) * 100;

      setCellPercentages(prevPercentages => ({
        ...prevPercentages,
        [activeCell]: percentage,
      }));
      
      
  
      // Write the updated data back to the database
      await updateDoc(dailyThresholdsRef, updatedData);
  
      console.log(`Player ${selectedPlayerInfo.player} has been guessed ${playerGuesses} times, which is ${percentage}% of the total guesses for square ${activeCell}.`);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };
  
  
  const logoUrl = (conference) => {

    var logo;

    if  (conference === 'Big Ten') {
      logo = b1gLogo;
    }

    if (conference === 'Pac-12' || conference === 'Pac-10'){
      logo = pacLogo;
    }

    if (conference === 'ACC'){
      logo = accLogo;
    }

    if(conference === 'SEC'){
      logo = secLogo;
    }

    if(conference === 'Big 12'){
      logo = b12Logo;
    }

    if(conference === 'MAC'){
      logo = mac;
    }

    if(conference === 'MWC'){
      logo = mwc;
    }

    if(conference === 'AAC'){
      logo = aac;
    }

    if(conference === 'C-USA'){
      logo = cusa;
    }

    if(conference === 'Sun Belt'){
      logo = sbc;
    }

    return logo;
  }

  const getTrophyOrStyling = (percentage) => {
    if (percentage > 10) {
      return null;
    } else if (percentage >= 5 && percentage <= 10) {
      return <FaTrophy style={{ fill: 'green' }} />;
    } else if (percentage >= 2 && percentage < 5) {
      return <FaTrophy style={{ fill: 'silver' }} />;
    } else if (percentage >= 1 && percentage < 2) {
      return <FaTrophy style={{ fill: 'gold' }} />;
    } else if (percentage < 1) {
      return <FaTrophy style={{ fill: 'purple' }} />;  // Changed fill color to purple for epic
    }
  };
  
  const getPlayerDisplayInfo = (cellId) => {
    const finalizedPlayer = finalizedCellPlayers[cellId];
    const currentPlayerInfo = Object.keys(cellPlayerInfo).length !== 0 ? cellPlayerInfo : selectedPlayer;
  
    const displayedPercentage = cellPercentages[cellId]; // Get the stored percentage for the cell
  
    if (finalizedPlayer) {
      return (
        <div className="text-center relative" style={{backgroundImage: `url(${getTeamLogoURL(finalizedPlayer.team)})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
          <span className="text-gray-200 bg-black p-1 rounded text-xs absolute top-0 right-0" style={{ display: 'flex', alignItems: 'center' }}>
          {getTrophyOrStyling(displayedPercentage)}  {displayedPercentage.toFixed(2)}%
          </span>
          <p className="mobile text-gray-200 mt-1 w-full bg-black">{finalizedPlayer.player}</p>
        </div>
      );
    }
  
    if (!currentPlayerInfo || activeCell !== cellId) return null;
  
    if (Object.keys(currentPlayerInfo).length !== 0) {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-200">{currentPlayerInfo.player}</p>
        </div>
      );
    } else {
      return <p>No matching player found.</p>;
    }
  };

  const allPlayers = [...qb, ...rb, ...wr, ...sep20, ...heisman];
  const draftPlayers = draft

// Combine all player names from 'qb', 'wr', 'rb', and 'draft'

const allPlayerNames = allPlayers.map(p => `${p.player} (${p.team})`);

const uniquePlayers = [...new Set([...allPlayerNames])];

  



  return (
    <div className="min-h-screen relative bg-gray-800">
      <Navbar />
      <div className="max-w-4xl mt-6 flex-col items-center mx-auto p-4">
        <h1 className="text-6xl font-bold text-center text-gray-200 mb-4">CFB Grids</h1>
        {focused && (
          <div className="mb-4 text-black">
            <Dropdown onChange={handleDropdownChange} options={uniquePlayers} />
          </div>
        )}

        <div className="grid-container w-screen m-auto">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center squarefont-bold text-gray-200" onClick={handleClick}>Rarity Score: {rarityScore}</div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            1 career completion
          </div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            1 career rushing yard
          </div>
          <div className="flex w-100 pb-100 wrap items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            1 receiving yard
          </div>
          <div className="flex items-center justify-center square text-gray-200" onClick={handleClick}>
            <img src={logoUrl(topConference)} alt="West Virginia Team Logo" />            
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='topLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('topLeft')}
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='topMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('topMiddle')}
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='topRight' onClick={handleClick}>
            {getPlayerDisplayInfo('topRight')}
          </div>
          <div className="flex items-center justify-center square text-gray-200" onClick={handleClick}>
            <img src={logoUrl(middleConference)} alt="West Virginia Team Logo" />
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='middleLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('middleLeft')}
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='middleMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('middleMiddle')}
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='middleRight' onClick={handleClick}>
            {getPlayerDisplayInfo('middleRight')}
          </div>
          <div className="flex items-center justify-center square text-gray-200" onClick={handleClick}>
            <img src={logoUrl(bottomConference)} alt="West Virginia Team Logo" />          
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='bottomLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomLeft')}
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='bottomMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomMiddle')}
          </div>
          <div className=" border-2 guess border-white flex items-center justify-center square" id='bottomRight' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomRight')}
          </div>
        </div>
        </div>

        <div className="text-center mt-5 flex justify-center space-x-4">
  {showTweetButton && (
    <a
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="rounded bg-blue-500 text-gray-200 py-2 px-4">Tweet Score</button>
    </a>
  )}
  <Modal />   
  <Leaderboard  />
</div>
    </div>
      <Footer />
    </div>
  );
}
