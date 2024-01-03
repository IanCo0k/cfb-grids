import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import grid from '../assets/grid.svg';


const HeroSection = () => {
    return (
        <div className="min-h-screen relative flex text-center flex-col justify-center items-center bg-gray-800 text-gray-200">
            <div className='absolute top-0 left-0'>
                <Navbar />

            </div>
            <img src={grid} alt="grid" className="w-32 sm:w-32 mb-8" />

            <h1 className="text-4xl sm:text-8xl font-bold mb-4">
                Welcome to <span className="text-blue-500">CFB Grids</span>!
            </h1>
            <p className="text-lg sm:text-2xl text-center max-w-md mb-8 text-blue-300">
                A sports trivia game testing your knowledge of the history of collegiate athletics.
            </p>
            <div className="space-x-4">
                <Link to="/play" className="bg-blue-500 hover:bg-blue-600 text-gray-200 font-semibold text-sm sm:text-lg  px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                    Play Now
                </Link>
                <Link to="/about" className="bg-transparent border border-white hover:border-blue-500 text-sm sm:text-lg text-gray-200 font-semibold px-6 py-3 rounded-full transition duration-300 hover:bg-blue-500 hover:text-gray-200">
                    About
                </Link>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
                <Footer />
            </div>
        </div>
    );
};

export default HeroSection;
