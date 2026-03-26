import React, { useState } from 'react';
import { 
    FaThLarge, FaWrench, FaUserCircle, FaCalendarCheck, 
    FaHistory, FaCog, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <FaThLarge /> },
        { id: 'bookings', label: 'Bookings', icon: <FaCalendarCheck /> },
        { id: 'services', label: 'All Services', icon: <FaWrench /> },
        { id: 'history', label: 'History', icon: <FaHistory /> },
        { id: 'profile', label: 'My Profile', icon: <FaUserCircle /> },
        { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <aside className={`main-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <h2>Wow<span className="accent-text-primary">Sewa</span></h2>
                </div>
                
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button key={item.id} className="nav-link">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-link">
                        <FaSignOutAlt className="nav-icon" /> 
                        <span className="nav-text">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;