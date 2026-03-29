import React from 'react';
import './Loading.css';

const Loader = () => (
    <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Syncing with server...</p>
    </div>
);

export default Loader;