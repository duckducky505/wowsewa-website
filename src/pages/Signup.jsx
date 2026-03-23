import React from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

const Signup = () => {
    return (
        <div className="auth-container">
            <div className="auth-sidebar">
                <h2 className="text-xxl">Join the <span className="accent-text-primary">Elite.</span></h2>
                <p className="text-md">Create an account to get the fastest plumbing, electrical, and IT services in Kathmandu.</p>
            </div>

            <div className="auth-form-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="text-xl">Create Account</h1>
                        <p className="text-sm">Join WowSewa today for professional home maintenance.</p>
                    </div>

                    <form>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="name@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="98XXXXXXXX" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Create a strong password" />
                        </div>
                        <button type="button" className="btn btn-darkgreen btn-block">
                            Register Now
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already a member? <Link to="/login">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;