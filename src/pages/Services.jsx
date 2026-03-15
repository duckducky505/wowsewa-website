import FAQ from '../components/FAQ';
import './Services.css'

const Services = () => {
    return(
        <>
        <section className="services-page">
            <div className="container">
                {/* Header Section */}
                <header className="services-header">
                    <h1 className="text-xxl">Our <span className="accent-text">Specialized</span> Services</h1>
                    <p className="subtitle">Precision installation, expert repair, and proactive maintenance for every corner of your life.</p>
                </header>

                {/* Service Categories Section */}
                <div className="services-grid-layout">
                    {/* Category 1: Digital & Tech */}
                    <div className="service-category-block">
                        <h2 className="category-title"><i className="fas fa-microchip"></i> Digital & IT Solutions</h2>
                        <div className="service-items-grid">
                        <div className="service-item">
                            <div className="item-head">
                                <h3>Laptop & Mobile Repair</h3>
                                <span className="service-tag">Most Popular</span>
                            </div>
                            <p>Chip-level motherboard repairs, screen replacements, and software optimization.</p>
                            <ul className="item-features">
                                <li><i className="fas fa-check"></i> Screen & Battery</li>
                                <li><i className="fas fa-check"></i> Data Recovery</li>
                            </ul>
                        </div>

                        <div className="service-item">
                            <div className="item-head">
                                <h3>Networking & Smart Boards</h3>
                            </div>
                            <p>High-speed WiFi mesh setups and interactive smart board installations for offices.</p>
                            <ul className="item-features">
                                <li><i className="fas fa-check"></i> Mesh WiFi Setup</li>
                                <li><i className="fas fa-check"></i> Office LAN/WAN</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Category 2: Home & Utility */}
                <div className="service-category-block">
                    <h2 className="category-title"><i className="fas fa-home"></i> Home & Utility</h2>
                    <div className="service-items-grid">
                        <div className="service-item">
                            <div className="item-head">
                                <h3>Plumbing & Maintenance</h3>
                            </div>
                            <p>Full-scale plumbing solutions, from leak detection to modern bathroom fittings.</p>
                            <ul className="item-features">
                                <li><i className="fas fa-check"></i> Pipe Installation</li>
                                <li><i className="fas fa-check"></i> Drainage Repair</li>
                            </ul>
                        </div>

                        <div className="service-item">
                            <div className="item-head">
                                <h3>Eco & Solar Energy</h3>
                                <span className="service-tag tag-green">Eco-Friendly</span>
                            </div>
                            <p>Expert installation and cleaning of Solar Geysers and energy-efficient systems.</p>
                            <ul className="item-features">
                                <li><i className="fas fa-check"></i> Geyser Maintenance</li>
                                <li><i className="fas fa-check"></i> Solar Panel Audit</li>
                            </ul>
                        </div>
                    </div>
                </div>

                </div>

                {/* Support Banner */}
                <div className="support-banner">
                    <div className="banner-content">
                        <h2>Don't see what you're looking for?</h2>
                        <p>We handle custom technical requirements for businesses and homes alike.</p>
                    </div>
                    <button className="btn btn-primary">Custom Request</button>
                </div>
            </div>
        </section>
        <FAQ/>
        </>
    )
} 

export default Services;