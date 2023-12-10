import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import HeroSection from './components/HeroSection.jsx';
import About from './components/About.jsx';
import Login from './components/Login.jsx';
import Signup from './components/SignUp.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import ReactGA from 'react-ga';

// Initialize Google Analytics with your Measurement ID
ReactGA.initialize('G-V6ZFJVRZGX');

const Main = () => {
  useEffect(() => {
    // Track the page view when the component mounts
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <Router>
      <React.StrictMode>
        <Routes>
          <Route path="/play" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HeroSection />} />
        </Routes>
      </React.StrictMode>
    </Router>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
