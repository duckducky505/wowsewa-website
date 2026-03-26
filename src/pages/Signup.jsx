import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';

const Signup = () => {
    return (
        <div className="auth-page-wrapper bg-darkgreen">
            <div className="container">
                <Link to="/" className="back-link">
                    <FaArrowLeft /> Back to Home
                </Link>
                
                <div className="auth-center-card bg-light">
                    <div className="auth-header text-center">
                        <h1 className="text-xl">Join the <span className="accent-text-lime-dark">Elite.</span></h1>
                        <p className="text-sm">Create an account for professional home maintenance.</p>
                    </div>

                    <form className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="98XXXXXXXX" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Create a strong password" required />
                        </div>
                        <button type="submit" className="btn btn-darkgreen btn-block btn-large">
                            Register Now
                        </button>
                    </form>

                    <div className="auth-footer text-center">
                        <p>Already a member? <Link to="/login" className="accent-text-lime-dark">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;