import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import teams from '../data/teams.js';

function CollegeSelection() {
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    // Listen for changes in authentication state
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);
  
  const handleLogoClick = async (teamUrl) => {
    setFavoriteTeam(teamUrl);

    // Reload the page after setting the favorite team
    window.location.reload();
  };
  
  const teamButtons = Array.from({ length: teams.length }, (_, i) => {
    const teamNumber = i + 1; // Adjust the team number
    const teamUrl = teams[i]['Logos[0]'];
    return (
      <button
        key={i}
        className="logo-button"
        onClick={() => handleLogoClick(teamUrl)}
      >
        <img
          src={teamUrl}
          alt={`Team ${teamNumber}`}
          className="w-12 h-12 p-1 mr-2 inline"
        />
      </button>
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.displayName);

    try {
      await updateDoc(userDocRef, {
        collegeTeam: favoriteTeam,
      });
      console.log("User data updated successfully.");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="favoriteTeam" className="block text-lg font-semibold">Favorite Team:</label>
        <div className="team-buttons">{teamButtons}</div>
      </div>
    </form>
  );
}

export default CollegeSelection;
