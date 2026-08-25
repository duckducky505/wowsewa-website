import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./CustomerDashboard.css";
import { fetchAPI } from "../../../utils/fetchAPI";
import { useAuth } from "../../../context/AuthContext";
import { useSignalR } from "../../../hooks/signalR";

// ---- Helpers (unchanged) ---------------------------------------------------

function initials(name) {
  if (!name) return "";
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
function formatRs(value) {
  if (value === null || value === undefined) return "";
  return `Rs ${Number(value).toLocaleString()}`;
}
function statusClass(status) {
  if (!status) return "";
  return status.toLowerCase().replace(/\s+/g, "-");
}
function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function serviceGlyph(name = "") {
  const s = name.toLowerCase();
  if (/plumb|pipe|water|tank|leak|drain/.test(s)) return "💧";
  if (/electric|wiring|light|fan|power|volt/.test(s)) return "⚡";
  if (/clean|sanitiz|mop|sweep/.test(s)) return "✦";
  if (/paint|polish|distemper/.test(s)) return "🖌";
  if (/carpent|furniture|wood|door/.test(s)) return "🔨";
  if (/\bac\b|hvac|heat|cool|fridge/.test(s)) return "❄";
  return "🔧";
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

// ---- Component --------------------------------------------------------------

export default function CustomerDashboard() {
  const { user } = useAuth();
  const guidId = user?.guidId ?? null;

  const [tab, setTab] = useState("upcoming");
  const [ratingDraft, setRatingDraft] = useState({});
  const [cancellingId, setCancellingId] = useState(null);

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

  const { connection, isConnected } = useSignalR() || {};

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

  // Live updates: technician assignment, status changes, or cancellations
  // made from the receptionist/admin side reflect here immediately.
  useEffect(() => {
    if (!connection || !isConnected || !guidId) return;

    const handleBookingUpdate = () => refreshBookings();

    connection.on("BookingUpdated", handleBookingUpdate);

    return () => {
      connection.off("BookingUpdated", handleBookingUpdate);
    };
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

  const stats = useMemo(() => {
    const completedThisYear = historyBookings.filter((b) => {
      if (b.status?.toLowerCase() !== "completed") return false;
      if (!b.date) return false;
      return new Date(b.date).getFullYear() === new Date().getFullYear();
    });
    const spent = completedThisYear.reduce((sum, b) => sum + Number(b.price || 0), 0);

    return [
      { icon: "📅", label: "Upcoming", value: pendingBookings.length },
      { icon: "✓", label: "Completed jobs", value: historyBookings.filter((b) => b.status?.toLowerCase() === "completed").length },
      { icon: "₨", label: "Spent this year", value: formatRs(spent) },
    ];
  }, [pendingBookings, historyBookings]);

  const userProfile = useMemo(() => {
    if (!profileData) return null;
    return {
      name: profileData.name || profileData.fullName,
      email: profileData.emailAddress,
      phone: profileData.phoneNumber || profileData.phone,
      memberSince: profileData.dateCreated
        ? new Date(profileData.dateCreated).toLocaleDateString(undefined, { year: "numeric", month: "short" })
        : null,
    };
  }, [profileData]);

  const isLoadingUpcoming = pendingLoading || stagesLoading;
  const isLoadingHistory = historyLoading || cancelledLoading;

  async function submitRating(booking, rating) {
    setRatingDraft((prev) => ({ ...prev, [booking.code]: rating }));
    const res = await fetchAPI(
      `https://localhost:7011/api/Booking/updateBookingDetails/${booking.id}`,
      "PATCH",
      [{ op: "replace", path: "/rating", value: rating }]
    );
    if (!res) {
      window.alert("Couldn't save your rating. Please try again.");
      setRatingDraft((prev) => ({ ...prev, [booking.code]: 0 }));
    }
  }

  async function handleCancelBooking(booking) {
    if (!window.confirm(`Cancel your ${booking.service} booking?`)) return;
    setCancellingId(booking.id);
    const res = await fetchAPI(`https://localhost:7011/api/Booking/deleteBooking/${booking.id}`, "DELETE");
    setCancellingId(null);

    if (res) {
      refreshBookings();
    } else {
      window.alert("Couldn't cancel this booking. Please try again.");
    }
  }

  return (
    <div className="wsw-dashboard">
      <header className="wsw-dashboard__header">
        <div className="wsw-dashboard__header-glow" aria-hidden="true" />
        <div className="wsw-dashboard__header-inner">
          <div className="wsw-dashboard__greeting">
            <span className="wsw-dashboard__eyebrow">
              <span className="wsw-dashboard__eyebrow-dot" />
              Your account
              {isConnected && <span className="wsw-dashboard__live-tag">Live</span>}
            </span>
            <h1 className="wsw-dashboard__title">
              Welcome back{userProfile?.name ? `, ${userProfile.name.split(" ")[0]}` : ""}
            </h1>
            <p className="wsw-dashboard__subtitle">Here's what's happening with your services.</p>
          </div>
        </div>
      </header>

      <div className="wsw-dashboard__body">
        <section className="wsw-dashboard__stats" aria-label="Account overview">
          {stats.map((s) => (
            <div className="wsw-dashboard__stat-card" key={s.label}>
              <span className="wsw-dashboard__stat-icon">{s.icon}</span>
              <div>
                <span className="wsw-dashboard__stat-value">{s.value}</span>
                <span className="wsw-dashboard__stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="wsw-dashboard__grid">
          <div className="wsw-dashboard__main">
            {isLoadingUpcoming ? (
              <section className="wsw-dashboard__panel" aria-label="Loading">
                <p className="wsw-dashboard__loading-note">Loading your bookings…</p>
              </section>
            ) : (
              activeJob && (
                <section className="wsw-dashboard__panel wsw-dashboard__panel--active" aria-label="Active job status">
                  <div className="wsw-dashboard__panel-head">
                    <h2 className="wsw-dashboard__panel-title">
                      <span className="wsw-dashboard__live-pill">
                        <span className="wsw-dashboard__live-dot" />
                        Live
                      </span>
                      Active job
                    </h2>
                    <span className="wsw-dashboard__job-code">{activeJob.code}</span>
                  </div>

                  <div className="wsw-dashboard__active-job">
                    <div className="wsw-dashboard__active-job-info">
                      <div className="wsw-dashboard__active-job-service-row">
                        <span className="wsw-dashboard__service-glyph">{serviceGlyph(activeJob.service)}</span>
                        <div>
                          <h3 className="wsw-dashboard__active-job-service">{activeJob.service}</h3>
                          <p className="wsw-dashboard__active-job-meta">
                            {activeJob.category && `${activeJob.category} · `}
                            {activeJob.date && `${fmtDate(activeJob.date)}`}
                            {activeJob.slot && `, ${activeJob.slot}`}
                          </p>
                        </div>
                      </div>
                      {activeJob.address && (
                        <p className="wsw-dashboard__active-job-address">📍 {activeJob.address}</p>
                      )}
                    </div>

                    {activeJob.technician && activeJob.technician.name && (
                      <div className="wsw-dashboard__technician">
                        <span className="wsw-dashboard__technician-avatar">
                          {initials(activeJob.technician.name)}
                        </span>
                        <div className="wsw-dashboard__technician-info">
                          <p className="wsw-dashboard__technician-role">Technician</p>
                          <p className="wsw-dashboard__technician-name">{activeJob.technician.name}</p>
                          {activeJob.technician.rating && (
                            <p className="wsw-dashboard__technician-rating">★ {activeJob.technician.rating}</p>
                          )}
                        </div>
                        {activeJob.technician.phone && (
                          <a
                            className="wsw-dashboard__technician-call"
                            href={`tel:${activeJob.technician.phone.replace(/[^\d+]/g, "")}`}
                          >
                            Call
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {stages.length > 0 && (
                    <ol className="wsw-dashboard__stage-tracker" aria-label="Job progress">
                      {stages.map((stage, i) => (
                        <li
                          key={stage}
                          className={
                            "wsw-dashboard__stage" +
                            (i < activeStageIndex ? " wsw-dashboard__stage--done" : "") +
                            (i === activeStageIndex ? " wsw-dashboard__stage--current" : "")
                          }
                        >
                          <span className="wsw-dashboard__stage-dot">
                            {i < activeStageIndex && "✓"}
                          </span>
                          <span className="wsw-dashboard__stage-label">{stage}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              )
            )}

            <section className="wsw-dashboard__panel" aria-label="Bookings">
              <div className="wsw-dashboard__panel-head">
                <h2 className="wsw-dashboard__panel-title">Bookings</h2>
                <div className="wsw-dashboard__tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "upcoming"}
                    className={"wsw-dashboard__tab" + (tab === "upcoming" ? " wsw-dashboard__tab--active" : "")}
                    onClick={() => setTab("upcoming")}
                  >
                    Upcoming
                    <span className="wsw-dashboard__tab-count">{pendingBookings.length}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "history"}
                    className={"wsw-dashboard__tab" + (tab === "history" ? " wsw-dashboard__tab--active" : "")}
                    onClick={() => setTab("history")}
                  >
                    History
                    <span className="wsw-dashboard__tab-count">{historyBookings.length}</span>
                  </button>
                </div>
              </div>

              {tab === "upcoming" ? (
                isLoadingUpcoming ? (
                  <p className="wsw-dashboard__loading-note">Loading upcoming bookings…</p>
                ) : pendingBookings.length > 0 ? (
                  <ul className="wsw-dashboard__booking-list">
                    {pendingBookings.map((b) => (
                      <li className="wsw-dashboard__booking-row" key={b.code}>
                        <span className="wsw-dashboard__row-glyph">{serviceGlyph(b.service)}</span>
                        <div className="wsw-dashboard__booking-main">
                          <span className="wsw-dashboard__booking-service">{b.service}</span>
                          <span className="wsw-dashboard__booking-meta">
                            {b.category && `${b.category} · `}
                            {b.date && `${fmtDate(b.date)}`}
                            {b.slot && `, ${b.slot}`}
                          </span>
                          {b.address && <span className="wsw-dashboard__booking-address">📍 {b.address}</span>}
                        </div>
                        <div className="wsw-dashboard__booking-side">
                          <span className={"wsw-dashboard__status wsw-dashboard__status--" + statusClass(b.status)}>
                            {b.status}
                          </span>
                          <button
                            type="button"
                            className="wsw-dashboard__link-btn wsw-dashboard__link-btn--danger"
                            onClick={() => handleCancelBooking(b)}
                            disabled={cancellingId === b.id}
                          >
                            {cancellingId === b.id ? "Cancelling…" : "Cancel"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    title="No upcoming bookings"
                    body="When you book a service, it'll show up here with live status updates."
                  />
                )
              ) : isLoadingHistory ? (
                <p className="wsw-dashboard__loading-note">Loading history…</p>
              ) : historyBookings.length > 0 ? (
                <ul className="wsw-dashboard__booking-list">
                  {historyBookings.map((b) => (
                    <li className="wsw-dashboard__booking-row" key={b.code}>
                      <span className="wsw-dashboard__row-glyph">{serviceGlyph(b.service)}</span>
                      <div className="wsw-dashboard__booking-main">
                        <span className="wsw-dashboard__booking-service">{b.service}</span>
                        <span className="wsw-dashboard__booking-meta">
                          {b.category && `${b.category} · `}
                          {b.date && `${fmtDate(b.date)} · `}
                          {b.price && formatRs(b.price)}
                        </span>
                        <span className="wsw-dashboard__booking-code">{b.code}</span>
                      </div>
                      <div className="wsw-dashboard__booking-side">
                        <span className={"wsw-dashboard__status wsw-dashboard__status--" + statusClass(b.status)}>
                          {b.status}
                        </span>
                        {b.status?.toLowerCase() === "completed" && b.rated == null && !ratingDraft[b.code] && (
                          <RatingPicker value={0} onRate={(rating) => submitRating(b, rating)} />
                        )}
                        {b.status?.toLowerCase() === "completed" && (b.rated != null || ratingDraft[b.code]) && (
                          <span className="wsw-dashboard__rated">★ {b.rated ?? ratingDraft[b.code]}/5</span>
                        )}
                        {b.status?.toLowerCase() === "completed" && (
                          <button type="button" className="wsw-dashboard__link-btn">
                            Rebook
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No past bookings" body="Completed and cancelled bookings will show up here." />
              )}
            </section>
          </div>

          <aside className="wsw-dashboard__side">
            <section className="wsw-dashboard__panel wsw-dashboard__panel--compact" aria-label="Account details">
              <h2 className="wsw-dashboard__panel-title">Account</h2>
              {profileLoading ? (
                <p className="wsw-dashboard__loading-note">Loading profile...</p>
              ) : userProfile ? (
                <>
                  <div className="wsw-dashboard__profile">
                    <span className="wsw-dashboard__profile-avatar">{initials(userProfile.name)}</span>
                    <div>
                      {userProfile.name && <p className="wsw-dashboard__profile-name">{userProfile.name}</p>}
                      {userProfile.memberSince && (
                        <p className="wsw-dashboard__profile-since">Customer since {userProfile.memberSince}</p>
                      )}
                    </div>
                  </div>
                  <dl className="wsw-dashboard__detail-list">
                    {userProfile.phone && (
                      <div className="wsw-dashboard__detail-item">
                        <dt>Phone</dt>
                        <dd>{userProfile.phone}</dd>
                      </div>
                    )}
                    {userProfile.email && (
                      <div className="wsw-dashboard__detail-item">
                        <dt>Email</dt>
                        <dd>{userProfile.email}</dd>
                      </div>
                    )}
                  </dl>
                  <button type="button" className="wsw-dashboard__link-btn wsw-dashboard__link-btn--block">
                    Edit profile
                  </button>
                </>
              ) : null}
            </section>

            <section
              className="wsw-dashboard__panel wsw-dashboard__panel--compact wsw-dashboard__panel--dark"
              aria-label="Support"
            >
              <span className="wsw-dashboard__support-tag">24/7 support</span>
              <h2 className="wsw-dashboard__panel-title">Need help?</h2>
              <p className="wsw-dashboard__support-copy">
                Reach our support team for booking changes, billing questions or complaints.
              </p>
              <div className="wsw-dashboard__support-actions">
                <a className="wsw-dashboard__support-btn" href="tel:+97714445566">
                  Call support
                </a>
                <a className="wsw-dashboard__support-btn wsw-dashboard__support-btn--ghost" href="mailto:help@wowsewa.com">
                  Email us
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ---- Subcomponents --------------------------------------------------------------

function EmptyState({ title, body }) {
  return (
    <div className="wsw-dashboard__empty">
      <span className="wsw-dashboard__empty-glyph">🗂</span>
      <p className="wsw-dashboard__empty-title">{title}</p>
      <p className="wsw-dashboard__empty-body">{body}</p>
    </div>
  );
}

function RatingPicker({ value, onRate }) {
  return (
    <div className="wsw-dashboard__rating-picker" role="radiogroup" aria-label="Rate this service">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={value === n}
          className={"wsw-dashboard__rating-star" + (n <= value ? " wsw-dashboard__rating-star--filled" : "")}
          onClick={() => onRate(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}