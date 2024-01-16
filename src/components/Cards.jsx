import React, { useState } from 'react';
import Navbar from './Navbar';

export default function Cards() {
  const [players, setPlayers] = useState({ QB: null, RB: null, WR: null });
  const [playerTiers, setPlayerTiers] = useState({ QB: null, RB: null, WR: null });

  // Determine the player's tier based on their rank
  const determinePlayerTier = (rank) => {
    if (rank <= 10) {
      return 'Legend';
    } else if (rank <= 20) {
      return 'Gold';
    } else if (rank <= 25) {
      return 'Silver';
    } else {
      return 'Bronze';
    }
  };

  const fetchPlayer = async (position) => {
    try {
      let randomTeam = Math.floor(Math.random() * 32) + 1;

      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${randomTeam}/roster`);
      const data = await response.json();

      const itemsArray = data.athletes[0]['items'];

      const filteredPlayers = itemsArray.filter(
        (player) =>
          (player.displayName || player.fullName) &&
          [position].includes(player.position.abbreviation)
      );

      const randomIndex = Math.floor(Math.random() * filteredPlayers.length);
      const randomPlayer = filteredPlayers[randomIndex];

      const leadersResponse = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2023/types/2/leaders');
      const leadersData = await leadersResponse.json();

      // Extract leader IDs for each category
      const passingLeaderIds = leadersData.categories[0].leaders.map((leader) => leader.athlete.$ref.split('/').pop().split('?')[0]);
      const rushingLeaderIds = leadersData.categories[1].leaders.map((leader) => leader.athlete.$ref.split('/').pop().split('?')[0]);
      const receivingLeaderIds = leadersData.categories[2].leaders.map((leader) => leader.athlete.$ref.split('/').pop().split('?')[0]);

      // Find the rank of the randomPlayer in each category
      const passingRank = passingLeaderIds.indexOf(randomPlayer?.id) + 1;
      const rushingRank = rushingLeaderIds.indexOf(randomPlayer?.id) + 1;
      const receivingRank = receivingLeaderIds.indexOf(randomPlayer?.id) + 1;

      // Determine the player's tier based on the lowest rank among the categories
      const ranks = [passingRank, rushingRank, receivingRank].filter((rank) => rank > 0); // Remove negative ranks (not in top 25)
      const lowestRank = ranks.length > 0 ? Math.min(...ranks) : 26; // Default to 26 if not in top 25 in any category
      const tier = determinePlayerTier(lowestRank);

      setPlayers(prevPlayers => ({ ...prevPlayers, [position]: randomPlayer }));
      setPlayerTiers(prevTiers => ({ ...prevTiers, [position]: tier }));
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  const handleClick = (position) => {
    if (!players[position]) {
      fetchPlayer(position);
    }
  };

  const renderCard = (position) => {
    const player = players[position];
    const tier = playerTiers[position];
    const cardStyle = {
      backgroundColor: tier === 'Legend' ? 'purple' :
                       tier === 'Gold' ? 'gold' :
                       tier === 'Silver' ? 'silver' :
                       tier === 'Bronze' ? 'brown' : 'black',
    };

    return (
      <div className='p-4 border-2 border-gray-200 rounded cursor-pointer' style={cardStyle} onClick={() => handleClick(position)}>
        <p className='font-bold text-xl'>{position} {player ? ` - ${player.displayName || player.fullName}` : ''}</p>
        {player && (
          <>
            <p className='font-bold mt-2 text-7xl text-center'>{player?.jersey}</p>
            <p className='text-center mt-8'>{tier} {player?.position?.abbreviation}</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
        <h1 className="text-5xl">Draft Your Team</h1>
        <div className="flex space-x-4 mt-8">
          {renderCard('QB')}
          {renderCard('RB')}
          {renderCard('WR')}
        </div>
      </div>
    </div>
  );
}
