// layouts/AfterLoginLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import './AfterLoginLayout.css';
import { MdMenu } from 'react-icons/md';
import { useState } from "react";

const AfterLoginLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar  = () => setIsSidebarOpen(false);

  return (
    <div className="all-app-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`all-main-content ${isSidebarOpen ? 'all-overlay-active' : ''}`}
        onClick={isSidebarOpen ? closeSidebar : undefined}
      >
        <button
          className="all-hamburger-btn"
          onClick={e => { e.stopPropagation(); toggleSidebar(); }}
          aria-label="Toggle navigation"
        >
          <MdMenu size={26} />
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default AfterLoginLayout;