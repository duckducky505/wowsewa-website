import React from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

const Login = () => {
    return (
        <div className="auth-container">
            <div className="auth-sidebar">
                <h2 className="text-xxl">Welcome <span className="accent-text-primary">Back.</span></h2>
                <p className="text-md">Log in to manage your bookings and track your service history with WowSewa.</p>
            </div>

            <div className="auth-form-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="text-xl">Login</h1>
                        <p className="text-sm">Enter your credentials to access your account.</p>
                    </div>

                    <form>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="name@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <button type="button" className="btn btn-darkgreen btn-block">
                            Login to Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/signup">Create one</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;