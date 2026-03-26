import React from 'react';
import './About.css';
import Book from '../../components/Book';
import { 
  FaUserShield, 
  FaHistory, 
  FaCheckCircle, 
  FaMicrochip, 
  FaShieldAlt, 
  FaFileInvoice, 
  FaVial 
} from 'react-icons/fa'; 

const About = () => {
    return (
        <section className="about-page bg-darkgreen">
            <div className="section-hero">
                <div className="container">
                    <header className="about-header">
                        <span className="tagline">Reliable. Professional. Technical.</span>
                        <h1 className="text-xxl">Service at the speed of <span className="accent-text-primary">WOW</span>.</h1>
                        <p className="subtitle">
                            <span className="accent-text-primary">WowSewa</span> is Kathmandu's premier all-in-one technical partner. 
                            We bridge the gap between <strong>traditional utility</strong> and <strong>modern technology</strong>.
                        </p>

                        <div className="trust-bar">
                            <div className="trust-item"><FaUserShield className="trust-icon" /> Verified Pros</div>
                            <div className="trust-item"><FaHistory className="trust-icon" /> On-Time Service</div>
                            <div className="trust-item"><FaCheckCircle className="trust-icon" /> Quality Guaranteed</div>
                        </div>
                    </header>
                </div>
            </div>

            <div className="section-wrapper bg-light">
                <div className="container">
                    <div className="founder-layout">
                        <div className="founder-image-container">
                            <img src="src/assets/images/founderIMG.png" alt="Mr. Jiwan Joshi" className="founder-img" />
                        </div>
                        <div className="founder-content">
                            <h2 className="section-label accent-text-lime-dark">Meet the Visionary</h2>
                            <h3 className="founder-name">Mr. Jiwan Joshi</h3>
                            <p className="founder-title accent-text-lime-dark">Founder & Head Technician</p>
                            <div className="founder-bio">
                                <p>Founded on the principle of technical excellence, WOWsewa bridges the gap between traditional utility and modern technology. Mr. Joshi established WOWsewa to provide a reliable, "all-in-one" technical solution for the community.</p>
                                <p>With years of hands-on experience in both industrial hardware and residential systems, his dual expertise ensures that every project meets the highest standards of safety and efficiency.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper values-section bg-darkgreen">
                <div className="container">
                    <div className="values-header">
                        <h3 className="section-label center accent-text-primary">Our DNA</h3>
                        <h2 className="text-xl">The <span className="accent-text-primary">WOW</span> Difference</h2>
                    </div>
                    
                    <div className="values-grid">
                        <div className="value-item">
                            <div className="value-number">01</div>
                            <h4>Technical Mastery</h4>
                            <p>We don't just "patch" problems. We understand the engineering behind your appliances and IT systems to provide long-term fixes.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-number">02</div>
                            <h4>Transparent Pricing</h4>
                            <p>No hidden costs or "surprise" surcharges. You get an honest estimate before we touch a single screw.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-number">03</div>
                            <h4>Verified Reliability</h4>
                            <p>Every technician is background-checked and trained to respect your space, privacy, and time.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-number">04</div>
                            <h4>Emergency Ready</h4>
                            <p>From burst pipes to crashed servers, we prioritize urgent technical failures to get your life back on track fast.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper bg-light">
                <div className="container">
                    <div className="standards-header">
                        <div className="section-label center accent-text-lime-dark">The Gold Standard</div>
                        <h2 className="text-xl">Built on <span className="accent-text-lime-dark">Precision.</span></h2>
                        <p>Our commitment to technical excellence goes beyond just fixing the surface.</p>
                    </div>

                    <div className="standards-grid">
                        <div className="standard-card">
                            <div className="standard-icon"><FaMicrochip /></div>
                            <div className="standard-info">
                                <h3>Zero-Compromise Parts</h3>
                                <p>No generic clones. We source only OEM or certified grade-A components to ensure your tech stays fixed for years.</p>
                            </div>
                        </div>
                        
                        <div className="standard-card">
                            <div className="standard-icon"><FaShieldAlt /></div>
                            <div className="standard-info">
                                <h3>Fortress-Grade Safety</h3>
                                <p>Beyond basic fixes—we verify grounding, insulation, and data security to protect your home and privacy.</p>
                            </div>
                        </div>
                        
                        <div className="standard-card">
                            <div className="standard-icon"><FaFileInvoice /></div>
                            <div className="standard-info">
                                <h3>Total Tech Clarity</h3>
                                <p>Ditch the jargon. You get a transparent breakdown of the "Why" and the "How," backed by digital logs.</p>
                            </div>
                        </div>
                        
                        <div className="standard-card">
                            <div className="standard-icon"><FaVial /></div>
                            <div className="standard-info">
                                <h3>Extreme Load Testing</h3>
                                <p>We don’t just "turn it on." We stress-test every repair under real-world conditions to guarantee durability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Book/>
        </section>
    );
};

export default About;