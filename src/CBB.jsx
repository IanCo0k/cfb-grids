import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
import BasketballModal from './components/BasketballModal';
import Leaderboard from './components/CBBLeaderboard';
import Footer from './components/Footer';

// Import the functions you need from the SDKs you need
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";


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

import chunk1 from './data/chunk_1';
import chunk2 from './data/chunk_2';
import chunk3 from './data/chunk_3';
import chunk4 from './data/chunk_4';
import chunk5 from './data/chunk_5';
import chunk6 from './data/chunk_6';

import teams from './data/teams.js'

export default function CFB() {

  let cbb = [...chunk1, ...chunk2, ...chunk3, ...chunk4, ...chunk5, ...chunk6];

  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');
  

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
    // Calculate the rarity score based on cellPercentages
    const updatedRarityScore = Object.values(cellPercentages).reduce((total, percentage) => total + percentage, 0);
  
    // Check if any cellPercentage value is equal to 0
    const hasZeroPercentage = Object.values(cellPercentages).some(percentage => percentage === 0);
  
    setShowTweetButton(!hasZeroPercentage);

    if (!hasZeroPercentage) {
      postRarityScore(updatedRarityScore);
    }
  
    setTweetText(`CBB Grids\n\nRarity Score: ${updatedRarityScore.toFixed(2)}\n\n@CFBGrids / cfbgrids.com`);
  
    // Update the rarity score in the state
    setRarityScore(updatedRarityScore.toFixed(2));
  }, [cellPercentages]);

  const postRarityScore = async (score) => {
    const db = getFirestore();
    const leaderboardRef = doc(db, 'dailyLeaderboard', 'cbb-nov11leaders');
  
    try {
      // Fetch current scores data from the database
      const docSnapshot = await getDoc(leaderboardRef);
      const currentScores = docSnapshot.data().scores || [];
      
      // Add new score without limiting the array size
      const updatedScores = [...currentScores, score];
      
      // Write the updated scores back to the database
      await updateDoc(leaderboardRef, { scores: updatedScores });
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const [topTeam, setTopTeam] = useState('Purdue');
  const [middleTeam, setMiddleTeam] = useState('UCLA');
  const [bottomTeam, setBottomTeam] = useState('Ohio State');

  const [topConference, setTopConference] = useState('Big Ten');
  const [middleConference, setMiddleConference] = useState('SEC');
  const [bottomConference, setBottomConference] = useState('ACC');

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

  const getPlayers = (team) => {
    let filteredPlayers = [];

    for (const player of cbb) {
        // Remove spaces and split by semicolons
        const teamsPlayedFor = (player.teamName || '').replace(/\s+/g, '').split(';');

        if (teamsPlayedFor.includes(team)) {
            filteredPlayers.push(player);
        }
    }

    return filteredPlayers;
}




    
  useEffect(() => {
    setPlayerGrid({
      topLeftPlayers: getPlayers(topTeam),
      topMiddlePlayers: getPlayers(topTeam),
      topRightPlayers: getPlayers(topTeam),
      middleLeftPlayers: getPlayers(middleTeam),
      middleMiddlePlayers: getPlayers(middleTeam),
      middleRightPlayers: getPlayers(middleTeam),  
      bottomLeftPlayers: getPlayers(bottomTeam),
      bottomMiddlePlayers: getPlayers(bottomTeam),
      bottomRightPlayers: getPlayers(bottomTeam),
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
    // Define the team name conversions
    const teamNameConversions = {
      'Louisiana State': 'LSU',
      'Texas AM': 'Texas A&M',
      'Mississippi': 'Ole Miss',
      'Texas Christian': 'TCU',
      'Southern California': 'USC',
    };
  
    // Check if the teamName needs to be converted
    if (teamNameConversions.hasOwnProperty(teamName)) {
      teamName = teamNameConversions[teamName];
    } else if (teamName === 'Gonzaga') {
      return 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Gonzaga_Bulldogs_logo.svg/1200px-Gonzaga_Bulldogs_logo.svg.png';
    }
  
    // Split the input teamName by semi-colons and remove spaces
    const teamsArray = teamName.split(';');
  
    // Check if any of the teams in the array match the state variables
    for (const team of teamsArray) {
      if (team === topTeam) {
        return teams.find((t) => t.School === topTeam)["Logos[1]"];
      } else if (team === middleTeam) {
        return teams.find((t) => t.School === middleTeam)["Logos[1]"];
      } else if (team === bottomTeam) {
        return teams.find((t) => t.School === bottomTeam)["Logos[1]"];
      }
    }
  
    // If no matching teams are found, log an error and return null
    console.log(`No team found with any of the names: ${teamsArray.join(', ')}`);
    return null;
  };
  
  
  
  


  const handleDropdownChange = (name) => {
    const playerNameOnly = name.split(' (')[0]; // Extract the player's name part
    setSelectedPlayer(playerNameOnly);
    
    const playerList = playerGrid[`${activeCell}Players`];
    const selectedPlayerInfo = playerList.find((player) => player.playerName === playerNameOnly);
    
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
    const dailyThresholdsRef = doc(db, 'dailyThresholds', 'cbb-nov11');
  
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
  
      if (selectedPlayerInfo.playerName in updatedData[playerKey]) {
        updatedData[playerKey][selectedPlayerInfo.playerName]++;
      } else {
        updatedData[playerKey][selectedPlayerInfo.playerName] = 1;
      }
  
      // Calculate the percentage
      const playerGuesses = updatedData[playerKey][selectedPlayerInfo.playerName];
      const totalGuesses = updatedData[squareKey];
      const percentage = (playerGuesses / totalGuesses) * 100;

      setCellPercentages(prevPercentages => ({
        ...prevPercentages,
        [activeCell]: percentage,
      }));
      
      
  
      // Write the updated data back to the database
      await updateDoc(dailyThresholdsRef, updatedData);
  
      console.log(`Player ${selectedPlayerInfo.playerName} has been guessed ${playerGuesses} times, which is ${percentage}% of the total guesses for square ${activeCell}.`);
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
        <div className="text-center relative" style={{backgroundImage: `url(${getTeamLogoURL(finalizedPlayer.teamName)})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
          <span className="text-white bg-black p-1 rounded text-xs absolute top-0 right-0" style={{ display: 'flex', alignItems: 'center' }}>
          {getTrophyOrStyling(displayedPercentage)}  {displayedPercentage.toFixed(2)}%
          </span>
          <p className="mobile text-white mt-1 w-full bg-black">{finalizedPlayer.playerName}</p>
        </div>
      );
    }
  
    if (!currentPlayerInfo || activeCell !== cellId) return null;
  
    if (Object.keys(currentPlayerInfo).length !== 0) {
      return (
        <div className="text-center">
          <p className="text-sm text-gray-200">{currentPlayerInfo.playerName}</p>
        </div>
      );
    } else {
      return <p>No matching player found.</p>;
    }
  };

  const allPlayers = [...cbb];

// Combine all player names from 'qb', 'wr', 'rb', and 'draft'

const allPlayerNames = allPlayers.map(p => `${p.playerName} (${p.teamName})`);

const uniquePlayers = [...new Set([...allPlayerNames])];

  



  return (
    <div className="min-h-screen relative bg-gray-800 py-8">
      <div className="max-w-4xl flex-col items-center mx-auto p-4">
        <h1 className="text-6xl font-bold text-center text-gray-200 mb-4">CBB Grids</h1>
        {focused && (
          <div className="mb-4 text-black">
            <Dropdown onChange={handleDropdownChange} options={uniquePlayers} />
          </div>
        )}

        <div className="grid-container w-screen m-auto">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center squarefont-bold text-gray-200" onClick={handleClick}>Rarity Score: {rarityScore}</div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            ANY PLAYER
          </div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            ANY PLAYER
          </div>
          <div className="flex w-100 pb-100 wrap items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            ANY PLAYER
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
          <img src={getTeamLogoURL(topTeam)} alt="" />
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
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={getTeamLogoURL(middleTeam)} alt="" />  
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
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
          <img src={getTeamLogoURL(bottomTeam)} alt="" />
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
      <button className="rounded bg-blue-500 text-white py-2 px-4">Tweet Score</button>
    </a>
  )}
  <BasketballModal />   
  <Leaderboard  />
</div>

      </div>
      <Footer />
    </div>
  );
}
