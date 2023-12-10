import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaTh } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase Authentication functions
import '../css/navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Store user information
  const navigate = useNavigate(); // Access the navigate function

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Function to check if a user has a profile image URL
  const hasProfileImage = () => {
    return user && user.photoURL;
  };

  useEffect(() => {
    // Initialize Firebase Authentication
    const auth = getAuth();

    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign the user out
      navigate('/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className='relative w-screen p-6 md:p-12'>
      <nav className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Link to='/' className='text-white'>
            <FaTh className='text-4xl' />
          </Link>
        </div>
        <div className='hidden md:flex items-center'>
          <ul className='flex space-x-12'>
            <li>
              <Link
                to='/play'
                className='text-white hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-xl'
              >
                Play
              </Link>
            </li>
            <li>
              <Link
                to='/about'
                className='text-white hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-xl'
              >
                About
              </Link>
            </li>
          </ul>
          {user ? (
            // Display user profile image if available
            <div className='flex items-center ml-8'>
              {hasProfileImage() ? (
                <img
                  src={user.photoURL}
                  alt='Profile'
                  className='w-8 h-8 rounded-full mr-2'
                />
              ) : (
                // Display a default person icon if no profile image is available
                <FaTh className='text-2xl text-white' />
              )}
              <span className='text-white'>{user.displayName}</span>
              <button
                onClick={handleLogout}
                className='ml-4 text-white hover:underline'
              >
                Logout
              </button>
            </div>
          ) : (
            // Display the Login button if the user is not signed in
            <Link to='/login'>
              <button className='ml-8 bg-blue-600 text-white px-4 py-2 rounded-lg text-xl'>
                Login
              </button>
            </Link>
          )}
        </div>
        <div className='md:hidden'>
          <button onClick={() => setIsOpen(!isOpen)}>
            <FaBars className='text-white text-4xl' />
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-screen bg-blue-600 animate-slide-in-top overflow-hidden z-10'>
          <button className='absolute top-6 right-6 text-white text-4xl' onClick={closeDropdown}>
            <FaTimes />
          </button>
          <div className='flex h-full justify-center items-center'>
            <ul className='flex flex-col items-center space-y-8'>
              <li className='animate-slide-in-right-1'>
                <Link
                  to='/play'
                  className='text-white hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-xl'
                >
                  Play
                </Link>
              </li>
              <li className='animate-slide-in-right-2'>
                <Link
                  to='/about'
                  className='text-white hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-xl'
                >
                  About
                </Link>
              </li>
              {user ? (
                <li className='animate-slide-in-right-2'>
                  <button
                    onClick={handleLogout}
                    className='text-white bg-orange-600 hover:bg-orange-800 hover:text-white px-3 py-2 rounded-lg text-xl'
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className='animate-slide-in-right-2'>
                  <Link
                    to='/login'
                    className='text-white bg-orange-600 hover:bg-orange-800 hover:text-white px-3 py-2 rounded-lg text-xl'
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
