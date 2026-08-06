// components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdClose, MdChevronLeft, MdChevronRight, MdLogout } from "react-icons/md";
import { getGroupedNavForRole, ROLE_LABELS } from "../navConfig";
import logo from "../../assets/images/wowLogo.png";
import "./Sidebar.css";

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar({ role, user, isOpen, onClose, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const groups = getGroupedNavForRole(role);

  return (
    <>
      {isOpen && <div className="wsw-sidebar__scrim" onClick={onClose} aria-hidden="true" />}

      <aside
        className={
          "wsw-sidebar" +
          (isOpen ? " wsw-sidebar--open" : "") +
          (collapsed ? " wsw-sidebar--collapsed" : "")
        }
        aria-label="Primary navigation"
      >
        <button
          type="button"
          className="wsw-sidebar__collapse-handle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <MdChevronRight size={15} /> : <MdChevronLeft size={15} />}
        </button>

        <div className="wsw-sidebar__brand">
          <img src={logo} alt="WowSewa" className="wsw-sidebar__logo" />
          {!collapsed && (
            <div className="wsw-sidebar__brand-text">
              <span className="wsw-sidebar__brand-name">WowSewa</span>
              <span className="wsw-sidebar__brand-role">{ROLE_LABELS[role] || role}</span>
            </div>
          )}
          <button type="button" className="wsw-sidebar__close" onClick={onClose} aria-label="Close menu">
            <MdClose size={20} />
          </button>
        </div>

        <nav className="wsw-sidebar__nav">
          {groups.map(({ group, items }, i) => (
            <div className="wsw-sidebar__group" key={group}>
              {i > 0 && <div className="wsw-sidebar__group-divider" aria-hidden="true" />}
              {!collapsed && <p className="wsw-sidebar__group-label">{group}</p>}
              {items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    "wsw-sidebar__link" + (isActive ? " wsw-sidebar__link--active" : "")
                  }
                >
                  <span className="wsw-sidebar__link-icon-chip">
                    <item.icon size={17} className="wsw-sidebar__link-icon" />
                  </span>
                  {!collapsed && <span className="wsw-sidebar__link-label">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {user && (
          <div className="wsw-sidebar__user-card">
            <span className="wsw-sidebar__user-avatar">{initials(user?.name)}</span>
            {!collapsed && (
              <div className="wsw-sidebar__user-info">
                <p className="wsw-sidebar__user-name">{user?.name}</p>
                <p className="wsw-sidebar__user-email">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button type="button" className="wsw-sidebar__user-logout" onClick={onLogout} aria-label="Log out">
                <MdLogout size={17} />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}