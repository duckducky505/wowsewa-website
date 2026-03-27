import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { 
    FaThLarge, FaCalendarCheck, FaWrench, 
    FaUsers, FaHistory, FaCog, FaSignOutAlt, 
    FaBars, FaTimes 
} from 'react-icons/fa';
import Logo from "/src/assets/images/wowLogo.png"
import './Sidebar.css';

const Sidebar = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Added 'path' to each menu item to match your routes
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
            <button className="sidebar-mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                {isMobileOpen ? <FaTimes /> : <FaBars />}
            </button>

            <aside className={`dashboard-sidebar bg-darkgreen ${isMobileOpen ? 'mobile-active' : ''}`}>
                <div className="sidebar-top">
                    <div className="sidebar-logo">
                      <img src={Logo} alt="WowSewa Logo" className="logo-img" />  
                    </div>
                    
                    <nav className="sidebar-menu">
                        {menuItems.map((item) => (
                            <NavLink 
                                key={item.id} 
                                to={item.path} 
                                className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMobileOpen(false)} // Close sidebar on mobile after click
                            >
                                <span className="sidebar-icon">{item.icon}</span>
                                <span className="sidebar-text">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    {/* Logout usually triggers a function, but can be a Link to '/' */}
                    <button className="sidebar-btn logout">
                        <FaSignOutAlt className="sidebar-icon" />
                        <span className="sidebar-text">Logout</span>
                    </button>
                </div>
            </aside>

            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
        </>
    );
};

export default Sidebar;