import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

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

import b1gLogo from './b1g.png';
import pacLogo from './pac.png';
import macLogo from './mac.png';
import accLogo from './acc.png';
import secLogo from './sec.png';
import b12Logo from './big12.png';

import qb from './data/passing';
import wr from './data/receiving';
import rb from './data/running';

export default function App() {

  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

  const [leftColumnStatType, setLeftColumnStatType] = useState('TD');
  const [leftColumnThreshold, setLeftColumnThreshold] = useState();
  const [middleColumnStatType, setMiddleColumnStatType] = useState('YDS');
  const [middleColumnThreshold, setMiddleColumnThreshold] = useState();
  const [rightColumnStatType, setRightColumnStatType] = useState('INT');
  const [rightColumnThreshold, setRightColumnThreshold] = useState();

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

  const [topRowConference, setTopRowConference] = useState();
  const [middleRowConference, setMiddleRowConference] = useState();
  const [bottomRowConference, setBottomRowConference] = useState();
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

  useEffect(() => {
    const db = getFirestore(app);

    async function fetchData() {
        // Fetch stat types
        try {
            const dailyStatTypesDocRef = doc(db, "dailyStatTypes", "statTypes");
            const dailyStatTypesDocSnapshot = await getDoc(dailyStatTypesDocRef);
        
            if (dailyStatTypesDocSnapshot.exists()) {
                const statTypesData = dailyStatTypesDocSnapshot.data();
                setLeftColumnStatType(statTypesData.leftColumn);
                setMiddleColumnStatType(statTypesData.middleColumn);
                setRightColumnStatType(statTypesData.rightColumn);
            } else {
                console.log("Stat types document not found.");
            }
        } catch (error) {
            console.error("Error fetching stat types: ", error);
        }

        // Fetch threshold data
        try {
            const dailyThresholdsDocRef = doc(db, "dailyThresholds", "thresholds");
            const dailyThresholdsDocSnapshot = await getDoc(dailyThresholdsDocRef);

            if (dailyThresholdsDocSnapshot.exists()) {
                const thresholdsData = dailyThresholdsDocSnapshot.data();
                setLeftColumnThreshold(thresholdsData.left);
                setMiddleColumnThreshold(thresholdsData.middle);
                setRightColumnThreshold(thresholdsData.right);
            } else {
                console.log("Thresholds document not found.");
            }
        } catch (error) {
            console.error("Error fetching thresholds: ", error);
        }

        // Fetch conference data
        try {
            const dailyConferencesDocRef = doc(db, "dailyConferences", "conferences");
            const dailyConferencesDocSnapshot = await getDoc(dailyConferencesDocRef);

            if (dailyConferencesDocSnapshot.exists()) {
                const conferencesData = dailyConferencesDocSnapshot.data();
                setTopRowConference(conferencesData.topRowConference);
                setMiddleRowConference(conferencesData.middleRowConference);
                setBottomRowConference(conferencesData.bottomRowConference);
            } else {
                console.log("Conferences document not found.");
            }
        } catch (error) {
            console.error("Error fetching conferences: ", error);
        }
    }
    
    fetchData();
}, []);



  const getPlayers = (position, statType, threshold, conference) => {
    const filteredPlayers = [];

    if (position === 'qb') {
        for (const playerIndex in qb) {
            const player = qb[playerIndex];

            if (conference && player.conference !== conference) {
                continue;
            }

            if (player.stats && player.stats[statType]) {  // Ensure the statType exists for the player
                const statValues = player.stats[statType];
                if (statValues.some(value => value >= threshold)) {
                    filteredPlayers.push(player);
                }
            }
        }
    } 
    else if (position === 'wr') {
        for (const playerIndex in wr) {
            const player = wr[playerIndex];

            if (conference && player.conference !== conference) {
                continue;
            }

            if (player.stats && player.stats[statType]) {  // Ensure the statType exists for the player
                const statValues = player.stats[statType];
                if (statValues.some(value => value >= threshold)) {
                    filteredPlayers.push(player);
                }
            }
        }
    } 
    else if (position === 'rb') {
        for (const playerIndex in rb) {
            const player = rb[playerIndex];

            if (conference && player.conference !== conference) {
                continue;
            }

            if (player.stats && player.stats[statType]) {  // Ensure the statType exists for the player
                const statValues = player.stats[statType];
                if (statValues.some(value => value >= threshold)) {
                    filteredPlayers.push(player);
                }
            }
        }
    }

    return filteredPlayers;
};

    
  useEffect(() => {

    console.log(leftColumnStatType + " " + leftColumnThreshold)

    setPlayerGrid({
      topLeftPlayers: getPlayers('qb', leftColumnStatType, leftColumnThreshold, topRowConference),
      topMiddlePlayers: getPlayers('wr', middleColumnStatType, middleColumnThreshold, topRowConference),
      topRightPlayers: getPlayers('rb', rightColumnStatType, rightColumnThreshold, topRowConference),
      middleLeftPlayers: getPlayers('qb', leftColumnStatType, leftColumnThreshold, middleRowConference),
      middleMiddlePlayers: getPlayers('wr', middleColumnStatType, middleColumnThreshold, middleRowConference),
      middleRightPlayers: getPlayers('rb', rightColumnStatType, rightColumnThreshold, middleRowConference),
      bottomLeftPlayers: getPlayers('qb', leftColumnStatType, leftColumnThreshold, bottomRowConference),
      bottomMiddlePlayers: getPlayers('wr', middleColumnStatType, middleColumnThreshold, bottomRowConference),
      bottomRightPlayers: getPlayers('rb', rightColumnStatType, rightColumnThreshold, bottomRowConference),
    });

    console.log(playerGrid);
  }, [leftColumnStatType, leftColumnThreshold, middleColumnStatType, middleColumnThreshold, rightColumnStatType, rightColumnThreshold, topRowConference, middleRowConference, bottomRowConference]);
    


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

    if (conference === 'Pac-12'){
      logo = pacLogo;
    }

    if (conference === 'Mid-American'){
      logo = macLogo;
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

  const uniquePlayers = [...new Set(allPlayers.map(p => p.player))];



  return (
    <div className="min-h-screen bg-gray-200 py-8">
      <div className="max-w-4xl flex-col items-center mx-auto p-4">
        <h1 className="text-6xl font-bold text-center mb-4">CFB Grids</h1>
        <p className="text-center mb-4">Players from 2005-2006 season up to 2022-2023</p>
        <p className="text-center mb-4"><span className='text-blue-500'>Passing</span> -- <span className='text-green-500'>Receiving</span> -- <span className='text-purple-500'>Rushing</span></p>
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
          <div className="flex w-100 pb-100 items-center justify-center square bg-purple-500 text-white" onClick={handleClick}>
            {rightColumnThreshold} {rightColumnStatType}
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
      </div>

        
      </div>
    </div>
  );
}
