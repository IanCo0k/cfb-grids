import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for createRoot
import App from './App.jsx';
import About from './components/About.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import Guess from './components/Guess.jsx';
import Signup from './components/SignUp.jsx';
import Dashboard from './components/Dashboard.jsx';
import Cards from './components/Cards.jsx';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import ReactGA from 'react-ga';

ReactGA.initialize('G-V6ZFJVRZGX');

const Main = () => {
  useEffect(() => {
    // Track the page view when the component mounts
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <Router>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/guess" element={<Guess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/" element={<App />} />
        </Routes>
    </Router>
  );
};

// Correct way to use createRoot
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);
