// layouts/AfterLoginLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "./AfterLoginLayout.css";
import { useAuth } from "../context/AuthContext";

export default function AfterLoginLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("Token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));


  const name =
    decodedToken.name ||
    decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"];

  const userEmail =
      decodedToken.email ||
      decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

  const rawRole =
      decodedToken.role ||
      decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const guidId =
      decodedToken.guidId ||
      decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];


  const role = (rawRole || "").toLowerCase();
  

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="wsw-app-layout">
      <Sidebar
        role={user?.role}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="wsw-app-layout__main">
        <Header user={user} role={user?.role} onMenuClick={() => setSidebarOpen(true)} onLogout={handleLogout} />
        <main className="wsw-app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}