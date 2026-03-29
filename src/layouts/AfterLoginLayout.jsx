import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../components/Sidebar/Sidebar"; 
import './AfterLoginLayout.css';

const AfterLoginLayout = () => {
    return (
        <div>
            <Sidebar />
            <main className="admin-main-view bg-light">
                <div>
                    <Outlet /> 
                </div>
            </main>
        </div> 
    );
};

export default AfterLoginLayout;