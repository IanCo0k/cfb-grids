import React from 'react';
import { FaTwitter, FaSpotify, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-black py-8">
      <div className="flex justify-center space-x-4">
        <a
          href="https://twitter.com/CFBGrids"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl hover:text-blue-400"
        >
          <FaTwitter />
        </a>
        <a
          href="https://open.spotify.com/show/3PxjY8VH1h4Q4Cb2shJqRQ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl hover:text-green-400"
        >
          <FaSpotify />
        </a>
        <a
          href="https://www.instagram.com/ianco0k/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl hover:text-red-400"
        >
          <FaInstagram />
        </a>
        <a href="mailto:ianscook19@gmail.com" className="text-4xl hover:text-yellow-400">
          <FaEnvelope />
        </a>
      </div>
      <p className="text-center mt-4">
        © {new Date().getFullYear()} CFB Grids.
      </p>
    </footer>
  );
};

export default Footer;

