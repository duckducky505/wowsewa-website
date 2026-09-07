// components/Sidebar/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/wowLogo.png";
import { getGroupedNavForRole, ROLE_LABELS } from "../navConfig";

const Chevron = ({ dir = "l", ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {dir === "l" ? <path d="m14 6-6 6 6 6" /> : <path d="m10 6 6 6-6 6" />}
  </svg>
);
const LogoutIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const CloseIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const Bolt = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

const initials = (name) =>
  (name || "").split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function Sidebar({ role, user, isOpen, onClose, onLogout, collapsed, setCollapsed }) {
  const groups = getGroupedNavForRole(role);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <>
      {/* mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[54] bg-[#010A08]/60 backdrop-blur-[2px] lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={[
          "relative z-[55] flex h-screen flex-col bg-[#074C3A] text-[#F8FAEA] transition-[width] duration-200 ease-in-out",
          collapsed ? "lg:w-[4.9rem]" : "lg:w-[17rem]",
          "fixed inset-y-0 left-0 w-72 shadow-[24px_0_60px_rgba(1,10,8,0.45)]",
          "lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:border-r lg:border-[#D1FE17]/25",
        ].join(" ")}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(209,254,23,0.045) 0px, rgba(209,254,23,0.045) 1px, transparent 1px, transparent 15px)",
        }}
        aria-label="Primary navigation"
      >
        {/* signature lime top hairline */}
        <span className="absolute inset-x-0 top-0 z-20 h-[3px] bg-[#D1FE17]" aria-hidden="true" />

        {/* collapse handle (desktop) */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-[4.9rem] z-20 hidden h-8 w-8 place-items-center rounded-full border-2 border-[#03201A] bg-[#D1FE17] text-[#010A08] shadow-[0_6px_16px_rgba(209,254,23,0.35)] transition-all duration-200 hover:rotate-12 hover:scale-110 lg:grid"
        >
          <Chevron dir={collapsed ? "r" : "l"} className="h-3.5 w-3.5" />
        </button>

        {/* brand */}
        <div className="relative flex min-h-[4.7rem] items-center gap-3 border-b border-[#F8FAEA]/10 px-4 py-4">
          <Bolt className="pointer-events-none absolute -right-2 top-1/2 h-16 w-16 -translate-y-1/2 text-[#D1FE17]/[0.07]" />
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F8FAEA] shadow-[0_0_0_3px_rgba(209,254,23,0.28)]">
            <img src={logo} alt="WowSewa" className="h-8 w-8 rounded-lg object-contain p-0.5" />
          </span>
          {!collapsed && (
            <div className="relative min-w-0">
              <p className="truncate font-display text-[16px] font-extrabold leading-tight tracking-tight">
                Wow<span className="text-[#D1FE17]">Sewa</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#F8FAEA]/50">
                <span className="h-[5px] w-[5px] rounded-[1px] bg-[#D1FE17]" aria-hidden="true" />
                {ROLE_LABELS[role] || role} console
              </p>
            </div>
          )}
          <button type="button" onClick={onClose} aria-label="Close menu" className="relative ml-auto text-[#F8FAEA]/70 transition-colors hover:text-[#D1FE17] lg:hidden">
            <CloseIc className="h-5 w-5" />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {groups.map(({ group, items }, gi) => (
            <div key={group}>
              {gi > 0 && <div className="mx-2 my-3.5 h-px bg-[#F8FAEA]/10" aria-hidden="true" />}
              {!collapsed && (
                <p className="mb-2 flex items-center gap-2 px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F8FAEA]/40">
                  <span className="h-[2px] w-3.5 bg-[#D1FE17]/70" aria-hidden="true" />
                  {group}
                </p>
              )}
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.key}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        [
                          "group relative flex items-center gap-3 rounded-lg py-2 pr-2.5 text-[14px] font-semibold transition-all duration-150",
                          collapsed ? "justify-center px-0" : "pl-2.5",
                          isActive
                            ? "bg-[#D1FE17] text-[#010A08] shadow-[4px_4px_0_0_rgba(1,10,8,0.55)]"
                            : "text-[#F8FAEA]/70 hover:bg-[#F8FAEA]/[0.07] hover:text-[#F8FAEA]",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && !collapsed && (
                            <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-[#010A08]" aria-hidden="true" />
                          )}
                          <span
                            className={[
                              "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all duration-150",
                              isActive
                                ? "bg-[#010A08]/[0.12] text-[#010A08]"
                                : "bg-[#F8FAEA]/[0.06] text-[#D1FE17] group-hover:translate-x-0.5 group-hover:bg-[#F8FAEA]/[0.12]",
                            ].join(" ")}
                          >
                            <item.icon className="h-[17px] w-[17px]" />
                          </span>
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {!collapsed && isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#010A08]" aria-hidden="true" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* footer: live meter + user */}
        <div className="border-t border-[#F8FAEA]/10 px-3.5 py-3.5">
          {!collapsed && (
            <div className="mb-3 flex items-center justify-between rounded-lg border border-[#D1FE17]/20 bg-[#F8FAEA]/[0.05] px-3 py-2.5">
              <span className="flex items-center gap-2.5">
                <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-sm bg-[#D1FE17]"
                      style={{ animation: `wsw-eq 1s ease-in-out ${i * 0.18}s infinite`, height: "100%" }}
                    />
                  ))}
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#D1FE17]">Live</span>
              </span>
              <span className="font-mono text-[12px] font-bold tracking-wider text-[#F8FAEA]">{clock}</span>
            </div>
          )}
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D1FE17] text-[12px] font-extrabold text-[#010A08] shadow-[0_0_0_3px_rgba(209,254,23,0.22)]">
              {initials(user?.name)}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#03201A] bg-[#9db800]" aria-hidden="true" />
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold leading-tight">{user?.name}</p>
                <p className="truncate text-[10.5px] text-[#F8FAEA]/45">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                title="Log out"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#F8FAEA]/55 transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#C0392B]/25 hover:text-[#ff8a7a]"
              >
                <LogoutIc className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}