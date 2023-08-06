import React, { useEffect, useState } from 'react';
import Dropdown from './components/Dropdown';
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

export default function App() {
  const statTypes = ['INT', 'COMPLETIONS', 'TD', 'YDS', 'YPA', 'ATT', 'PCT'];
  const [finalizedCellPlayers, setFinalizedCellPlayers] = useState({});


  const [focused, setFocused] = useState(false);
  const [activeCell, setActiveCell] = useState('');

  const [leftColumnStatType, setLeftColumnStatType] = useState('TD');
  const [leftColumnThreshold, setLeftColumnThreshold] = useState(10);
  
  const [middleColumnStatType, setMiddleColumnStatType] = useState('YDS');
  const [middleColumnThreshold, setMiddleColumnThreshold] = useState(1000);

  const [rightColumnStatType, setRightColumnStatType] = useState('COMPLETIONS');
  const [rightColumnThreshold, setRightColumnThreshold] = useState(55);

  const [topRowConference, setTopRowConference] = useState('Big Ten');
  const [middleRowConference, setMiddleRowConference] = useState('Pac-12');
  const [bottomRowConference, setBottomRowConference] = useState('ACC');

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

  // Combine all QB data into one array
  const allQBData = [...secQB, ...b1gQB, ...pacQB, ...macQB, ...accQB, ...b12QB];

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

  const getPlayers = (statType, threshold, conference) => {
    return Quarterback.filter(player => {
      const stat = player.stats.find((item) => item.statType === statType);
      return stat.stat >= threshold && player.conference === conference;
    });
  };

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
    console.log(playerGrid[`${activeCell}Players`]);
    const selectedPlayerInfo = playerList.find((player) => player.player === playerName);
  
    if (selectedPlayerInfo) {
      setCellPlayerInfo(selectedPlayerInfo);
      // Finalize the answer for the active cell
      setFinalizedCellPlayers(prevState => ({ ...prevState, [activeCell]: selectedPlayerInfo }));
    }
  };

  function generateLogoUrl(teamName) {
    

    if(teamName === 'USC'){
      teamName = 'southern-california';
    } else if(teamName === 'NC State'){
      teamName = 'north-carolina-state';
    }
     else{
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
          <img src={generateLogoUrl(finalizedPlayer.team)} alt={finalizedPlayer.team} className="w-16 h-16 mx-auto" />
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto p-4">
        {focused && (
          <div className="mb-4">
            <Dropdown onChange={handleDropdownChange} options={Quarterback.map(p => p.player)} />
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center square bg-white font-bold text-gray-800" onClick={handleClick}></div>
          <div className="flex items-center justify-center square bg-blue-500 text-white" onClick={handleClick}>
            {leftColumnThreshold} {leftColumnStatType}
          </div>
          <div className="flex items-center justify-center square bg-green-500 text-white" onClick={handleClick}>
            {middleColumnThreshold} {middleColumnStatType}
          </div>
          <div className="flex items-center justify-center square bg-purple-500 text-white" onClick={handleClick}>
            {rightColumnThreshold} {rightColumnStatType}
          </div>
          <div className="flex items-center justify-center square bg-red-500 text-white" onClick={handleClick}>
            {topRowConference}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='topLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('topLeft')}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='topMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('topMiddle')}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='topRight' onClick={handleClick}>
            {getPlayerDisplayInfo('topRight')}
          </div>
          <div className="flex items-center justify-center square bg-yellow-500 text-white" onClick={handleClick}>
            {middleRowConference}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='middleLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('middleLeft')}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='middleMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('middleMiddle')}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='middleRight' onClick={handleClick}>
            {getPlayerDisplayInfo('middleRight')}
          </div>
          <div className="flex items-center justify-center square bg-pink-500 text-white" onClick={handleClick}>
            {bottomRowConference}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='bottomLeft' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomLeft')}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='bottomMiddle' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomMiddle')}
          </div>
          <div className="border border-2 border-white flex items-center justify-center square" id='bottomRight' onClick={handleClick}>
            {getPlayerDisplayInfo('bottomRight')}
          </div>
        </div>
      </div>
    </div>
  );
  
}
