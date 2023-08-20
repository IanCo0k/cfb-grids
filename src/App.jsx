import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
import Modal from './components/Modal';
import Footer from './components/Footer';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";


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
import other from './other.png';


import qb from './data/passing';
import wr from './data/receiving';
import rb from './data/running';
import draft from './data/draft';

export default function App() {

  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

  const [leftColumnStatType, setLeftColumnStatType] = useState('TD');
  const [leftColumnThreshold, setLeftColumnThreshold] = useState(20);
  const [middleColumnStatType, setMiddleColumnStatType] = useState('TD');
  const [middleColumnThreshold, setMiddleColumnThreshold] = useState(10);
  const [rightColumnStatType, setRightColumnStatType] = useState('TD');
  const [rightColumnThreshold, setRightColumnThreshold] = useState(10);

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
  
    setTweetText(`CFB Grids\n\nRarity Score: ${updatedRarityScore.toFixed(1)}\n\n@cfbgrids / cfbgrids.com`);
  
    // Update the rarity score in the state
    setRarityScore(updatedRarityScore.toFixed(1));
  }, [cellPercentages]);

  const [topRowConference, setTopRowConference] = useState('Big Ten');
  const [middleRowConference, setMiddleRowConference] = useState('Pac-12');
  const [bottomRowConference, setBottomRowConference] = useState('other');
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





const getPlayers = (position, statType, threshold, conference) => {
  const filteredPlayers = [];
  const datasets = {
      'qb': qb,
      'wr': wr,
      'rb': rb
  };

  const majorConferences = ['Big Ten', 'Pac-12', 'Pac-10', 'Big 12', 'ACC', 'SEC'];

  const data = datasets[position];

  for (const playerIndex in data) {
      const player = data[playerIndex];

      // If the player's conference is 'Pac-10', consider it as 'Pac-12'
      const playerConference = player.conference === 'Pac-10' ? 'Pac-12' : player.conference;

      if (conference === 'other') {
          if (majorConferences.includes(playerConference)) {
              continue;
          }
      } else if (conference && playerConference !== conference) {
          continue;
      }

      if (player.stats && player.stats[statType]) {  // Ensure the statType exists for the player
          const statValues = player.stats[statType];
          if (statValues.some(value => value >= threshold)) {
              filteredPlayers.push(player);
          }
      }
  }

  return filteredPlayers;
};

const getPlayersByOverallAndConference = (data, overallThreshold, targetConference) => {
  const filteredPlayers = [];
  const majorConferences = ['Big Ten', 'Pac-12', 'Pac-10', 'Big 12', 'ACC', 'SEC'];

  console.log(data);

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





    
  useEffect(() => {
    setPlayerGrid({
      topLeftPlayers: getPlayers('qb', leftColumnStatType, leftColumnThreshold, topRowConference),
      topMiddlePlayers: getPlayers('wr', middleColumnStatType, middleColumnThreshold, topRowConference),
      topRightPlayers: getPlayersByOverallAndConference(draft, 100, topRowConference),
      middleLeftPlayers: getPlayers('qb', leftColumnStatType, leftColumnThreshold, middleRowConference),
      middleMiddlePlayers: getPlayers('wr', middleColumnStatType, middleColumnThreshold, middleRowConference),
      middleRightPlayers: getPlayersByOverallAndConference(draft, 100, middleRowConference),
      bottomLeftPlayers: getPlayers('qb', leftColumnStatType, leftColumnThreshold, bottomRowConference),
      bottomMiddlePlayers: getPlayers('wr', middleColumnStatType, middleColumnThreshold, bottomRowConference),
      bottomRightPlayers: getPlayersByOverallAndConference(draft, 100, bottomRowConference)
    });

    console.log(playerGrid);
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
    setSelectedPlayer(playerName);
    const playerList = playerGrid[`${activeCell}Players`];
    const selectedPlayerInfo = playerList.find((player) => player.player === playerName);
  
    if (selectedPlayerInfo) {
      setCellPlayerInfo(selectedPlayerInfo);
      setFinalizedCellPlayers(prevState => ({ ...prevState, [activeCell]: selectedPlayerInfo }));
  
      // Assuming you have a database update function, e.g., updateDatabase(activeCell, selectedPlayerInfo);
      updateDatabase(activeCell, selectedPlayerInfo);
      
      console.log(selectedPlayerInfo);
    }
  };

  const updateDatabase = async (activeCell, selectedPlayerInfo) => {
    const db = getFirestore();
    const dailyThresholdsRef = doc(db, 'dailyThresholds', 'rarity');
  
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

    if(conference === 'other'){
      logo = other;
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
          {displayedPercentage.toFixed(1)}%
        </span>
        <p className="mobile text-white mt-1 w-full bg-black">{finalizedPlayer.player}</p>
      </div>
    );
  }

    if (!currentPlayerInfo || activeCell !== cellId) return null;

    if (Object.keys(currentPlayerInfo).length !== 0) {
      return (
        <div className="text-center">
          <p className="text-sm">{currentPlayerInfo.player}</p>
        </div>
      );
    } else {
      return <p>No matching player found.</p>;
    }
  };

  const allPlayers = [...qb, ...wr, ...rb];
  const draftPlayers = draft

  // Combine all player names from 'qb', 'wr', 'rb', and 'draft'
  const uniquePlayers = [...new Set([...allPlayers.map(p => p.player), ...draftPlayers.map(p => p.player)])];
  



  return (
    <div className="min-h-screen relative bg-gray-200 py-8">
      <div className="max-w-4xl flex-col items-center mx-auto p-4">
        <h1 className="text-6xl font-bold text-center mb-4">CFB Grids</h1>
        {focused && (
          <div className="mb-4 text-black">
            <Dropdown onChange={handleDropdownChange} options={uniquePlayers} />
          </div>
        )}

        <div className="grid-container w-screen m-auto">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center squarefont-bold text-gray-800" onClick={handleClick}>Rarity Score: {rarityScore}</div>
          <div className="flex items-center justify-center square bg-blue-500 text-white" onClick={handleClick}>
            {leftColumnThreshold} {leftColumnStatType}
          </div>
          <div className="flex items-center justify-center square bg-green-500 text-white" onClick={handleClick}>
            {middleColumnThreshold} {middleColumnStatType}
          </div>
          <div className="flex w-100 pb-100 wrap items-center justify-center square bg-orange-500 text-white" onClick={handleClick}>
            Top 100 Pick
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={logoUrl(topRowConference)} alt="" />
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='topLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('topLeft')}
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='topMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('topMiddle')}
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='topRight' onClick={handleClick}>
            {getPlayerDisplayInfo('topRight')}
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={logoUrl(middleRowConference)} alt="" />
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='middleLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('middleLeft')}
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='middleMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('middleMiddle')}
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='middleRight' onClick={handleClick}>
            {getPlayerDisplayInfo('middleRight')}
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={logoUrl(bottomRowConference)} alt="" />
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='bottomLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomLeft')}
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='bottomMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomMiddle')}
          </div>
          <div className="border border-2 guess border-black flex items-center justify-center square" id='bottomRight' onClick={handleClick}>
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
            <button className="rounded bg-black text-white py-2 px-4">Tweet Score</button>
          </a>
        )}
                <Modal />   

      </div>
      </div>
      <Footer />
    </div>
  );
}
