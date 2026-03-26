import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaLinkedin, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt
} from 'react-icons/fa'; // Import all necessary icons
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer bg-darkgreen">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <Link to="/home">
                            <img src="/src/assets/images/wowLogo.png" alt="WowSewa Logo" className="footer-logo" />
                        </Link>
                        <p className="brand-tagline">
                            Elite installation, repair, and maintenance for the modern home and office.
                        </p>
                        <div className="social-icons">
                            <a href="#" aria-label="Facebook"><FaFacebook size={28}/></a>
                            <a href="#" aria-label="Instagram"><FaInstagram size={28}/></a>
                            <a href="#" aria-label="Whatsapp"><FaWhatsapp size={28}/></a>
                            <a href="#" aria-label="Linkedin"><FaLinkedin size={28}/></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/amc">AMC Plans</Link></li>
                            <li><Link to="/services">Our Services</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/wow-privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h4>Contact</h4>
                        <ul className="contact-list">
                            <li><FaEnvelope className="footer-icon" /> wowsewaa@gmail.com</li>
                            <li><FaPhoneAlt className="footer-icon" /> 9762424318</li>
                            <li><FaMapMarkerAlt className="footer-icon" /> Kathmandu, Nepal</li>
                        </ul>
                    </div>

                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2026 WowSewa Pvt. Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;