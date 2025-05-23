import React from 'react';
import { Link } from 'react-router-dom';
import LetterGlitch from '../components/LetterGlitch';
import './LandingPage.css';
import DecryptedText from '../components/DecryptedText';
import RotatingText from '../components/RotatingText';

function LandingPage() {
  return (
    <>
    <div className="landing-container animate-fade-in">
  
  {/* <LetterGlitch
    glitchSpeed={50}
    centerVignette={true}
    outerVignette={false}
    smooth={true}
  /> */}
      <h1> 
      <DecryptedText
        text="Welcome to the Catminator!"
        speed={100}
        maxIterations={20}
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!?"
        className="revealed"
        parentClassName="all-letters"
        encryptedClassName="encrypted"
        animateOn='view'
        />
      </h1>
      <p>Scan websites for Performance Analysis, Metadata Retrieval and more
      </p>
      <p>Please log in or register to access the scanning dashboard.</p>

      <div className="landing-actions animate-slide-in">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
      </div>
      <div className="features-section animate-slide-in">
        <h2>Features</h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <li className="feature-item">
            <strong>Security Check (Google Safe Browsing):</strong> Detects if the website is unsafe or malicious.
          </li>
          <li className="feature-item">
            <strong>Website Performance Analysis (Google PageSpeed Insights):</strong> Provides performance scores and metrics like FCP, LCP, CLS, TBT, and Speed Index.
          </li>
          <li className="feature-item">
            <strong>Website Metadata Retrieval (Microlink API):</strong> Fetches title, description, and preview image of the website.
          </li>
          <li className="feature-item">
            <strong>Domain Registration Information (WHOIS Lookup):</strong> Shows registrar, creation/expiration dates, domain age, and status.
          </li>
          <li className="feature-item">
            <strong>IP Address Information (IPinfo API):</strong> Displays location, organization, and timezone of the IP address.
          </li>
        </ul>
      </div>
      </>
  );
}

export default LandingPage;
