import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaTh } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import '../css/navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className='relative w-screen p-6 md:p-12'>
      <nav className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Link to='/' className='text-gray-200'>
            <FaTh className='text-2xl' />
          </Link>
          <span className='text-gray-200 ml-4 hidden md:block text-2xl'>CFB Grids</span>
        </div>
        <div className='hidden md:flex items-center'>
          <ul className='flex space-x-12'>
            <li>
              <Link
                to='/'
                className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
              >
                Grid
              </Link>
            </li>
            <li>
              <Link
                to='/guess'
                className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
              >
                College Guesser
              </Link>
            </li>
            <li>
              <Link
                to='/about'
                className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
              >
                About
              </Link>
            </li>
            {/* Conditionally display the "Dashboard" link */}
            {user && user.displayName === 'Ian Cook' && (
              <li>
                <Link
                  to='/dashboard'
                  className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
          {user ? (
            <div className='flex items-center ml-8'>
              <Link
                to='/profile'
                className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className='ml-4 text-gray-200 hover:underline'
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to='/login'>
              <button className='ml-8 bg-blue-600 text-gray-200 px-4 py-2 rounded-lg text-xl'>
                Login
              </button>
            </Link>
          )}
        </div>
        <div className='md:hidden'>
          <button onClick={() => setIsOpen(!isOpen)}>
            <FaBars className='text-gray-200 text-2xl' />
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-screen bg-blue-600 animate-slide-in-top overflow-hidden z-10'>
          <button className='absolute top-6 right-6 text-gray-200 text-4xl' onClick={closeDropdown}>
            <FaTimes />
          </button>
          <div className='flex h-full justify-center items-center'>
            <ul className='flex flex-col items-center space-y-8'>
              <li className='animate-slide-in-right-1'>
                <Link
                  to='/'
                  className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                >
                  Grid
                </Link>
              </li>
              <li className='animate-slide-in-right-1'>
                <Link
                  to='/guess'
                  className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                >
                  College Guesser
                </Link>
              </li>
              <li className='animate-slide-in-right-2'>
                <Link
                  to='/about'
                  className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                >
                  About
                </Link>
              </li>
              <li className='animate-slide-in-right-2'>
                <Link
                  to='/profile'
                  className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                >
                  Profile
                </Link>
              </li>
              {user && user.displayName === 'Ian Cook' && (
                <li className='animate-slide-in-right-2'>
                  <Link
                    to='/dashboard'
                    className='text-gray-200 hover:bg-blue-600 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {user ? (
                <li className='animate-slide-in-right-2'>
                  <button
                    onClick={handleLogout}
                    className='text-gray-200 bg-orange-600 hover:bg-orange-800 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className='animate-slide-in-right-2'>
                  <Link
                    to='/login'
                    className='text-gray-200 bg-orange-600 hover:bg-orange-800 hover:text-gray-200 px-3 py-2 rounded-lg text-xl'
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
