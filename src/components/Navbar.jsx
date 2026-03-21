import React, { useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar bg-dark">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="src/assets/images/wowLogo.png" alt="logo" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="main-menu">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/About">About Us</Link></li>
            <li><Link to="/amc">AMC</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li>
              <a href="#" className="btn btn-dark">
                <i className="fas fa-user"></i>Log In
              </a>
            </li>
          </ul>
        </div>

        {/* Hamburger Button - Added onClick and dynamic class */}
        <button 
          className={`hamburger-button ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>

        {/* Mobile Menu - Added dynamic class based on state */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''} dark-bg`}>
          <ul>
            <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/About" onClick={toggleMenu}>About Us</Link></li>
            <li><Link to="/amc" onClick={toggleMenu}>AMC</Link></li>
            <li><Link to="/services" onClick={toggleMenu}>Our Services</Link></li>
            <li>
              <a href="#" className="btn btn-dark" onClick={toggleMenu}>
                <i className="fas fa-user"></i>Log In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;