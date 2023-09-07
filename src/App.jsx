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
import sbc from './sbc.png';

import qb from './data/qb';
import rb from './data/rb';
import wr from './data/wr';
import draft from './data/draft';
import unc from './data/unc';
import colorado from './data/colorado';
import uga from './data/uga';

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
  const [middleRowConference, setMiddleRowConference] = useState('MAC');
  const [bottomRowConference, setBottomRowConference] = useState('Big Ten');
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

const getUGAplayers = () => {
  const filteredPlayers = [];

  // map through first_name and last_name for each player in uga dataset
  for (const player of uga) {
    filteredPlayers.push({ player: `${player.first_name} ${player.last_name}`, team: 'Georgia' });
  }

  return filteredPlayers;
}



const getUNCplayers = () => {
  const filteredPlayers = [];

  // map through first_name and last_name for each player in unc dataset
  for (const player of unc) {
    filteredPlayers.push({ player: `${player.first_name} ${player.last_name}`, team: 'North Carolina' });
  }

  return filteredPlayers;
}


const getColoradoplayers = () => {
  const filteredPlayers = [];

  // map through first_name and last_name for each player in colorado dataset
  for (const player of colorado) {
    filteredPlayers.push({ player: `${player.first_name} ${player.last_name}`, team: 'Colorado' });
  }

  return filteredPlayers;
}



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
  console.log(uga.map(p => `${p.first_name} ${p.last_name}`))
}, []);

    
  useEffect(() => {
    setPlayerGrid({
      topLeftPlayers: getTeam('qb', 'passesCompleted', 1, 'Mississippi State'),
      topMiddlePlayers: getTeam('rb', 'yds', 1, 'Mississippi State'),
      topRightPlayers: getTeam('wr', 'yards', 1, 'Mississippi State'),
      middleLeftPlayers: getTeam('qb', 'passesCompleted', 1, 'West Virginia'),
      middleMiddlePlayers: getTeam('rb', 'yds', 1, 'West Virginia'),
      middleRightPlayers: getTeam('wr', 'yards', 1, 'West Virginia'),
      bottomLeftPlayers: getTeam('qb', 'passesCompleted', 1, 'Louisville'),
      bottomMiddlePlayers: getTeam('rb', 'yds', 1, 'Louisville'),
      bottomRightPlayers: getTeam('wr', 'yards', 1, 'Louisville'),
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
    const dailyThresholdsRef = doc(db, 'dailyThresholds', 'sep7');
  
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

  function generateLogoUrl(teamName) {

    let logoUrl = '';

    if(teamName === 'Oregon'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Oregon_Ducks_logo.svg/580px-Oregon_Ducks_logo.svg.png'
    } else if(teamName === 'Oklahoma'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Oklahoma_Sooners_logo.svg/795px-Oklahoma_Sooners_logo.svg.png'
    } else if(teamName === 'Ohio State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Buckeyes_logo.svg/1087px-Buckeyes_logo.svg.png'
    } else if(teamName === 'Michigan State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Michigan_State_Spartans_alternate_logo.svg/1200px-Michigan_State_Spartans_alternate_logo.svg.png'
    } else if(teamName === 'Michigan'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Michigan_Wolverines_Block_M.png'
    } else if(teamName === 'Penn State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/6a/PennStateShield.png'
    } else if(teamName === 'Wisconsin'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Wisconsin_Badgers_logo.svg/814px-Wisconsin_Badgers_logo.svg.png'
    } else if(teamName === 'Iowa'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Iowa_Hawkeyes_logo.svg/1200px-Iowa_Hawkeyes_logo.svg.png'
    } else if(teamName === 'Minnesota'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Minnesota_Golden_Gophers_logo.svg/2560px-Minnesota_Golden_Gophers_logo.svg.png'
    } else if(teamName === 'Indiana'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Indiana_Hoosiers_logo.svg/800px-Indiana_Hoosiers_logo.svg.png'
    } else if(teamName === 'Maryland'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Maryland_Terrapins_logo.svg/1869px-Maryland_Terrapins_logo.svg.png'
    } else if(teamName === 'Rutgers'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Rutgers_Scarlet_Knights_logo.svg/870px-Rutgers_Scarlet_Knights_logo.svg.png'
    } else if(teamName === 'Nebraska'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nebraska_Cornhuskers_logo.svg/2048px-Nebraska_Cornhuskers_logo.svg.png'
    } else if(teamName === 'Illinois'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Illinois_Fighting_Illini_logo.svg/166px-Illinois_Fighting_Illini_logo.svg.png'
    } else if(teamName === 'Northwestern'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1330px-Northwestern_Wildcats_logo.svg.png'
    } else if(teamName === 'Purdue'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/66/PurdueBoilermakersAthleticLogo.png'
    } else if(teamName === 'Alabama'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Alabama_Crimson_Tide_logo.svg/1200px-Alabama_Crimson_Tide_logo.svg.png'
    } else if(teamName === 'Georgia'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Georgia_Athletics_logo.svg/2560px-Georgia_Athletics_logo.svg.png'
    } else if(teamName === 'LSU'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/LSU_Athletics_logo.svg/1200px-LSU_Athletics_logo.svg.png'
    } else if(teamName === 'Florida'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Florida_Gators_script_logo.svg/1200px-Florida_Gators_script_logo.svg.png'
    } else if(teamName === 'Texas A&M'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Texas_A%26M_University_logo.svg/1200px-Texas_A%26M_University_logo.svg.png'
    } else if(teamName === 'Auburn'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Auburn_Tigers_logo.svg/543px-Auburn_Tigers_logo.svg.png'
    } else if(teamName === 'Mississippi State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mississippi_State_Bulldogs_logo.svg/2560px-Mississippi_State_Bulldogs_logo.svg.png'
    } else if(teamName === 'Mississippi'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ole_Miss_Rebels_logo.svg/2560px-Ole_Miss_Rebels_logo.svg.png'
    } else if(teamName === 'South Carolina'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/South_Carolina_Gamecocks_logo.svg/1200px-South_Carolina_Gamecocks_logo.svg.png'
    } else if(teamName === 'Tennessee'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tennessee_Volunteers_logo.svg/1024px-Tennessee_Volunteers_logo.svg.png'
    } else if(teamName === 'Kentucky'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Kentucky_Wildcats_logo.svg/1200px-Kentucky_Wildcats_logo.svg.png'
    } else if(teamName === 'Missouri'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Missouri_Tigers_logo.svg/1200px-Missouri_Tigers_logo.svg.png'
    } else if(teamName === 'Vanderbilt'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Vanderbilt_Commodores_logo.svg/1200px-Vanderbilt_Commodores_logo.svg.png'
    } else if(teamName === 'Arkansas'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Arkansas-Razorback-Logo-2001.png'
    } else if(teamName === 'North Carolina'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/North_Carolina_Tar_Heels_logo.svg/2560px-North_Carolina_Tar_Heels_logo.svg.png'
    } else if(teamName === 'Colorado'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Colorado_Buffs_alternate_logo.png'
    } else if(teamName === 'Florida State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/33/Florida_State_Seminoles_Alternate_Logo.png'
    } else if(teamName === 'Oklahoma State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Oklahoma_State_University_logo.svg/2560px-Oklahoma_State_University_logo.svg.png'
    } else if(teamName === 'Washington'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Washington_Huskies_logo.svg/2560px-Washington_Huskies_logo.svg.png'
    } else if(teamName === 'Texas Christian'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/TCU_Athletics_wordmark.png/640px-TCU_Athletics_wordmark.png'
    } else if(teamName === 'Tennessee'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tennessee_Volunteers_logo.svg/1024px-Tennessee_Volunteers_logo.svg.png'
    } else if(teamName === 'Cincinnati'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Cincinnati_Bearcats_logo.svg/1200px-Cincinnati_Bearcats_logo.svg.png';
    } else if(teamName === 'Iowa State'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Iowa_State_Cyclones_logo.svg/2560px-Iowa_State_Cyclones_logo.svg.png';
    } else if(teamName === 'West Virginia'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/WVU_flying_WV_Gold124.svg/2369px-WVU_flying_WV_Gold124.svg.png';
    } else if(teamName === 'Louisville'){
      logoUrl = 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Louisville_Cardinals_logo.svg/1200px-Louisville_Cardinals_logo.svg.png'
    }

    return logoUrl;
  }

  const getPlayerDisplayInfo = (cellId) => {
    const finalizedPlayer = finalizedCellPlayers[cellId];
  const currentPlayerInfo = Object.keys(cellPlayerInfo).length !== 0 ? cellPlayerInfo : selectedPlayer;

  const displayedPercentage = cellPercentages[cellId]; // Get the stored percentage for the cell

  if (finalizedPlayer) {
    return (
      <div className="text-center relative" style={{backgroundImage: `url(${generateLogoUrl(finalizedPlayer.team)})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
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

const allPlayerNames = allPlayers.map(p => `${p.player} (${p.team})`);
const uncPlayerNames = unc.map(p => `${p.first_name} ${p.last_name}`);
const coloradoPlayerNames = colorado.map(p => `${p.first_name} ${p.last_name}`);
const ugaPlayerNames = uga.map(p => `${p.first_name} ${p.last_name}`);
const uniquePlayers = [...new Set([...allPlayerNames, ...uncPlayerNames, ...coloradoPlayerNames, ...ugaPlayerNames])];

  



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
            1 career completion
          </div>
          <div className="flex items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            1 career rushing yard
          </div>
          <div className="flex w-100 pb-100 wrap items-center justify-center title-square bg-blue-500 text-gray-200" onClick={handleClick}>
            1 career receiving yard
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={generateLogoUrl('Mississippi State')} alt="Mississippi State Logo" />
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
            <img src={generateLogoUrl('West Virginia')} alt="West Virginia Team Logo" />
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
          <div className="flex items-center justify-center square text-black" onClick={handleClick}>
            <img src={generateLogoUrl('Louisville')} alt="Arkansas logo" />
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
