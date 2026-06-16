import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/images/wowLogo.png';

const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const close = () => setMenuActive(false);

  return (
    <nav className="navbar bg-main">
      <div className="container">
        {/* left — logo */}
        <div className="logo">
          <Link to="/" onClick={close}>
            <img src={logo} alt="WowSewa" />
          </Link>
        </div>

        <div className="main-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Services</Link></li>
            <li><Link to="/training-wowsewa">Training</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
          </ul>
        </div>

        {/* right — login */}
        <div className="nav-right">
          <Link to="/login" className="btn btn-primary nav-login">
            <UserIcon /> Log In
          </Link>
        </div>

        {/* Hamburger button (shown under 670px via app.css) */}
        <button
          id="hamburger-button"
          className="hamburger-button"
          aria-label="Toggle menu"
          onClick={() => setMenuActive((active) => !active)}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>

        <div className={menuActive ? 'mobile-menu active' : 'mobile-menu'}>
          <ul>
            <li><Link to="/" onClick={close}>Home</Link></li>
            <li><Link to="/about" onClick={close}>About Us</Link></li>
            <li>
              <Link to="/login" onClick={close} className="btn btn-primary nav-login">
                <UserIcon /> Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;