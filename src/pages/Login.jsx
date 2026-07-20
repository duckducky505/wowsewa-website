import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const LoginAPI = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch("https://localhost:7011/api/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                setSubmitting(false);
                if (response.status === 401) {
                    setError("Incorrect username or password.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
                return;
            }

            const data = await response.json();

            const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
            const name =
                decodedToken.name ||
                decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"];
            const rawRole =
                decodedToken.role ||
                decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const guidId =
                decodedToken.guidId ||
                decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const role = (rawRole || "").toLowerCase();
            
            const  user = {
                guidId: guidId,
                name : name,
                role: role,
            }

            login(user, data.token);

            navigate(`/${role}/dashboard`, { replace: true });
        } catch (err) {
            setError("Couldn't reach the server. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-glow" aria-hidden="true" />
            <div className="container">
                <Link to="/" className="back-link">
                    <FaArrowLeft /> Back to Home
                </Link>

                <div className="auth-center-card">
                    <div className="auth-header text-center">
                        <h1>Login to <span className="accent-text-primary">WowSewa</span></h1>
                        <p>Manage your home and office services effortlessly.</p>
                    </div>

                    <form className="auth-form" onSubmit={LoginAPI}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                required
                                value={username}
                                autoComplete='current-username'
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password"
                                placeholder="••••••••" 
                                required 
                                // Capital 'C' fixes the React warning
                                autoComplete="current-password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                />
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button type="submit" className="btn btn-primary btn-block btn-large" disabled={submitting}>
                            {submitting ? "Logging in…" : "Login Now"}
                        </button>
                    </form>

                    <div className="auth-footer text-center">
                        <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;