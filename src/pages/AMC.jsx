import React from 'react';
import './AMC.css';

const AMC = () => {
  return (
    <section className="amc-page">
      <div className="section-hero dark-bg">
        <div className="container">
          <header className="amc-header">
            <h1 className="text-xxl">Zero Stress. <span className="accent-text">Total Maintenance.</span></h1>
            <p className="subtitle">Join the WowSewa AMC and let our experts handle your home and office repairs 24/7. One contract, infinite solutions.</p>
          </header>
        </div>
      </div>

      {/* SECTION 2: PLANS (White) */}
      <div className="section-wrapper light-bg">
        <div className="container">
          <div className="section-title-center">
            <h2 className="text-xl">Choose Your Plan</h2>
            <p>Annual packages tailored for every need.</p>
          </div>

          <div className="amc-grid">
            {/* Essential Plan */}
            <div className="amc-card">
              <div className="plan-tag">Basic</div>
              <h3>Essential</h3>
              <div className="price">NPR 4,999<span>/year</span></div>
              <ul className="plan-features">
                <li><i className="fas fa-check"></i> 2 Scheduled Inspections</li>
                <li><i className="fas fa-check"></i> Unlimited Plumbing Fixes</li>
                <li><i className="fas fa-check"></i> 10% Off Spare Parts</li>
                <li className="disabled"><i className="fas fa-times"></i> IT Support</li>
              </ul>
              <button className="btn btn-outline">Select Plan</button>
            </div>

            {/* Premium Plan (Featured) */}
            <div className="amc-card featured">
              <div className="plan-tag featured-tag">Best Value</div>
              <h3>Standard</h3>
              <div className="price">NPR 9,999<span>/year</span></div>
              <ul className="plan-features">
                <li><i className="fas fa-check"></i> 4 Scheduled Inspections</li>
                <li><i className="fas fa-check"></i> Full Electrical & Plumbing</li>
                <li><i className="fas fa-check"></i> Priority Emergency Callouts</li>
                <li><i className="fas fa-check"></i> Basic IT/WiFi Support</li>
              </ul>
              <button className="btn btn-primary">Select Plan</button>
            </div>

            {/* Enterprise Plan */}
            <div className="amc-card">
              <div className="plan-tag">Advanced</div>
              <h3>Enterprise</h3>
              <div className="price">NPR 19,999<span>/year</span></div>
              <ul className="plan-features">
                <li><i className="fas fa-check"></i> Monthly Tech Audits</li>
                <li><i className="fas fa-check"></i> Solar & AC Maintenance</li>
                <li><i className="fas fa-check"></i> Full Networking Support</li>
                <li><i className="fas fa-check"></i> Dedicated Account Pro</li>
              </ul>
              <button className="btn btn-outline">Select Plan</button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: WHY AMC? (Dark) */}
      <div className="section-wrapper dark-bg">
        <div className="container">
          <div className="about-grid-intro">
            <h2 className="text-xl">Why Choose <span className="accent-text">AMC?</span></h2>
          </div>
          <div className="services-cards-container">
            <div className="service-card">
                <div className="icon-box"><i className="fas fa-shield-alt"></i></div>
                <h3>Predictive Repairs</h3>
                <p>We fix issues before they become expensive breakdowns.</p>
            </div>
            <div className="service-card">
                <div className="icon-box"><i className="fas fa-clock"></i></div>
                <h3>24/7 Priority</h3>
                <p>AMC members skip the queue with 30-min response times.</p>
            </div>
            <div className="service-card">
                <div className="icon-box"><i className="fas fa-wallet"></i></div>
                <h3>Cost Savings</h3>
                <p>Save up to 40% compared to individual one-time repairs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AMC;