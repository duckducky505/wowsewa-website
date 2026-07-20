// components/Header/Header.jsx
import React, { useState } from "react";
import { MdMenu, MdNotificationsNone, MdKeyboardArrowDown, MdLogout } from "react-icons/md";
import { ROLE_LABELS } from "../navConfig";
import "./Header.css";

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Header({ user, role, onMenuClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="wsw-topbar">
      <div className="wsw-topbar__left">
        <button type="button" className="wsw-topbar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <MdMenu size={22} />
        </button>
        <span className="wsw-topbar__role-badge">{ROLE_LABELS[role] || role}</span>
      </div>

      <div className="wsw-topbar__right">
        <button type="button" className="wsw-topbar__icon-btn" aria-label="Notifications">
          <MdNotificationsNone size={20} />
          <span className="wsw-topbar__notif-dot" />
        </button>

        <div className="wsw-topbar__user-menu">
          <button
            type="button"
            className="wsw-topbar__user-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="wsw-topbar__avatar">{initials(user?.name)}</span>
            <span className="wsw-topbar__user-name">{user?.name || "Account"}</span>
            <MdKeyboardArrowDown size={16} />
          </button>

          {menuOpen && (
            <>
              <div className="wsw-topbar__menu-scrim" onClick={() => setMenuOpen(false)} />
              <div className="wsw-topbar__dropdown" role="menu">
                <div className="wsw-topbar__dropdown-head">
                  <p className="wsw-topbar__dropdown-name">{user?.name}</p>
                  <p className="wsw-topbar__dropdown-email">{user?.email}</p>
                </div>
                <button
                  type="button"
                  className="wsw-topbar__dropdown-item wsw-topbar__dropdown-item--danger"
                  onClick={onLogout}
                  role="menuitem"
                >
                  <MdLogout size={16} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}