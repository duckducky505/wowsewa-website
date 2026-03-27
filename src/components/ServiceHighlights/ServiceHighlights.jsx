import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFaucet, 
  FaBolt, 
  FaNetworkWired, 
  FaScrewdriverWrench, 
  FaArrowRight 
} from 'react-icons/fa6'; 
import './ServiceHighlights.css';

const ServiceHighlights = () => {
    const highlights = [
        {
            icon: <FaFaucet />,
            title: "Plumbing",
            desc: "Expert repairs for leaks, pipes, and bathroom fittings."
        },
        {
            icon: <FaBolt />,
            title: "Electrical",
            desc: "Safe wiring, panel repairs, and lighting installations."
        },
        {
            icon: <FaNetworkWired />,
            title: "IT & Networking",
            desc: "Office networking, WiFi setup, and hardware support."
        },
        {
            icon: <FaScrewdriverWrench />,
            title: "General Repair",
            desc: "AC, Fridges, and various home appliance maintenance."
        }
    ];

    return (
        <section className="highlights-section bg-light1">
            <div className="container">
                <div className="section-header">
                    <h2 className="text-xxl">Our <span className="accent-text-lime-dark">Expertise</span></h2>
                    <p className='text-md'>Professional solutions for your home and workspace.</p>
                </div>
                
                <div className="highlights-grid">
                    {highlights.map((item, index) => (
                        <div key={index} className="highlight-card">
                            <div className="highlight-icon">
                                {item.icon}
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <Link to="/services" className="learn-more">
                                View Details <FaArrowRight className="icon-right" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceHighlights;