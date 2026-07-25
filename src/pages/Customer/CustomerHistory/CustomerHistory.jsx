import React, { useMemo, useState } from "react";
import "./CustomerHistory.css";
import { fetchHook } from "../../../hooks/fetchHook";
import { useAuth } from "../../../context/AuthContext";

// ---- Helpers --------------------------------------------------------------

function normalizeBooking(raw) {
  return {
    id: raw.bookingId,
    code: raw.bookingCode,
    service: raw.duty?.dutyName ?? "",
    category: raw.industry?.industryName ?? "",
    date: raw.preferredDate,
    slot: raw.preferredTime,
    address: raw.address,
    price: raw.price,
    status: raw.bookingStatus ?? raw.status ?? "Completed",
    rated: raw.rating ?? raw.Rating ?? null,
    technicianName: raw.technicianName ?? raw.TechnicianName ?? "",
    notes: raw.notes ?? raw.Notes ?? "",
  };
}

function categoryCode(name) {
  return (name || "").slice(0, 3).toUpperCase();
}

function formatRs(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`;
}

function statusClass(status) {
  return (status || "").toLowerCase().replace(/\s+/g, "-");
}

function monthLabel(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Undated";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
}

function dayLabel(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---- Component --------------------------------------------------------------

export default function CustomerBookingHistory() {
  const { user } = useAuth();
  const guidId = user?.guidId ?? null;

  const { data: rawHistory, loading: historyLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/history/getUserSpecificBooking/${guidId}` : null
  );
  const { data: rawCancelled, loading: cancelledLoading } = fetchHook(
    guidId ? `https://localhost:7011/api/Booking/cancelled/getUserSpecificBooking/${guidId}` : null
  );

  const [filter, setFilter] = useState("all");

  const bookings = useMemo(() => {
    const completed = (rawHistory || []).map(normalizeBooking);
    const cancelled = (rawCancelled || []).map(normalizeBooking);
    return [...completed, ...cancelled].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [rawHistory, rawCancelled]);

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => statusClass(b.status) === filter);
  }, [bookings, filter]);

  const groups = useMemo(() => {
    const map = new Map();
    filteredBookings.forEach((b) => {
      const key = monthLabel(b.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(b);
    });
    return [...map.entries()];
  }, [filteredBookings]);

  const isLoading = historyLoading || cancelledLoading;

  return (
    <div className="wsw-history">
      <header className="wsw-history__header">
        <div className="wsw-history__header-inner">
          <span className="wsw-history__eyebrow">Your account</span>
          <h1 className="wsw-history__title">Booking history</h1>
          <p className="wsw-history__subtitle">Every job you've booked with us, stamped and filed.</p>
        </div>
      </header>

      <div className="wsw-history__body">
        <div className="wsw-history__filters" role="tablist" aria-label="Filter by status">
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            className={"wsw-history__filter" + (filter === "all" ? " wsw-history__filter--active" : "")}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "completed"}
            className={"wsw-history__filter" + (filter === "completed" ? " wsw-history__filter--active" : "")}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "cancelled"}
            className={"wsw-history__filter" + (filter === "cancelled" ? " wsw-history__filter--active" : "")}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {isLoading ? (
          <p className="wsw-history__loading-note">Loading your booking history…</p>
        ) : groups.length > 0 ? (
          <div className="wsw-history__receipt">
            <div className="wsw-history__receipt-edge wsw-history__receipt-edge--top" aria-hidden="true" />

            <div className="wsw-history__receipt-body">
              {groups.map(([month, monthBookings], groupIndex) => (
                <section className="wsw-history__section" key={month}>
                  <p className="wsw-history__section-label">
                    <span>{month}</span>
                  </p>

                  {monthBookings.map((b, i) => {
                    const cancelled = statusClass(b.status) === "cancelled";
                    const isLast = groupIndex === groups.length - 1 && i === monthBookings.length - 1;

                    return (
                      <div className="wsw-history__entry-wrap" key={b.id}>
                        <div
                          className={
                            "wsw-history__entry" + (cancelled ? " wsw-history__entry--cancelled" : "")
                          }
                        >
                          {cancelled && <span className="wsw-history__stamp">Cancelled</span>}

                          <div className="wsw-history__entry-row">
                            <span className="wsw-history__entry-date">{dayLabel(b.date)}</span>
                            <span className="wsw-history__entry-tag">{categoryCode(b.category)}</span>
                            <span className="wsw-history__entry-service">{b.service}</span>
                            <span className="wsw-history__entry-price">{formatRs(b.price)}</span>
                          </div>

                          <div className="wsw-history__entry-details">
                            <div className="wsw-history__entry-detail-row">
                              <span>Category</span>
                              <strong>{b.category || "—"}</strong>
                            </div>
                            <div className="wsw-history__entry-detail-row">
                              <span>Time slot</span>
                              <strong>{b.slot || "—"}</strong>
                            </div>
                            <div className="wsw-history__entry-detail-row">
                              <span>Job code</span>
                              <strong>{b.code}</strong>
                            </div>
                            <div className="wsw-history__entry-detail-row">
                              <span>Address</span>
                              <strong>{b.address || "—"}</strong>
                            </div>
                            <div className="wsw-history__entry-detail-row">
                              <span>Technician</span>
                              <strong>{b.technicianName || "Unassigned"}</strong>
                            </div>
                            {b.rated !== null && (
                              <div className="wsw-history__entry-detail-row">
                                <span>Your rating</span>
                                <strong>★ {b.rated}</strong>
                              </div>
                            )}
                            {b.notes && (
                              <div className="wsw-history__entry-detail-row">
                                <span>Notes</span>
                                <strong>{b.notes}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        {!isLast && <div className="wsw-history__tear" aria-hidden="true" />}
                      </div>
                    );
                  })}
                </section>
              ))}
            </div>

            <div className="wsw-history__receipt-edge wsw-history__receipt-edge--bottom" aria-hidden="true" />
          </div>
        ) : (
          <div className="wsw-history__empty">
            <p className="wsw-history__empty-title">Nothing here yet</p>
            <p className="wsw-history__empty-body">
              Once you complete or cancel a booking, it'll show up in this list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}