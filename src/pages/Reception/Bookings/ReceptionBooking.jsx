import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import "./ReceptionBooking.css";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";

// ---- Helpers --------------------------------------------------------------

function normalizeIndustry(raw) {
  return {
    id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
    name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
  };
}

function normalizeBooking(raw) {
  return {
    id: raw.bookingId,
    code: raw.bookingCode,
    customer: raw.customerName,
    phone: raw.phoneNumber,
    industryId: raw.industryId,
    category: raw.industry?.industryName ?? "",
    service: raw.duty?.dutyName ?? "",
    description: raw.description ?? raw.Description ?? raw.duty?.description ?? raw.duty?.Description ?? "",
    address: raw.address,
    date: raw.preferredDate,
    slot: raw.preferredTime,
    price: raw.duty.price,
    status: raw.bookingStatus,
    technicianName: raw.technicianName ?? raw.TechnicianName ?? "",
    notes: raw.notes ?? raw.Notes ?? "",
    createdAt: raw.createdDate,
  };
}

// Status list comes straight from the API — this just handles either a
// plain string array or a list of {statusName} objects, and never leaves
// it undefined so .map/.forEach elsewhere can't crash on first render.
function normalizeStatus(raw, i) {
  if (typeof raw === "string") return raw;
  return raw.statusName ?? raw.StatusName ?? raw.name ?? raw.Name ?? `Status ${i + 1}`;
}

function emptyDraftFromBooking(b) {
  return {
    date: b.date,
    slot: b.slot,
    price: String(b.price ?? ""),
    status: b.status,
  };
}

function formatRs(value) {
  return `Rs ${Number(value || 0).toLocaleString()}`;
}

// ---- Component --------------------------------------------------------------

export default function ReceptionBookings() {
  const { data: rawBookings, loading: bookingsLoading } = fetchHook(
    "https://localhost:7011/api/Booking/getBookings"
  );
  const { data: rawIndustries } = fetchHook("https://localhost:7011/api/industry/getIndustryData");
  const { data: rawStatuses } = fetchHook("https://localhost:7011/api/Booking/getBookingStatus");

  const bookings = useMemo(() => (rawBookings || []).map(normalizeBooking), [rawBookings]);
  const industries = useMemo(() => (rawIndustries || []).map(normalizeIndustry), [rawIndustries]);
  const statusOptions = useMemo(() => (rawStatuses || []).map(normalizeStatus), [rawStatuses]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (b.customer || "").toLowerCase().includes(q) ||
        (b.code || "").toLowerCase().includes(q) ||
        (b.phone || "").includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts = { All: bookings.length };
    statusOptions.forEach((s) => {
      counts[s] = bookings.filter((b) => b.status === s).length;
    });
    return counts;
  }, [bookings, statusOptions]);

  function openView(booking) {
    setViewingBooking(booking);
  }

  function closeView() {
    setViewingBooking(null);
  }

  function openEdit(booking) {
    setEditingBooking(booking);
    setDraft(emptyDraftFromBooking(booking));
    setErrors({});
  }

  function closeEdit() {
    setEditingBooking(null);
    setDraft(null); 
    setErrors({});
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateDraft() {
    const next = {};
    if (!draft.date) next.date = "Choose a date";
    if (!draft.slot.trim()) next.slot = "Enter a time slot";
    const priceNum = Number(draft.price);
    if (draft.price === "" || Number.isNaN(priceNum) || priceNum < 0) {
      next.price = "Enter a valid price";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!validateDraft()) return;

    setSubmitting(true);

    // Match C# Booking model property names exactly (PascalCase)
    const patchPayload = [
      { op: "replace", path: "/PreferredDate", value: draft.date },
      { op: "replace", path: "/PreferredTime", value: draft.slot.trim() },
      { op: "replace", path: "/BookingStatus", value: draft.status.toLocaleString() },
    ];

    const res = await fetchAPI(
      `https://localhost:7011/api/Booking/updateBookingDetails/${editingBooking.id}`,
      "PATCH",
      patchPayload
    );
    setSubmitting(false);

    if (res) {
      window.alert("Booking updated successfully.");
      window.location.reload();
    } else {
      window.alert("Couldn't update this booking. Please try again.");
    }
  }

  return (
    <div className="wsw-reception-bookings">
      <header className="wsw-reception-bookings__header">
        <div className="wsw-reception-bookings__header-inner">
          <div>
            <span className="wsw-reception-bookings__eyebrow">Front desk</span>
            <h1 className="wsw-reception-bookings__title">All bookings</h1>
            <p className="wsw-reception-bookings__sub">Every booking on the platform, including cancelled ones.</p>
          </div>
        </div>
      </header>

      <div className="wsw-reception-bookings__body">
        <div className="wsw-reception-bookings__toolbar">
          <div className="wsw-reception-bookings__status-tabs" role="tablist" aria-label="Filter by status">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === "All"}
              className={
                "wsw-reception-bookings__status-tab" +
                (statusFilter === "All" ? " wsw-reception-bookings__status-tab--active" : "")
              }
              onClick={() => setStatusFilter("All")}
            >
              All <span className="wsw-reception-bookings__tab-count">{statusCounts.All ?? 0}</span>
            </button>
            {statusOptions.map((s) => (
              <button
                type="button"
                role="tab"
                key={s}
                aria-selected={statusFilter === s}
                className={
                  "wsw-reception-bookings__status-tab" +
                  (statusFilter === s ? " wsw-reception-bookings__status-tab--active" : "")
                }
                onClick={() => setStatusFilter(s)}
              >
                {s} <span className="wsw-reception-bookings__tab-count">{statusCounts[s] ?? 0}</span>
              </button>
            ))}
          </div>

          <input
            type="search"
            className="wsw-reception-bookings__search"
            placeholder="Search customer, phone or job code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search bookings"
          />
        </div>

        <section className="wsw-reception-bookings__panel" aria-label="Bookings">
          {bookingsLoading ? (
            <p className="wsw-reception-bookings__loading-note">Loading bookings…</p>
          ) : filteredBookings.length > 0 ? (
            <div className="wsw-reception-bookings__table-wrap">
              <table className="wsw-reception-bookings__table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Date / Time</th>
                    <th>Technician</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr className="wsw-reception-bookings__row" key={b.id}>
                      <td>
                        <p className="wsw-reception-bookings__cell-strong">{b.customer}</p>
                        <p className="wsw-reception-bookings__cell-muted">{b.phone}</p>
                      </td>
                      <td>
                        <p className="wsw-reception-bookings__cell-strong">{b.service}</p>
                        <p className="wsw-reception-bookings__cell-muted">{b.code}</p>
                      </td>
                      <td className="wsw-reception-bookings__cell-muted">{b.category}</td>
                      <td className="wsw-reception-bookings__cell-muted">
                        {b.date} · {b.slot}
                      </td>
                      <td className="wsw-reception-bookings__cell-muted">{b.technicianName || "Unassigned"}</td>
                      <td>
                        <span
                          className={
                            "wsw-reception-bookings__status-pill wsw-reception-bookings__status-pill--" +
                            (b.status || "").toLowerCase().replace(/\s+/g, "-")
                          }
                        >
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div className="wsw-reception-bookings__row-actions">
                          <button type="button" className="wsw-reception-bookings__icon-action" onClick={() => openView(b)}>
                            View
                          </button>
                          <button type="button" className="wsw-reception-bookings__icon-action" onClick={() => openEdit(b)}>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="wsw-reception-bookings__empty">
              <p className="wsw-reception-bookings__empty-title">No bookings found</p>
              <p className="wsw-reception-bookings__empty-body">Try a different status or search term.</p>
            </div>
          )}
        </section>
      </div>

      {viewingBooking && <TicketView booking={viewingBooking} onClose={closeView} />}

      {editingBooking && draft && (
        <div className="wsw-reception-bookings__modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit booking">
          <div className="wsw-reception-bookings__modal">
            <div className="wsw-reception-bookings__modal-head">
              <h2 className="wsw-reception-bookings__modal-title">Edit booking · {editingBooking.code}</h2>
              <button type="button" className="wsw-reception-bookings__modal-close" onClick={closeEdit} aria-label="Close">
                <MdClose size={20} />
              </button>
            </div>

            <dl className="wsw-reception-bookings__readonly-list">
              <div className="wsw-reception-bookings__readonly-item">
                <dt>Customer</dt>
                <dd>{editingBooking.customer || "—"}</dd>
              </div>
              <div className="wsw-reception-bookings__readonly-item">
                <dt>Phone</dt>
                <dd>{editingBooking.phone || "—"}</dd>
              </div>
              <div className="wsw-reception-bookings__readonly-item">
                <dt>Category</dt>
                <dd>{editingBooking.category || "—"}</dd>
              </div>
              <div className="wsw-reception-bookings__readonly-item">
                <dt>Service</dt>
                <dd>{editingBooking.service || "—"}</dd>
              </div>
              <div className="wsw-reception-bookings__readonly-item">
                <dt>Address</dt>
                <dd>{editingBooking.address || "—"}</dd>
              </div>
              <div className="wsw-reception-bookings__readonly-item">
                <dt>Description</dt>
                <dd>{editingBooking.description || "—"}</dd>
              </div>
            </dl>

            <form className="wsw-reception-bookings__form" onSubmit={handleSaveEdit} noValidate>
              <div className="wsw-reception-bookings__field-row">
                <Field
                  id="edit-date"
                  label="Date"
                  value={draft.date}
                  onChange={(v) => updateDraft("date", v)}
                  error={errors.date}
                  type="date"
                />
                <Field
                  id="edit-slot"
                  label="Time slot"
                  value={draft.slot}
                  onChange={(v) => updateDraft("slot", v)}
                  error={errors.slot}
                  placeholder="e.g. 4:00 PM – 6:00 PM"
                />
              </div>

              <div className="wsw-reception-bookings__field-row">
                <div className="wsw-reception-bookings__field">
                  <label className="wsw-reception-bookings__label" htmlFor="edit-status">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    className="wsw-reception-bookings__select"
                    value={draft.status}
                    onChange={(e) => updateDraft("status", e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="wsw-reception-bookings__modal-actions">
                <button type="submit" className="wsw-reception-bookings__primary-btn" disabled={submitting}>
                  {submitting ? "Saving…" : "Save changes"}
                </button>
                <button type="button" className="wsw-reception-bookings__ghost-btn" onClick={closeEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Ticket view --------------------------------------------------------------

function TicketView({ booking, onClose }) {
  return (
    <div className="wsw-reception-bookings__modal-backdrop" role="dialog" aria-modal="true" aria-label="Booking details">
      <div className="wsw-reception-bookings__ticket-shell">
        <button type="button" className="wsw-reception-bookings__ticket-close" onClick={onClose} aria-label="Close">
          <MdClose size={20} />
        </button>

        <div className="wsw-reception-bookings__ticket">
          <div className="wsw-reception-bookings__ticket-top">
            <span className="wsw-reception-bookings__ticket-eyebrow">Work order</span>
            <span
              className={
                "wsw-reception-bookings__status-pill wsw-reception-bookings__status-pill--" +
                (booking.status || "").toLowerCase().replace(/\s+/g, "-")
              }
            >
              {booking.status}
            </span>
          </div>

          <h2 className="wsw-reception-bookings__ticket-code">{booking.code}</h2>
          <p className="wsw-reception-bookings__ticket-line">
            {booking.service} · {booking.category}
          </p>

          <div className="wsw-reception-bookings__ticket-perforation" aria-hidden="true" />

          <dl className="wsw-reception-bookings__ticket-list">
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Customer</dt>
              <dd>{booking.customer || "—"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Phone</dt>
              <dd>{booking.phone || "—"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Address</dt>
              <dd>{booking.address || "—"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Description</dt>
              <dd>{booking.description || "—"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Date</dt>
              <dd>{booking.date || "—"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Time</dt>
              <dd>{booking.slot || "—"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Technician</dt>
              <dd>{booking.technicianName || "Unassigned"}</dd>
            </div>
            <div className="wsw-reception-bookings__ticket-item">
              <dt>Price</dt>
              <dd>{formatRs(booking.price)}</dd>
            </div>
            {booking.notes && (
              <div className="wsw-reception-bookings__ticket-item">
                <dt>Notes</dt>
                <dd>{booking.notes}</dd>
              </div>
            )}
          </dl>

          <div className="wsw-reception-bookings__ticket-perforation" aria-hidden="true" />

          <p className="wsw-reception-bookings__ticket-footnote">
            {booking.createdAt ? `Booked ${booking.createdAt}` : "Full booking record"} · ID {booking.id}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange, error, type = "text", placeholder }) {
  return (
    <div className="wsw-reception-bookings__field">
      <label className="wsw-reception-bookings__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={"wsw-reception-bookings__input" + (error ? " wsw-reception-bookings__input--error" : "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className="wsw-reception-bookings__error">{error}</span>}
    </div>
  );
}