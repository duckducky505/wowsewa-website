import React from 'react';
import './LegalPages.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-container">
            <div className="legal-content">
                <h1>Privacy Policy</h1>
                <span className="last-updated">Last Updated: October 2023</span>
                
                <p>At Wow Sewa, we are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and disclose information about you when you visit our website, engage our services, or contact us.</p>

                <h2>Information We Collect</h2>
                <p>We may collect personal information about you, such as your name, email address, phone number, and postal address, when you provide it to us via contact forms or direct communication.</p>

                <h2>How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                    <li>Provide plumbing, electrical, and appliance repair services.</li>
                    <li>Communicate regarding service requests.</li>
                    <li>Improve our website and service quality.</li>
                    <li>Comply with legal obligations.</li>
                </ul>

                <h2>Security</h2>
                <p>We take reasonable measures to protect your information from unauthorized access. However, please be aware that no method of electronic storage is 100% secure.</p>

                <div className="contact-box">
                    <h3>Questions?</h3>
                    <p>Contact us at: wowsewaa@gmail.com | 9762424318</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;