import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
import BasketballModal from './components/BasketballModal';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';

// Import the functions you need from the SDKs you need
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

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

import cbb from './data/cbb.js';
import teams from './data/teams.js'

export default function CFB() {

  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

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
  
    setTweetText(`1st EVER CBB Grids\n\nRarity Score: ${updatedRarityScore.toFixed(2)}\n\n@CFBGrids / cfbgrids.com`);
  
    // Update the rarity score in the state
    setRarityScore(updatedRarityScore.toFixed(2));
  }, [cellPercentages]);

  const postRarityScore = async (score) => {
    const db = getFirestore();
    const leaderboardRef = doc(db, 'dailyLeaderboard', 'oct17leaders');
  
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

  const [topTeam, setTopTeam] = useState('Alabama');
  const [middleTeam, setMiddleTeam] = useState('Florida');
  const [bottomTeam, setBottomTeam] = useState('Texas');

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

const getPlayers = () => {
    let filteredPlayers = [];

    for (const player of cbb) {
        filteredPlayers.push(player)
    }

    return filteredPlayers;
}

    
  useEffect(() => {
    setPlayerGrid({
      topLeftPlayers: getPlayers(),
      topMiddlePlayers: getPlayers(),
      topRightPlayers: getPlayers(),
      middleLeftPlayers: getPlayers(),
      middleMiddlePlayers: getPlayers(),
      middleRightPlayers: getPlayers(),  
      bottomLeftPlayers: getPlayers(),
      bottomMiddlePlayers: getPlayers(),
      bottomRightPlayers: getPlayers(),
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
    const dailyThresholdsRef = doc(db, 'dailyThresholds', 'cbb-oct17');
  
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
            ANY CBB PLAYER
          </div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            ANY CBB PLAYER
          </div>
          <div className="flex w-100 pb-100 wrap items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            ANY CBB PLAYER
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            ANY
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
            ANY  
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
            ANY
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
