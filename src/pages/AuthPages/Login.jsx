import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState("");
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
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setSubmitting(false);
                const serverMessage = await response.text();
                if (response.status === 401) {
                    setError(serverMessage || "Incorrect email or password.");
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

            const userEmail =
                decodedToken.email ||
                decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

            const rawRole =
                decodedToken.role ||
                decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const guidId =
                decodedToken.guidId ||
                decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            const role = (rawRole || "").toLowerCase();

            console.log(name);
            console.log(userEmail);
            console.log(rawRole);
            console.log(guidId);


            const user = { guidId, name, email: userEmail };

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
        <div className="wsw-auth">
            <header className="wsw-auth__header">
                <div className="wsw-auth__header-inner">
                    <Link to="/" className="wsw-auth__back-link">
                        <FaArrowLeft /> Back to home
                    </Link>
                </div>
            </header>

            <div className="wsw-auth__body">
                <div className="wsw-auth__card">
                    <span className="wsw-auth__eyebrow">Welcome back</span>
                    <h1 className="wsw-auth__title">Login to WowSewa</h1>
                    <p className="wsw-auth__subtitle">Manage your home and office services effortlessly.</p>

                    <form className="wsw-auth__form" onSubmit={LoginAPI} noValidate>
                        <div className="wsw-auth__field">
                            <label className="wsw-auth__label" htmlFor="login-email">Email address</label>
                            <input
                                id="login-email"
                                type="email"
                                className="wsw-auth__input"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="wsw-auth__field">
                            <label className="wsw-auth__label" htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                className="wsw-auth__input"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="wsw-auth__error">{error}</p>}

                        <button type="submit" className="wsw-auth__submit" disabled={submitting}>
                            {submitting ? "Logging in…" : "Login now"}
                        </button>
                    </form>

                    <div className="wsw-auth__footer">
                        <p>Don't have an account? <Link to="/signup" className="wsw-auth__link">Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;   