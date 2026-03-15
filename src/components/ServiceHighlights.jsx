import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceHighlights.css';

const ServiceHighlights = () => {
    const highlights = [
        {
            icon: "fa-faucet-drip",
            title: "Plumbing",
            desc: "Expert repairs for leaks, pipes, and bathroom fittings."
        },
        {
            icon: "fa-bolt",
            title: "Electrical",
            desc: "Safe wiring, panel repairs, and lighting installations."
        },
        {
            icon: "fa-network-wired",
            title: "IT & Networking",
            desc: "Office networking, WiFi setup, and hardware support."
        },
        {
            icon: "fa-screwdriver-wrench",
            title: "General Repair",
            desc: "AC, Fridges, and various home appliance maintenance."
        }
    ];

    return (
        <section className="highlights-section light-bg">
            <div className="container">
                <div className="section-header">
                    <h2 className="text-xl">Our <span className="accent-text-dark">Expertise</span></h2>
                    <p>Professional solutions for your home and workspace.</p>
                </div>
                
                <div className="highlights-grid">
                    {highlights.map((item, index) => (
                        <div key={index} className="highlight-card">
                            <div className="highlight-icon">
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <Link to="/services" className="learn-more">
                                View Details <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceHighlights;