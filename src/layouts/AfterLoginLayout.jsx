// layouts/AfterLoginLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import './AfterLoginLayout.css'; // We will create this file
import { MdMenu } from 'react-icons/md';
import { useState } from "react";

const AfterLoginLayout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="app-container">
            {/* Sidebar component */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className={`main-content ${isSidebarOpen ? 'active' : ''}`}>
                {/* Hamburger button - positioned Top Left on mobile/tablet only */} 
                <button className="global-hamburger" onClick={toggleSidebar}>
                    <MdMenu size={30} />
                </button>
                
                <Outlet />
            </div>
        </div>
    );
}

export default AfterLoginLayout;