import React from 'react';
import '../App.css';

interface NavbarProps {
  score: number;
  isScoreAnimating: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ score, isScoreAnimating }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>
          Suzy's Tafels Avontuur
          <span>✨</span>
          <span>✨</span>
          <span>✨</span>
          <span>✨</span>
        </h1>
        <div className={`total-value ${isScoreAnimating ? 'points-changed' : ''}`}>
          Score: {score}
          {isScoreAnimating && (
            <div className="sparkle-container">
              <span className="sparkle">+{score}</span>
              <span className="sparkle">+{score}</span>
              <span className="sparkle">+{score}</span>
              <span className="sparkle">+{score}</span>
              <span className="sparkle">+{score}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 