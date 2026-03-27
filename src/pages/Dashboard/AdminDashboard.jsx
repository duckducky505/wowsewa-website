import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            
            <main className="dashboard-content bg-darkgreen1">
                <header className="dashboard-header">
                    <h1 className="text-xl">Welcome back, <span className="accent-text-primary">KaiZer949</span></h1>
                    <p className="text-md">Here's what's happening with WowSewa today.</p>
                </header>

                <div className="dashboard-grid">
                    {/* Stat Cards */}
                    <div className="stat-card bg-light">
                        <p className="text-md accent-text-dark">Total Bookings</p>
                        <h2 className="text-xxl">128</h2>
                    </div>
                    <div className="stat-card bg-light">
                        <p className="text-md accent-text-dark">Pending Jobs</p>
                        <h2 className="text-xxl">14</h2>
                    </div>
                    <div className="stat-card bg-light">
                        <p className="text-md accent-text-dark">Revenue</p>
                        <h2 className="text-xxl">रु 45,200</h2>
                    </div>
                </div>

                <div className="recent-section card bg-light">
                    <h3 className="text-md">Recent Service Activity</h3>
                    <div className="placeholder-table">
                        <p className="text-silver">Table or list data will render here...</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;