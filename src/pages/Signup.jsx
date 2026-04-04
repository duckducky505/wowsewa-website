import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthStyles.css';

const Signup = () => {

    
    const [name, setName] = useState("");
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const signupRequest = async(e) => {

        e.preventDefault();

        try{
            const response = await fetch("https://localhost:7011/api/signup/addUser",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({name,username,password}),
            });
            if(!response.ok){console.log("Couldn't connect to the API.")}
            return <Navigate to="/login"/>
        }
        catch(Error){
            console.log(Error)
        }
        
    }

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
                            <input type="text" placeholder="John Doe" required onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>UserName</label>
                            <input type="text" placeholder="doe123" required onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Create a strong password" required onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-darkgreen btn-block btn-large" onClick={signupRequest}>
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