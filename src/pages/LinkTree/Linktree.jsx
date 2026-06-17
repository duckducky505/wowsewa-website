import React from 'react';
import { 
  FaFacebook, FaInstagram, FaYoutube, 
  FaTiktok, FaLinkedin, FaWhatsapp, FaGlobe, 
  FaPhoneAlt, FaEnvelope, FaMobileAlt 
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { MdArrowForward } from 'react-icons/md';
import './Linktree.css'; // Contains the specific layout styles below

const Linktree = () => {
  return (
    // Uses bg-main from App.css for the dark green background
    <div className="bg-main connect-page-wrapper">
      {/* Uses container-sm from App.css to center and restrict width */}
      <div className="container-sm connect-container">
        
        {/* Header */}
        <header className="connect-header">
          {/* Requested Logo Image Instead of Text */}
          <img 
            src="/assets/wowsewa-logo-white.png" 
            alt="Brand Logo" 
            className="brand-logo-img" 
          />
          <div className="status-badge">
            <span className="dot"></span> ONLINE - 7 CITIES
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="section-label-line">
            <span className="line"></span> THANKS FOR CHOOSING US
          </div>
          {/* Uses text-xxl from App.css */}
          <h1 className="text-xxl text-white hero-title">
            Let's stay <br />
            {/* Uses accent-text-main from App.css for the custom font and primary color */}
            <span className="accent-text-main">connected.</span>
          </h1>
          {/* Uses text-md from App.css */}
          <p className="text-md text-white hero-desc">
            Rate your experience, follow along, or reach us directly — every way to find WowSewa, in one place.
          </p>
        </section>

        {/* Google Review Card - Uses bg-primary from App.css */}
        <a href="#" className="card bg-primary google-review-card">
          <div className="google-icon-wrapper">
            <FcGoogle size={24} />
          </div>
          <div className="card-content">
            <div className="stars">★★★★★</div>
            <h3>Leave a Google review</h3>
            <p>Your feedback helps us serve you better</p>
          </div>
          <div className="arrow-btn">
            <MdArrowForward />
          </div>
        </a>

        {/* Follow Along Grid */}
        <section className="links-section">
          <div className="section-label-line">
            <span className="line"></span> FOLLOW ALONG
          </div>
          
          <div className="social-grid">
            {/* Social Cards - Uses bg-light from App.css */}
            <a href="#" className="card bg-light social-card">
              <div className="social-icon fb"><FaFacebook /></div>
              <div className="social-info">
                <h4>Facebook</h4>
                <p>Stay connected</p>
                <span>/wowsewa</span>
              </div>
              <div className="arrow-btn"><MdArrowForward /></div>
            </a>

            <a href="#" className="card bg-light social-card">
              <div className="social-icon ig"><FaInstagram /></div>
              <div className="social-info">
                <h4>Instagram</h4>
                <p>Latest updates!</p>
                <span>@wowsewa</span>
              </div>
              <div className="arrow-btn"><MdArrowForward /></div>
            </a>

            <a href="#" className="card bg-light social-card">
              <div className="social-icon yt"><FaYoutube /></div>
              <div className="social-info">
                <h4>YouTube</h4>
                <p>Watch our videos</p>
                <span>/@wowsewa</span>
              </div>
              <div className="arrow-btn"><MdArrowForward /></div>
            </a>

            <a href="#" className="card bg-light social-card">
              <div className="social-icon tt"><FaTiktok /></div>
              <div className="social-info">
                <h4>TikTok</h4>
                <p>Fun & quick fixes</p>
                <span>@wowsewa</span>
              </div>
              <div className="arrow-btn"><MdArrowForward /></div>
            </a>

            <a href="#" className="card bg-light social-card">
              <div className="social-icon in"><FaLinkedin /></div>
              <div className="social-info">
                <h4>LinkedIn</h4>
                <p>Connect professionally</p>
                <span>/company/wowsewa</span>
              </div>
              <div className="arrow-btn"><MdArrowForward /></div>
            </a>

            <a href="#" className="card bg-light social-card">
              <div className="social-icon wa"><FaWhatsapp /></div>
              <div className="social-info">
                <h4>WhatsApp</h4>
                <p>We're here to help</p>
                <span>+977 9801858586</span>
              </div>
              <div className="arrow-btn"><MdArrowForward /></div>
            </a>
          </div>
        </section>

        {/* More Section */}
        <section className="more-section">
          <div className="section-label-line">
            <span className="line"></span> MORE
          </div>
          <div className="more-grid">
            {/* Uses bg-dark from App.css */}
            <div className="card bg-dark dark-card scan-card">
              <div className="qr-drop">
                <span className="qr-icon">qr</span>
                <span>Drop QR</span>
                <small>or browse files</small>
              </div>
              <div className="card-content">
                <h4>Scan & share</h4>
                <p>Save our link and pass it to a friend.</p>
              </div>
            </div>

            <a href="#" className="card bg-dark dark-card website-card">
              <div className="social-icon web"><FaGlobe /></div>
              <div className="card-content">
                <h4>Visit our website</h4>
                <p>Book any home service</p>
              </div>
              <div className="arrow-btn dark-arrow"><MdArrowForward /></div>
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="section-label-line">
            <span className="line"></span> Contact us
          </div>
          {/* Uses bg-dark from App.css */}
          <div className="card bg-dark contact-card">
            <div className="contact-grid">
              <div className="contact-item">
                <div className="c-icon"><FaPhoneAlt /></div>
                <div>
                  <label>LANDLINE</label>
                  <p>01-5970230</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="c-icon"><FaMobileAlt /></div>
                <div>
                  <label>MOBILE</label>
                  <p>9801858586</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="c-icon"><FaEnvelope /></div>
                <div>
                  <label>EMAIL</label>
                  <p>info@wowsewa.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="c-icon"><FaGlobe /></div>
                <div>
                  <label>WEB</label>
                  <p>www.wowsewa.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="connect-footer text-sm">
          © 2026 WowSewa Home Services Pvt. Ltd. - Back to website
        </footer>
      </div>
    </div>
  );
};

export default Linktree;