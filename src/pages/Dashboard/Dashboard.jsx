import React from 'react';
import { FaWallet, FaClipboardList, FaUsers, FaArrowTrendUp, FaPlus, FaClockRotateLeft } from 'react-icons/fa6';
import styles from './Dashboard.module.css';

const Dashboard = ({ userRole = 'admin' }) => {
    const isAdmin = userRole === 'admin';

    return (
        /* Using the global container class we discussed for consistent sidebar spacing */
        <div className="container-after-login-large">
            <header className={styles['header-section']}>
                <div className={styles['welcome-text']}>
                    <h1 className="text-xl">
                        {isAdmin ? 'Shubha Prabhat' : 'Namaste'}, <span className="accent-text-primary">KaiZer949</span>
                    </h1>
                    <p className="text-silver">
                        {isAdmin 
                            ? <>Overview of <span className="accent-text-lime-dark">WowSewa</span> business performance.</>
                            : <>Manage your home services and active requests.</>
                        }
                    </p>
                </div>
                
                {/* Action button changes based on role */}
                <button className={`btn ${isAdmin ? 'btn-primary' : 'btn-darkgreen'}`}>
                    {isAdmin ? 'Generate Report' : <><FaPlus /> Book a Service</>}
                </button>
            </header>

            <div className={styles['stats-grid']}>
                {isAdmin ? (
                    <>
                        <StatCard title="Total Revenue" value="रु 45,200" trend="+5.4k today" icon={<FaWallet />} />
                        <StatCard title="Total Bookings" value="128" trend="+12% weekly" icon={<FaClipboardList />} />
                        <StatCard title="New Customers" value="24" trend="+4 today" icon={<FaUsers />} />
                    </>
                ) : (
                    <>
                        <StatCard title="Total Spent" value="रु 8,500" trend="3 services" icon={<FaWallet />} />
                        <StatCard title="Active Requests" value="02" trend="1 arriving soon" icon={<FaClockRotateLeft />} />
                        <StatCard title="Reward Points" value="450" trend="Gold Member" icon={<FaArrowTrendUp />} />
                    </>
                )}
            </div>

            <div className={`${styles['main-card']} card bg-light`}>
                <div className={styles['card-header']}>
                    <h3 className="text-md font-bold accent-text-dark">
                        {isAdmin ? 'Recent Service Activity' : 'My Recent Bookings'}
                    </h3>
                    <button className="btn btn-outline-dark">
                        {isAdmin ? 'View All Requests' : 'View History'}
                    </button>
                </div>
                
                <div className={styles['activity-list']}>
                    <div className={styles['empty-state']}>
                        <div className={styles['pulse-dot']}></div>
                        <p className="text-silver">
                            {isAdmin 
                                ? 'Waiting for incoming service logs...' 
                                : 'No active services at the moment.'}
                        </p>
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