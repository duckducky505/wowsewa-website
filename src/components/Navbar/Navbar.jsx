import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import logo from "../../assets/images/wowLogo.png";

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/about-us', label: 'About Us' },
  { to: '/amc', label: 'AMC' },
  { to: '/services', label: 'Our Services' },
  { to: '/training-wowsewa', label: 'Training' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

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

  // Close on outside click / tap, regardless of what else is on the page
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-lime/20 bg-pine/95 py-2 shadow-[0_10px_40px_rgba(3,32,26,0.45)] backdrop-blur-md'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* logo */}
        <Link to="/" onClick={closeMenu} className="group flex shrink-0 items-center" aria-label="WowSewa home">
          <img
            src={logo}
            alt="WowSewa"
            className="block h-9 w-auto transition-transform duration-300 group-hover:scale-[1.04] sm:h-10"
          />
        </Link>

        {/* desktop centre links */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <ul className="flex flex-wrap items-center justify-center gap-1">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `link-underline block whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold tracking-wide transition-colors duration-200 hover:bg-cream/10 hover:text-lime ${
                      isActive ? 'text-lime' : 'text-cream/85'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* right cluster */}
        <div className="flex shrink-0 items-center gap-3">
          {/* <Link
            to="/login"
            onClick={closeMenu}
            className="btn-hard hidden items-center gap-2 rounded-md bg-lime px-5 py-2.5 font-display text-sm font-bold text-ink md:inline-flex"
          >
            <FaUser size={14} /> 
          </Link> */}

          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-cream/25 text-cream lg:hidden"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* mobile drawer — absolute, anchored to this header (its positioned ancestor) */}
      <div
        className={`absolute inset-x-0 top-full z-40 border-b border-lime/15 bg-pine-deep transition-all duration-300 ease-out lg:hidden ${
          isMenuOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {navLinks.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-2.5 font-display text-lg font-bold transition-colors duration-200 hover:bg-cream/10 hover:text-lime ${
                  isActive ? 'text-lime' : 'text-cream'
                }`
              }
            >
              {l.label}
              <span className="font-mono text-[10px] text-lime/60">0{i + 1}</span>
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={closeMenu}
            className="btn-hard mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 font-display font-bold text-ink"
          >
            <FaUser size={14} /> Book a service now
          </Link>
        </nav>
      </div>

      {/* dim backdrop behind the drawer, purely visual now — closing is handled by the pointerdown listener */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 top-0 z-30 bg-ink/50 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
    </header>
  );
};

export default Navbar;