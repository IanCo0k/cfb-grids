import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(50);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.displayName === 'Ian Cook') {
        setCurrentUser(user);

        try {
          const usersCollectionRef = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollectionRef);
          const usersData = [];

          usersSnapshot.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() });
          });

          setUsersData(usersData);

          // Calculate the total number of registered users
          setRegisteredUsers(usersData.length);

          // Retrieve total page views from views collection
          const viewsDocRef = doc(db, 'views', 'guessGame');
          const viewsDocSnapshot = await getDoc(viewsDocRef);

          if (viewsDocSnapshot.exists()) {
            setTotalPageViews(viewsDocSnapshot.data().views || 0);
          }

          // Calculate the total number of games played
          const streaksDocRef = doc(db, 'streakLeaderboard', 'streaks');
          const streaksDocSnapshot = await getDoc(streaksDocRef);

          if (streaksDocSnapshot.exists()) {
            const streaksData = streaksDocSnapshot.data().streaks || [];
            setTotalGamesPlayed(streaksData.length);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!currentUser) {
    return <div>Access Denied</div>;
  }

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersData.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className='text-white'>
      <Navbar />
      <div className='flex justify-center gap-4 mb-4'>
        <div className='bg-blue-600 p-4 rounded-lg'>
          <h2 className='md:text-xl text-sm font-semibold'>Total Page Views</h2>
          <p className='font-bold text-3xl'>{totalPageViews}</p>
        </div>
        <div className='bg-blue-600 p-4 rounded-lg'>
          <h2 className='md:text-xl text-sm font-semibold'>Registered Users</h2>
          <p className='font-bold text-3xl'>{registeredUsers}</p>
        </div>
        <div className='bg-blue-600 p-4 rounded-lg'>
          <h2 className='md:text-xl text-sm font-semibold'>Games Played Today</h2>
          <p className='font-bold text-3xl'>{totalGamesPlayed}</p>
        </div>
      </div>
      <h1 className="text-2xl text-center font-semibold mb-4">User Dashboard</h1>
      <div className=" md:p-8 overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className='text-black'>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Favorite Team</th>
              <th className="py-2 px-3 text-left">College Team</th>
              <th className="py-2 px-3 text-left">Twitter</th>
              <th className="py-2 px-3 text-left">Total Guesses</th>
              <th className='py-2 px-3 text-left'>Colleges Guessed</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-3 border">{user.id}</td>
                <td className="py-2 px-3 border">
                  <img className="w-8" src={user.favoriteTeam || ''} alt="Favorite Team" />
                </td>
                <td className="py-2 px-3 border">
                  <img className="w-8" src={user.collegeTeam || ''} alt="College Team" />
                </td>
                <td className="py-2 px-3 border">{user.twitter || ''}</td>
                <td className="py-2 px-3 border">{user.totalGuesses || 0}</td>
                <td className="py-2 px-3 border">{user.collegesGuessed || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Previous Page
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastUser >= usersData.length}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
