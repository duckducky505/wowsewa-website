import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdClose, MdChevronLeft, MdChevronRight, MdLogout } from "react-icons/md";
import { getGroupedNavForRole, ROLE_LABELS } from "../navConfig";
import logo from "../../assets/images/wowLogo.png";

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
      {isOpen && (
        <div
          className="fixed inset-0 z-[39] bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "relative flex h-screen flex-col sticky top-0 z-40",
          "bg-[#074C3A] text-[#F8FAEA] font-sans transition-[width] duration-200 ease-in-out",
          collapsed ? "w-[4.5rem]" : "w-64",
          "max-md:fixed max-md:left-0 max-md:top-0 max-md:w-64 max-md:shadow-[20px_0_40px_rgba(1,10,8,0.4)]",
          "max-md:transition-transform max-md:duration-200",
          isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        ].join(" ")}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(209,254,23,0.04) 0px, rgba(209,254,23,0.04) 1px, transparent 1px, transparent 14px)",
        }}
        aria-label="Primary navigation"
      >
        {/* Collapse handle */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:grid absolute top-[5.5rem] -right-3 z-10 h-6 w-6 place-items-center rounded-full
                     bg-[#D1FE17] text-[#010a08] border-2 border-[#F8FAEA] shadow-[0_4px_10px_rgba(1,10,8,0.35)]
                     transition-transform duration-150 hover:scale-110 hover:bg-[#A6C400]"
        >
          {collapsed ? <MdChevronRight size={15} /> : <MdChevronLeft size={15} />}
        </button>

        {/* Brand */}
        <div className="flex min-h-[4.5rem] items-center gap-3 border-b border-white/10 px-4 py-5">
          <img
            src={logo}
            alt="WowSewa"
            className="h-9 w-9 shrink-0 rounded-lg bg-[#F8FAEA] object-contain p-1"
          />
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[1.02rem] font-bold leading-tight tracking-tight text-[#F8FAEA]">
                WowSewa
              </span>
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[#D1FE17]">
                {ROLE_LABELS[role] || role}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto hidden text-[#F8FAEA]/80 hover:text-[#F8FAEA] max-md:inline-flex"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-2.5 py-3">
          {groups.map(({ group, items }, i) => (
            <div className="flex flex-col gap-0.5" key={group}>
              {i > 0 && <div className="mx-2 my-2.5 h-px bg-white/10" aria-hidden="true" />}
              {!collapsed && (
                <p className="mb-1 px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#F8FAEA]/40">
                  {group}
                </p>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[0.87rem] font-medium whitespace-nowrap transition-colors duration-150",
                      isActive
                        ? "bg-white/[0.07] font-semibold text-[#F8FAEA]"
                        : "text-[#F8FAEA]/65 hover:bg-white/[0.08] hover:text-[#F8FAEA]",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={[
                          "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-150",
                          isActive
                            ? "bg-[#D1FE17] text-[#010a08]"
                            : "bg-white/5 text-current group-hover:bg-white/[0.12]",
                        ].join(" ")}
                      >
                        <item.icon size={17} />
                      </span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User card */}
        {user && (
          <div className="flex items-center gap-2.5 border-t border-white/10 bg-black/15 px-3.5 py-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D1FE17] text-[0.68rem] font-bold text-[#010a08]">
              {initials(user?.name)}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.82rem] font-semibold text-[#F8FAEA]">{user?.name}</p>
                <p className="truncate text-[0.7rem] text-[#F8FAEA]/55">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                className="shrink-0 rounded-lg p-1.5 text-[#F8FAEA]/60 transition-colors duration-150 hover:bg-[#C0392B]/25 hover:text-[#ff8a7a]"
              >
                <MdLogout size={17} />
              </button>
            )}
          </div>
        )}

        {!collapsed && (
          <div className="border-t border-white/10 px-3.5 py-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-[#F8FAEA]/35">
            console v2.4 · secure
          </div>
        )}
      </aside>
    </>
  );
}