// components/Header/Header.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { ROLE_LABELS, default as ALL_NAV_ITEMS } from "../navConfig";
import { fetchHook } from "../../hooks/fetchHook";
import { fetchAPI } from "../../utils/fetchAPI";

const MenuIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);
const BellIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);
const ChevronDownIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const LogoutIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);
const GearIc = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
  </svg>
);
const CrumbSlash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="m14 6-5 12" />
  </svg>
);

const initials = (name) =>
  (name || "").split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();

function findNavItemByPath(pathname) {
  return ALL_NAV_ITEMS.find((item) => item.path === pathname) || null;
}

// Normalizes three different shapes into one panel-friendly notification:
//  1. Persisted Notification rows from GET /api/Notification (id/read from DB)
//  2. The transient SignalR "BookingNotification" push (AddNotification calls)
//  3. The generic SignalR "EntityUpdated" broadcast every controller's
//     BroadcastToRoles(...) call emits — { entityType, action, message, data }
function normalizeNotification(raw) {
  // Shape 3: generic entity broadcast — surface entityType + action as the title
  if (raw?.entityType && raw?.action) {
    return {
      id: `entity-${raw.entityType}-${raw.action}-${Date.now()}-${Math.random()}`,
      title: `${raw.entityType} ${raw.action}`,
      message: raw.message ?? "",
      read: false,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      persisted: false,
    };
  }

  // Shapes 1 & 2: persisted DB row or the dedicated AddNotification push
  return {
    id: raw.notificationId ?? raw.NotificationId ?? raw.id ?? raw.Id ?? `local-${Date.now()}-${Math.random()}`,
    title: raw.title ?? raw.Title ?? "Notification",
    message: raw.message ?? raw.Message ?? "",
    read: raw.read ?? raw.Read ?? false,
    time:
      raw.time ??
      (raw.createdDate ?? raw.CreatedDate
        ? new Date(raw.createdDate ?? raw.CreatedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : ""),
    persisted: raw.notificationId != null || raw.NotificationId != null || raw.id != null || raw.Id != null,
  };
}

const HUB_URL = "https://localhost:7011/hub/notification"; // must match Program.cs MapHub route

export default function Header({ user, role, onMenuClick, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  const location = useLocation();
  const navigate = useNavigate();
  const item = findNavItemByPath(location.pathname);

  const { data: rawNotifications, loading: notifsLoading } = fetchHook(
    "https://localhost:7011/api/Notification"
  );

  useEffect(() => {
    if (!notifsLoading && rawNotifications) {
      setNotifications((rawNotifications || []).map(normalizeNotification));
    }
  }, [rawNotifications, notifsLoading]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("Token"),
      })
      .withAutomaticReconnect()
      .build();

    // Dedicated push from NotificationService.AddNotification (e.g. new
    // booking received) — kept as-is, this one was already working.
    connection.on("BookingNotification", (raw) => {
      const incoming = normalizeNotification(raw);
      setNotifications((prev) => [incoming, ...prev]);
    });

    // Generic broadcast every BroadcastToRoles(...) call emits, across
    // every controller (Holder, CashFlow, Booking, HoldingSheet, etc).
    // The header is the one place notifications should surface globally,
    // regardless of which page is currently open — so it needs to listen
    // to this event too, not just the narrower BookingNotification push.
    // Server-side role filtering already happened before this reaches the
    // client (BroadcastToRoles only sends to the groups it was given), so
    // anything arriving here is already meant for this user's role.
    connection.on("EntityUpdated", (raw) => {
      const incoming = normalizeNotification(raw);
      setNotifications((prev) => [incoming, ...prev]);
    });

    connection.start().catch((err) => {
      console.error("SignalR connection failed:", err);
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleNotificationClick = useCallback(async (n) => {
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));

    if (n.persisted) {
      const res = await fetchAPI(`https://localhost:7011/api/Notification/${n.id}/read`, "PATCH");
      if (!res) {
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: false } : x)));
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div className="relative border-b border-[rgba(248,250,234,0.12)] bg-[#074C3A]/95 backdrop-blur-md">
        <span
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(209,254,23,0.04) 0px, rgba(209,254,23,0.04) 1px, transparent 1px, transparent 14px)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex h-[4.2rem] max-w-[84rem] items-center justify-between gap-4 px-5 lg:px-10">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#F8FAEA] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[rgba(248,250,234,0.12)] hover:text-[#D1FE17] active:translate-y-0 lg:hidden"
            >
              <MenuIc className="h-5 w-5" />
            </button>

            <span className="hidden shrink-0 items-center gap-2 rounded-full bg-[#D1FE17] py-1.5 pl-3 pr-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#010A08] shadow-[2px_2px_0_0_rgba(1,10,8,0.4)] sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-[#010A08] opacity-40" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#010A08]" />
              </span>
              {ROLE_LABELS[role] || role}
            </span>

            <nav className="flex min-w-0 items-center gap-2 text-[13px]" aria-label="Breadcrumb">
              <span className="font-semibold text-[#F8FAEA]/50">Console</span>
              {item && (
                <>
                  <CrumbSlash className="h-3.5 w-3.5 shrink-0 text-[#D1FE17]/45" />
                  <span className="hidden font-semibold text-[#F8FAEA]/50 md:inline">{item.group}</span>
                  <CrumbSlash className="hidden h-3.5 w-3.5 shrink-0 text-[#D1FE17]/45 md:inline" />
                  <span className="inline-flex min-w-0 items-center gap-2 rounded-md border border-[rgba(248,250,234,0.3)] bg-[#F8FAEA] py-1 pl-1.5 pr-2.5 shadow-[2px_2px_0_0_rgba(1,10,8,0.3)]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-[#074C3A] text-[#D1FE17]">
                      <item.icon className="h-3 w-3" />
                    </span>
                    <span className="truncate font-extrabold text-[#074C3A]">{item.label}</span>
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notifications"
                aria-expanded={notifOpen}
                className={`relative grid h-10 w-10 place-items-center rounded-lg border transition-all duration-150 active:translate-y-px ${
                  notifOpen
                    ? "border-[#D1FE17] bg-[#D1FE17] text-[#010A08] shadow-[3px_3px_0_0_rgba(1,10,8,0.35)]"
                    : "border-[rgba(248,250,234,0.25)] bg-[rgba(248,250,234,0.06)] text-[#F8FAEA] hover:-translate-y-0.5 hover:border-[#D1FE17] hover:bg-[rgba(248,250,234,0.12)] hover:text-[#D1FE17]"
                }`}
              >
                <BellIc className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C0392B] opacity-50" />
                    <span className="relative grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#C0392B] px-1 font-mono text-[9.5px] font-bold text-white ring-2 ring-[#074C3A]">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="toast-in absolute right-0 top-[calc(100%+0.6rem)] z-50 w-80 max-w-[86vw] overflow-hidden rounded-xl border border-[#E3E5D6] bg-white shadow-[0_24px_50px_-16px_rgba(1,10,8,0.35)]">
                  <div className="relative flex items-center justify-between bg-[#074C3A] px-4 py-3">
                    <span className="absolute inset-y-0 left-0 w-[3px] bg-[#D1FE17]" aria-hidden="true" />
                    <p className="font-display text-sm font-extrabold text-[#F8FAEA]">Notifications</p>
                    {unread > 0 && <span className="rounded-full bg-[#D1FE17] px-2 py-0.5 font-mono text-[10px] font-bold text-[#010A08]">{unread} new</span>}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifsLoading ? (
                      <p className="px-4 py-9 text-center text-sm text-[#5C6B60]">Loading…</p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-9 text-center text-sm text-[#5C6B60]">You're all caught up 🎉</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => handleNotificationClick(n)}
                          className={`flex w-full items-start gap-3 border-b border-[#E3E5D6] px-4 py-3 text-left transition-colors duration-150 last:border-0 hover:bg-[#F8FAEA] ${!n.read ? "bg-[rgba(209,254,23,0.07)]" : ""}`}
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-[#9db800] ring-4 ring-[rgba(209,254,23,0.25)]"}`} aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-bold text-[#010A08]">{n.title}</span>
                            {n.message && <span className="mt-0.5 block text-[12px] leading-snug text-[#5C6B60]">{n.message}</span>}
                            {n.time && <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-[#9aa89d]">{n.time}</span>}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={userOpen}
                className={`flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3 transition-all duration-150 active:translate-y-px ${
                  userOpen
                    ? "border-[#D1FE17] bg-[rgba(248,250,234,0.14)] shadow-[3px_3px_0_0_rgba(1,10,8,0.35)]"
                    : "border-[rgba(248,250,234,0.25)] bg-[rgba(248,250,234,0.06)] hover:-translate-y-0.5 hover:border-[#D1FE17] hover:bg-[rgba(248,250,234,0.12)]"
                }`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D1FE17] text-[11px] font-extrabold text-[#010A08] shadow-[0_0_0_2.5px_rgba(248,250,234,0.35)]">
                  {initials(user?.name)}
                </span>
                <span className="hidden max-w-[8.5rem] truncate text-[13.5px] font-bold text-[#F8FAEA] sm:block">{user?.name || "Account"}</span>
                <ChevronDownIc className={`h-4 w-4 text-[#F8FAEA]/60 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`} />
              </button>

              {userOpen && (
                <div className="toast-in absolute right-0 top-[calc(100%+0.55rem)] z-50 w-64 overflow-hidden rounded-xl border border-[#E3E5D6] bg-white shadow-[0_24px_50px_-16px_rgba(1,10,8,0.35)]">
                  <div className="relative border-b border-[#E3E5D6] bg-[#F8FAEA]/60 px-4 py-3.5">
                    <span className="absolute inset-y-0 left-0 w-[3px] bg-[#D1FE17]" aria-hidden="true" />
                    <p className="truncate text-sm font-extrabold text-[#010A08]">{user?.name}</p>
                    <p className="truncate text-[12px] text-[#5C6B60]">{user?.email}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#074C3A] px-2.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#D1FE17]">
                      <span className="h-[5px] w-[5px] rounded-[1px] bg-[#D1FE17]" aria-hidden="true" />
                      {ROLE_LABELS[role] || role}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { navigate("/settings"); setUserOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13.5px] font-semibold text-[#074C3A] transition-colors hover:bg-[#F8FAEA]"
                  >
                    <GearIc className="h-4 w-4" /> Account settings
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 border-t border-[#E3E5D6] px-4 py-3 text-left text-[13.5px] font-bold text-[#C0392B] transition-colors hover:bg-[rgba(192,57,43,0.07)]"
                  >
                    <LogoutIc className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-[2.5px] w-full bg-[#D1FE17] shadow-[0_2px_10px_rgba(209,254,23,0.5)]" aria-hidden="true" />
    </header>
  );
}