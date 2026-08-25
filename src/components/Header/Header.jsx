import React, { useState, useRef, useEffect } from "react";
import { MdMenu, MdNotificationsNone, MdKeyboardArrowDown, MdLogout } from "react-icons/md";
import { ROLE_LABELS } from "../navConfig";

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Header({
  user,
  role,
  onMenuClick,
  onLogout,
  notifications = [],
  onNotificationClick,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userRef = useRef(null);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E3E5D6] bg-white px-5 font-sans">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="hidden text-[#074C3A] max-md:inline-flex"
        >
          <MdMenu size={22} />
        </button>
        <span className="rounded-full bg-[#074C3A]/[0.08] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#074C3A]">
          {ROLE_LABELS[role] || role}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className={[
              "relative grid h-10 w-10 place-items-center rounded-xl border transition-colors duration-150",
              notifOpen
                ? "border-[#D1FE17] bg-[#D1FE17]/15 text-[#074C3A]"
                : "border-[#E3E5D6] bg-white text-[#074C3A] hover:bg-[#F8FAEA]",
            ].join(" ")}
          >
            <MdNotificationsNone size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-[#C0392B] px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-80 max-w-[85vw] overflow-hidden rounded-2xl border border-[#E3E5D6] bg-white shadow-[0_20px_50px_-12px_rgba(1,10,8,0.35)]">
              <div className="flex items-center justify-between bg-[#074C3A] px-4 py-3.5">
                <span className="text-sm font-bold text-[#F8FAEA]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#D1FE17] px-2 py-0.5 text-[10px] font-bold text-[#074C3A]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-[#5C6B60]">You're all caught up</p>
                    <p className="mt-0.5 text-xs text-[#5C6B60]/70">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        onNotificationClick?.(n);
                        setNotifOpen(false);
                      }}
                      className={[
                        "flex w-full items-start gap-3 border-b border-[#E3E5D6] px-4 py-3 text-left last:border-b-0 transition-colors duration-150 hover:bg-[#F8FAEA]",
                        !n.read && "bg-[#D1FE17]/[0.06]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          n.read ? "bg-transparent" : "bg-[#D1FE17] ring-4 ring-[#D1FE17]/20",
                        ].join(" ")}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#010a08]">{n.title}</p>
                        {n.message && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-[#5C6B60]">{n.message}</p>
                        )}
                        {n.time && (
                          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#5C6B60]/70">
                            {n.time}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t border-[#E3E5D6] px-4 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-bold uppercase tracking-wide text-[#074C3A] hover:text-[#A6C400]"
                  >
                    View all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
            className={[
              "flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3 transition-colors duration-150",
              userMenuOpen
                ? "border-[#D1FE17] bg-[#D1FE17]/10"
                : "border-[#E3E5D6] bg-white hover:bg-[#F8FAEA]",
            ].join(" ")}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#074C3A] text-[0.68rem] font-bold text-[#D1FE17]">
              {initials(user?.name)}
            </span>
            <span className="max-w-[8rem] truncate text-[0.85rem] font-semibold text-[#010a08] max-[560px]:hidden">
              {user?.name || "Account"}
            </span>
            <MdKeyboardArrowDown
              size={16}
              className={`text-[#5C6B60] transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl border border-[#E3E5D6] bg-white shadow-[0_24px_48px_-20px_rgba(1,10,8,0.35)]">
              <div className="border-b border-[#E3E5D6] px-4 py-3.5">
                <p className="truncate text-sm font-semibold text-[#010a08]">{user?.name}</p>
                <p className="truncate text-[0.76rem] text-[#5C6B60]">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-[0.85rem] font-semibold text-[#C0392B] transition-colors duration-150 hover:bg-[#F8FAEA]"
              >
                <MdLogout size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}