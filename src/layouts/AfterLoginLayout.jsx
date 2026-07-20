// layouts/AfterLoginLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "./AfterLoginLayout.css";
import { useAuth } from "../context/AuthContext";

export default function AfterLoginLayout() {
  const {user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const userRole = user?.role;

  return (
    <div className="wsw-app-layout">
      <Sidebar
        role={userRole}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="wsw-app-layout__main">
        <Header
          user={user}
          role={userRole}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="wsw-app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}