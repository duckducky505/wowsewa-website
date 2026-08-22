import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/wowLogo.png';

const UserIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', href: '/#services', isServices: true },
  { label: 'AMC', to: '/amc' },
  { label: 'Training', to: '/training-wowsewa' },
  { label: 'About Us', to: '/about-us' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--primary-color)]/20 bg-[var(--background-color)]/95 py-2 shadow-[0_10px_40px_rgba(3,32,26,0.45)] backdrop-blur-md'
          : 'bg-transparent py-3.5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* logo */}
        <Link to="/" onClick={close} className="flex shrink-0 items-center" aria-label="WowSewa home">
          <img src={logo} alt="WowSewa" className="block h-9 w-auto sm:h-10" />
        </Link>

        {/* desktop centre links */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <ul className="flex flex-wrap items-center justify-center gap-1">
            {NAV.map((n) =>
              n.isServices ? (
                <li key={n.label}>
                  <a
                    href={n.href}
                    onClick={handleServices}
                    className="link-underline block whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold tracking-wide text-[rgba(248,250,234,0.85)] transition-colors duration-200 hover:bg-[rgba(248,250,234,0.1)] hover:text-[var(--primary-color)]"
                  >
                    {n.label}
                  </a>
                </li>
              ) : (
                <li key={n.label}>
                  <Link
                    to={n.to}
                    onClick={close}
                    className="link-underline block whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold tracking-wide text-[rgba(248,250,234,0.85)] transition-colors duration-200 hover:bg-[rgba(248,250,234,0.1)] hover:text-[var(--primary-color)]"
                  >
                    {n.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* right cluster */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/"
            onClick={close}
            className="btn-hard hidden items-center gap-2 rounded-md bg-lime px-5 py-2.5 font-display text-sm font-bold text-ink md:inline-flex"
          >
            <UserIcon /> Log In
          </Link>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md border border-[rgba(248,250,234,0.25)] lg:hidden"
          >
            <span
              className={`h-[2px] w-5 rounded-sm bg-[var(--light-color)] transition-transform duration-300 ${
                open ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[2px] w-5 rounded-sm bg-[var(--primary-color)] transition-opacity duration-200 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-[2px] w-5 rounded-sm bg-[var(--light-color)] transition-transform duration-300 ${
                open ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={`overflow-hidden border-b border-[var(--primary-color)]/15 bg-[#053a2c]/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
          open ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {NAV.map((n, i) =>
            n.isServices ? (
              <a
                key={n.label}
                href={n.href}
                onClick={handleServices}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 font-display text-lg font-bold text-[var(--light-color)] transition-colors duration-200 hover:bg-[rgba(248,250,234,0.1)] hover:text-[var(--primary-color)]"
              >
                {n.label}
                <span className="font-mono text-[10px] text-[var(--primary-color)]/60">0{i + 1}</span>
              </a>
            ) : (
              <Link
                key={n.label}
                to={n.to}
                onClick={close}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 font-display text-lg font-bold text-[var(--light-color)] transition-colors duration-200 hover:bg-[rgba(248,250,234,0.1)] hover:text-[var(--primary-color)]"
              >
                {n.label}
                <span className="font-mono text-[10px] text-[var(--primary-color)]/60">0{i + 1}</span>
              </Link>
            )
          )}

          <Link
            to="/"
            onClick={close}
            className="btn-hard mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 font-display font-bold text-ink"
          >
            <UserIcon /> Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;