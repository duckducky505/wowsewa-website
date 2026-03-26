import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';

const Login = () => {
    return (
        <div className="auth-page-wrapper bg-darkgreen">
            <div className="container">
                <Link to="/" className="back-link">
                    <FaArrowLeft /> Back to Home
                </Link>
                
                <div className="auth-center-card bg-light">
                    <div className="auth-header text-center">
                        <h1 className="text-xl">Login to <span className="accent-text-lime-dark">WowSewa</span></h1>
                        <p className="text-sm">Manage your home and office services effortlessly.</p>
                    </div>

                    <form className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="Enter your email" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" required />
                        </div>
                        <button type="submit" className="btn btn-darkgreen btn-block btn-large">
                            Login Now
                        </button>
                    </form>

                    <div className="auth-footer text-center">
                        <p>Don't have an account? <Link to="/signup" className="accent-text-lime-dark">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;