import React, { useMemo, useState } from "react";
import "./CustomerBooking.css";

// ---- Service data -------------------------------------------------------

const SERVICE_CATEGORIES = [
  {
    id: "plumbing",
    label: "Plumbing",
    tagline: "Leaks, pipes & fittings",
    code: "PLB",
    services: [
      { id: "leak-repair", label: "Leak repair", duration: "45–60 min", price: "Rs 800+" },
      { id: "pipe-install", label: "Pipe installation", duration: "1–2 hrs", price: "Rs 1,200+" },
      { id: "drain-cleaning", label: "Drain cleaning", duration: "30–45 min", price: "Rs 600+" },
      { id: "bathroom-fitting", label: "Bathroom fitting", duration: "2–3 hrs", price: "Rs 2,500+" },
    ],
  },
  {
    id: "electrical",
    label: "Electrical",
    tagline: "Wiring, switches & fixtures",
    code: "ELC",
    services: [
      { id: "wiring-repair", label: "Wiring repair", duration: "1 hr", price: "Rs 900+" },
      { id: "switchboard", label: "Switchboard installation", duration: "1–2 hrs", price: "Rs 1,000+" },
      { id: "fan-light", label: "Fan / light installation", duration: "30–45 min", price: "Rs 500+" },
      { id: "short-circuit", label: "Short circuit fix", duration: "45–90 min", price: "Rs 1,100+" },
    ],
  },
  {
    id: "appliances",
    label: "Home Appliances",
    tagline: "Install, service & repair",
    code: "APL",
    services: [
      { id: "ac-install", label: "AC installation", duration: "2–3 hrs", price: "Rs 2,800+" },
      { id: "washing-machine", label: "Washing machine repair", duration: "1 hr", price: "Rs 900+" },
      { id: "refrigerator", label: "Refrigerator repair", duration: "1–1.5 hrs", price: "Rs 1,000+" },
      { id: "microwave", label: "Microwave repair", duration: "45 min", price: "Rs 700+" },
    ],
  },
  {
    id: "it-devices",
    label: "IT Devices",
    tagline: "Setup & repair",
    code: "ITD",
    services: [
      { id: "laptop-repair", label: "Laptop repair", duration: "1–2 hrs", price: "Rs 1,000+" },
      { id: "desktop-setup", label: "Desktop setup", duration: "1 hr", price: "Rs 700+" },
      { id: "printer-install", label: "Printer installation", duration: "30–45 min", price: "Rs 500+" },
      { id: "wifi-network", label: "Wi‑Fi / network setup", duration: "45–60 min", price: "Rs 800+" },
    ],
  },
];

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

// ---- Helpers --------------------------------------------------------------

function generateTicketCode(categoryCode) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `WS-${categoryCode}-${rand}`;
}

function formatDateLabel(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ---- Component --------------------------------------------------------------

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    date: "",
    slot: "",
    notes: "",
  });
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [errors, setErrors] = useState({});

  const category = useMemo(
    () => SERVICE_CATEGORIES.find((c) => c.id === categoryId) || null,
    [categoryId]
  );

  const service = useMemo(
    () => category?.services.find((s) => s.id === serviceId) || null,
    [category, serviceId]
  );

  function handleSelectCategory(id) {
    setCategoryId(id);
    setServiceId(null);
    setStep(2);
  }

  function handleSelectService(id) {
    setServiceId(id);
    setStep(3);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name";
    if (!/^[0-9+\s-]{7,15}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (!form.address.trim()) next.address = "Enter your service address";
    if (!form.city.trim()) next.city = "Enter your city";
    if (!form.date) next.date = "Choose a date";
    if (!form.slot) next.slot = "Choose a time slot";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!service || !category) return;
    if (!validate()) return;
    setConfirmedTicket({
      code: generateTicketCode(category.code),
      category,
      service,
      form: { ...form },
    });
  }

  function handleNewBooking() {
    setConfirmedTicket(null);
    setCategoryId(null);
    setServiceId(null);
    setForm({ fullName: "", phone: "", address: "", city: "", date: "", slot: "", notes: "" });
    setErrors({});
    setStep(1);
  }

  const canReviewTicket = Boolean(category);

  return (
    <div className="wsw-booking-page">
      <header className="wsw-booking-page__header">
        <div className="wsw-booking-page__header-inner">
          <span className="wsw-booking-page__eyebrow">Book a service</span>
          <h1 className="wsw-booking-page__title">
            Tell us what's broken.
            <br />
            We'll send someone who can fix it.
          </h1>
          <p className="wsw-booking-page__subtitle">
            Plumbing, electrical, appliances or IT devices — one booking, one visit, one bill.
          </p>
        </div>
      </header>

      {confirmedTicket ? (
        <ConfirmationView ticket={confirmedTicket} onNewBooking={handleNewBooking} />
      ) : (
        <div className="wsw-booking-page__body">
          <div className="wsw-booking-page__main">
            <ol className="wsw-booking-page__steps" aria-label="Booking steps">
              <StepPill index={1} label="Category" active={step === 1} done={Boolean(category)} onClick={() => setStep(1)} />
              <StepPill index={2} label="Service" active={step === 2} done={Boolean(service)} onClick={() => category && setStep(2)} disabled={!category} />
              <StepPill index={3} label="Details" active={step === 3} done={false} onClick={() => service && setStep(3)} disabled={!service} />
            </ol>

            {step === 1 && (
              <section className="wsw-booking-page__panel" aria-label="Choose a service category">
                <h2 className="wsw-booking-page__panel-title">What needs attention?</h2>
                <div className="wsw-booking-page__category-grid">
                  {SERVICE_CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      className={
                        "wsw-booking-page__category-card" +
                        (c.id === categoryId ? " wsw-booking-page__category-card--selected" : "")
                      }
                      onClick={() => handleSelectCategory(c.id)}
                    >
                      <span className="wsw-booking-page__category-code">{c.code}</span>
                      <span className="wsw-booking-page__category-label">{c.label}</span>
                      <span className="wsw-booking-page__category-tagline">{c.tagline}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 2 && category && (
              <section className="wsw-booking-page__panel" aria-label="Choose a specific service">
                <button type="button" className="wsw-booking-page__back-link" onClick={() => setStep(1)}>
                  ← {category.label}
                </button>
                <h2 className="wsw-booking-page__panel-title">Pick the exact job</h2>
                <ul className="wsw-booking-page__service-list">
                  {category.services.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        className={
                          "wsw-booking-page__service-row" +
                          (s.id === serviceId ? " wsw-booking-page__service-row--selected" : "")
                        }
                        onClick={() => handleSelectService(s.id)}
                      >
                        <span className="wsw-booking-page__service-name">{s.label}</span>
                        <span className="wsw-booking-page__service-meta">
                          <span>{s.duration}</span>
                          <span className="wsw-booking-page__service-price">{s.price}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {step === 3 && category && service && (
              <section className="wsw-booking-page__panel" aria-label="Enter booking details">
                <button type="button" className="wsw-booking-page__back-link" onClick={() => setStep(2)}>
                  ← {service.label}
                </button>
                <h2 className="wsw-booking-page__panel-title">Where and when</h2>

                <form className="wsw-booking-page__form" onSubmit={handleSubmit} noValidate>
                  <div className="wsw-booking-page__field-row">
                    <Field
                      id="fullName"
                      label="Full name"
                      value={form.fullName}
                      onChange={(v) => updateField("fullName", v)}
                      error={errors.fullName}
                      autoComplete="name"
                    />
                    <Field
                      id="phone"
                      label="Phone number"
                      value={form.phone}
                      onChange={(v) => updateField("phone", v)}
                      error={errors.phone}
                      type="tel"
                      autoComplete="tel"
                    />
                  </div>

                  <Field
                    id="address"
                    label="Service address"
                    value={form.address}
                    onChange={(v) => updateField("address", v)}
                    error={errors.address}
                    autoComplete="street-address"
                  />

                  <Field
                    id="city"
                    label="City"
                    value={form.city}
                    onChange={(v) => updateField("city", v)}
                    error={errors.city}
                    autoComplete="address-level2"
                  />

                  <div className="wsw-booking-page__field-row">
                    <Field
                      id="date"
                      label="Preferred date"
                      value={form.date}
                      onChange={(v) => updateField("date", v)}
                      error={errors.date}
                      type="date"
                    />
                    <div className="wsw-booking-page__field">
                      <label className="wsw-booking-page__label" htmlFor="slot">
                        Time slot
                      </label>
                      <select
                        id="slot"
                        className={
                          "wsw-booking-page__select" +
                          (errors.slot ? " wsw-booking-page__select--error" : "")
                        }
                        value={form.slot}
                        onChange={(e) => updateField("slot", e.target.value)}
                      >
                        <option value="">Choose a time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.slot && <span className="wsw-booking-page__error">{errors.slot}</span>}
                    </div>
                  </div>

                  <div className="wsw-booking-page__field">
                    <label className="wsw-booking-page__label" htmlFor="notes">
                      Notes for the technician <span className="wsw-booking-page__label-optional">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      className="wsw-booking-page__textarea"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Gate code, parking instructions, symptoms you've noticed…"
                    />
                  </div>

                  <button type="submit" className="wsw-booking-page__submit">
                    Confirm booking
                  </button>
                </form>
              </section>
            )}
          </div>

          <aside className="wsw-booking-page__ticket-rail" aria-label="Booking summary">
            <div className="wsw-booking-page__ticket">
              <div className="wsw-booking-page__ticket-top">
                <span className="wsw-booking-page__ticket-eyebrow">Work order</span>
                <span className="wsw-booking-page__ticket-status">
                  {canReviewTicket ? "In progress" : "Not started"}
                </span>
              </div>

              <dl className="wsw-booking-page__ticket-list">
                <div className="wsw-booking-page__ticket-item">
                  <dt>Category</dt>
                  <dd>{category ? category.label : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Service</dt>
                  <dd>{service ? service.label : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Est. duration</dt>
                  <dd>{service ? service.duration : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Est. price</dt>
                  <dd>{service ? service.price : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Date</dt>
                  <dd>{formatDateLabel(form.date)}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Time</dt>
                  <dd>{form.slot || "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Address</dt>
                  <dd>{form.address ? `${form.address}${form.city ? `, ${form.city}` : ""}` : "—"}</dd>
                </div>
              </dl>

              <div className="wsw-booking-page__ticket-perforation" aria-hidden="true" />

              <p className="wsw-booking-page__ticket-footnote">
                A technician confirms your slot within 30 minutes of booking. Final price may vary after inspection.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

// ---- Subcomponents --------------------------------------------------------------

function StepPill({ index, label, active, done, onClick, disabled }) {
  return (
    <li>
      <button
        type="button"
        className={
          "wsw-booking-page__step" +
          (active ? " wsw-booking-page__step--active" : "") +
          (done ? " wsw-booking-page__step--done" : "")
        }
        onClick={onClick}
        disabled={disabled}
      >
        <span className="wsw-booking-page__step-index">{done ? "✓" : index}</span>
        <span className="wsw-booking-page__step-label">{label}</span>
      </button>
    </li>
  );
}

function Field({ id, label, value, onChange, error, type = "text", autoComplete }) {
  return (
    <div className="wsw-booking-page__field">
      <label className="wsw-booking-page__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={"wsw-booking-page__input" + (error ? " wsw-booking-page__input--error" : "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
      />
      {error && <span className="wsw-booking-page__error">{error}</span>}
    </div>
  );
}

function ConfirmationView({ ticket, onNewBooking }) {
  const { code, category, service, form } = ticket;
  return (
    <div className="wsw-booking-page__confirmation">
      <div className="wsw-booking-page__confirmation-ticket">
        <span className="wsw-booking-page__ticket-eyebrow">Booking confirmed</span>
        <h2 className="wsw-booking-page__confirmation-code">{code}</h2>
        <p className="wsw-booking-page__confirmation-line">
          {service.label} · {category.label}
        </p>
        <div className="wsw-booking-page__ticket-perforation" aria-hidden="true" />
        <dl className="wsw-booking-page__ticket-list">
          <div className="wsw-booking-page__ticket-item">
            <dt>Technician arrives</dt>
            <dd>
              {formatDateLabel(form.date)}, {form.slot}
            </dd>
          </div>
          <div className="wsw-booking-page__ticket-item">
            <dt>Address</dt>
            <dd>
              {form.address}, {form.city}
            </dd>
          </div>
          <div className="wsw-booking-page__ticket-item">
            <dt>Contact</dt>
            <dd>
              {form.fullName} · {form.phone}
            </dd>
          </div>
        </dl>
        <p className="wsw-booking-page__ticket-footnote">
          Save this code. You'll get an SMS confirmation shortly with your technician's name and photo.
        </p>
      </div>
      <button type="button" className="wsw-booking-page__submit" onClick={onNewBooking}>
        Book another service
      </button>
    </div>
  );
}