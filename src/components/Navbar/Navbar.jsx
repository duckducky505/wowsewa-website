import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate  = useNavigate();
  const location  = useLocation();

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleServices = (e) => {
    e.preventDefault();
    close();
    if (location.pathname === '/') {
      scrollToServices();
    } else {
      navigate('/');
      setTimeout(scrollToServices, 150);
    }
  };

  return (
    <nav className="navbar bg-main">
      <div className="container">
        {/* logo */}
        <div className="logo">
          <Link to="/" onClick={close}>
            <img src={logo} alt="WowSewa" />
          </Link>
        </div>

        {/* desktop center links */}
        <div className="main-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/#services" onClick={handleServices}>Services</a></li>
            <li><Link to="/training-wowsewa">Training</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
          </ul>
        </div>

        {/* desktop login */}
        <div className="nav-right">
          <Link to="/login" className="btn btn-primary nav-login">
            <UserIcon /> Log In
          </Link>
        </div>

        {/* hamburger */}
        <button
          className="hamburger-button"
          aria-label="Toggle menu"
          aria-expanded={menuActive}
          onClick={() => setMenuActive((a) => !a)}
        >
          <div className={`hamburger-line${menuActive ? ' open' : ''}`} />
          <div className={`hamburger-line${menuActive ? ' open' : ''}`} />
          <div className={`hamburger-line${menuActive ? ' open' : ''}`} />
        </button>

        {/* mobile drawer */}
        <div className={menuActive ? 'mobile-menu active' : 'mobile-menu'}>
          <ul>
            <li><Link to="/" onClick={close}>Home</Link></li>
            <li><a href="/#services" onClick={handleServices}>Services</a></li>
            <li><Link to="/training-wowsewa" onClick={close}>Training</Link></li>
            <li><Link to="/about-us" onClick={close}>About Us</Link></li>
            <li>
              <Link to="/login" onClick={close} className="btn btn-primary nav-login" style={{ marginTop: 8, display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
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