import React from 'react';
import './LegalPages.css';

const TermsAndConditions = () => {
    return (
        <div className="legal-container">
            <div className="legal-content">
                <h1>Terms and Conditions</h1>
                <span className="last-updated">Last Updated: October 2023</span>

                <p>Welcome to Wow Sewa. By using our website and services, you agree to these Terms and Conditions. If you do not agree, you may not use our services.</p>

                <h2>Services</h2>
                <p>Wow Sewa provides repair and maintenance services for plumbing, electrical, networking, mobile devices, home appliances, laptops, and more. We reserve the right to modify or discontinue services at any time.</p>

                <h2>Fees and Payment</h2>
                <p>Fees vary depending on the service requested. Estimates are provided beforehand, and payment is due upon completion of the service. We accept cash and digital payments.</p>

                <h2>Limitation of Liability</h2>
                <p>In no event shall Wow Sewa be liable for any damages arising from or in connection with your use of our website or services.</p>

                <h2>Governing Law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes shall be resolved exclusively within Nepali jurisdiction.</p>

                <div className="contact-box">
                    <h3>Contact Information</h3>
                    <p>9762424318, 9824232439 or wowsewaa@gmail.com</p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;