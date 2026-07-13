import React, { useMemo, useState } from "react";
import "./CustomerDashboard.css";

// ---- Mock data --------------------------------------------------------------
// In production these come from the API — shaped here to match that contract.

const CUSTOMER = {
  name: "Sagar Thapa",
  phone: "+977 98‑1234‑5678",
  email: "sagar.thapa@example.com",
  memberSince: "Mar 2024",
};

const ADDRESSES = [
  { id: "addr-1", label: "Home", address: "Baneshwor Height, Kathmandu", primary: true },
  { id: "addr-2", label: "Office", address: "Durbar Marg, Kathmandu", primary: false },
];

const ACTIVE_JOB = {
  code: "WS-ELC-7734",
  service: "Switchboard installation",
  category: "Electrical",
  address: "Baneshwor Height, Kathmandu",
  date: "Today",
  slot: "2:00 PM – 4:00 PM",
  technician: { name: "Bikash Rai", rating: 4.9, phone: "+977 98‑7654‑3210" },
  stage: 2, // index into JOB_STAGES
};

const JOB_STAGES = ["Booked", "Confirmed", "Technician en route", "In progress", "Completed"];

const UPCOMING_BOOKINGS = [
  {
    code: "WS-ELC-7734",
    service: "Switchboard installation",
    category: "Electrical",
    date: "Today",
    slot: "2:00 PM – 4:00 PM",
    status: "En route",
    address: "Baneshwor Height, Kathmandu",
  },
  {
    code: "WS-APL-2210",
    service: "AC installation",
    category: "Home Appliances",
    date: "Fri, Jul 17",
    slot: "10:00 AM – 12:00 PM",
    status: "Confirmed",
    address: "Baneshwor Height, Kathmandu",
  },
];

const BOOKING_HISTORY = [
  {
    code: "WS-PLB-1182",
    service: "Leak repair",
    category: "Plumbing",
    date: "Jun 28, 2026",
    price: "Rs 850",
    status: "Completed",
    rated: 5,
  },
  {
    code: "WS-ITD-9043",
    service: "Wi‑Fi / network setup",
    category: "IT Devices",
    date: "Jun 12, 2026",
    price: "Rs 800",
    status: "Completed",
    rated: 4,
  },
  {
    code: "WS-APL-5521",
    service: "Refrigerator repair",
    category: "Home Appliances",
    date: "May 30, 2026",
    price: "Rs 1,000",
    status: "Completed",
    rated: null,
  },
  {
    code: "WS-ELC-3387",
    service: "Fan / light installation",
    category: "Electrical",
    date: "May 09, 2026",
    price: "Rs 500",
    status: "Cancelled",
    rated: null,
  },
];

const STATS = [
  { label: "Upcoming", value: UPCOMING_BOOKINGS.length },
  { label: "Completed jobs", value: 11 },
  { label: "This year, spent", value: "Rs 9,450" },
  { label: "Saved addresses", value: ADDRESSES.length },
];

// ---- Helpers --------------------------------------------------------------

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---- Component --------------------------------------------------------------

export default function CustomerDashboard() {
  const [tab, setTab] = useState("upcoming");
  const [ratingDraft, setRatingDraft] = useState({});

  const historyRated = useMemo(
    () => BOOKING_HISTORY.filter((b) => b.status === "Completed" && b.rated === null),
    []
  );

  return (
    <div className="wsw-dashboard">
      <header className="wsw-dashboard__header">
        <div className="wsw-dashboard__header-inner">
          <div className="wsw-dashboard__greeting">
            <span className="wsw-dashboard__eyebrow">Your account</span>
            <h1 className="wsw-dashboard__title">Welcome back, {CUSTOMER.name.split(" ")[0]}</h1>
            <p className="wsw-dashboard__subtitle">
              Here's what's happening with your services.
            </p>
          </div>
          <button type="button" className="wsw-dashboard__new-booking">
            + New booking
          </button>
        </div>
      </header>

      <div className="wsw-dashboard__body">
        <section className="wsw-dashboard__stats" aria-label="Account overview">
          {STATS.map((s) => (
            <div className="wsw-dashboard__stat-card" key={s.label}>
              <span className="wsw-dashboard__stat-value">{s.value}</span>
              <span className="wsw-dashboard__stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        <div className="wsw-dashboard__grid">
          <div className="wsw-dashboard__main">
            {ACTIVE_JOB && (
              <section className="wsw-dashboard__panel" aria-label="Active job status">
                <div className="wsw-dashboard__panel-head">
                  <h2 className="wsw-dashboard__panel-title">Active job</h2>
                  <span className="wsw-dashboard__job-code">{ACTIVE_JOB.code}</span>
                </div>

                <div className="wsw-dashboard__active-job">
                  <div className="wsw-dashboard__active-job-info">
                    <h3 className="wsw-dashboard__active-job-service">{ACTIVE_JOB.service}</h3>
                    <p className="wsw-dashboard__active-job-meta">
                      {ACTIVE_JOB.category} · {ACTIVE_JOB.date}, {ACTIVE_JOB.slot}
                    </p>
                    <p className="wsw-dashboard__active-job-address">{ACTIVE_JOB.address}</p>
                  </div>

                  <div className="wsw-dashboard__technician">
                    <span className="wsw-dashboard__technician-avatar">
                      {initials(ACTIVE_JOB.technician.name)}
                    </span>
                    <div>
                      <p className="wsw-dashboard__technician-name">{ACTIVE_JOB.technician.name}</p>
                      <p className="wsw-dashboard__technician-rating">★ {ACTIVE_JOB.technician.rating}</p>
                    </div>
                    <a
                      className="wsw-dashboard__technician-call"
                      href={`tel:${ACTIVE_JOB.technician.phone.replace(/[^\d+]/g, "")}`}
                    >
                      Call
                    </a>
                  </div>
                </div>

                <ol className="wsw-dashboard__stage-tracker" aria-label="Job progress">
                  {JOB_STAGES.map((stage, i) => (
                    <li
                      key={stage}
                      className={
                        "wsw-dashboard__stage" +
                        (i < ACTIVE_JOB.stage ? " wsw-dashboard__stage--done" : "") +
                        (i === ACTIVE_JOB.stage ? " wsw-dashboard__stage--current" : "")
                      }
                    >
                      <span className="wsw-dashboard__stage-dot" />
                      <span className="wsw-dashboard__stage-label">{stage}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="wsw-dashboard__panel" aria-label="Bookings">
              <div className="wsw-dashboard__panel-head">
                <h2 className="wsw-dashboard__panel-title">Bookings</h2>
                <div className="wsw-dashboard__tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "upcoming"}
                    className={
                      "wsw-dashboard__tab" + (tab === "upcoming" ? " wsw-dashboard__tab--active" : "")
                    }
                    onClick={() => setTab("upcoming")}
                  >
                    Upcoming
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "history"}
                    className={
                      "wsw-dashboard__tab" + (tab === "history" ? " wsw-dashboard__tab--active" : "")
                    }
                    onClick={() => setTab("history")}
                  >
                    History
                  </button>
                </div>
              </div>

              {tab === "upcoming" ? (
                UPCOMING_BOOKINGS.length > 0 ? (
                  <ul className="wsw-dashboard__booking-list">
                    {UPCOMING_BOOKINGS.map((b) => (
                      <li className="wsw-dashboard__booking-row" key={b.code}>
                        <div className="wsw-dashboard__booking-main">
                          <span className="wsw-dashboard__booking-service">{b.service}</span>
                          <span className="wsw-dashboard__booking-meta">
                            {b.category} · {b.date}, {b.slot}
                          </span>
                          <span className="wsw-dashboard__booking-address">{b.address}</span>
                        </div>
                        <div className="wsw-dashboard__booking-side">
                          <span
                            className={
                              "wsw-dashboard__status wsw-dashboard__status--" +
                              b.status.toLowerCase().replace(/\s+/g, "-")
                            }
                          >
                            {b.status}
                          </span>
                          <button type="button" className="wsw-dashboard__link-btn">
                            Manage
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
              ) : (
                <ul className="wsw-dashboard__booking-list">
                  {BOOKING_HISTORY.map((b) => (
                    <li className="wsw-dashboard__booking-row" key={b.code}>
                      <div className="wsw-dashboard__booking-main">
                        <span className="wsw-dashboard__booking-service">{b.service}</span>
                        <span className="wsw-dashboard__booking-meta">
                          {b.category} · {b.date} · {b.price}
                        </span>
                        <span className="wsw-dashboard__booking-code">{b.code}</span>
                      </div>
                      <div className="wsw-dashboard__booking-side">
                        <span
                          className={
                            "wsw-dashboard__status wsw-dashboard__status--" +
                            b.status.toLowerCase().replace(/\s+/g, "-")
                          }
                        >
                          {b.status}
                        </span>
                        {b.status === "Completed" && b.rated === null && (
                          <RatingPicker
                            code={b.code}
                            value={ratingDraft[b.code] || 0}
                            onRate={(rating) =>
                              setRatingDraft((prev) => ({ ...prev, [b.code]: rating }))
                            }
                          />
                        )}
                        {b.status === "Completed" && b.rated !== null && (
                          <span className="wsw-dashboard__rated">★ {b.rated} rated</span>
                        )}
                        {b.status === "Completed" && (
                          <button type="button" className="wsw-dashboard__link-btn">
                            Rebook
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="wsw-dashboard__side">
            <section className="wsw-dashboard__panel wsw-dashboard__panel--compact" aria-label="Account details">
              <h2 className="wsw-dashboard__panel-title">Account</h2>
              <div className="wsw-dashboard__profile">
                <span className="wsw-dashboard__profile-avatar">{initials(CUSTOMER.name)}</span>
                <div>
                  <p className="wsw-dashboard__profile-name">{CUSTOMER.name}</p>
                  <p className="wsw-dashboard__profile-since">Customer since {CUSTOMER.memberSince}</p>
                </div>
              </div>
              <dl className="wsw-dashboard__detail-list">
                <div className="wsw-dashboard__detail-item">
                  <dt>Phone</dt>
                  <dd>{CUSTOMER.phone}</dd>
                </div>
                <div className="wsw-dashboard__detail-item">
                  <dt>Email</dt>
                  <dd>{CUSTOMER.email}</dd>
                </div>
              </dl>
              <button type="button" className="wsw-dashboard__link-btn">
                Edit profile
              </button>
            </section>

            <section className="wsw-dashboard__panel wsw-dashboard__panel--compact" aria-label="Saved addresses">
              <div className="wsw-dashboard__panel-head">
                <h2 className="wsw-dashboard__panel-title">Addresses</h2>
                <button type="button" className="wsw-dashboard__link-btn">
                  + Add
                </button>
              </div>
              <ul className="wsw-dashboard__address-list">
                {ADDRESSES.map((a) => (
                  <li className="wsw-dashboard__address-row" key={a.id}>
                    <div>
                      <p className="wsw-dashboard__address-label">
                        {a.label}
                        {a.primary && <span className="wsw-dashboard__address-primary">Primary</span>}
                      </p>
                      <p className="wsw-dashboard__address-text">{a.address}</p>
                    </div>
                    <button type="button" className="wsw-dashboard__link-btn">
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
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
          className={
            "wsw-dashboard__rating-star" + (n <= value ? " wsw-dashboard__rating-star--filled" : "")
          }
          onClick={() => onRate(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}