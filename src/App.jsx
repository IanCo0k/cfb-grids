import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
import macLogo from './mac.png';
import accLogo from './acc.png';

import secQB from './data/passing/2022-sec-passing';
import b1gQB from './data/passing/2022-b1g-passing';
import pacQB from './data/passing/2022-pac-passing';
import macQB from './data/passing/2022-mac-passing';
import accQB from './data/passing/2022-acc-passing';
import b12QB from './data/passing/2022-b12-passing';
import macWR from './data/receiving/2022-mac-receiving';
import b1gWR from './data/receiving/2022-b1g-receiving';
import pacWR from './data/receiving/2022-pac-receiving';
import b12WR from './data/receiving/2022-b12-receiving';
import accWR from './data/receiving/2022-acc-receiving';
import secWR from './data/receiving/2022-sec-receiving';

export default function App() {
  const statTypes = ['INT', 'COMPLETIONS', 'TD', 'YDS', 'YPA', 'ATT', 'PCT'];
  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});
  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

  const [leftColumnStatType, setLeftColumnStatType] = useState('TD');
  const [leftColumnThreshold, setLeftColumnThreshold] = useState();
  const [middleColumnStatType, setMiddleColumnStatType] = useState('YDS');
  const [middleColumnThreshold, setMiddleColumnThreshold] = useState();
  const [rightColumnStatType, setRightColumnStatType] = useState('INT');
  const [rightColumnThreshold, setRightColumnThreshold] = useState();

  const [topRowConference, setTopRowConference] = useState();
  const [middleRowConference, setMiddleRowConference] = useState();
  const [bottomRowConference, setBottomRowConference] = useState();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [logo, setLogo] = useState();
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

  // Combine all QB data into one array
  const allQBData = [...secQB, ...b1gQB, ...pacQB, ...macQB, ...accQB, ...b12QB];

  const allWRData = [...secWR, ...b1gWR, ...pacWR, ...macWR, ...accWR, ...b12WR];



  useEffect(() => {
    setPlayerGrid({
      topLeftPlayers: getPlayers(leftColumnStatType, leftColumnThreshold, topRowConference),
      topMiddlePlayers: getPlayers(middleColumnStatType, middleColumnThreshold, topRowConference),
      topRightPlayers: getPlayers(rightColumnStatType, rightColumnThreshold, topRowConference),
      middleLeftPlayers: getPlayers(leftColumnStatType, leftColumnThreshold, middleRowConference),
      middleMiddlePlayers: getPlayers(middleColumnStatType, middleColumnThreshold, middleRowConference),
      middleRightPlayers: getPlayers(rightColumnStatType, rightColumnThreshold, middleRowConference),
      bottomLeftPlayers: getPlayers(leftColumnStatType, leftColumnThreshold, bottomRowConference),
      bottomMiddlePlayers: getPlayers(middleColumnStatType, middleColumnThreshold, bottomRowConference),
      bottomRightPlayers: getPlayers(rightColumnStatType, rightColumnThreshold, bottomRowConference),
    });
  }, [leftColumnStatType, leftColumnThreshold, middleColumnStatType, middleColumnThreshold, rightColumnStatType, rightColumnThreshold, topRowConference, middleRowConference, bottomRowConference]);

  

  useEffect(() => {
    setSelectedPlayer(null);
  }, [activeCell]);

  useEffect(() => {
    async function logConferenceData() {
      try {
        const db = getFirestore(app);
        const dailyConferencesDocRef = doc(db, "dailyConferences", "conferences");
        const dailyConferencesDocSnapshot = await getDoc(dailyConferencesDocRef);

        if (dailyConferencesDocSnapshot.exists()) {
          const conferencesData = dailyConferencesDocSnapshot.data();
          const topRowConference = conferencesData.topRowConference;
          const middleRowConference = conferencesData.middleRowConference;
          const bottomRowConference = conferencesData.bottomRowConference;

          console.log("Top Row Conference: ", topRowConference);
          console.log("Middle Row Conference: ", middleRowConference);
          console.log("Bottom Row Conference: ", bottomRowConference);
          setTopRowConference(topRowConference);
          setMiddleRowConference(middleRowConference);
          setBottomRowConference(bottomRowConference);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error fetching conferences: ", error);
      }
    }

    async function logThresholdData() {
      try {
        const db = getFirestore(app);
        const dailyThresholdsDocRef = doc(db, "dailyThresholds", "thresholds");
        const dailyThresholdsDocSnapshot = await getDoc(dailyThresholdsDocRef);

        if (dailyThresholdsDocSnapshot.exists()) {
          const thresholdsData = dailyThresholdsDocSnapshot.data();
          const left = thresholdsData.left;
          const middle = thresholdsData.middle;
          const right = thresholdsData.right;

          setLeftColumnThreshold(left);
          setMiddleColumnThreshold(middle);
          setRightColumnThreshold(right);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error fetching conferences: ", error);
      }
    }

    async function logStatTypes() {
      console.log('LOGGING STAT TYPES')
      try {
        const db = getFirestore(app);
        const dailyStatTypesDocRef = doc(db, "dailyStatTypes", "statTypes");
        const dailyStatTypesDocSnapshot = await getDoc(dailyStatTypesDocRef);
    
        if (dailyStatTypesDocSnapshot.exists()) {
          console.log('THIS EXISTS')
          const statTypesData = dailyStatTypesDocSnapshot.data();
          const leftColumnStatType = statTypesData.leftColumn;
          const middleColumnStatType = statTypesData.middleColumn;
          const rightColumnStatType = statTypesData.rightColumn;
    
          setLeftColumnStatType(leftColumnStatType);
          setMiddleColumnStatType(middleColumnStatType);
          setRightColumnStatType(rightColumnStatType);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error fetching stat types: ", error);
      }
    }
    


    logStatTypes();
    logThresholdData();
    logConferenceData();
  }, []); // The empty dependency array ensures this effect runs only once, similar to componentDidMount

    // Transform the data to group stats for each player
    const Quarterback = allQBData.reduce((acc, qb) => {
      const existingPlayer = acc.find((item) => item.player === qb.player);
      if (existingPlayer) {
        existingPlayer.stats.push({ statType: qb.statType, stat: qb.stat });
      } else {
        acc.push({
          player: qb.player,
          team: qb.team,
          conference: qb.conference,
          stats: [{ statType: qb.statType, stat: qb.stat }],
        });
      }
      return acc;
    }, []);

    const WideReceiver = allWRData.reduce((acc, wr) => {
      const existingPlayer = acc.find((item) => item.player === wr.player);
      if (existingPlayer) {
        existingPlayer.stats.push({ statType: wr.statType, stat: wr.stat });
      } else {
        acc.push({
          player: wr.player,
          team: wr.team,
          conference: wr.conference,
          stats: [{ statType: wr.statType, stat: wr.stat }],
        });
      }
      return acc;
    }, []);

  const getPlayers = (statType, threshold, conference) => {
    return Quarterback.filter(player => {
      const stat = player.stats.find((item) => item.statType === statType);
      return stat.stat >= threshold && player.conference === conference;
    });
  };


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
      // Finalize the answer for the active cell
      setFinalizedCellPlayers(prevState => ({ ...prevState, [activeCell]: selectedPlayerInfo }));
      console.log(selectedPlayerInfo);
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

    return logo;
  }

  function generateLogoUrl(teamName) {
    if (teamName === 'USC') {
      teamName = 'southern-california';
    } else if (teamName === 'NC State') {
      teamName = 'north-carolina-state';
    } else {
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

    if (finalizedPlayer) {
      return (
        <div className="text-center">
          <img src={generateLogoUrl(finalizedPlayer.team)} alt={finalizedPlayer.team} className="w-100 mx-auto" />
          <p className="text-sm mt-1">{finalizedPlayer.player}</p>
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

  return (
    <div className="min-h-screen bg-gray-200 py-8">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-6xl font-bold text-center mb-4">CFB Grids</h1>
        {focused && (
          <div className="mb-4 text-black">
            <Dropdown onChange={handleDropdownChange} options={Quarterback.map(p => p.player)} />
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center squarefont-bold text-gray-800" onClick={handleClick}></div>
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
          <div className="border border-2 border-black flex items-center justify-center square" id='topLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('topLeft')}
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='topMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('topMiddle')}
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='topRight' onClick={handleClick}>
            {getPlayerDisplayInfo('topRight')}
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={logoUrl(middleRowConference)} alt="" />
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='middleLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('middleLeft')}
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='middleMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('middleMiddle')}
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='middleRight' onClick={handleClick}>
            {getPlayerDisplayInfo('middleRight')}
          </div>
          <div className="flex items-center justify-center square text-white" onClick={handleClick}>
            <img src={logoUrl(bottomRowConference)} alt="" />
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='bottomLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomLeft')}
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='bottomMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomMiddle')}
          </div>
          <div className="border border-2 border-black flex items-center justify-center square" id='bottomRight' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomRight')}
          </div>
        </div>

        
      </div>
    </div>
  );
}
