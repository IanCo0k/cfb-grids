import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const fetchUserData = async () => {
      try {
        // Listen for changes in authentication state
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Reference to the user's document in the "users" collection
            const userDocRef = doc(db, 'users', user.displayName);
            setUser(user.displayName);

            // Fetch the user's document
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              // Extract the user data
              const userData = userDocSnapshot.data();
              setUserData(userData);
            } else {
              console.log("User document does not exist.");
            }
          } else {
            console.log("No user is currently authenticated.");
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto p-4 flex justify-center items-center h-full">
        {userData && (
          <div className="bg-gray-800 rounded-lg p-8 shadow-md w-full max-w-md">
            <h2 className="text-3xl font-semibold mb-4">Welcome, {user}!</h2>
            <div className='w-full text-center p-8 rounded bg-gray-700'>
                <p>TOTAL GUESSES</p>
                <p className='text-6xl font-semibold'>{userData.totalGuesses}</p>
            </div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Top 5 Career Rarity Scores:</h3>
            <ol className="list-decimal pl-4">
              {userData.topRarities.slice(0, 5).map((rarity, index) => (
                <li key={index} className="flex justify-between items-center text-gray-400 py-1">
                  <span className="text-lg">{index + 1}.</span>
                  <span className="text-lg">{rarity}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
