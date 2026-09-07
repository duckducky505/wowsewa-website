import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PageHead, Card, StatTile, Pill, Avatar, SectionLabel,
  LimeButton, GhostButton, useToast, ToastHost,
} from "../../../ui/ui";
import { fetchAPI } from "../../../utils/fetchAPI";
import { useAuth } from "../../../context/AuthContext";
import { useSignalR } from "../../../hooks/signalR";

/* ---- icons (same family as the rest of the console) -------------------- */
const Ic = (d) => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {d}
  </svg>
);
const CalIc = Ic(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9.5h18" /></>);
const CheckIc = Ic(<path d="m4 12.5 5 5L20 6.5" />);
const CoinIc = Ic(<><circle cx="12" cy="12" r="9" /><path d="M9 8.5h6M9 12h6M10 8.5c2.8 0 4 1.4 4 3.5s-1.2 3.5-4 3.5l4 3" /></>);
const StarIc = Ic(<path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8L12 3z" />);
const PhoneIc = Ic(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />);
const PinIc = Ic(<><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
const HeadsetIc = Ic(<><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" /></>);
const MailIc = Ic(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 6.5 8 6 8-6" /></>);

/* ---- helpers ------------------------------------------------------------ */
function formatRs(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}
function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function serviceTone(status) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "lime";
  if (s === "cancelled") return "red";
  return "amber";
}
function normalizeStage(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  return raw.stageName ?? raw.StageName ?? raw.name ?? raw.Name;
}
function normalizeBooking(raw) {
  if (!raw) return null;
  return {
    id: raw.bookingId,
    code: raw.bookingCode,
    service: raw.duty?.dutyName,
    category: raw.industry?.industryName,
    date: raw.preferredDate,
    slot: raw.preferredTime,
    address: raw.address,
    price: raw.price,
    status: raw.bookingStatus ?? raw.status,
    rated: raw.rating ?? raw.Rating,
    technician: raw.technician
      ? { name: raw.technician.name, rating: raw.technician.rating, phone: raw.technician.phone }
      : null,
  };
}

/* ================================================================== */
/*  CUSTOMER DASHBOARD                                                 */
/* ================================================================== */
export default function CustomerDashboard() {
  const { user } = useAuth();
  const guidId = user?.guidId ?? null;
  const { toasts, push } = useToast();
  const { connection, isConnected } = useSignalR() || {};

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [rawStages, setRawStages] = useState([]);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [rawPending, setRawPending] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [rawHistory, setRawHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [rawCancelled, setRawCancelled] = useState([]);
  const [cancelledLoading, setCancelledLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [ratingDraft, setRatingDraft] = useState({});

  const loadProfile = useCallback(async () => {
    if (!guidId) return;
    setProfileLoading(true);
    const res = await fetchAPI(`https://localhost:7011/api/User/UserSpecificAccountInfo/${guidId}`, "GET");
    setProfileData(res || null);
    setProfileLoading(false);
  }, [guidId]);

  const loadStages = useCallback(async () => {
    setStagesLoading(true);
    const res = await fetchAPI("https://localhost:7011/api/Booking/getBookingStatus", "GET");
    setRawStages(Array.isArray(res) ? res : []);
    setStagesLoading(false);
  }, []);

  const loadPending = useCallback(async () => {
    if (!guidId) return;
    setPendingLoading(true);
    const res = await fetchAPI(`https://localhost:7011/api/Booking/upcoming/getUserSpecificBooking/${guidId}`, "GET");
    setRawPending(Array.isArray(res) ? res : []);
    setPendingLoading(false);
  }, [guidId]);

  const loadHistory = useCallback(async () => {
    if (!guidId) return;
    setHistoryLoading(true);
    const res = await fetchAPI(`https://localhost:7011/api/Booking/history/getUserSpecificBooking/${guidId}`, "GET");
    setRawHistory(Array.isArray(res) ? res : []);
    setHistoryLoading(false);
  }, [guidId]);

  const loadCancelled = useCallback(async () => {
    if (!guidId) return;
    setCancelledLoading(true);
    const res = await fetchAPI(`https://localhost:7011/api/Booking/cancelled/getUserSpecificBooking/${guidId}`, "GET");
    setRawCancelled(Array.isArray(res) ? res : []);
    setCancelledLoading(false);
  }, [guidId]);

  const refreshBookings = useCallback(() => {
    loadPending();
    loadHistory();
    loadCancelled();
  }, [loadPending, loadHistory, loadCancelled]);

  useEffect(() => {
    loadProfile();
    loadStages();
    refreshBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidId]);

  // Live updates from the receptionist/admin side (assignment, status, cancellation).
useEffect(() => {
  if (!connection || !isConnected || !guidId) return;
  const handleEntityUpdate = (payload) => {
    if (payload?.entityType !== "Booking") return;
    refreshBookings();
  };
  connection.on("EntityUpdated", handleEntityUpdate);
  return () => connection.off("EntityUpdated", handleEntityUpdate);
}, [connection, isConnected, guidId, refreshBookings]);



  const stages = useMemo(
    () => (rawStages || []).map(normalizeStage).filter((s) => s && s.toLowerCase() !== "cancelled"),
    [rawStages]
  );
  const pendingBookings = useMemo(
    () => (rawPending || []).map(normalizeBooking).filter((b) => b && b.status?.toLowerCase() !== "cancelled"),
    [rawPending]
  );
  const historyBookings = useMemo(() => {
    const completed = (rawHistory || []).map(normalizeBooking).filter(Boolean);
    const cancelled = (rawCancelled || []).map(normalizeBooking).filter(Boolean);
    return [...completed, ...cancelled].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawHistory, rawCancelled]);

  const activeJob = useMemo(() => {
    if (pendingBookings.length === 0) return null;
    return [...pendingBookings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [pendingBookings]);

  const activeStageIndex = useMemo(() => {
    if (!activeJob || !activeJob.status) return 0;
    const idx = stages.findIndex((s) => s.toLowerCase() === activeJob.status.toLowerCase());
    return idx === -1 ? 0 : idx;
  }, [activeJob, stages]);
  const progressPct = stages.length > 1 ? Math.min(100, Math.round((activeStageIndex / (stages.length - 1)) * 100)) : 0;

  const completedCount = historyBookings.filter((b) => b.status?.toLowerCase() === "completed").length;
  const spentThisYear = useMemo(() => {
    return historyBookings
      .filter((b) => b.status?.toLowerCase() === "completed" && b.date && new Date(b.date).getFullYear() === new Date().getFullYear())
      .reduce((sum, b) => sum + Number(b.price || 0), 0);
  }, [historyBookings]);
  const avgRating = useMemo(() => {
    const rated = historyBookings.filter((b) => b.rated != null && b.rated > 0);
    if (rated.length === 0) return null;
    return (rated.reduce((s, b) => s + Number(b.rated), 0) / rated.length).toFixed(1);
  }, [historyBookings]);

  const first = (profileData?.name || profileData?.fullName || user?.name || "neighbour").split(" ")[0];

  async function submitRating(booking, rating) {
    setRatingDraft((prev) => ({ ...prev, [booking.code]: rating }));
    const res = await fetchAPI(
      `https://localhost:7011/api/Booking/updateBookingDetails/${booking.id}`,
      "PATCH",
      [{ op: "replace", path: "/rating", value: rating }]
    );
    if (res) {
      push(`Thanks! You rated ${booking.code} ${rating}★`);
    } else {
      push("Couldn't save your rating — try again", "red");
      setRatingDraft((prev) => ({ ...prev, [booking.code]: 0 }));
    }
  }

  async function handleCancelBooking(booking) {
    if (!window.confirm(`Cancel your ${booking.service} booking?`)) return;
    setCancellingId(booking.id);
    const res = await fetchAPI(`https://localhost:7011/api/Booking/deleteBooking/${booking.id}`, "DELETE");
    setCancellingId(null);
    if (res) {
      push(`Booking ${booking.code} cancelled`);
      refreshBookings();
    } else {
      push("Couldn't cancel this booking — try again", "red");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[72rem] px-4 py-6 sm:px-6 lg:px-8">
      <PageHead
        eyebrow={`Workspace · ${new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}${isConnected ? " · Live" : ""}`}
        title={`Namaste, ${first} 👋`}
        sub="Your home, handled. Here's what's coming up and what WowSewa has done for you lately."
      >
        <LimeButton onClick={() => { window.location.hash = "#/console/customer/booking"; }}>
          <CalIc className="h-4 w-4" /> Book a service
        </LimeButton>
      </PageHead>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Upcoming" value={pendingBookings.length} icon={CalIc} tone="lime" />
        <StatTile label="Completed" value={completedCount} icon={CheckIc} tone="pine" />
        <StatTile label="Spent this year" value={spentThisYear} prefix="Rs. " icon={CoinIc} tone="teal" />
        <StatTile label="Avg rating given" value={avgRating ? Number(avgRating) : 0} count={false} suffix="★" icon={StarIc} tone="amber" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* next visit — live timeline */}
        <Card className="relative overflow-hidden p-6">
          <span className="absolute inset-y-0 left-0 w-1 bg-[#D1FE17]" aria-hidden="true" />
          {pendingLoading || stagesLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-[#ECEEE0]" />
              <div className="h-14 w-full animate-pulse rounded bg-[#ECEEE0]" />
              <div className="h-2 w-full animate-pulse rounded-full bg-[#ECEEE0]" />
            </div>
          ) : activeJob ? (
            <>
              <div className="flex items-center justify-between">
                <SectionLabel>Next visit</SectionLabel>
                <Pill tone="amber" pulse>{activeJob.status || "In progress"}</Pill>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <Avatar name={activeJob.technician?.name || "?"} size="h-14 w-14 text-[17px]" />
                <div>
                  <p className="font-display text-xl font-extrabold text-[#010A08]">{activeJob.service}</p>
                  <p className="text-[13px] text-[#5C6B60]">
                    {activeJob.technician?.name ? `${activeJob.technician.name} · ` : "Technician not yet assigned · "}
                    {activeJob.date && fmtDate(activeJob.date)}{activeJob.slot && `, ${activeJob.slot}`}
                  </p>
                  {activeJob.address && <p className="mt-0.5 text-[12px] text-[#9aa89d]">📍 {activeJob.address}</p>}
                </div>
              </div>
              {stages.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#5C6B60]">
                    {stages.map((s, i) => (
                      <span key={s} className={i === activeStageIndex ? "text-[#074C3A]" : ""}>{s}</span>
                    ))}
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F0F2E2]">
                    <div className="h-full rounded-full bg-[#074C3A] transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {activeJob.technician?.phone && (
                  <GhostButton onClick={() => { window.location.href = `tel:${activeJob.technician.phone.replace(/[^\d+]/g, "")}`; }}>
                    <PhoneIc className="h-4 w-4" /> Call technician
                  </GhostButton>
                )}
                {activeJob.address && (
                  <GhostButton onClick={() => push("Live location shared")}><PinIc className="h-4 w-4" /> Track on map</GhostButton>
                )}
                <GhostButton
                  className="border-[#C0392B] text-[#C0392B] hover:bg-[rgba(192,57,43,0.08)]"
                  onClick={() => handleCancelBooking(activeJob)}
                  disabled={cancellingId === activeJob.id}
                >
                  {cancellingId === activeJob.id ? "Cancelling…" : "Cancel booking"}
                </GhostButton>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="font-display text-lg font-extrabold text-[#010A08]">No upcoming visits</p>
              <p className="mt-1 max-w-xs text-[13px] text-[#5C6B60]">Book a service and it'll show up here with live status updates.</p>
              <LimeButton className="mt-4" onClick={() => { window.location.hash = "#/console/customer/booking"; }}>Book a service</LimeButton>
            </div>
          )}
        </Card>

        {/* profile + recent */}
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <SectionLabel>Account</SectionLabel>
            {profileLoading ? (
              <div className="h-14 w-full animate-pulse rounded bg-[#ECEEE0]" />
            ) : (
              <div className="flex items-center gap-3.5">
                <Avatar name={profileData?.name || profileData?.fullName || "WS"} size="h-12 w-12 text-[15px]" />
                <div className="min-w-0">
                  <p className="truncate font-display text-[15px] font-extrabold text-[#010A08]">{profileData?.name || profileData?.fullName || "—"}</p>
                  <p className="truncate text-[12px] text-[#5C6B60]">{profileData?.phoneNumber || profileData?.phone || profileData?.emailAddress || ""}</p>
                </div>
              </div>
            )}
          </Card>
          <Card className="flex-1 p-5">
            <SectionLabel>Recent activity</SectionLabel>
            {historyLoading || cancelledLoading ? (
              <ul className="space-y-3">
                {[0, 1, 2].map((i) => <li key={i} className="h-9 w-full animate-pulse rounded bg-[#ECEEE0]" />)}
              </ul>
            ) : historyBookings.length > 0 ? (
              <ul className="space-y-3">
                {historyBookings.slice(0, 5).map((b) => (
                  <li key={b.code} className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: { lime: "#9db800", amber: "#E8A33D", red: "#C0392B" }[serviceTone(b.status)] }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-bold text-[#010A08]">{b.service}</p>
                      <p className="text-[11.5px] text-[#5C6B60]">{b.status} · {formatRs(b.price)}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#9aa89d]">{fmtDate(b.date)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-[12.5px] text-[#9aa89d]">Nothing here yet.</p>
            )}
          </Card>
        </div>
      </div>

      {/* upcoming list + rate completed jobs */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <SectionLabel>Upcoming bookings</SectionLabel>
          {pendingLoading ? (
            <div className="h-24 w-full animate-pulse rounded bg-[#ECEEE0]" />
          ) : pendingBookings.length > 0 ? (
            <ul className="divide-y divide-[#E3E5D6]">
              {pendingBookings.map((b) => (
                <li key={b.code} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-[#010A08]">{b.service}</p>
                    <p className="text-[11.5px] text-[#5C6B60]">{fmtDate(b.date)}{b.slot && `, ${b.slot}`} · {b.category}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <Pill tone={serviceTone(b.status)}>{b.status}</Pill>
                    <button
                      onClick={() => handleCancelBooking(b)}
                      disabled={cancellingId === b.id}
                      className="font-mono text-[11px] font-bold text-[#C0392B] hover:underline disabled:opacity-50"
                    >
                      {cancellingId === b.id ? "…" : "Cancel"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-[12.5px] text-[#9aa89d]">No upcoming bookings.</p>
          )}
        </Card>

        <Card className="p-5">
          <SectionLabel>Rate completed jobs</SectionLabel>
          {historyLoading ? (
            <div className="h-24 w-full animate-pulse rounded bg-[#ECEEE0]" />
          ) : (
            (() => {
              const toRate = historyBookings.filter((b) => b.status?.toLowerCase() === "completed" && b.rated == null && !ratingDraft[b.code]);
              return toRate.length > 0 ? (
                <ul className="divide-y divide-[#E3E5D6]">
                  {toRate.map((b) => (
                    <li key={b.code} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-bold text-[#010A08]">{b.service}</p>
                        <p className="text-[11.5px] text-[#5C6B60]">{fmtDate(b.date)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => submitRating(b, n)} aria-label={`${n} star`} className="transition-transform duration-150 hover:scale-125">
                            <StarIc className="h-4.5 w-4.5 text-[#d8dcc8]" style={{ width: "1.05rem", height: "1.05rem" }} />
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-[12.5px] text-[#9aa89d]">All caught up — nothing to rate.</p>
              );
            })()
          )}
        </Card>
      </div>

      {/* support strip */}
      <Card className="relative mt-5 overflow-hidden bg-[#074C3A] p-6 text-[#F8FAEA]">
        <span className="absolute inset-y-0 left-0 w-1 bg-[#D1FE17]" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <HeadsetIc className="h-7 w-7 text-[#D1FE17]" />
            <div>
              <p className="font-display text-lg font-extrabold">Need a hand?</p>
              <p className="text-[13px] text-[#F8FAEA]/70">Booking changes, billing, or complaints — 7am to 9pm, every day.</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <GhostButton className="border-[rgba(248,250,234,0.3)] text-[#F8FAEA] hover:bg-[rgba(248,250,234,0.1)]" onClick={() => { window.location.href = "tel:+97714445566"; }}>
              <PhoneIc className="h-4 w-4" /> Call support
            </GhostButton>
            <GhostButton className="border-[rgba(248,250,234,0.3)] text-[#F8FAEA] hover:bg-[rgba(248,250,234,0.1)]" onClick={() => { window.location.href = "mailto:help@wowsewa.com"; }}>
              <MailIc className="h-4 w-4" /> Email us
            </GhostButton>
          </div>
        </div>
      </Card>

      <ToastHost toasts={toasts} />
    </div>
  );
}