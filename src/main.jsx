import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </React.StrictMode>,
  </Router>
  )
