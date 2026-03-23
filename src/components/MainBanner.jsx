import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa'; 
import './MainBanner.css';

import logo from '../assets/images/wowLogo2.png';

const MainBanner = () => {
    return (
        <section className="home-hero bg-light">
            <div className="container hero-flex">
                
                <div className="hero-content">
                    <h1 className="text-xxl">
                        Your Home. <span className="accent-text-primary">Fixed.</span> <br />
                        Your Office. <span className="accent-text-primary">Connected.</span>
                    </h1>
                    <p className="hero-subtitle">
                        From leaking pipes to complex IT networking, WowSewa provides elite, on-demand maintenance and installation across Kathmandu.
                    </p>
                    <div className="hero-cta-group">
                        <Link to="/services" className="btn btn-dark btn-large">
                            Explore Services
                        </Link>
                        <a href="tel:9762424318" className="btn btn-darkgreen btn-large btn-flex">
                            <FaPhoneAlt className="icon-left" /> Call Now
                        </a>
                    </div>
                </div>

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