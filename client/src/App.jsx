import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Silk from './components/Silk';
import './index.css'; // Make sure index.css is imported

function App() {
  return (
    <Router>
      <div className="full-screen-container">
        <Silk />
      </div>
      {/* Added wrapper div for main content with z-index */}
      <div className="app-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 