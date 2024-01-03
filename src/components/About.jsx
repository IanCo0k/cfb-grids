import React, {useEffect} from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const AboutPage = () => {


    const location = useLocation();

    useEffect(() => {
      ReactGA.pageview(location.pathname + location.search);
    }, [location]);

  return (
    <div className="relative flex-col text-gray-200 min-h-screen py-16">
      <div className='absolute top-0'>
        <Navbar />
      </div>
      <div className="max-w-screen-md mt-12 mx-auto px-4">
        <div className="p-8 rounded-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-center font-semibold mb-6">About CFB Grids</h1>
          <img
            src='https://media.licdn.com/dms/image/D5603AQGoG0oPOOzUNQ/profile-displayphoto-shrink_800_800/0/1673552040979?e=2147483647&v=beta&t=r9oXKngbGbRsZbVYAOigVQ1wsjgohGZ0k6QZzpDiP9Y' // Replace with the path to your image
            alt="My Image"
            className="w-1/3 max-w-screen-md mx-auto rounded-full mb-8" // Adjust styling as needed
          />
          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-4">
            Hi there! I'm Ian Cook, and I'm the creator behind CFB Grids. This project began as a small side endeavor for my friends, but it has since blossomed into a valuable resource for college football enthusiasts like you.
          </p>
          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-4">
            With over 200,000 visitors and counting, I take pride in providing a platform for fans to explore and test their knowledge of the rich history of college football.
          </p>
          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-4">
            My mission is to offer you a comprehensive and user-friendly experience, allowing you to compete against others in a fun and engaging way.
          </p>
          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl">
            I'm constantly working to enhance and expand our offerings, and I'm truly grateful for the support of our dedicated community. Thank you for joining me on this incredible journey with CFB Grids!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
