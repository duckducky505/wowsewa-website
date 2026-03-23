import React from 'react';
import './AMC.css';
import FAQ from '../components/FAQ';
// Import React Icons
import { 
  FaCheck, 
  FaTimes, 
  FaShieldAlt, 
  FaClock, 
  FaWallet 
} from 'react-icons/fa';

const AMC = () => {

  const AMCFaqData = [
    {
        question: "What exactly does 'Unlimited Calls' mean?",
        answer: "It means you don't pay any labor or visiting charges, no matter how many times you call us. Whether it's a leaky tap or a complete power failure, your service fee is $0."
    },
    {
        question: "Does the AMC cover spare parts?",
        answer: "The annual fee covers 100% of the labor and expertise. While spare parts are billed separately, AMC members enjoy an exclusive 10% to 15% discount on all materials."
    },
    {
        question: "Can I transfer my AMC if I move houses?",
        answer: "Yes! If you move within the Kathmandu Valley, we can transfer your remaining contract to your new address after a quick site audit of the new location."
    },
    {
        question: "Is there a limit on the number of appliances covered?",
        answer: "Our Essential and Standard plans cover all major fixed systems (Plumbing & Electrical). For specific IT and high-end appliance coverage, our Enterprise plan is the best fit."
    },
    {
        question: "Do you offer AMC for offices or restaurants?",
        answer: "Yes, we have specialized 'Enterprise' packages designed for high-usage environments like offices, banks, and cafes where uptime is critical."
    }
];

  return (
    <section className="amc-page">
      <div className="section-hero bg-light">
        <div className="container">
          <header className="amc-header">
            <h1 className="text-xxl">Zero Stress. <span className="accent-text">Total Maintenance.</span></h1>
            <p className="subtitle">Join the WowSewa AMC and let our experts handle your home and office repairs 24/7. One contract, infinite solutions.</p>
          </header>
        </div>
      </div>

      {/* SECTION 2: PLANS (White) */}
      <div className="section-wrapper bg-light">
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
                <li><FaCheck className="icon-success" /> 2 Scheduled Inspections</li>
                <li><FaCheck className="icon-success" /> Unlimited Plumbing Fixes</li>
                <li><FaCheck className="icon-success" /> 10% Off Spare Parts</li>
                <li className="disabled"><FaTimes className="icon-disabled" /> IT Support</li>
              </ul>
            </div>

            {/* Premium Plan (Featured) */}
            <div className="amc-card featured">
              <div className="plan-tag featured-tag">Best Value</div>
              <h3 className='accent-text-primary'>Standard</h3>
              <div className="price">NPR 9,999<span>/year</span></div>
              <ul className="plan-features">
                <li><FaCheck className="icon-success" /> 4 Scheduled Inspections</li>
                <li><FaCheck className="icon-success" /> Full Electrical & Plumbing</li>
                <li><FaCheck className="icon-success" /> Priority Emergency Callouts</li>
                <li><FaCheck className="icon-success" /> Basic IT/WiFi Support</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="amc-card">
              <div className="plan-tag">Advanced</div>
              <h3>Enterprise</h3>
              <div className="price">NPR 19,999<span>/year</span></div>
              <ul className="plan-features">
                <li><FaCheck className="icon-success" /> Monthly Tech Audits</li>
                <li><FaCheck className="icon-success" /> Solar & AC Maintenance</li>
                <li><FaCheck className="icon-success" /> Full Networking Support</li>
                <li><FaCheck className="icon-success" /> Dedicated Account Pro</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrapper bg-dark">
        <div className="container">
          <div className="about-grid-intro">
            <h2 className="text-xl">Why Choose <span className="accent-text">AMC?</span></h2>
          </div>
          <div className="services-cards-container">
            <div className="service-card">
                <div className="icon-box"><FaShieldAlt /></div>
                <h3>Predictive Repairs</h3>
                <p>We fix issues before they become expensive breakdowns.</p>
            </div>
            <div className="service-card">
                <div className="icon-box"><FaClock /></div>
                <h3>24/7 Priority</h3>
                <p>AMC members skip the queue with 30-min response times.</p>
            </div>
            <div className="service-card">
                <div className="icon-box"><FaWallet /></div>
                <h3>Cost Savings</h3>
                <p>Save up to 40% compared to individual one-time repairs.</p>
            </div>
          </div>
        </div>
      </div>
      <FAQ data={AMCFaqData} title='Frequently Asked Questions'/>
    </section>
  );
};

export default AMC;