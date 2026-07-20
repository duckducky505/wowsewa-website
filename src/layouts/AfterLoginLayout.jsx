// layouts/AfterLoginLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { useAuth } from "../hooks/useAuth";
import "./AfterLoginLayout.css";

export default function AfterLoginLayout() {
  // Was only destructuring `logout` — `user` and `role` were referenced
  // below without ever being declared, which throws at render time.
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="wsw-app-layout">
      <Sidebar
        role={role}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="wsw-app-layout__main">
        <Header
          user={user}
          role={role}
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