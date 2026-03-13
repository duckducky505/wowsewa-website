import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
    return(
        <footer class="footer bg-black">
            <div class="container">
            <div class="footer-grid">
                <div>
                <Link to="/home">
                    <img src="images/logo-white.png" alt="logo" />
                </Link>
                <div class="card">
                    <h4>Subscribe to Newsletter</h4>
                    <p class="text-sm">
                    Subscribe now to recieve tips on how to take your business to
                    the next level.
                    </p>
                    <form action="">
                    <input type="email" id="email" placeholder="Enter your email" />
                    <button type="submit" class="btn btn-primary btn-block">
                        Subscribe
                    </button>
                    </form>
                </div>
                <i class="fab fa-linkedin"></i>
                <i class="fab fa-twitter"></i>
                </div>
                <div>
                <h4>Company</h4>
                <ul>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/amc">AMC</Link></li>
                    <li><Link to="/services">Our Services</Link></li>
                </ul>
                </div>
                <div>
                <h4>Resources</h4>
                <ul>
                    <li><Link to="#">News</Link></li>
                    <li><Link to="#">Research</Link></li>
                    <li><Link to="#">Recent Projects</Link></li>
                </ul>
                </div>
                <div>
                <h4>Contact</h4>
                <ul>
                    <li>wowsewaa@gmail.com</li>
                    <li>9762424318</li>
                </ul>
                </div>
            </div>
            </div>
        </footer>
    )
}

export default Footer;

