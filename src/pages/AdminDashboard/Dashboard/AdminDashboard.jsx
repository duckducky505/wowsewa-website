// pages/AdminDashboard/AdminDashboard.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { fetchAPI } from "../../../utils/fetchAPI";
import { useSignalR } from "../../../hooks/signalR";


const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_COLORS = ["#D1FE17", "#074C3A", "#E8A33D", "#4E9C7F", "#010A08", "#149066", "#B9D94A", "#5C6B60"];

const API = {
  monthly: (year) => `https://localhost:7011/api/AdminDashboard/monthly/charts-data/${year}`,
  donut: (year, month) =>
    `https://localhost:7011/api/AdminDashboard/donut/industry-category?year=${year}&month=${month}`,
  cashFlow: "https://localhost:7011/api/CashFlow/get/allCashFlowData",
  holding: "https://localhost:7011/api/HoldingSheet/get/holding-sheet-data",
};

/* ---------------- small helpers ------------------------------------ */

function formatRs(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}
function computeDelta(current, previous) {
  if (previous === null || previous === undefined) return { delta: "N/A", up: current >= 0 };
  if (previous === 0) return { delta: current === 0 ? "0.0%" : "N/A", up: current >= 0 };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  return { delta: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`, up: pct >= 0 };
}
const timeAgo = (ts) => {
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
};

/* ---------------- inline icons -------------------------------------- */

const TrendUp = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" />
  </svg>
);
const TrendDown = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7l6 6 4-4 8 8" /><path d="M14 17h7v-7" />
  </svg>
);
const BellIcon = ({ s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);
const CalendarIcon = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const DownloadIcon = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12m0 0-4-4m4 4 4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
const ArrowOutIcon = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
const CheckAll = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12l5 5L18 6" /><path d="M9 17l2 2L22 8" />
  </svg>
);
const TypeIcon = ({ type, s = 15 }) => {
  if (type === "payment")
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" />
      </svg>
    );
  if (type === "alert")
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" />
      </svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-9-9" /><path d="M21 3v6h-6" />
    </svg>
  );
};

const TYPE_STYLE = {
  cashflow: "bg-[#074C3A]/10 text-[#074C3A]",
  payment: "bg-[#D1FE17]/30 text-[#4d6b00]",
  alert: "bg-[#C0392B]/10 text-[#C0392B]",
  system: "bg-[#E8A33D]/20 text-[#8a5a12]",
};

/* ---------------- chart tooltip ------------------------------------- */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[10px] bg-[#010A08] px-3.5 py-3 shadow-[0_16px_32px_-18px_rgba(1,10,8,0.5)]">
        <p className="mb-1 text-[13px] font-bold text-[#F8FAEA]">{label}</p>
        <p className="m-0 font-mono text-[12px] text-[#D1FE17]">In: {formatRs(payload[0]?.value ?? 0)}</p>
        <p className="m-0 font-mono text-[12px] text-[#E8A33D]">Out: {formatRs(payload[1]?.value ?? 0)}</p>
      </div>
    );
  }
  return null;
};

/* ================================================================== */

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = today.getFullYear(); y >= today.getFullYear() - 4; y--) years.push(y);
    return years;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rawChartData, setRawChartData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [holdingData, setHoldingData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  /* ---------------- notifications (populated only by real live events) --- */
  const [notifications, setNotifications] = useState([]);
  const unread = notifications.filter((n) => !n.read).length;

  const pushNotification = useCallback((n) => {
    setNotifications((prev) => [{ id: Date.now() + Math.random(), at: Date.now(), read: false, ...n }, ...prev].slice(0, 20));
  }, []);

  /* close the notification box on outside click */
  useEffect(() => {
    const onDown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const { connection, isConnected } = useSignalR() || {};

  /* ---------------- loaders — all data from the API, no fallback ---- */

  const loadChartData = useCallback(async () => {
    setChartsLoading(true);
    const res = await fetchAPI(API.monthly(selectedYear), "GET");
    setRawChartData(Array.isArray(res) ? res : []);
    setChartsLoading(false);
  }, [selectedYear]);

  const loadCategoryData = useCallback(async () => {
    const res = await fetchAPI(API.donut(selectedYear, selectedMonth), "GET");
    setCategoriesData(Array.isArray(res) ? res : []);
  }, [selectedYear, selectedMonth]);

  const loadCashFlow = useCallback(async () => {
    const res = await fetchAPI(API.cashFlow, "GET");
    setCashFlowData(Array.isArray(res) ? res : []);
  }, []);

  const loadHoldingData = useCallback(async () => {
    const res = await fetchAPI(API.holding, "GET");
    setHoldingData(Array.isArray(res) ? res : []);
  }, []);

  useEffect(() => { loadChartData(); }, [loadChartData]);
  useEffect(() => { loadCategoryData(); }, [loadCategoryData]);
  useEffect(() => { loadCashFlow(); }, [loadCashFlow]);
  useEffect(() => { loadHoldingData(); }, [loadHoldingData]);

  /* ---------------- live hub wiring --------------------------------- */
  useEffect(() => {
    if (!connection || !isConnected) return;

    const handleCashFlowUpdate = () => {
      loadCashFlow();
      loadChartData();
      loadCategoryData();
      pushNotification({ type: "cashflow", title: "Cash flow updated", body: "A new transaction was posted to the ledger." });
    };
    const handleHoldingUpdate = () => {
      loadHoldingData();
      pushNotification({ type: "system", title: "Holding sheet updated", body: "A technician settlement was recorded." });
    };

    connection.on("CashFlowUpdated", handleCashFlowUpdate);
    connection.on("HoldingSheetUpdated", handleHoldingUpdate);
    return () => {
      connection.off("CashFlowUpdated", handleCashFlowUpdate);
      connection.off("HoldingSheetUpdated", handleHoldingUpdate);
    };
  }, [connection, isConnected, loadCashFlow, loadChartData, loadCategoryData, loadHoldingData, pushNotification]);

  /* ---------------- derived data ------------------------------------ */

  const barChartData = useMemo(() => {
    return MONTH_NAMES.slice(1).map((monthStr, index) => {
      const monthNum = index + 1;
      const found = (rawChartData || []).find(
        (item) => item && (item.monthNumber == monthNum || item.MonthNumber == monthNum)
      );
      return {
        name: monthStr,
        monthNum,
        Earnings: found ? (found.income ?? found.Income ?? 0) : 0,
        Expenses: found ? (found.expense ?? found.Expense ?? 0) : 0,
      };
    });
  }, [rawChartData]);

  const kpis = useMemo(() => {
    const current = barChartData.find((m) => m.monthNum === selectedMonth) || { Earnings: 0, Expenses: 0 };
    const prevMonthNum = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const previous = prevYear === selectedYear ? barChartData.find((m) => m.monthNum === prevMonthNum) : null;

    const income = current.Earnings;
    const expense = current.Expenses;
    const net = income - expense;

    return [
      { label: "Total Income", value: formatRs(income), ...computeDelta(income, previous?.Earnings) },
      { label: "Total Expense", value: formatRs(expense), ...computeDelta(expense, previous?.Expenses) },
      { label: "Net Profit", value: formatRs(net), ...computeDelta(net, previous ? previous.Earnings - previous.Expenses : null) },
    ];
  }, [barChartData, selectedMonth, selectedYear]);

  const categoryData = useMemo(
    () =>
      (categoriesData || []).map((item, idx) => ({
        name: item.industryName ?? item.IndustryName ?? "Unknown",
        value: item.totalEarnings ?? item.TotalEarnings ?? 0,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      })),
    [categoriesData]
  );
  const categoryTotal = categoryData.reduce((a, d) => a + d.value, 0);
  const hovered = activeIndex != null ? categoryData[activeIndex] : null;

  const selectedMonthLabel = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const fmtAxis = (v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}k` : v);

  /* ================================================================== */

  return (
    <div className="w-full bg-[#F8FAEA] pb-14 font-body text-[#010A08]">
      {/* ---------------- green console header ---------------- */}
      <header className="relative overflow-hidden bg-[#074C3A] px-5 pb-16 pt-10 text-[#F8FAEA] sm:px-7">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(209,254,23,0.06) 0px, rgba(209,254,23,0.06) 1px, transparent 1px, transparent 14px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex max-w-[84rem] flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mb-3.5 inline-block rounded-full border border-[#D1FE17]/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D1FE17]">
              WowSewa Admin Console
            </span>
            <h1 className="m-0 font-display text-[clamp(1.9rem,3.6vw,2.7rem)] font-extrabold leading-tight tracking-tight">
              System Analytics
            </h1>
            <p className="m-0 mt-1 text-[15px] text-[#F8FAEA]/75">Real-time performance tracking &amp; ledger audits</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[11px] font-bold tracking-[0.18em] ${
                isConnected ? "border-[#D1FE17]/45 text-[#D1FE17]" : "border-[#F8FAEA]/25 text-[#F8FAEA]/60"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D1FE17] opacity-70" />}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${isConnected ? "bg-[#D1FE17]" : "bg-[#F8FAEA]/40"}`} />
              </span>
              {isConnected ? "LIVE" : "SYNCING"}
            </span>

            {/* notification bell + box */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                aria-label="Notifications"
                aria-expanded={notifOpen}
                className={`relative grid h-11 w-11 place-items-center rounded-xl border transition-all duration-200 ${
                  notifOpen
                    ? "border-[#D1FE17] bg-[#D1FE17] text-[#074C3A]"
                    : "border-[#F8FAEA]/25 bg-[#F8FAEA]/10 text-[#F8FAEA] hover:bg-[#F8FAEA]/20"
                }`}
              >
                <BellIcon />
                {unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-[#C0392B] px-1 font-mono text-[10px] font-bold text-white shadow-[0_0_0_3px_rgba(7,76,58,0.9)]">
                    {unread}
                  </span>
                )}
              </button>

              {/* notification dropdown */}
              <div
                className={`absolute right-0 top-full z-50 mt-3 w-[min(92vw,370px)] origin-top-right overflow-hidden rounded-[14px] border border-[#E3E5D6] bg-white text-[#010A08] shadow-[0_28px_60px_-24px_rgba(1,10,8,0.45)] transition-all duration-200 ${
                  notifOpen ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#E3E5D6] px-4 py-3">
                  <p className="m-0 font-display text-[15px] font-bold">
                    Notifications
                    {unread > 0 && <span className="ml-2 rounded-full bg-[#D1FE17] px-2 py-0.5 font-mono text-[10px] font-bold text-[#074C3A]">{unread} NEW</span>}
                  </p>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                      className="flex items-center gap-1.5 rounded-full bg-[#010A08] px-3 py-1.5 text-[11px] font-bold text-[#D1FE17] transition-colors hover:bg-[#053528]"
                    >
                      <CheckAll /> Mark all read
                    </button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  <ul className="m-0 max-h-[340px] list-none overflow-y-auto p-1.5">
                    {notifications.map((n) => (
                      <li key={n.id}>
                        <button
                          onClick={() => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                          className={`flex w-full items-start gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors hover:bg-[#F8FAEA] ${
                            n.read ? "opacity-65" : "bg-[#F8FAEA]/60"
                          }`}
                        >
                          <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TYPE_STYLE[n.type] || TYPE_STYLE.system}`}>
                            <TypeIcon type={n.type} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="truncate text-[13px] font-bold">{n.title}</span>
                              <span className="shrink-0 font-mono text-[10px] text-[#5C6B60]">{timeAgo(n.at)}</span>
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-snug text-[#5C6B60]">{n.body}</span>
                          </span>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D1FE17] shadow-[0_0_0_2px_rgba(7,76,58,0.25)]" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="m-0 px-4 py-8 text-center text-[13px] text-[#5C6B60]">
                    No notifications yet. You'll see live updates here as they happen.
                  </p>
                )}

                <div className="border-t border-[#E3E5D6] bg-[#F8FAEA]/70 px-4 py-2 text-center font-mono text-[10px] tracking-[0.14em] text-[#5C6B60]">
                  {isConnected ? "STREAMED VIA LIVE HUB" : "HUB DISCONNECTED"} · {notifications.length} KEPT
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-xl border border-[#F8FAEA]/25 bg-[#F8FAEA]/10 px-4 py-2.5 text-[13px] font-bold text-[#F8FAEA] transition-colors hover:bg-[#F8FAEA]/20">
              <DownloadIcon /> Export
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- body (overlaps the green band) -------------- */}
      <div className="relative z-10 mx-auto -mt-10 max-w-[84rem] px-5 sm:px-7">
        {/* period bar */}
        <section
          aria-label="Reporting period"
          className="fade-up mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E3E5D6] bg-white px-5 py-3.5 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)]"
        >
          <div className="flex items-center gap-2.5 text-[14px] text-[#5C6B60]">
            <span className="text-[#074C3A]"><CalendarIcon /></span>
            Showing data for <strong className="font-bold text-[#010A08]">{selectedMonthLabel}</strong>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              aria-label="Month"
              className="cursor-pointer rounded-[10px] border border-[#E3E5D6] bg-[#F8FAEA] px-3 py-2 text-[13.5px] font-semibold text-[#010A08] outline-none transition-colors focus:border-[#074C3A]"
            >
              {MONTH_NAMES.slice(1).map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Year"
              className="cursor-pointer rounded-[10px] border border-[#E3E5D6] bg-[#F8FAEA] px-3 py-2 text-[13.5px] font-semibold text-[#010A08] outline-none transition-colors focus:border-[#074C3A]"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </section>

        {/* KPI strip */}
        <section aria-label="Key financial metrics" className="mb-7 grid gap-4 sm:grid-cols-3">
          {kpis.map((k, i) => (
            <div
              key={k.label}
              className="fade-up group relative flex flex-col gap-2 overflow-hidden rounded-[16px] border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(1,10,8,0.35)]"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-[#D1FE17] transition-all duration-200 group-hover:w-1.5" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5C6B60]">{k.label}</span>
              <span className="font-display text-[1.7rem] font-extrabold leading-none tracking-tight">
                {chartsLoading ? "…" : k.value}
              </span>
              <span className={`flex w-fit items-center gap-1.5 text-[13px] font-bold ${k.up ? "text-[#074C3A]" : "text-[#C0392B]"}`}>
                {k.delta !== "N/A" && (k.up ? <TrendUp /> : <TrendDown />)} {k.delta}
                <span className="font-mono text-[10px] font-medium tracking-wide text-[#5C6B60]">vs last month</span>
              </span>
            </div>
          ))}
        </section>

        {/* charts row */}
        <div className="mb-6 grid gap-5 lg:grid-cols-3">
          {/* cash flow run-rate */}
          <div className="fade-up rounded-[16px] border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)] lg:col-span-2" style={{ animationDelay: "120ms" }}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="m-0 font-display text-[17px] font-bold">Cash Flow Run-Rate</h3>
                <p className="m-0 mt-0.5 text-[13px] text-[#5C6B60]">
                  {selectedYear} by month · <span className="font-semibold text-[#074C3A]">{MONTH_NAMES[selectedMonth]} highlighted</span>
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px] font-bold tracking-wide text-[#5C6B60]">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#074C3A]" /> IN</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#E8A33D]" /> OUT</span>
              </div>
            </div>
            {chartsLoading ? (
              <div className="flex h-[300px] items-center justify-center text-[13px] text-[#5C6B60]">Loading chart…</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E5D6" />
                  <XAxis dataKey="name" stroke="#5C6B60" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#5C6B60" }} />
                  <YAxis stroke="#5C6B60" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5C6B60" }} tickFormatter={fmtAxis} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(7,76,58,0.05)" }} />
                  <Bar dataKey="Earnings" radius={[4, 4, 0, 0]} barSize={13} isAnimationActive={!reduced}>
                    {barChartData.map((entry) => (
                      <Cell key={`earn-${entry.monthNum}`} fill="#074C3A" opacity={entry.monthNum === selectedMonth ? 1 : 0.32} />
                    ))}
                  </Bar>
                  <Bar dataKey="Expenses" radius={[4, 4, 0, 0]} barSize={13} isAnimationActive={!reduced}>
                    {barChartData.map((entry) => (
                      <Cell key={`exp-${entry.monthNum}`} fill="#E8A33D" opacity={entry.monthNum === selectedMonth ? 1 : 0.32} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* category donut */}
          <div className="fade-up rounded-[16px] border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)]" style={{ animationDelay: "200ms" }}>
            <div className="mb-4">
              <h3 className="m-0 font-display text-[17px] font-bold">By Category</h3>
              <p className="m-0 mt-0.5 text-[13px] text-[#5C6B60]">Share of volume revenue · {selectedMonthLabel}</p>
            </div>

            <div className="relative mx-auto h-[200px] w-full max-w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={78}
                    paddingAngle={4}
                    cornerRadius={5}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={!reduced}
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                {hovered ? (
                  <>
                    <span className="font-display text-[1.55rem] font-extrabold leading-none">
                      {categoryTotal ? Math.round((hovered.value / categoryTotal) * 100) : 0}%
                    </span>
                    <span className="mt-1 max-w-[110px] truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[#5C6B60]">{hovered.name}</span>
                  </>
                ) : (
                  <>
                    <span className="font-display text-[1.35rem] font-extrabold leading-none">{formatRs(categoryTotal)}</span>
                    <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5C6B60]">Total · {MONTH_NAMES[selectedMonth]}</span>
                  </>
                )}
              </div>
            </div>

            {categoryData.length > 0 ? (
              <ul className="mt-4 flex list-none flex-col gap-0.5 p-0">
                {categoryData.map((d, i) => (
                  <li
                    key={d.name}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={`flex cursor-pointer items-center rounded-lg px-2.5 py-[7px] text-[13.5px] transition-colors ${
                      activeIndex === i ? "bg-[#F8FAEA]" : "hover:bg-[#F8FAEA]"
                    }`}
                  >
                    <span className="mr-2.5 h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: d.color }} />
                    <span className="flex-grow text-[#5C6B60]">{d.name}</span>
                    <span className="font-mono text-[12px] font-bold text-[#010A08]">Rs {d.value.toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-center text-[13px] text-[#5C6B60]">No category data for {selectedMonthLabel}.</p>
            )}
          </div>
        </div>

        {/* split tables */}
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {/* cash flow stream */}
          <div className="fade-up rounded-[16px] border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)]" style={{ animationDelay: "260ms" }}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="m-0 font-display text-[17px] font-bold">Cash Flow Stream</h3>
                <p className="m-0 mt-0.5 text-[13px] text-[#5C6B60]">Recent revenue transactions</p>
              </div>
              <button
                onClick={() => navigate("/admin/CashFlow")}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#E3E5D6] px-3 py-1.5 text-[12px] font-bold text-[#074C3A] transition-colors hover:border-[#074C3A] hover:bg-[#074C3A]/5"
              >
                View More <ArrowOutIcon />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    {["Target", "Type", "Amount"].map((h) => (
                      <th key={h} className="border-b border-[#E3E5D6] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#5C6B60]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(cashFlowData || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-[13px] text-[#5C6B60]">No cash flow entries yet.</td>
                    </tr>
                  ) : (
                    cashFlowData.slice(0, 6).map((flow, index) => {
                      const isExpense = (flow.cashType || "").toLowerCase() === "expense";
                      return (
                        <tr key={flow.id || index} className="border-b border-[#E3E5D6] transition-colors last:border-b-0 hover:bg-[#F8FAEA]">
                          <td className="px-4 py-3.5 text-[14px] font-semibold">{flow.clientName ?? flow.ClientName ?? "N/A"}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[11.5px] font-bold capitalize ${
                                isExpense ? "bg-[#C0392B]/10 text-[#C0392B]" : "bg-[#074C3A]/10 text-[#074C3A]"
                              }`}
                            >
                              {flow.cashType}
                            </span>
                          </td>
                          <td className={`px-4 py-3.5 font-mono text-[13.5px] font-bold ${isExpense ? "text-[#C0392B]" : ""}`}>
                            {formatRs(flow.cashIn > 0 ? flow.cashIn : flow.cashOut)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* holding sheets */}
          <div className="fade-up rounded-[16px] border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)]" style={{ animationDelay: "320ms" }}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="m-0 font-display text-[17px] font-bold">Employee Holding Sheets</h3>
                <p className="m-0 mt-0.5 text-[13px] text-[#5C6B60]">Active hand-to-hand balances</p>
              </div>
              <button
                onClick={() => navigate("/admin/holding-sheet")}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#E3E5D6] px-3 py-1.5 text-[12px] font-bold text-[#074C3A] transition-colors hover:border-[#074C3A] hover:bg-[#074C3A]/5"
              >
                View More <ArrowOutIcon />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    {["From / To", "Type", "Amount"].map((h) => (
                      <th key={h} className="border-b border-[#E3E5D6] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#5C6B60]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(holdingData || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-[13px] text-[#5C6B60]">No holding sheet entries yet.</td>
                    </tr>
                  ) : (
                    holdingData.slice(0, 6).map((sheet, index) => (
                      <tr key={sheet.id || index} className="border-b border-[#E3E5D6] transition-colors last:border-b-0 hover:bg-[#F8FAEA]">
                        <td className="px-4 py-3.5">
                          <div className="text-[12.5px] text-[#5C6B60]">
                            F: {sheet.fromHolderName ?? sheet.FromHolderName ?? sheet.fromHolderId ?? sheet.FromHolderId ?? "Unknown"}
                          </div>
                          <div className="text-[14px] font-semibold">
                            T: {sheet.toHolderName ?? sheet.ToHolderName ?? sheet.toHolderId ?? sheet.ToHolderId ?? "Unknown"}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex rounded-full bg-[#E8A33D]/18 px-3 py-1 text-[11.5px] font-bold capitalize text-[#8a5a12]">
                            {sheet.entryType ?? sheet.EntryType ?? "Transfer"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[13.5px] font-bold">{formatRs(sheet.amount ?? sheet.Amount ?? 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* console footer line */}
        <p className="mt-8 text-center font-mono text-[11px] tracking-[0.16em] text-[#5C6B60]">
          WOWSEWA SYSTEM ANALYTICS · {isConnected ? "LIVE HUB CONNECTED" : "CONNECTING TO HUB"} · ALL FIGURES IN NPR
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;