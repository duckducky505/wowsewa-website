import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaThLarge, FaCalendarCheck, FaWrench, 
    FaUsers, FaHistory, FaCog, FaSignOutAlt, 
    FaBars, FaTimes 
} from 'react-icons/fa';
import Logo from "/src/assets/images/wowLogo.png";
import './Sidebar.css';

const Sidebar = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { id: 1, label: 'Dashboard', icon: <FaThLarge />, path: '/admin/dashboard' },
        { id: 2, label: 'Bookings', icon: <FaCalendarCheck />, path: '/admin/booking' },
        { id: 3, label: 'Users', icon: <FaWrench />, path: '/admin/users' },
        { id: 4, label: 'Staffs', icon: <FaUsers />, path: '/admin/staffs' },
        { id: 5, label: 'History', icon: <FaHistory />, path: '/history' },
        { id: 6, label: 'Settings', icon: <FaCog />, path: '/settings' },
    ];

    return (
        <>
            <button 
                className={`sidebar-mobile-toggle ${isMobileOpen ? 'open' : ''}`} 
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle Menu"
            >
                {isMobileOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Main Sidebar */}
            <aside className={`sidebar bg-darkgreen ${isMobileOpen ? 'mobile-active' : ''}`}>
                <div className="sidebar-inner">
                    <div className="sidebar-top">
                        <div className="sidebar-logo">
                            <img src={Logo} alt="WowSewa" className="logo-img" />
                        </div>
                        
                        <nav className="sidebar-menu">
                            {menuItems.map((item) => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.path} 
                                    className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <span className="sidebar-icon">{item.icon}</span>
                                    <span className="sidebar-text">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="sidebar-bottom">
                        <button className="sidebar-btn logout">
                            <span className="sidebar-icon"><FaSignOutAlt /></span>
                            <span className="sidebar-text">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Clickable Overlay for Mobile */}
            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
        </>
    );
};

export default Sidebar;