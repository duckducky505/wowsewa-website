import React, { useMemo, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./CustomerBooking.css";
import { fetchHook } from "../../../hooks/fetchHook";
import { fetchAPI } from "../../../utils/fetchAPI";


function categoryCode(name) {
  return (name || "").slice(0, 3).toUpperCase();
}

function generateTicketCode(categoryName) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `WS-${categoryCode(categoryName)}-${rand}`;
}

function formatDateLabel(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(v) {
  if (!v) return "—";
  const [h, m] = v.split(":").map(Number);
  if (Number.isNaN(h)) return v;
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}

function formatRs(value) {
  return value ? `Rs ${Number(value).toLocaleString()}` : "—";
}

function normalizeIndustry(raw) {
  return {
    id: raw.industryId ?? raw.IndustryId ?? raw.id ?? raw.Id,
    name: raw.industryName ?? raw.IndustryName ?? raw.name ?? raw.Name ?? "",
    tagline: raw.tagline ?? raw.Tagline ?? raw.description ?? raw.Description ?? "",
  };
}

function normalizeDuty(raw) {
  return {
    id: raw.dutyId ?? raw.DutyId ?? raw.id ?? raw.Id,
    name: raw.dutyName ?? raw.DutyName ?? raw.name ?? raw.Name ?? "",
    industryId: raw.industryId ?? raw.IndustryId ?? raw.industry?.industryId ?? null,
    duration: raw.duration ?? raw.Duration ?? raw.estimatedDuration ?? "",
    price: raw.price ?? raw.Price ?? raw.rate ?? raw.Rate ?? 0,
  };
}

function categoryIconGlyph(name = "") {
  const s = name.toLowerCase();
  if (/plumb|pipe|water/.test(s)) return "💧";
  if (/electric|power|wiring/.test(s)) return "⚡";
  if (/applian|fridge|wash|ac\b/.test(s)) return "🔌";
  if (/it\b|device|comput|network|cctv/.test(s)) return "🖥";
  if (/clean|sanitiz/.test(s)) return "✦";
  if (/carpent|wood|furniture/.test(s)) return "🔨";
  return "🔧";
}

// ---- Barcode (decorative, matches ticket rail styling) ---------------------

const BARCODE = [3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 4, 1, 2];

function Barcode({ label }) {
  return (
    <div className="wsw-booking-page__barcode" aria-hidden="true">
      <div className="wsw-booking-page__barcode-bars">
        {BARCODE.map((w, i) => (
          <span
            key={i}
            style={{ width: `${w}px` }}
            className={i % 6 === 4 ? "wsw-booking-page__barcode-bar--lime" : ""}
          />
        ))}
      </div>
      {label && <span className="wsw-booking-page__barcode-label">{label}</span>}
    </div>
  );
}

// ---- Component --------------------------------------------------------------

export default function BookingPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("Token") : null;

  let name = "";
  let guidId = null;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? "";
      guidId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null;
    } catch (e) {
      // malformed token — treated as unauthenticated below
    }
  }

  const { data: rawIndustryData, loading: industriesLoading } = fetchHook(
    "https://localhost:7011/api/Industry/getIndustryData"
  );
  const { data: rawDutyData, loading: dutiesLoading } = fetchHook(
    "https://localhost:7011/api/Duty/getAllDutyData"
  );

  const industries = useMemo(() => (rawIndustryData || []).map(normalizeIndustry), [rawIndustryData]);
  const duties = useMemo(() => (rawDutyData || []).map(normalizeDuty), [rawDutyData]);
  const isLoadingCatalog = industriesLoading || dutiesLoading;

  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [form, setForm] = useState({
    fullName: name,
    phone: "",
    address: "",
    date: "",
    slot: "",
    notes: "",
  });
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (name) setForm((prev) => ({ ...prev, fullName: prev.fullName || name }));
  }, [name]);

  const category = useMemo(
    () => industries.find((c) => c.id === categoryId) || null,
    [industries, categoryId]
  );

  const categoryServices = useMemo(
    () => duties.filter((d) => d.industryId === categoryId),
    [duties, categoryId]
  );

  const service = useMemo(
    () => duties.find((s) => s.id === serviceId) || null,
    [duties, serviceId]
  );

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const ticketStatus = service
    ? { label: "Ready to confirm", tone: "ready" }
    : category
    ? { label: "In progress", tone: "progress" }
    : { label: "Not started", tone: "idle" };

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
    if (!form.address.trim()) next.address = "Enter your address";
    if (!form.date) next.date = "Choose a date";
    if (!form.slot) next.slot = "Choose a time";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!service || !category) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    const payload = {
      industryId: category.id,
      dutyId: service.id,
      customerName: form.fullName.trim(),
      phoneNumber: form.phone.trim(),
      address: form.address.trim(),
      preferredDate: form.date,
      preferredTime: form.slot,
      bookingDescription: form.notes.trim(),
      userId: guidId,
    };

    const res = await fetchAPI("https://localhost:7011/api/Booking/addBooking", "POST", payload);
    setSubmitting(false);

    if (res) {
      setConfirmedTicket({
        code: res?.bookingCode ?? res?.BookingCode ?? generateTicketCode(category.name),
        category,
        service,
        form: { ...form },
      });
    } else {
      setSubmitError("We couldn't confirm your booking. Please try again.");
    }
  }

  function handleNewBooking() {
    setConfirmedTicket(null);
    setCategoryId(null);
    setServiceId(null);
    setForm({ fullName: name, phone: "", address: "", date: "", slot: "", notes: "" });
    setErrors({});
    setSubmitError("");
    setStep(1);
  }

  function copyCode(code) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
  }

  // Guard is placed after all hooks are called, keeping hook order stable.
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="wsw-booking-page">
      <header className="wsw-booking-page__header">
        <div className="wsw-booking-page__header-deco" aria-hidden="true">
          <span className="wsw-booking-page__ring" />
          <span className="wsw-booking-page__ring wsw-booking-page__ring--inner" />
          <span className="wsw-booking-page__glow" />
        </div>
        <div className="wsw-booking-page__header-inner">
          <span className="wsw-booking-page__eyebrow">🔧 Book a service</span>
          <h1 className="wsw-booking-page__title">
            Tell us what's broken.
            <br />
            We'll send someone who can <span className="wsw-booking-page__title-hl">fix it.</span>
          </h1>
          <p className="wsw-booking-page__subtitle">
            Plumbing, electrical, appliances or IT devices — one booking, one visit, one bill.
          </p>

          <ul className="wsw-booking-page__trust">
            <li className="wsw-booking-page__trust-chip">🛡 Verified technicians</li>
            <li className="wsw-booking-page__trust-chip">⏱ Slot confirmed in ~30 min</li>
            <li className="wsw-booking-page__trust-chip">🪙 Pay after the job is done</li>
          </ul>
        </div>
      </header>

      {confirmedTicket ? (
        <ConfirmationView ticket={confirmedTicket} onNewBooking={handleNewBooking} onCopy={copyCode} />
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
                <div className="wsw-booking-page__panel-head">
                  <h2 className="wsw-booking-page__panel-title">What needs attention?</h2>
                  <span className="wsw-booking-page__stepcount">01 / 03</span>
                </div>

                {isLoadingCatalog ? (
                  <div className="wsw-booking-page__category-grid" aria-label="Loading">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="wsw-booking-page__skel" style={{ height: 118 }} />
                    ))}
                  </div>
                ) : industries.length > 0 ? (
                  <div className="wsw-booking-page__category-grid">
                    {industries.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        className={
                          "wsw-booking-page__category-card" +
                          (c.id === categoryId ? " wsw-booking-page__category-card--selected" : "")
                        }
                        onClick={() => handleSelectCategory(c.id)}
                      >
                        <span className="wsw-booking-page__category-top">
                          <span className="wsw-booking-page__category-icon">{categoryIconGlyph(c.name)}</span>
                          <span className="wsw-booking-page__category-code">{categoryCode(c.name)}</span>
                        </span>
                        <span className="wsw-booking-page__category-label">{c.name}</span>
                        {c.tagline && <span className="wsw-booking-page__category-tagline">{c.tagline}</span>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="wsw-booking-page__loading-note">No service categories available right now.</p>
                )}
              </section>
            )}

            {step === 2 && category && (
              <section className="wsw-booking-page__panel" aria-label="Choose a specific service">
                <button type="button" className="wsw-booking-page__back-link" onClick={() => setStep(1)}>
                  ← {category.name}
                </button>
                <div className="wsw-booking-page__panel-head">
                  <h2 className="wsw-booking-page__panel-title">Pick the exact job</h2>
                  <span className="wsw-booking-page__stepcount">02 / 03</span>
                </div>

                {isLoadingCatalog ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }} aria-label="Loading">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="wsw-booking-page__skel" style={{ height: 62 }} />
                    ))}
                  </div>
                ) : categoryServices.length > 0 ? (
                  <ul className="wsw-booking-page__service-list">
                    {categoryServices.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className={
                            "wsw-booking-page__service-row" +
                            (s.id === serviceId ? " wsw-booking-page__service-row--selected" : "")
                          }
                          onClick={() => handleSelectService(s.id)}
                        >
                          <span className="wsw-booking-page__service-left">
                            {s.id === serviceId && <span className="wsw-booking-page__service-check">✓</span>}
                            <span className="wsw-booking-page__service-name">{s.name}</span>
                          </span>
                          <span className="wsw-booking-page__service-meta">
                            <span className="wsw-booking-page__service-dur">
                              {s.duration ? `${s.duration}m` : "—"}
                            </span>
                            <span className="wsw-booking-page__service-price">{formatRs(s.price)}</span>
                            <span className="wsw-booking-page__service-arrow">→</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="wsw-booking-page__loading-note">No jobs listed under this category yet.</p>
                )}
              </section>
            )}

            {step === 3 && category && service && (
              <section className="wsw-booking-page__panel" aria-label="Enter booking details">
                <button type="button" className="wsw-booking-page__back-link" onClick={() => setStep(2)}>
                  ← {service.name}
                </button>
                <div className="wsw-booking-page__panel-head">
                  <h2 className="wsw-booking-page__panel-title">Where and when</h2>
                  <span className="wsw-booking-page__stepcount">03 / 03</span>
                </div>

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
                      placeholder="+977 98X-XXXXXXX"
                    />
                  </div>

                  <Field
                    id="address"
                    label="Address"
                    value={form.address}
                    onChange={(v) => updateField("address", v)}
                    error={errors.address}
                    autoComplete="street-address"
                    placeholder="Street, area, city"
                  />

                  <div className="wsw-booking-page__field-row">
                    <Field
                      id="date"
                      label="Preferred date"
                      value={form.date}
                      onChange={(v) => updateField("date", v)}
                      error={errors.date}
                      type="date"
                      min={todayIso}
                    />
                    <Field
                      id="slot"
                      label="Preferred time"
                      value={form.slot}
                      onChange={(v) => updateField("slot", v)}
                      error={errors.slot}
                      type="time"
                    />
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

                  {submitError && <p className="wsw-booking-page__error wsw-booking-page__error--form">{submitError}</p>}

                  <button type="submit" className="wsw-booking-page__submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="wsw-booking-page__spin" />
                        Confirming…
                      </>
                    ) : (
                      <>Confirm booking →</>
                    )}
                  </button>
                </form>
              </section>
            )}
          </div>

          <aside className="wsw-booking-page__ticket-rail" aria-label="Booking summary">
            <div className="wsw-booking-page__ticket">
              <div className="wsw-booking-page__ticket-top">
                <span className="wsw-booking-page__ticket-eyebrow">Work order</span>
                <span className={"wsw-booking-page__ticket-status wsw-booking-page__ticket-status--" + ticketStatus.tone}>
                  <span className="wsw-booking-page__ticket-status-dot" />
                  {ticketStatus.label}
                </span>
              </div>

              <dl className="wsw-booking-page__ticket-list">
                <div className="wsw-booking-page__ticket-item">
                  <dt>Category</dt>
                  <dd>{category ? category.name : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Service</dt>
                  <dd>{service ? service.name : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Est. duration</dt>
                  <dd>{service?.duration ? `${service.duration} mins` : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item wsw-booking-page__ticket-item--hl">
                  <dt>Est. price</dt>
                  <dd>{service ? formatRs(service.price) : "—"}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Date</dt>
                  <dd>{formatDateLabel(form.date)}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Time</dt>
                  <dd>{formatTime(form.slot)}</dd>
                </div>
                <div className="wsw-booking-page__ticket-item">
                  <dt>Address</dt>
                  <dd>{form.address || "—"}</dd>
                </div>
              </dl>

              <div className="wsw-booking-page__ticket-perforation" aria-hidden="true" />

              <Barcode label="PRE-CONFIRMATION" />

              <p className="wsw-booking-page__ticket-footnote">
                A technician confirms your slot within 30 minutes of booking. Final price may vary after inspection.
              </p>
            </div>
          </aside>
        </div>
      )}

      <footer className="wsw-booking-page__footer">
        WOWSEWA <span className="wsw-booking-page__footer-dot" /> ONE VISIT, ONE BILL{" "}
        <span className="wsw-booking-page__footer-dot" /> KATHMANDU
      </footer>
    </div>
  );
}

// ---- Subcomponents --------------------------------------------------------------

function StepPill({ index, label, active, done, onClick, disabled }) {
  return (
    <li className="wsw-booking-page__step-item">
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

function Field({ id, label, value, onChange, error, type = "text", autoComplete, ...rest }) {
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
        {...rest}
      />
      {error && <span className="wsw-booking-page__error">⚠ {error}</span>}
    </div>
  );
}

function ConfirmationView({ ticket, onNewBooking, onCopy }) {
  const { code, category, service, form } = ticket;

  return (
    <div className="wsw-booking-page__confirmation">
      <div className="wsw-booking-page__confirmation-ticket">
        <span className="wsw-booking-page__confirmation-badge">✓</span>

        <span className="wsw-booking-page__ticket-eyebrow">Booking confirmed</span>
        <div className="wsw-booking-page__confirmation-code-row">
          <h2 className="wsw-booking-page__confirmation-code">{code}</h2>
          <button type="button" className="wsw-booking-page__copy-btn" onClick={() => onCopy(code)}>
            Copy
          </button>
        </div>
        <p className="wsw-booking-page__confirmation-line">
          {service.name} · {category.name}
        </p>

        <div className="wsw-booking-page__ticket-perforation" aria-hidden="true" />

        <dl className="wsw-booking-page__ticket-list">
          <div className="wsw-booking-page__ticket-item">
            <dt>Technician arrives</dt>
            <dd>
              {formatDateLabel(form.date)}, {formatTime(form.slot)}
            </dd>
          </div>
          <div className="wsw-booking-page__ticket-item">
            <dt>Address</dt>
            <dd>{form.address}</dd>
          </div>
          <div className="wsw-booking-page__ticket-item">
            <dt>Contact</dt>
            <dd>
              {form.fullName} · {form.phone}
            </dd>
          </div>
          <div className="wsw-booking-page__ticket-item wsw-booking-page__ticket-item--hl">
            <dt>Est. total</dt>
            <dd>{formatRs(service.price)}</dd>
          </div>
        </dl>

        <Barcode label={`WOWSEWA • ${code}`} />

        <p className="wsw-booking-page__ticket-footnote">
          Save this code. You'll get an SMS confirmation shortly with your technician's name and photo.
        </p>
      </div>

      <div className="wsw-booking-page__confirmation-actions">
        <button type="button" className="wsw-booking-page__submit" onClick={onNewBooking}>
          + Book another service
        </button>
      </div>
    </div>
  );
}