import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import TeamSelection from './TeamSelection';
import CollegeSelection from './CollegeSelection';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState('');
const [collegeTeam, setCollegeTeam] = useState('');
const [twitterHandle, setTwitterHandle] = useState('');
const [successMessage, setSuccessMessage] = useState('');


  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const fetchUserData = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUser(user.displayName);

            const userDocRef = doc(db, 'users', user.displayName);

            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              setUserData(userData);

              setFavoriteTeam(userData.favoriteTeam || '');
              setCollegeTeam(userData.collegeTeam || '');
              setTwitterHandle(userData.twitter || ''); // Set Twitter handle if it exists


              if (!userData.favoriteTeam) {
                await updateDoc(userDocRef, { favoriteTeam: '' });
                console.log("Favorite team field created.");
              } else if (!userData.collegeTeam) {
                await updateDoc(userDocRef, { collegeTeam: '' });
                console.log("Favorite team field created.");
              }
            } else {
              console.log("User document does not exist. Creating user fields...");

              await setDoc(userDocRef, {
                displayName: '',
                favoriteTeam: '',
                totalGuesses: 0,
                collegesGuessed: 0,
                topRarities: [],
              });

              console.log("User fields created.");
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

  const handleEditClick = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', auth.currentUser.displayName);
    
    try {
      // Set the favoriteTeam field to an empty string
      await updateDoc(userDocRef, {
        favoriteTeam: ''
      });
      console.log("Favorite team field set to empty string.");
      // Reload the page to reveal the grid again
      window.location.reload();
    } catch (error) {
      console.error("Error setting favorite team field to empty string:", error);
    }
  };

  const collegeEditClick = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', auth.currentUser.displayName);
    
    try {
      // Set the favoriteTeam field to an empty string
      await updateDoc(userDocRef, {
        collegeTeam: ''
      });
      console.log("Favorite team field set to empty string.");
      // Reload the page to reveal the grid again
      window.location.reload();
    } catch (error) {
      console.error("Error setting favorite team field to empty string:", error);
    }
  }

  const saveTwitterHandle = async () => {
    const userDocRef = doc(db, 'users', auth.currentUser.displayName);

    try {
      await updateDoc(userDocRef, {
        twitter: twitterHandle,
      });
      setSuccessMessage("Twitter handle saved successfully!");
    } catch (error) {
      console.error("Error saving Twitter handle:", error);
      setSuccessMessage("Error saving Twitter handle. Please try again.");
    }
  };
  
  

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Navbar />
      <div className="container mx-auto p-4 flex justify-center items-center h-full">
        {userData && (
          <div className="bg-gray-800 rounded-lg p-8 shadow-md w-full max-w-md">
            <h2 className="text-3xl font-semibold mb-4">Welcome, {user}!</h2>
            {favoriteTeam ? (
              <div className="text-center mb-4">
                <img
                  src={favoriteTeam}
                  alt="Favorite Team"
                  className="w-40 h-40 mx-auto mb-2"
                />
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              </div>
            ) : (
              <TeamSelection />
            )}

            {collegeTeam ? (
                <div className="text-center mb-4">
                <img
                  src={collegeTeam}
                  alt="Favorite Team"
                  className="w-40 h-40 mx-auto mb-2"
                />
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                  onClick={collegeEditClick}
                >
                  Edit
                </button>
              </div>
            ) : (
              <CollegeSelection />
            )}

<div className="text-center mb-4">
          <label htmlFor="twitterHandle" className="text-lg block mb-2">
            Enter your Twitter handle:
          </label>
          <div className="flex items-center justify-center">
            <input
              type="text"
              id="twitterHandle"
              placeholder="E.g., @yourhandle"
              className="border-2 border-gray-300 text-black p-2 rounded-md w-40 mr-2"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
            />
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
              onClick={saveTwitterHandle}
            >
              Save
            </button>
          </div>
          {successMessage && (
            <p className="text-green-500 mt-2">{successMessage}</p>
          )}
        </div>


            <div className="flex gap-2">
              <div className="rounded p-4 bg-gray-700">
                <p className="text-center py-4">TOTAL GRID GUESSES</p>
                <p className="text-6xl font-semibold text-center">{userData.totalGuesses}</p>
              </div>
              <div className="rounded p-4 bg-gray-700">
                <p className="text-center py-4">TOTAL COLLEGES CORRECTLY GUESSED</p>
                <p className="text-6xl font-semibold text-center">{userData.collegesGuessed}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Bottom 5 Career Rarity Scores:</h3>
            <ol className="list-decimal pl-4">
              {userData.topRarities
                .slice()
                .sort((a, b) => a - b) // Sort in ascending order
                .slice(0, 5) // Get the first 5 smallest scores
                .map((rarity, index) => (
                  <li key={index} className="flex justify-between items-center text-gray-400 py-1">
                    <span className="text-lg">{index + 1}.</span>
                    <span className="text-lg">{rarity}</span>
                  </li>
                ))}
            </ol>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
