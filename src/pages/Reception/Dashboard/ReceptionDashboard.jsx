  import React, { useMemo, useState } from "react";
  import "./ReceptionDashboard.css";
  import { fetchHook } from "../../../hooks/fetchHook";
  import { fetchAPI } from "../../../utils/fetchAPI";


  function initials(name) {
    return (name || "")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function isToday(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  function normalizeIndustry(raw) {
    return {
      id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
      name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
    };
  }

function normalizeEmployee(raw) {
  return {
    id: raw.guidId ?? raw.GuidId ?? raw.id ?? raw.Id,
    name: raw.fullName ?? raw.FullName ?? raw.name ?? raw.Name ?? "",
    industryId: raw.industryId ?? raw.IndustryId ?? raw.industry?.industryId ?? null,
    industryName: raw.industryName ?? raw.IndustryName ?? raw.industry?.industryName ?? "Unassigned",
    // backend enum: Available = 1, AssignedInJob = 2 — API may return it as a number or the string name
    employeeStatus: raw.employeeStatus ?? raw.EmployeeStatus,
  };
}
  function normalizeBooking(raw) {
    return {
      id: raw.bookingId,
      code: raw.bookingCode,
      customer: raw.customerName,
      phone: raw.phoneNumber,
      category: raw.industry.industryName,  
      industryId: raw.industryId,
      service: raw.duty.dutyName,
      address: raw.address,
      date: raw.preferredDate,
      slot: raw.preferredTime,
      source: raw.source ?? raw.Source ?? "App",
      status: raw.status ?? raw.Status ?? "Pending",
      priority: raw.priority ?? raw.Priority ?? "normal",
      technicianId: raw.technicianId ?? raw.TechnicianId ?? null,
      technicianName: raw.technicianName ?? raw.TechnicianName ?? null,
    };
  }

  const STATUS_LABEL = {
    available: "Available",
    "on-job": "On a job",
  };

  // ---- Component --------------------------------------------------------------

  export default function ReceptionistPage() {
    const [view, setView] = useState("queue");
    const [showNewBooking, setShowNewBooking] = useState(false);
    const [search, setSearch] = useState("");
    const [assigningId, setAssigningId] = useState(null);
    const [dismissingId, setDismissingId] = useState(null);

    const { data: rawBookings, loading: bookingsLoading } = fetchHook(
      "https://localhost:7011/api/Booking/getAllPendingBookings"
    );
    const { data: rawEmployees, loading: staffLoading } = fetchHook(
      "https://localhost:7011/api/Employee/getEmployeesDetail"
    );
    const { data: rawIndustries, loading: industriesLoading } = fetchHook(
      "https://localhost:7011/api/industry/getIndustryData"
    );

    const bookings = useMemo(() => (rawBookings || []).map(normalizeBooking), [rawBookings]);
    const industries = useMemo(() => (rawIndustries || []).map(normalizeIndustry), [rawIndustries]);

    const queue = useMemo(
      () => bookings.filter((b) => b.status === "Pending" && !b.technicianId),
      [bookings]
    );


    const todaysSchedule = useMemo(
      () =>
        bookings.filter(
          (b) => isToday(b.date) && (b.status === "In progress" || b.status === "Completed")
        ),
      [bookings]
    );


  const technicians = useMemo(() => {
    const employees = (rawEmployees || []).map(normalizeEmployee);
    return employees.map((emp) => {
      const status =
        emp.employeeStatus === "Available" || emp.employeeStatus === 1
          ? "available"
          : "on-job";

      const activeJob = bookings.find(
        (b) => b.technicianId === emp.id && b.status === "In progress"
      );

      return {
        id: emp.id,
        name: emp.name,
        skill: emp.industryName,
        industryId: emp.industryId,
        status,
        jobCode: activeJob?.code ?? null,
      };
    });
  }, [rawEmployees, bookings]);

    const filteredQueue = useMemo(() => {
      if (!search.trim()) return queue;
      const q = search.toLowerCase();
      return queue.filter(
        (item) =>
          item.customer.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.phone.includes(q)
      );
    }, [queue, search]);

    const stats = useMemo(() => {
      const available = technicians.filter((t) => t.status === "available").length;
      const urgent = queue.filter((q) => q.priority === "urgent").length;
      return [
        { label: "Needs assignment", value: queue.length },
        { label: "Urgent", value: urgent },
        { label: "Technicians available", value: available },
        { label: "Jobs today", value: todaysSchedule.length },
      ];
    }, [queue, technicians, todaysSchedule]);

    function matchingTechnicians() {
      return technicians.filter((t) => t.status === "available");
    }

    async function handleAssign(booking, technicianId) {
      const tech = technicians.find((t) => t.id === technicianId);
      if (!tech) return;

      setAssigningId(booking.id);
      const res = await fetchAPI(
        `https://localhost:7011/api/Booking/assignTechnician/${booking.id}?technicianId=${technicianId}`,
        "PATCH"
      );
      setAssigningId(null);

      if (res) {
        window.location.reload(); // simplest — refetches bookings + employees so status stays in sync
      } else {
        window.alert("Couldn't assign this technician. Please try again.");
      }
    }

    async function handleCancel(booking) {
      if (!window.confirm(`Cancel the booking for ${booking.customer}?`)) return;
      setDismissingId(booking.id);
      const res = await fetchAPI(`https://localhost:7011/api/Booking/deleteBooking/${booking.id}`, "DELETE");
      setDismissingId(null);

      if (res) {
        window.location.reload();
      } else {
        window.alert("Couldn't cancel this booking. Please try again.");
      }
    }

    async function handleCreateBooking(form) {
      const payload = {
        customerName: form.customer,
        phone: form.phone,
        industryId: form.industryId,
        service: form.service,
        address: form.address,
        preferredDate: form.date,
        timeSlot: form.slot,
        source: "Phone",
        priority: form.priority,
        status: "Pending",
      };

      const res = await fetchAPI("https://localhost:7011/api/Booking/addBooking", "POST", payload);

      if (res) {
        window.alert("Booking added to the queue.");
        window.location.reload();
      } else {
        window.alert("Couldn't create this booking. Please try again.");
      }
    }

    const isLoading = bookingsLoading || staffLoading || industriesLoading;

    return (
      <div className="wsw-receptionist">
        <header className="wsw-receptionist__header">
          <div className="wsw-receptionist__header-inner">
            <div>
              <span className="wsw-receptionist__eyebrow">Front desk</span>
              <h1 className="wsw-receptionist__title">Booking queue</h1>
              <p className="wsw-receptionist__subtitle">Assign technicians and manage today's schedule.</p>
            </div>
            <div className="wsw-receptionist__header-actions">
              <input
                type="search"
                className="wsw-receptionist__search"
                placeholder="Search customer, phone or job code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search bookings"
              />
              <button type="button" className="wsw-receptionist__new-booking" onClick={() => setShowNewBooking(true)}>
                + Phone booking
              </button>
            </div>
          </div>
        </header>

        <div className="wsw-receptionist__body">
          <section className="wsw-receptionist__stats" aria-label="Front desk overview">
            {stats.map((s) => (
              <div className="wsw-receptionist__stat-card" key={s.label}>
                <span className="wsw-receptionist__stat-value">{s.value}</span>
                <span className="wsw-receptionist__stat-label">{s.label}</span>
              </div>
            ))}
          </section>

          <div className="wsw-receptionist__grid">
            <div className="wsw-receptionist__main">
              <div className="wsw-receptionist__tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === "queue"}
                  className={"wsw-receptionist__tab" + (view === "queue" ? " wsw-receptionist__tab--active" : "")}
                  onClick={() => setView("queue")}
                >
                  Assignment queue
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === "schedule"}
                  className={"wsw-receptionist__tab" + (view === "schedule" ? " wsw-receptionist__tab--active" : "")}
                  onClick={() => setView("schedule")}
                >
                  Today's schedule
                </button>
              </div>

              {isLoading ? (
                <section className="wsw-receptionist__panel" aria-label="Loading">
                  <p className="wsw-receptionist__loading-note">Loading bookings…</p>
                </section>
              ) : view === "queue" ? (
                <section className="wsw-receptionist__panel" aria-label="Bookings needing assignment">
                  {filteredQueue.length > 0 ? (
                    <ul className="wsw-receptionist__queue-list">
                      {filteredQueue.map((item) => (
                        <QueueRow
                          key={item.id}
                          item={item}
                          options={matchingTechnicians()}
                          onAssign={handleAssign}
                          onCancel={handleCancel}
                          assigning={assigningId === item.id}
                          cancelling={dismissingId === item.id}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div className="wsw-receptionist__empty">
                      <p className="wsw-receptionist__empty-title">Queue is clear</p>
                      <p className="wsw-receptionist__empty-body">
                        Every booking has a technician assigned. New requests will appear here.
                      </p>
                    </div>
                  )}
                </section>
              ) : (
                <section className="wsw-receptionist__panel" aria-label="Today's schedule">
                  {todaysSchedule.length > 0 ? (
                    <ul className="wsw-receptionist__schedule-list">
                      {todaysSchedule.map((row) => (
                        <li className="wsw-receptionist__schedule-row" key={row.id}>
                          <span className="wsw-receptionist__schedule-time">{row.slot}</span>
                          <div className="wsw-receptionist__schedule-main">
                            <p className="wsw-receptionist__schedule-service">{row.service}</p>
                            <p className="wsw-receptionist__schedule-meta">
                              {row.customer} · {row.technicianName || "Unassigned"}
                            </p>
                          </div>
                          <span
                            className={
                              "wsw-receptionist__status wsw-receptionist__status--" +
                              row.status.toLowerCase().replace(/\s+/g, "-")
                            }
                          >
                            {row.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="wsw-receptionist__empty">
                      <p className="wsw-receptionist__empty-title">Nothing in progress yet</p>
                      <p className="wsw-receptionist__empty-body">
                        Jobs that are in progress or completed today will show up here.
                      </p>
                    </div>
                  )}
                </section>
              )}

              <section className="wsw-receptionist__panel" aria-label="Recent calls">
                <div className="wsw-receptionist__panel-head">
                  <h2 className="wsw-receptionist__panel-title">Recent calls</h2>
                </div>
                <p className="wsw-receptionist__loading-note">Call log integration coming soon.</p>
              </section>
            </div>

            <aside className="wsw-receptionist__side">
              <section className="wsw-receptionist__panel wsw-receptionist__panel--compact" aria-label="Technician roster">
                <div className="wsw-receptionist__panel-head">
                  <h2 className="wsw-receptionist__panel-title">Technicians</h2>
                </div>
                {staffLoading ? (
                  <p className="wsw-receptionist__loading-note">Loading roster…</p>
                ) : (
                  <ul className="wsw-receptionist__roster-list">
                    {technicians.map((t) => (
                      <li className="wsw-receptionist__roster-row" key={t.id}>
                        <span className="wsw-receptionist__roster-avatar">{initials(t.name)}</span>
                        <div className="wsw-receptionist__roster-main">
                          <p className="wsw-receptionist__roster-name">{t.name}</p>
                          <p className="wsw-receptionist__roster-skill">{t.skill}</p>
                        </div>
                        <span
                          className={"wsw-receptionist__roster-status wsw-receptionist__roster-status--" + t.status}
                        >
                          {STATUS_LABEL[t.status]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        </div>

        {showNewBooking && (
          <NewBookingModal
            industries={industries}
            onClose={() => setShowNewBooking(false)}
            onCreate={handleCreateBooking}
          />
        )}
      </div>
    );
  }

  // ---- Subcomponents --------------------------------------------------------------

  function QueueRow({ item, options, onAssign, onCancel, assigning, cancelling }) {
    const [pickedTech, setPickedTech] = useState("");

    return (
      <li
        className={
          "wsw-receptionist__queue-row" +
          (item.priority === "urgent" ? " wsw-receptionist__queue-row--urgent" : "")
        }
      >
        <div className="wsw-receptionist__queue-main">
          <div className="wsw-receptionist__queue-top">
            <p className="wsw-receptionist__queue-customer">{item.customer}</p>
            {item.priority === "urgent" && <span className="wsw-receptionist__urgent-tag">Urgent</span>}
            <span className="wsw-receptionist__source-tag">{item.source}</span>
          </div>
          <p className="wsw-receptionist__queue-service">
            {item.service} · {item.category}
          </p>
          <p className="wsw-receptionist__queue-meta">
            {item.slot} · {item.address}
          </p>
          <p className="wsw-receptionist__queue-meta">
            {item.phone} · <span className="wsw-receptionist__queue-code">{item.code}</span>
          </p>
        </div>

        <div className="wsw-receptionist__queue-actions">
          <select
            className="wsw-receptionist__assign-select"
            value={pickedTech}
            onChange={(e) => setPickedTech(e.target.value)}
            aria-label={`Assign technician for ${item.customer}`}
          >
            <option value="">Assign technician…</option>
            {options.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({STATUS_LABEL[t.status]})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="wsw-receptionist__assign-btn"
            disabled={!pickedTech || assigning}
            onClick={() => onAssign(item, pickedTech)}
          >
            {assigning ? "Assigning…" : "Assign"}
          </button>
          <button
            type="button"
            className="wsw-receptionist__dismiss-btn"
            onClick={() => onCancel(item)}
            disabled={cancelling}
          >
            {cancelling ? "…" : "Cancel"}
          </button>
        </div>
      </li>
    );
  }

  function NewBookingModal({ industries, onClose, onCreate }) {
    const [form, setForm] = useState({
      customer: "",
      phone: "",
      industryId: industries[0]?.id ?? "",
      service: "",
      address: "",
      date: "",
      slot: "",
      priority: "normal",
    });
    const [submitting, setSubmitting] = useState(false);

    function update(field, value) {
      setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e) {
      e.preventDefault();
      if (!form.customer.trim() || !form.phone.trim() || !form.service.trim() || !form.address.trim() || !form.slot.trim()) {
        return;
      }
      setSubmitting(true);
      await onCreate(form);
      setSubmitting(false);
    }

    return (
      <div className="wsw-receptionist__modal-backdrop" role="dialog" aria-modal="true" aria-label="Create phone booking">
        <div className="wsw-receptionist__modal">
          <div className="wsw-receptionist__modal-head">
            <h2 className="wsw-receptionist__panel-title">New phone booking</h2>
            <button type="button" className="wsw-receptionist__modal-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>

          <form className="wsw-receptionist__modal-form" onSubmit={handleSubmit}>
            <div className="wsw-receptionist__field-row">
              <ModalField id="m-customer" label="Customer name" value={form.customer} onChange={(v) => update("customer", v)} />
              <ModalField id="m-phone" label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
            </div>

            <div className="wsw-receptionist__field-row">
              <div className="wsw-receptionist__field">
                <label className="wsw-receptionist__label" htmlFor="m-category">
                  Category
                </label>
                <select
                  id="m-category"
                  className="wsw-receptionist__select"
                  value={form.industryId}
                  onChange={(e) => update("industryId", e.target.value)}
                >
                  {industries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <ModalField id="m-service" label="Service requested" value={form.service} onChange={(v) => update("service", v)} placeholder="e.g. Leak repair" />
            </div>

            <ModalField id="m-address" label="Service address" value={form.address} onChange={(v) => update("address", v)} />

            <div className="wsw-receptionist__field-row">
              <ModalField id="m-date" label="Date" value={form.date} onChange={(v) => update("date", v)} type="date" />
              <ModalField id="m-slot" label="Requested slot" value={form.slot} onChange={(v) => update("slot", v)} placeholder="e.g. 4:00 PM – 6:00 PM" />
            </div>

            <div className="wsw-receptionist__field">
              <label className="wsw-receptionist__label" htmlFor="m-priority">
                Priority
              </label>
              <select
                id="m-priority"
                className="wsw-receptionist__select"
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="wsw-receptionist__modal-actions">
              <button type="submit" className="wsw-receptionist__primary-btn" disabled={submitting}>
                {submitting ? "Adding…" : "Add to queue"}
              </button>
              <button type="button" className="wsw-receptionist__ghost-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function ModalField({ id, label, value, onChange, type = "text", placeholder }) {
    return (
      <div className="wsw-receptionist__field">
        <label className="wsw-receptionist__label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          type={type}
          className="wsw-receptionist__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  }