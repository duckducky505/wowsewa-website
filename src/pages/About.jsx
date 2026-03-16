import React from 'react';
import './About.css';

const About = () => {
    return (
        <section className="about-page">
            <div className="section-hero">
                <div className="container">
                    <header className="about-header">
                        <span className="brand-tagline">Reliable. Professional. Technical.</span>
                
                        <h1 className="text-xxl">Service at the speed of <span className="accent-text">WOW</span>.</h1>
                        
                        <p className="subtitle">
                            WOWsewa is Kathmandu's premier all-in-one technical partner. 
                            We bridge the gap between <strong>traditional utility</strong> and <strong>modern technology</strong>.
                        </p>

                        {/* 2. Trust Bar - Icons that prove your quality */}
                        <div className="trust-bar">
                            <div className="trust-item"><i className="fas fa-user-shield"></i> Verified Pros</div>
                            <div className="trust-item"><i className="fas fa-history"></i> On-Time Service</div>
                            <div className="trust-item"><i className="fas fa-check-circle"></i> Quality Guaranteed</div>
                        </div>
                    </header>

                    <div className="infographic-wrapper">
                        <div className="image-frame">
                            <img src="src/assets/images/businesscard.jpg" alt="WOWsewa Services" className="service-img" />
                            <div className="glow-overlay"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-wrapper light-bg">
                <div className="container">
                    <div className="founder-layout">
                        <div className="founder-image-container">
                            <img src="src/assets/images/founderIMG.png" alt="Mr. Jiwan Joshi" className="founder-img" />
                        </div>
                        <div className="founder-content">
                            <h2 className="section-label">Meet the Visionary</h2>
                            <h3 className="founder-name">Mr. Jiwan Joshi</h3>
                            <p className="founder-title">Founder & Head Technician</p>
                            <div className="founder-bio">
                                <p>Founded on the principle of technical excellence, WOWsewa bridges the gap between traditional utility and modern technology. Mr. Joshi established WOWsewa to provide a reliable, "all-in-one" technical solution for the community.</p>
                                <p>With years of hands-on experience in both industrial hardware and residential systems, his dual expertise ensures that every project meets the highest standards of safety and efficiency.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: SERVICES GRID (Dark Background - Alternating) */}
            <div className="section-wrapper dark-bg">
                <div className="container">
                    <div className="about-grid-intro">
                        <h2 className="text-xl">One Company. <span className="accent-text">All Solutions.</span></h2>
                        <p>We realized that modern living requires a mix of traditional skills and future-tech. WOWsewa was built to master both.</p>
                    </div>

                    <div className="services-cards-container">
                        <div className="service-card">
                            <div className="icon-box"><i className="fas fa-tools"></i></div>
                            <h3>Hardware & Appliances</h3>
                            <p>Laptops, Mobiles, and Home Appliances. We don't just fix; we optimize.</p>
                        </div>

                        <div className="service-card">
                            <div className="icon-box"><i className="fas fa-network-wired"></i></div>
                            <h3>IT & Networking</h3>
                            <p>Enterprise-grade networking and smart board setups for home and office.</p>
                        </div>

                        <div className="service-card">
                            <div className="icon-box"><i className="fas fa-solar-panel"></i></div>
                            <h3>Eco Systems</h3>
                            <p>Specialized maintenance for Solar Geysers and energy-efficient plumbing.</p>
                        </div>
                    </div>

                    <div className="about-footer">
                        <a href="#" className="btn btn-primary btn-large">Book a Service</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;