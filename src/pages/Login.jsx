import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';

const Login = () => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const LoginAPI = async(e) => {
            e.preventDefault();
        try{
            const response= await fetch("https://localhost:7011/api/Login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({username,password}),      //{username,pass} written like this because json.stringify expects one object not multiple variables, it will stringify only the first one.
            });

            if(!response.ok){console.log(Error)}
            const data = await response.json();
            localStorage.setItem("Token",data.token);
        }
        catch(error){console.log(error.message)};
    }

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
                            <label>Username</label>
                            <input type="text" placeholder="Enter your username" required onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" required onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-darkgreen btn-block btn-large" onClick={LoginAPI}>
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