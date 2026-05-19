import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/images/wowLogo.png';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/amc', label: 'AMC' },
  { to: '/services', label: 'Our Services' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <img src={logo} alt="WowSewa" />
        </Link>

        <nav className="navbar__menu">
          <ul>
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/login" className="btn btn-primary navbar__cta">
          <FaUser /> Log In
        </Link>

        <button
          className="navbar__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`navbar__overlay ${isMenuOpen ? 'is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={`navbar__drawer ${isMenuOpen ? 'is-open' : ''}`}>
        <ul>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
                }
                onClick={closeMenu}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/login"
              className="btn btn-primary btn-block navbar__drawer-cta"
              onClick={closeMenu}
            >
              <FaUser /> Log In
            </Link>
          </li>
        </ul>
      </aside>
    </header>
  );
};

export default Navbar;
