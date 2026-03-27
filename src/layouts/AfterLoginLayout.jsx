import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../components/Sidebar/Sidebar"; 
import './AfterLoginLayout.css';

const AfterLoginLayout = () => {
    return (
        <div className="after-login-container">
            <Sidebar />
            <main className="admin-main-view">
                <Outlet /> 
            </main>
        </div>
    );
};

export default AfterLoginLayout;