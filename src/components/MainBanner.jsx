import React from 'react';
import { Link } from 'react-router-dom';
import './MainBanner.css';

// Import the business card image
import logo from '../assets/images/wowLogo2.png';

const MainBanner = () => {
    return (
        <section className="home-hero dark-bg">
            <div className="container hero-flex">
                
                {/* Text Content (Left Side) */}
                <div className="hero-content">
                    <h1 className="text-xxl">
                        Your Home. <span className="accent-text">Fixed.</span> <br />
                        Your Office. <span className="accent-text">Connected.</span>
                    </h1>
                    <p className="hero-subtitle">
                        From leaking pipes to complex IT networking, WowSewa provides elite, on-demand maintenance and installation across Kathmandu.
                    </p>
                    <div className="hero-cta-group">
                        <Link to="/services" className="btn btn-primary btn-large">
                            Explore Services
                        </Link>
                        <a href="tel:9762424318" className="btn btn-outline btn-large">
                            <i className="fas fa-phone-alt"></i> Call Now
                        </a>
                    </div>
                </div>

                {/* Visual Content (Right Side) */}
                <div className="hero-visual">
                    <div className="hero-image-frame">
                        <img 
                            src={logo} 
                            alt="WowSewa Services Overview" 
                            className="hero-img" 
                        />
                        <div className="hero-glow"></div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default MainBanner;