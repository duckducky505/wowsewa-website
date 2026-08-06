import React, { useMemo, useState } from "react";
import "./CustomerDashboard.css";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";
import { useAuth } from "../../../context/AuthContext";

// ---- Helpers --------------------------------------------------------------

function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRs(value) {
  if (value === null || value === undefined) return "";
  return `Rs ${Number(value).toLocaleString()}`;
}

function statusClass(status) {
  if (!status) return "";
  return status.toLowerCase().replace(/\s+/g, "-");
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
      ? {
          name: raw.technician.name,
          rating: raw.technician.rating,
          phone: raw.technician.phone,
        }
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

  // Profile Fetch
  const { data: profileData, loading: profileLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/User/UserSpecificAccountInfo/${guidId}` : null
  );

  const { data: rawStages, loading: stagesLoading } = fetchHook(
    "https://localhost:7011/api/Booking/getBookingStatus"
  );

  const { data: rawPending, loading: pendingLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/upcoming/getUserSpecificBooking/${guidId}` : null
  );

  const { data: rawHistory, loading: historyLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/history/getUserSpecificBooking/${guidId}` : null
  );

  const { data: rawCancelled, loading: cancelledLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/cancelled/getUserSpecificBooking/${guidId}` : null
  );

  const stages = useMemo(
    () =>
      (rawStages || [])
        .map(normalizeStage)
        .filter((s) => s && s.toLowerCase() !== "cancelled"),
    [rawStages]
  );

  const pendingBookings = useMemo(
    () =>
      (rawPending || [])
        .map(normalizeBooking)
        .filter((b) => b && b.status?.toLowerCase() !== "cancelled"),
    [rawPending]
  );

  const historyBookings = useMemo(() => {
    const completed = (rawHistory || []).map(normalizeBooking).filter(Boolean);
    const cancelled = (rawCancelled || []).map(normalizeBooking).filter(Boolean);
    return [...completed, ...cancelled].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [rawHistory, rawCancelled]);

  const activeJob = useMemo(() => {
    if (pendingBookings.length === 0) return null;
    return [...pendingBookings].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];
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
      { label: "Upcoming", value: pendingBookings.length },
      { label: "Completed jobs", value: historyBookings.filter((b) => b.status?.toLowerCase() === "completed").length },
      { label: "This year, spent", value: formatRs(spent) },
    ];
  }, [pendingBookings, historyBookings]);

  const userProfile = useMemo(() => {
    if (!profileData) return null;
    return {
      name: profileData.name || profileData.fullName,
      email: profileData.emailAddress,
      memberSince: profileData.dateCreated
        ? new Date(profileData.dateCreated).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
        : null
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
      window.location.reload();
    } else {
      window.alert("Couldn't cancel this booking. Please try again.");
    }
  }

  return (
    <div className="wsw-dashboard">
      <header className="wsw-dashboard__header">
        <div className="wsw-dashboard__header-inner">
          <div className="wsw-dashboard__greeting">
            <span className="wsw-dashboard__eyebrow">Your account</span>
            <h1 className="wsw-dashboard__title">
              Welcome back{userProfile?.name ? `, ${userProfile.name.split(" ")[0]}` : ""}
            </h1>
            <p className="wsw-dashboard__subtitle">Here's what's happening with your services.</p>
          </div>
          <button type="button" className="wsw-dashboard__new-booking">
            + New booking
          </button>
        </div>
      </header>

      <div className="wsw-dashboard__body">
        <section className="wsw-dashboard__stats" aria-label="Account overview">
          {stats.map((s) => (
            <div className="wsw-dashboard__stat-card" key={s.label}>
              <span className="wsw-dashboard__stat-value">{s.value}</span>
              <span className="wsw-dashboard__stat-label">{s.label}</span>
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
                <section className="wsw-dashboard__panel" aria-label="Active job status">
                  <div className="wsw-dashboard__panel-head">
                    <h2 className="wsw-dashboard__panel-title">Active job</h2>
                    <span className="wsw-dashboard__job-code">{activeJob.code}</span>
                  </div>

                  <div className="wsw-dashboard__active-job">
                    <div className="wsw-dashboard__active-job-info">
                      <h3 className="wsw-dashboard__active-job-service">{activeJob.service}</h3>
                      <p className="wsw-dashboard__active-job-meta">
                        {activeJob.category && `${activeJob.category} · `}
                        {activeJob.date && `${activeJob.date}`}
                        {activeJob.slot && `, ${activeJob.slot}`}
                      </p>
                      <p className="wsw-dashboard__active-job-address">{activeJob.address}</p>
                    </div>

                    {activeJob.technician && activeJob.technician.name && (
                      <div className="wsw-dashboard__technician">
                        <span className="wsw-dashboard__technician-avatar">
                          {initials(activeJob.technician.name)}
                        </span>
                        <div>
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
                          <span className="wsw-dashboard__stage-dot" />
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
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "history"}
                    className={"wsw-dashboard__tab" + (tab === "history" ? " wsw-dashboard__tab--active" : "")}
                    onClick={() => setTab("history")}
                  >
                    History
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
                        <div className="wsw-dashboard__booking-main">
                          <span className="wsw-dashboard__booking-service">{b.service}</span>
                          <span className="wsw-dashboard__booking-meta">
                            {b.category && `${b.category} · `}
                            {b.date && `${b.date}`}
                            {b.slot && `, ${b.slot}`}
                          </span>
                          <span className="wsw-dashboard__booking-address">{b.address}</span>
                        </div>
                        <div className="wsw-dashboard__booking-side">
                          <span className={"wsw-dashboard__status wsw-dashboard__status--" + statusClass(b.status)}>
                            {b.status}
                          </span>
                          <button
                            type="button"
                            className="wsw-dashboard__link-btn"
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
                      <div className="wsw-dashboard__booking-main">
                        <span className="wsw-dashboard__booking-service">{b.service}</span>
                        <span className="wsw-dashboard__booking-meta">
                          {b.category && `${b.category} · `}
                          {b.date && `${b.date} · `}
                          {b.price && formatRs(b.price)}
                        </span>
                        <span className="wsw-dashboard__booking-code">{b.code}</span>
                      </div>
                      <div className="wsw-dashboard__booking-side">
                        <span className={"wsw-dashboard__status wsw-dashboard__status--" + statusClass(b.status)}>
                          {b.status}
                        </span>
                        {b.status?.toLowerCase() === "completed" && b.rated === null && !ratingDraft[b.code] && (
                          <RatingPicker value={0} onRate={(rating) => submitRating(b, rating)} />
                        )}
                        {b.status?.toLowerCase() === "completed" && (b.rated !== null || ratingDraft[b.code]) && (
                          <span className="wsw-dashboard__rated">★ {b.rated ?? ratingDraft[b.code]} rated</span>
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
                  <button type="button" className="wsw-dashboard__link-btn">
                    Edit profile
                  </button>
                </>
              ) : null}
            </section>

            <section className="wsw-dashboard__panel wsw-dashboard__panel--compact wsw-dashboard__panel--dark" aria-label="Support">
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