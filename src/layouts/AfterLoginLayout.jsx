// layouts/AfterLoginLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "./AfterLoginLayout.css";
import { useAuth } from "../context/AuthContext";
import { useEntityNotifications } from '../hooks/useEntityNotification';

export default function AfterLoginLayout() {
  const { user, logout } = useAuth();
  useEntityNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-[#E9EFE0]">
      <Sidebar
        role={user?.role}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          role={user?.role}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[84rem] px-5 py-8 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}