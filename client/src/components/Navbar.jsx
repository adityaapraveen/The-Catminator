import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import GradientText from './GradientText.jsx';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div className="navbar-title"> <span className="navbar-title-icon"><img src="/hackercat.svg" alt="" /></span> 
        <GradientText
  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class"
>
  The Catminator!
</GradientText>
        </div>
        <button className="hamburger-icon" onClick={toggleMobileMenu}>
          &#9776;
        </button>
      </div>
      <ul className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        </li>
        {token ? (
          <>
            <li>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </li>
            <li>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar; 