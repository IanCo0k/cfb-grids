import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
import Modal from './components/Modal';
import Footer from './components/Footer';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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



import b1gLogo from './b1g.png';
import pacLogo from './pac.png';
import accLogo from './acc.png';
import secLogo from './sec.png';
import b12Logo from './big12.png';
import mac from './mac.png'
import mwc from './mwc.png';
import aac from './aac.png';
import cusa from './cusa.png';

import qb from './data/qb';
import rb from './data/rb';
import wr from './data/wr';
import draft from './data/draft';

export default function App() {

  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

  const [leftColumnStatType, setLeftColumnStatType] = useState('TD');
  const [leftColumnThreshold, setLeftColumnThreshold] = useState(1);
  const [middleColumnStatType, setMiddleColumnStatType] = useState('CAR');
  const [middleColumnThreshold, setMiddleColumnThreshold] = useState(20);
  const [rightColumnStatType, setRightColumnStatType] = useState('REC');
  const [rightColumnThreshold, setRightColumnThreshold] = useState(10)

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
  
    setTweetText(`CFB Grids\n\nRarity Score: ${updatedRarityScore.toFixed(2)}\n\n@CFBGrids / cfbgrids.com`);
  
    // Update the rarity score in the state
    setRarityScore(updatedRarityScore.toFixed(2));
  }, [cellPercentages]);

  const [topRowConference, setTopRowConference] = useState('Big Ten');
  const [middleRowConference, setMiddleRowConference] = useState('Big 12');
  const [bottomRowConference, setBottomRowConference] = useState('SEC');
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

  useEffect(() => {
    setSelectedPlayer(null);
  }, [activeCell]);



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

const getPlayersByOverallAndTeam = (data, overallThreshold, targetConference) => {
  const filteredPlayers = [];
  const majorConferences = ['Big Ten', 'Pac-12', 'Pac-10', 'Big 12', 'ACC', 'SEC'];

  for (const player of data) {

   if (targetConference && player.team !== targetConference) {
      continue;
    }

    if (player.overall && player.overall <= overallThreshold) {
      filteredPlayers.push(player);
    }
  }

  return filteredPlayers;
};

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

const getTeam = (position, statType, threshold, team) => {
  const filteredPlayers = [];
  const datasets = {
    'qb': qb,
    'rb': rb,
    'wr': wr
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
      topLeftPlayers: getTeam('qb', 'yardsPerAttempt', 5.0, 'Clemson'),
      topMiddlePlayers: getTeam('rb', 'attempts', 1 , 'Clemson'),
      topRightPlayers: getTeam('wr', 'yards', 100, 'Clemson'),
      middleLeftPlayers: getTeam('qb', 'yardsPerAttempt', 5.0, 'Nebraska'),
      middleMiddlePlayers: getTeam('rb', 'attempts', 1, 'Nebraska'),
      middleRightPlayers: getTeam('wr', 'yards', 100, 'Nebraska'),
      bottomLeftPlayers: getConference('qb', 'yardsPerAttempt', 5.0, bottomRowConference),
      bottomMiddlePlayers: getConference('rb', 'attempts', 1, bottomRowConference),
      bottomRightPlayers: getConference('wr', 'yards', 100, bottomRowConference)
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


  const handleDropdownChange = (playerName) => {
    const playerNameOnly = playerName.split(' (')[0]; // Extract the player's name part
    setSelectedPlayer(playerNameOnly);
    
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
    const dailyThresholdsRef = doc(db, 'dailyThresholds', 'aug30');
  
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

    return logo;
  }

  function generateLogoUrl(teamName) {
    if (teamName === 'USC') {
      teamName = 'southern-california';
    } else if (teamName === 'NC State') {
      teamName = 'north-carolina-state';
    } else if (teamName === 'LSU'){
      teamName = 'louisiana-state';
    } else if(teamName === 'TCU'){
      teamName = 'texas-christian'
    } else if(teamName === 'Texas A&M'){
      teamName = 'texas-am';
    } else if(teamName === 'Ole Miss'){
      teamName = 'mississippi';
    } else if(teamName === 'UT San Antonio'){
      teamName = 'texas-san-antonio'
    } else if(teamName === 'BYU'){
      teamName = 'brigham-young'
    } else if(teamName === 'Miami'){
      teamName = 'miami-fl';
    } else if(teamName === 'UNLV'){
      teamName = 'nevada-las-vegas'
    }
    else {
      // Remove leading/trailing spaces and convert the name to lowercase
      teamName = teamName.trim().toLowerCase();
      // Replace spaces with dashes to match the pattern
      teamName = teamName.replace(/\s+/g, '-');
    }
    // Construct the URL using the formatted team name
    const logoUrl = `https://cdn.ssref.net/req/202307313/tlogo/ncaa/${teamName}.png`;
    return logoUrl;
  }

  const getPlayerDisplayInfo = (cellId) => {
    const finalizedPlayer = finalizedCellPlayers[cellId];
  const currentPlayerInfo = Object.keys(cellPlayerInfo).length !== 0 ? cellPlayerInfo : selectedPlayer;

  const displayedPercentage = cellPercentages[cellId]; // Get the stored percentage for the cell

  if (finalizedPlayer) {
    return (
      <div className="text-center relative" style={{backgroundImage: `url(${generateLogoUrl(finalizedPlayer.team)})`, backgroundSize: 'cover', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
        <span className="text-white bg-black p-1 rounded text-xs absolute top-0 right-0">
          {displayedPercentage.toFixed(2)}%
        </span>
        <p className="mobile text-white mt-1 w-full bg-black">{finalizedPlayer.player}</p>
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

  const allPlayers = [...qb, ...rb, ...wr];
  const draftPlayers = draft

// Combine all player names from 'qb', 'wr', 'rb', and 'draft'
const uniquePlayers = [...new Set([...allPlayers.map(p => `${p.player} (${p.team})`), ...draftPlayers.map(p => `${p.player} (${p.team})`)])];

  



  return (
    <div className="min-h-screen relative bg-gray-800 py-8">
      <div className="max-w-4xl flex-col items-center mx-auto p-4">
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
            5.0 career YPA
          </div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            1 career CAR
          </div>
          <div className="flex w-100 pb-100 wrap items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            100 career REC YDS
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
          <img src='https://cdn.ssref.net/req/202307313/tlogo/ncaa/clemson.png' alt="" />
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
          <div className="flex items-center bg-gray-200 justify-center square text-white" onClick={handleClick}>
          <img src='https://cdn.ssref.net/req/202307313/tlogo/ncaa/nebraska.png' alt="" />
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
          <div className="flex bg-gray-200 text-xl lg:text-4xl items-center justify-center square text-black" onClick={handleClick}>
          <img src={logoUrl(bottomRowConference)} alt="" />
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

        <div className="text-center mt-5">
        {showTweetButton && (
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="rounded m-2 bg-blue-500 text-white py-2 px-4">Tweet Score</button>
          </a>
        )}
                <Modal />   

      </div>
      </div>
      <Footer />
    </div>
  );
}
