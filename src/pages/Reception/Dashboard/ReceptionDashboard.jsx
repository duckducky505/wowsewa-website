import React, { useMemo, useState } from "react";
import "./ReceptionDashboard.css";

// ---- Mock data --------------------------------------------------------------

const CATEGORIES = ["Plumbing", "Electrical", "Home Appliances", "IT Devices"];

const TECHNICIANS = [
  { id: "tech-1", name: "Bikash Rai", skill: "Electrical", status: "on-job", jobCode: "WS-ELC-7734" },
  { id: "tech-2", name: "Anita Gurung", skill: "Plumbing", status: "available", jobCode: null },
  { id: "tech-3", name: "Suman Shrestha", skill: "IT Devices", status: "available", jobCode: null },
  { id: "tech-4", name: "Rita Karki", skill: "Home Appliances", status: "on-job", jobCode: "WS-APL-2210" },
  { id: "tech-5", name: "Deepak Thapa", skill: "Plumbing", status: "off-duty", jobCode: null },
  { id: "tech-6", name: "Prakash Lama", skill: "Electrical", status: "available", jobCode: null },
];

const INITIAL_QUEUE = [
  {
    id: "q-1",
    code: "WS-PLB-4821",
    customer: "Nirmala Adhikari",
    phone: "+977 98-2233-1100",
    category: "Plumbing",
    service: "Leak repair",
    address: "Sundhara, Kathmandu",
    slot: "Today · 4:00 PM – 6:00 PM",
    source: "App",
    assignedTo: null,
    priority: "normal",
  },
  {
    id: "q-2",
    code: "WS-ITD-6602",
    customer: "Rajan Basnet",
    phone: "+977 98-4411-7788",
    category: "IT Devices",
    service: "Wi-Fi / network setup",
    address: "Chabahil, Kathmandu",
    slot: "Tomorrow · 10:00 AM – 12:00 PM",
    source: "Phone",
    assignedTo: null,
    priority: "normal",
  },
  {
    id: "q-3",
    code: "WS-ELC-9310",
    customer: "Sabina Maharjan",
    phone: "+977 98-1122-3344",
    category: "Electrical",
    service: "Short circuit fix",
    address: "Patan, Lalitpur",
    slot: "Today · 6:00 PM – 8:00 PM",
    source: "Phone",
    assignedTo: null,
    priority: "urgent",
  },
];

const SCHEDULE_TODAY = [
  { time: "9:00 AM", technician: "Anita Gurung", customer: "Kiran Joshi", service: "Bathroom fitting", status: "Completed" },
  { time: "11:00 AM", technician: "Rita Karki", customer: "Manisha Rai", service: "Refrigerator repair", status: "Completed" },
  { time: "2:00 PM", technician: "Bikash Rai", customer: "Sagar Thapa", service: "Switchboard installation", status: "In progress" },
  { time: "4:00 PM", technician: "Rita Karki", customer: "Sagar Thapa", service: "AC installation", status: "Confirmed" },
  { time: "4:00 PM", technician: "Unassigned", customer: "Nirmala Adhikari", service: "Leak repair", status: "Needs assignment" },
];

const CALL_LOG = [
  { id: "c-1", customer: "Sabina Maharjan", time: "10 min ago", note: "Reported sparking sound near switchboard", tag: "New booking" },
  { id: "c-2", customer: "Kiran Joshi", time: "42 min ago", note: "Confirmed technician arrival window", tag: "Follow-up" },
  { id: "c-3", customer: "Unknown caller", time: "1 hr ago", note: "Asked about IT device repair pricing", tag: "Inquiry" },
];

const STATUS_LABEL = {
  available: "Available",
  "on-job": "On a job",
  "off-duty": "Off duty",
};

// ---- Helpers --------------------------------------------------------------

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function matchingTechnicians(category) {
  return TECHNICIANS.filter((t) => t.skill === category && t.status !== "off-duty");
}

// ---- Component --------------------------------------------------------------

export default function ReceptionistPage() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [technicians, setTechnicians] = useState(TECHNICIANS);
  const [view, setView] = useState("queue");
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const available = technicians.filter((t) => t.status === "available").length;
    const pending = queue.length;
    const urgent = queue.filter((q) => q.priority === "urgent").length;
    return [
      { label: "Needs assignment", value: pending },
      { label: "Urgent", value: urgent },
      { label: "Technicians available", value: available },
      { label: "Jobs today", value: SCHEDULE_TODAY.length },
    ];
  }, [queue, technicians]);

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

  function handleAssign(queueId, technicianId) {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;
    setQueue((prev) =>
      prev.map((item) => (item.id === queueId ? { ...item, assignedTo: tech.name } : item))
    );
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === technicianId ? { ...t, status: "on-job" } : t
      )
    );
  }

  function handleDismiss(queueId) {
    setQueue((prev) => prev.filter((item) => item.id !== queueId));
  }

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

            {view === "queue" ? (
              <section className="wsw-receptionist__panel" aria-label="Bookings needing assignment">
                {filteredQueue.length > 0 ? (
                  <ul className="wsw-receptionist__queue-list">
                    {filteredQueue.map((item) => (
                      <QueueRow
                        key={item.id}
                        item={item}
                        onAssign={handleAssign}
                        onDismiss={handleDismiss}
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
                <ul className="wsw-receptionist__schedule-list">
                  {SCHEDULE_TODAY.map((row, i) => (
                    <li className="wsw-receptionist__schedule-row" key={i}>
                      <span className="wsw-receptionist__schedule-time">{row.time}</span>
                      <div className="wsw-receptionist__schedule-main">
                        <p className="wsw-receptionist__schedule-service">{row.service}</p>
                        <p className="wsw-receptionist__schedule-meta">
                          {row.customer} · {row.technician}
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
              </section>
            )}

            <section className="wsw-receptionist__panel" aria-label="Recent calls">
              <div className="wsw-receptionist__panel-head">
                <h2 className="wsw-receptionist__panel-title">Recent calls</h2>
              </div>
              <ul className="wsw-receptionist__call-list">
                {CALL_LOG.map((c) => (
                  <li className="wsw-receptionist__call-row" key={c.id}>
                    <span className="wsw-receptionist__call-avatar">{initials(c.customer)}</span>
                    <div className="wsw-receptionist__call-main">
                      <p className="wsw-receptionist__call-customer">
                        {c.customer} <span className="wsw-receptionist__call-time">· {c.time}</span>
                      </p>
                      <p className="wsw-receptionist__call-note">{c.note}</p>
                    </div>
                    <span className="wsw-receptionist__call-tag">{c.tag}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="wsw-receptionist__side">
            <section className="wsw-receptionist__panel wsw-receptionist__panel--compact" aria-label="Technician roster">
              <div className="wsw-receptionist__panel-head">
                <h2 className="wsw-receptionist__panel-title">Technicians</h2>
              </div>
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
            </section>
          </aside>
        </div>
      </div>

      {showNewBooking && (
        <NewBookingModal
          onClose={() => setShowNewBooking(false)}
          onCreate={(booking) => {
            setQueue((prev) => [booking, ...prev]);
            setShowNewBooking(false);
          }}
        />
      )}
    </div>
  );
}

// ---- Subcomponents --------------------------------------------------------------

function QueueRow({ item, onAssign, onDismiss }) {
  const [pickedTech, setPickedTech] = useState("");
  const options = matchingTechnicians(item.category);

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

      {item.assignedTo ? (
        <div className="wsw-receptionist__assigned-note">
          Assigned to <strong>{item.assignedTo}</strong>
        </div>
      ) : (
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
            disabled={!pickedTech}
            onClick={() => onAssign(item.id, pickedTech)}
          >
            Assign
          </button>
          <button type="button" className="wsw-receptionist__dismiss-btn" onClick={() => onDismiss(item.id)}>
            Dismiss
          </button>
        </div>
      )}
    </li>
  );
}

function NewBookingModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    category: CATEGORIES[0],
    service: "",
    address: "",
    slot: "",
    priority: "normal",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer.trim() || !form.phone.trim() || !form.service.trim() || !form.address.trim() || !form.slot.trim()) {
      return;
    }
    const code = `WS-${form.category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    onCreate({
      id: `q-${Date.now()}`,
      code,
      customer: form.customer,
      phone: form.phone,
      category: form.category,
      service: form.service,
      address: form.address,
      slot: form.slot,
      source: "Phone",
      assignedTo: null,
      priority: form.priority,
    });
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
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <ModalField id="m-service" label="Service requested" value={form.service} onChange={(v) => update("service", v)} placeholder="e.g. Leak repair" />
          </div>

          <ModalField id="m-address" label="Service address" value={form.address} onChange={(v) => update("address", v)} />
          <ModalField id="m-slot" label="Requested slot" value={form.slot} onChange={(v) => update("slot", v)} placeholder="e.g. Today · 4:00 PM – 6:00 PM" />

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
            <button type="submit" className="wsw-receptionist__primary-btn">
              Add to queue
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