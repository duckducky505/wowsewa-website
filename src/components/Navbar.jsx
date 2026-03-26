import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa'; // Import React Icons
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar bg-darkgreen">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/src/assets/images/wowLogo.png" alt="WowSewa Logo" />
          </Link>
        </div>

        <div className="main-menu">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/amc">AMC</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li>
              <Link to="/login" className="btn btn-dark">
                <FaUser className="icon-left" /> Log In
              </Link>
            </li>
          </ul>
        </div>

        {/* Hamburger Button */}
        <button 
          className="hamburger-button" 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <FaTimes size={28} color="var(--primary-color)" />
          ) : (
            <FaBars size={28} color="var(--primary-color)" />
          )}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/home" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/about" onClick={toggleMenu}>About Us</Link></li>
            <li><Link to="/amc" onClick={toggleMenu}>AMC</Link></li>
            <li><Link to="/services" onClick={toggleMenu}>Our Services</Link></li>
            <li>
              <Link to="/login" className="btn btn-dark" onClick={toggleMenu}>
                <FaUser className="icon-left" /> Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;