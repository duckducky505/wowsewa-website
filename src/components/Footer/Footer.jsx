import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';
import logo from '../../assets/images/wowLogo.png';

/* social icons (inline SVG — no Font Awesome dependency) */
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H16.4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H10z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5-6.5L5.5 22H2.4l8.1-9.3L1.7 2h6.9l4.5 6 5.8-6zm-2.4 18h1.9L7.6 4H5.6z" />
  </svg>
);
const Instagram = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Facebook = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.76-1.6 1.5V12h2.7l-.43 2.9h-2.27v7A10 10 0 0 0 22 12z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer bg-main">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/home" className="footer-logo">
              <img src={logo} alt="WowSewa" className="footer-logo-img" />
            </Link>
            <p className="footer-desc text-md">
              WowSewa is your one number for every home fix — plumbing,
              electrical, appliances and IT. Vetted, insured technicians at
              fixed, up-front prices, booked in under a minute.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><LinkedIn /></a>
              <a href="#" aria-label="Twitter / X"><XIcon /></a>
              <a href="#" aria-label="Instagram"><Instagram /></a>
              <a href="#" aria-label="Facebook"><Facebook /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="plumbing.html">Plumbing</a></li>
              <li><a href="electrical.html">Electrical</a></li>
              <li><a href="appliances.html">Appliances</a></li>
              <li><a href="it-devices.html">IT &amp; Devices</a></li>
              <li><a href="deep-cleaning.html">Deep Cleaning</a></li>
              <li><a href="emergency.html">24×7 Emergency</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/privacy-wowsewa">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions-wowsewa">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="ci"><FiMail size={17} /></span>
                <a href="mailto:wowsewaa@gmail.com">hello@wowsewa.com</a>
              </li>
              <li>
                <span className="ci"><FiPhone size={17} /></span>
                <a href="tel:+97718009697392">+977 1800-WOW-SEWA</a>
              </li>
              <li>
                <span className="ci"><FiMapPin size={17} /></span>
                <span className="footer-addr">Machhapokhari, Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom text-sm">
          © 2026 WowSewa Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;