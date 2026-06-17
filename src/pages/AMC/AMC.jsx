import React, { useState } from 'react';
import { 
  MdCheckCircle, 
  MdNetworkCheck, 
  MdAcUnit, 
  MdSolarPower, 
  MdKitchen, 
  MdPhone, 
  MdLocationOn, 
  MdStar, 
  MdShield 
} from 'react-icons/md';
import './AMC.css';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

// Image Imports
import starterImg from '../../assets/images/starter.jpg';
import businessImg from '../../assets/images/business.jpg';
import corporateImg from '../../assets/images/corporate.jpg';

const AMC_PLANS = [
  {
    name: "Starter Plan",
    price: "Rs. 8,000",
    image: starterImg,
    suitableFor: ["Shops", "Cafes", "Clinics"],
    includes: ["1 scheduled visit", "Phone support", "Priority service", "AMC discount 10%"],
    tagline: "Reliable Care. Every Month.",
    featured: false
  },
  {
    name: "Business Plan",
    price: "Rs. 15,000",
    image: businessImg,
    suitableFor: ["Schools", "Restaurants", "Medium offices"],
    includes: ["2 visits/month", "Emergency support", "AMC discount 12%", "Preventive maintenance"],
    tagline: "Peace of Mind. Every Day.",
    featured: true
  },
  {
    name: "Corporate Plan",
    price: "Rs. 25,000",
    image: corporateImg,
    suitableFor: ["Hotels", "Corporate offices", "Large facilities"],
    includes: ["Weekly visits", "Emergency response", "AMC discount 15%", "Dedicated technician support", "Monthly reports"],
    tagline: "Expert Care. Maximum Uptime.",
    featured: false
  }
];

const AMC_SERVICES = [
  {
    id: "networking",
    title: "Networking AMC",
    tagline: "Strong Network. Seamless Connection.",
    icon: <MdNetworkCheck />,
    badge: "EXPERT CARE FOR STABLE NETWORKS",
    services: [
      { name: "Router Maintenance", desc: "Regular checkup, updates, and performance optimization for smooth internet access." },
      { name: "Switch Maintenance", desc: "Port check, updates, and configuration to ensure stable network performance." },
      { name: "Rack Organization", desc: "Neat and professional rack setup for better airflow and easy access." },
      { name: "Cable Management", desc: "Proper cable labeling, bundling, and routing for a clean and reliable network." },
      { name: "WiFi Troubleshooting", desc: "Resolve WiFi issues, optimize signal strength, and ensure uninterrupted wireless connectivity." }
    ],
    benefits: ["Stable Internet", "Less Downtime", "Improved Performance", "Enhanced Security", "Cost Savings", "Expert Support"]
  },
  {
    id: "ac",
    title: "AC AMC",
    tagline: "Cooler Spaces. Happier Places.",
    icon: <MdAcUnit />,
    badge: "EXPERT CARE FOR YOUR COMFORT",
    services: [
      { name: "AC Cleaning", desc: "Deep cleaning of indoor & outdoor unit for better cooling." },
      { name: "Gas Pressure Inspection", desc: "Check and adjust gas pressure for optimal performance." },
      { name: "Filter Cleaning", desc: "Clean filters to ensure clean air and efficient cooling." },
      { name: "Drain Cleaning", desc: "Clear drain line to prevent water leakage and blockage." },
      { name: "Electrical Inspection", desc: "Inspect wiring, connections, and electrical components for safe operation." }
    ],
    benefits: ["Lower Electricity Bill", "Better Cooling", "Longer AC Lifespan", "Cleaner Air", "Fewer Breakdowns"]
  },
  {
    id: "solar",
    title: "Solar & Inverter AMC",
    tagline: "Clean Energy. Reliable Power.",
    icon: <MdSolarPower />,
    badge: "EXPERT CARE FOR YOUR ENERGY",
    services: [
      { name: "Panel Cleaning", desc: "Remove dust, dirt, and debris to ensure maximum sunlight absorption and efficiency." },
      { name: "Battery Inspection", desc: "Check battery health, charge level, terminals, and connections for reliable backup." },
      { name: "Inverter Maintenance", desc: "Inspect and service inverter components for smooth and safe operation." },
      { name: "Performance Testing", desc: "Test system performance, voltage, current, and output for maximum efficiency." }
    ],
    benefits: ["Higher Output", "Longer Battery Life", "System Reliability", "Lower Maintenance Cost", "Eco-Friendly & Efficient"]
  },
  {
    id: "refrigerator",
    title: "Refrigerator AMC",
    tagline: "Cool Inside. Fresh Always.",
    icon: <MdKitchen />,
    badge: "EXPERT CARE FOR YOUR APPLIANCES",
    services: [
      { name: "Cooling Inspection", desc: "Check cooling performance to ensure optimum temperature and freshness." },
      { name: "Compressor Testing", desc: "Test compressor for proper functioning and long life." },
      { name: "Gas Pressure Check", desc: "Check and adjust gas pressure for efficient cooling." },
      { name: "Condenser Cleaning", desc: "Clean the condenser coils to remove dust and improve heat exchange." },
      { name: "Electrical Inspection", desc: "Inspect wiring, connections, and components for safe and reliable operation." }
    ],
    benefits: ["Reduced Spoilage", "Improved Efficiency", "Longer Appliance Life", "Cost Savings", "Timely Service"]
  }
];

export default function Amc() {
  const [activeTab, setActiveTab] = useState('networking');
  const activeService = AMC_SERVICES.find(s => s.id === activeTab);

  return (
    <>
      <Navbar/>
      <div className="amc-page">
        
        {/* Hero Header Unit */}
        <section className="bg-main text-center amc-hero">
          <div className="container hero-content-wrapper">
            <span className="text-md accent-text-main">
              Annual & Monthly Maintenance Contracts
            </span>
            <h1 className="text-xxl">
              You Rest, <span className="accent-text-main">We Care</span>
            </h1>
            <p className="text-md amc-hero-lead">
              Ensure seamless operations with our professional service packages. Tailored technical support for corporate spaces, residential complexes, and commercial facilities.
            </p>
          </div>
        </section>

        {/* Subscription Tier List System */}
        <section className="container amc-plans-section">
          <div className="text-center plans-header">
            <h2 className="text-xl">Monthly <span>AMC Plans</span></h2>
            <p className="text-sm">Choose the ideal tier designed to handle your scale of operations effortlessly.</p>
          </div>

          <div className="plan-grid">
            {AMC_PLANS.map((plan, index) => (
              <div 
                key={index} 
                className={`card plan-card ${plan.featured ? 'plan-card--featured' : ''}`}
              >
                {plan.featured && (
                  <div className="featured-badge">
                    <MdStar /> MOST POPULAR
                  </div>
                )}
                
                {/* Plan Card Image Layout */}
                <div className="plan-img-container">
                  <img src={plan.image} alt={plan.name} className="plan-card-img" />
                </div>
                
                <div className="plan-header-block">
                  <h3 className="text-lg">{plan.name}</h3>
                  <p>{plan.tagline}</p>
                </div>
                
                <div className="price-block">
                  <span className="text-xl">{plan.price}</span>
                  <span> / Month</span>
                </div>

                <div className="tags-section">
                  <strong>Suitable For:</strong>
                  <div className="tags-wrapper">
                    {plan.suitableFor.map((item, idx) => (
                      <span key={idx} className="tag">{item}</span>
                    ))}
                  </div>
                </div>

                <div className="features-section">
                  <strong>What's Included:</strong>
                  <ul>
                    {plan.includes.map((inc, idx) => (
                      <li key={idx} className="feature-item">
                        <MdCheckCircle />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Interactive Filter Selection Modules */}
        <section className="bg-light amc-verticals-section">
          <div className="container">
            <div className="text-center verticals-header">
              <h2 className="text-xl">Our Specialized <span className="accent-text-bg">AMC </span> Verticals</h2>
              <p className="text-sm">Select a category below to explore dedicated services and target benefits.</p>
            </div>

            {/* Interactive Navigation Array */}
            <div className="tab-container">
              {AMC_SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(service.id)}
                  className={`tab-btn ${activeTab === service.id ? 'active' : ''}`}
                >
                  {service.icon}
                  <span>{service.title}</span>
                </button>
              ))}
            </div>

            {/* Target Dynamic Content Display Board */}
            {activeService && (
              <div className="board-wrapper">
                
                {/* Scope of Work Panel */}
                <div className="card scope-card">
                  <div className="scope-header">
                    <div>
                      <h3 className="text-lg">{activeService.title} Scope</h3>
                      <p className="accent-text">{activeService.tagline}</p>
                    </div>
                    <span className="badge">{activeService.badge}</span>
                  </div>

                  <div className="services-list">
                    {activeService.services.map((item, idx) => (
                      <div key={idx} className="service-item-row">
                        <div className="bullet-index">{idx + 1}</div>
                        <div>
                          <h4>{item.name}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits Core Array Layout */}
                <div className="side-panel">
                  <div className="bg-dark benefits-card">
                    <h3>KEY BENEFITS</h3>
                    <ul>
                      {activeService.benefits.map((benefit, idx) => (
                        <li key={idx}>
                          <MdCheckCircle />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Team Quality Stamp Footer Element */}
                  <div className="technician-stamp">
                    <div className="text-block">
                      <span>OUR EXPERT TEAM</span>
                      <span>SKILLED • RELIABLE • DEDICATED</span>
                    </div>
                    <MdShield />
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>

        {/* Action Footer Call parameters */}
        <section className="bg-black amc-footer-action">
          <div className="container footer-grid-layout">
            <div>
              <h3 className="text-lg accent-text-main">Ready to Secure Your Operations?</h3>
              <p className="text-sm">
                Get in touch with our account managers to arrange a custom site evaluation or set up your monthly subscription protocol setup immediately.
              </p>
            </div>
            
            <div className="contact-wrapper-block">
              <div className="contact-item-box">
                <MdPhone />
                <div>
                  <small>CALL SUPPORT</small>
                  <strong>9762424318</strong>
                </div>
              </div>
              
              <div className="contact-item-box">
                <MdLocationOn />
                <div>
                  <small>HEADQUARTERS</small>
                  <strong>Machhapokhari, Kathmandu</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  );
}