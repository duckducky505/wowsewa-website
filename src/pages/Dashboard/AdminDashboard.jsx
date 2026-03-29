import React from 'react';
import { FaWallet, FaClipboardList, FaUsers, FaArrowTrendUp } from 'react-icons/fa6';
import styles from './Dashboard.module.css';
 
const Dashboard = () => {
    return (
            <div className="container-dashboard">
                <header className={styles['header-section']}>
                    <div className={styles['welcome-text']}>
                        <h1 className="text-xl">
                            Shubha Prabhat, <span className="accent-text-primary">KaiZer949</span>
                        </h1>
                        <p className="text-silver">
                            Overview of <span className="accent-text-lime-dark">WowSewa</span> business performance.
                        </p>
                    </div>
                    <button className="btn btn-primary">
                        Generate Report
                    </button>
                </header>

                <div className={styles['stats-grid']}>
                    <StatCard 
                        title="Total Revenue" 
                        value="रु 45,200" 
                        trend="+5.4k today" 
                        icon={<FaWallet />} 
                    />
                    <StatCard 
                        title="Bookings" 
                        value="128" 
                        trend="+12% weekly" 
                        icon={<FaClipboardList />} 
                    />
                    <StatCard 
                        title="New Customers" 
                        value="24" 
                        trend="+4 today" 
                        icon={<FaUsers />} 
                    />
                </div>

                <div className={`${styles['main-card']} card bg-light`}>
                    <div className={styles['card-header']}>
                        <h3 className="text-md font-bold accent-text-dark">Recent Service Activity</h3>
                        <button className="btn btn-darkgreen">View All Requests</button>
                    </div>
                    
                    <div className={styles['activity-list']}>
                        {/* Placeholder for future API data */}
                        <div className={styles['empty-state']}>
                            <div className={styles['pulse-dot']}></div>
                            <p className="text-silver">Waiting for incoming service logs...</p>
                        </div>
                    </div>
                </div>
            </div>
    );
};

const StatCard = ({ title, value, trend, icon }) => (
    <div className={`${styles['stat-card']} bg-darkgreen`}>
        <div className={styles['stat-icon']}>{icon}</div>
        <div className={styles['stat-info']}>
            <p className="text-sm text-silver">{title}</p>
            <h2 className="text-lg accent-text-white">{value}</h2>
            <span className={styles['trend-text']}><FaArrowTrendUp /> {trend}</span>
        </div>
    </div>
);

export default Dashboard;