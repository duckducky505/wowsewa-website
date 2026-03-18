import { Link } from 'react-router-dom';
import "./Footer.css"

const Footer = () => {
    return (
        <footer className="footer dark-bg">
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
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-whatsapp"></i></a>
                            <a href="#"><i className="fab fa-linkedin"></i></a>
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

                    <div>
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/Wow-privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h4>Contact</h4>
                        <ul className="contact-list">
                            <li><i className="fas fa-envelope"></i> wowsewa@gmail.com</li>
                            <li><i className="fas fa-phone"></i> 9762424318</li>
                            <li><i className="fas fa-map-marker-alt"></i> Kathmandu, Nepal</li>
                        </ul>
                    </div>

                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2026 WowSewa Pvt. Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;