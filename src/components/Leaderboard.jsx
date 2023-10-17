import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { MdLeaderboard, MdClose } from 'react-icons/md';

function Leaderboard({ imgSrc1, imgSrc2, imgSrc3 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [topScores, setTopScores] = useState([]);

  const toggleLeaderboard = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchTopScores = async () => {
      const db = getFirestore();
      const leaderboardRef = doc(db, 'dailyLeaderboard', 'oct17leaders');
      
      try {
        const docSnapshot = await getDoc(leaderboardRef);
        const scores = docSnapshot.data().scores || [];
        
        const top5Scores = scores
            .sort((a, b) => a - b)  // Sorting in ascending order
            .slice(0, 5)
            .map(score => score.toFixed(2));
        
        setTopScores(top5Scores);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    
    fetchTopScores();
  }, []);

  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-md z-10 max-w-md mx-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <h1 className='text-center text-2xl font-semibold mb-4 flex items-center justify-center'>
              <MdLeaderboard size={32} className="mr-2" />
              Top Scores Leaderboard
            </h1>
            <ol className="list-decimal pl-5 mb-4">
              {topScores.map((score, index) => (
                <li key={index} className="text-lg mb-2">{score}</li>
              ))}
            </ol>
            <button
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleLeaderboard}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        onClick={toggleLeaderboard}
      >
        <MdLeaderboard size={24} className="mr-2" />
        View Leaderboard
      </button>
    </div>
  );
}

export default Leaderboard;
