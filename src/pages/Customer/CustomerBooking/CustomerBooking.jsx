import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useToast, ToastHost, LimeButton, GhostButton } from "../../../ui/ui";
import { fetchAPI } from "../../../utils/fetchAPI";
import { useSignalR } from "../../../hooks/signalR";
import { useAuth } from "../../../context/AuthContext";

const INDUSTRIES_ENDPOINT = "https://localhost:7011/api/Industry/getIndustryData";
const DUTIES_ENDPOINT = "https://localhost:7011/api/Duty/getAllDutyData";
const BOOKING_ENDPOINT = "https://localhost:7011/api/Booking/addBooking";

/* ---- helpers ------------------------------------------------------------ */
function categoryCode(name) {
  return (name || "").replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase();
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

/* ---- category glyphs ----------------------------------------------------- */
const G = (d) => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{d}</svg>
);
const DropG = G(<path d="M12 3s6 6.8 6 11a6 6 0 0 1-12 0c0-4.2 6-11 6-11z" />);
const BoltG = G(<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />);
const PlugG = G(<><path d="M9 2v6M15 2v6" /><path d="M6 8h12v3a6 6 0 0 1-12 0V8z" /><path d="M12 17v4" /></>);
const MonG = G(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>);
const SparkG = G(<><path d="M12 4l1.7 4.8 4.8 1.7-4.8 1.7L12 17l-1.7-4.8L5.5 10.5l4.8-1.7L12 4z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></>);
const HammG = G(<><path d="M13.5 5.5 18 10l-2.5 2.5L11 8l2.5-2.5z" /><path d="M11 8l-7.5 7.5a1.8 1.8 0 0 0 0 2.5l2.5 2.5a1.8 1.8 0 0 0 2.5 0L16 13" /><path d="M14 3l7 7" /></>);
const WrenG = G(<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2.4-.7-.7-2.4 2.9-2.7z" />);
const ShieldG = G(<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></>);
const ClockG = G(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>);
const CoinG = G(<><circle cx="12" cy="12" r="9" /><path d="M9 8.5h6M9 12h6M10 8.5c2.8 0 4 1.4 4 3.5s-1.2 3.5-4 3.5l4 3" /></>);
const CheckSmG = G(<path d="m5 12.5 4.5 4.5L19 7.5" />);

function categoryIcon(name = "") {
  const s = name.toLowerCase();
  if (/plumb|pipe|water/.test(s)) return DropG;
  if (/electric|power|wiring/.test(s)) return BoltG;
  if (/applian|fridge|wash|ac\b/.test(s)) return PlugG;
  if (/it\b|device|comput|network|cctv/.test(s)) return MonG;
  if (/clean|sanitiz/.test(s)) return SparkG;
  if (/carpent|wood|furniture/.test(s)) return HammG;
  return WrenG;
}

/* ---- barcode + ticket primitives --------------------------------------- */
const BARCODE = [3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 4, 1, 2];

function Barcode({ label }) {
  return (
    <div className="flex flex-col items-center" aria-hidden="true">
      <div className="flex h-9 items-stretch gap-[2.5px]">
        {BARCODE.map((w, i) => (
          <span key={i} style={{ width: `${w * 1.7}px` }} className={i % 6 === 4 ? "bg-[#A3C500]" : "bg-[#010A08]"} />
        ))}
      </div>
      {label && <span className="mt-1.5 font-mono text-[9.5px] font-bold tracking-[0.28em] text-[#5C6B60]">{label}</span>}
    </div>
  );
}

function Perforation() {
  return (
    <div className="relative my-4" aria-hidden="true">
      <div className="mx-5 border-t-2 border-dashed border-[#E3E5D6]" />
      <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-[#E3E5D6] bg-[#F8FAEA]" />
      <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-[#E3E5D6] bg-[#F8FAEA]" />
    </div>
  );
}

function StepPill({ index, label, active, done, onClick, disabled }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2.5 rounded-full border-2 px-3.5 py-2 text-[13px] font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
          active
            ? "border-transparent bg-[#074C3A] text-[#F8FAEA] shadow-[4px_4px_0_0_rgba(209,254,23,0.9)]"
            : done
            ? "border-transparent bg-[#D1FE17] text-[#010A08] hover:-translate-y-0.5"
            : "border-[#E3E5D6] bg-white text-[#5C6B60] hover:border-[#074C3A]"
        }`}
      >
        <span
          className={`grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] font-bold ${
            active ? "bg-[#D1FE17] text-[#010A08]" : done ? "bg-[#074C3A] text-[#D1FE17]" : "bg-[#F8FAEA] text-[#5C6B60]"
          }`}
        >
          {done ? "✓" : index}
        </span>
        {label}
      </button>
    </li>
  );
}

function FormField({ id, label, value, onChange, error, type = "text", autoComplete, optional, ...rest }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#5C6B60]" htmlFor={id}>
        {label}{" "}
        {optional && <span className="font-semibold normal-case tracking-normal text-[#9aa89d]">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full rounded-lg border-2 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#010A08] outline-none transition-all duration-150 placeholder:font-medium placeholder:text-[#9aa89d] focus:ring-2 focus:ring-[#D1FE17]/60 ${
          error ? "border-[#C0392B]" : "border-[#E3E5D6] focus:border-[#074C3A]"
        }`}
        {...rest}
      />
      {error && (
        <span className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-bold text-[#C0392B]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 8v5M12 16.5v.01" />
            <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

function ConfirmationView({ ticket, onNewBooking, onCopy, copied }) {
  const { code, category, service, form } = ticket;
  return (
    <div className="fade-up mx-auto mt-8 max-w-xl">
      <div className="pop-badge relative rounded-xl border border-[#E3E5D6] bg-white px-7 pb-7 pt-10 text-center shadow-[0_30px_60px_-30px_rgba(1,10,8,0.45)]">
        <span className="absolute -top-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-4 border-[#F8FAEA] bg-[#D1FE17] shadow-[0_12px_26px_-10px_rgba(163,197,0,0.9)]">
          <CheckSmG className="h-6 w-6 text-[#010A08]" />
        </span>

        <p className="font-mono text-[10.5px] font-bold tracking-[0.28em] text-[#5C6B60]">BOOKING CONFIRMED</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold tracking-tight text-[#010A08]">{code}</h2>
          <button
            type="button"
            onClick={() => onCopy(code)}
            className={`rounded-lg border-2 px-3.5 py-1.5 font-mono text-[11.5px] font-bold tracking-wide transition-all duration-150 ${
              copied
                ? "border-[#074C3A] bg-[#074C3A] text-[#D1FE17]"
                : "border-[#E3E5D6] bg-white text-[#074C3A] hover:border-[#074C3A] hover:bg-[#D1FE17] hover:text-[#010A08]"
            }`}
          >
            {copied ? "COPIED ✓" : "COPY"}
          </button>
        </div>
        <p className="mt-1 text-sm font-semibold text-[#5C6B60]">
          {service.name} · {category.name}
        </p>

        <Perforation />

        <dl className="mx-auto max-w-sm space-y-2.5 text-left text-[13px]">
          {[
            ["Technician arrives", `${formatDateLabel(form.date)}, ${formatTime(form.slot)}`],
            ["Address", form.address],
            ["Contact", `${form.fullName} · ${form.phone}`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3">
              <dt className="text-[#5C6B60]">{k}</dt>
              <dd className="max-w-[58%] text-right font-mono text-[12.5px] font-bold text-[#010A08]">{v}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 rounded-lg bg-[#F8FAEA] px-3 py-2">
            <dt className="text-[12.5px] font-bold text-[#074C3A]">Est. total</dt>
            <dd className="font-mono text-[15px] font-bold text-[#074C3A]">{formatRs(service.price)}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <Barcode label={`WOWSEWA • ${code}`} />
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-[#9aa89d]">
          Save this code. You'll get an SMS confirmation shortly with your technician's name and photo.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <LimeButton onClick={onNewBooking}>+ Book another service</LimeButton>
        <GhostButton onClick={() => { window.location.hash = "#/console/customer/history"; }}>View history</GhostButton>
      </div>
    </div>
  );
}

export default function CustomerBooking() {
  const { user } = useAuth();
  const guidId = user?.guidId ?? null;
  const { toasts, push } = useToast();
  const { connection, isConnected } = useSignalR() || {};

  const [rawIndustryData, setRawIndustryData] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [rawDutyData, setRawDutyData] = useState([]);
  const [dutiesLoading, setDutiesLoading] = useState(true);

  const loadIndustries = useCallback(async () => {
    setIndustriesLoading(true);
    const res = await fetchAPI(INDUSTRIES_ENDPOINT, "GET");
    setRawIndustryData(Array.isArray(res) ? res : []);
    setIndustriesLoading(false);
  }, []);

  const loadDuties = useCallback(async () => {
    setDutiesLoading(true);
    const res = await fetchAPI(DUTIES_ENDPOINT, "GET");
    setRawDutyData(Array.isArray(res) ? res : []);
    setDutiesLoading(false);
  }, []);

  useEffect(() => {
    loadIndustries();
    loadDuties();
  }, [loadIndustries, loadDuties]);

  /* Live catalog updates: if the admin changes the service catalog while
     this page is open, refresh silently without disturbing the step. */

     
useEffect(() => {
  if (!connection || !isConnected) return;
  const handleEntityUpdate = (payload) => {
    if (payload?.entityType === "Industry") loadIndustries();
    if (payload?.entityType === "Duty") loadDuties();
  };
  connection.on("EntityUpdated", handleEntityUpdate);
  return () => connection.off("EntityUpdated", handleEntityUpdate);
}, [connection, isConnected, loadIndustries, loadDuties]);


  const industries = useMemo(() => (rawIndustryData || []).map(normalizeIndustry), [rawIndustryData]);
  const duties = useMemo(() => (rawDutyData || []).map(normalizeDuty), [rawDutyData]);
  const isLoadingCatalog = industriesLoading || dutiesLoading;

  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.name || "",
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.name) setForm((prev) => ({ ...prev, fullName: prev.fullName || user.name }));
  }, [user?.name]);

  const category = useMemo(() => industries.find((c) => c.id === categoryId) || null, [industries, categoryId]);
  const categoryServices = useMemo(() => duties.filter((d) => d.industryId === categoryId), [duties, categoryId]);
  const service = useMemo(() => duties.find((s) => s.id === serviceId) || null, [duties, serviceId]);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const ticketStatus = service
    ? { label: "Ready to confirm", bg: "rgba(209,254,23,0.3)", fg: "#4f6b00", dot: "#86a800", pulse: true }
    : category
    ? { label: "In progress", bg: "rgba(232,163,61,0.2)", fg: "#8a5a12", dot: "#E8A33D", pulse: false }
    : { label: "Not started", bg: "#F1F3E4", fg: "#5C6B60", dot: "#9aa89d", pulse: false };

  const handleSelectCategory = (id) => {
    setCategoryId(id);
    setServiceId(null);
    setStep(2);
  };
  const handleSelectService = (id) => {
    setServiceId(id);
    setStep(3);
  };
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name";
    if (!/^[0-9+\s-]{7,15}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (!form.address.trim()) next.address = "Enter your address";
    if (!form.date) next.date = "Choose a date";
    if (!form.slot) next.slot = "Choose a time";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !category || !validate()) return;
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

    const res = await fetchAPI(BOOKING_ENDPOINT, "POST", payload);
    setSubmitting(false);

    if (res) {
      const code = res?.bookingCode ?? res?.BookingCode;
      setConfirmedTicket({ code, category, service, form: { ...form } });
      push(`Booking ${code} confirmed`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitError("We couldn't confirm your booking. Please try again.");
    }
  };

  const handleNewBooking = () => {
    setConfirmedTicket(null);
    setCategoryId(null);
    setServiceId(null);
    setForm({ fullName: user?.name || "", phone: "", address: "", date: "", slot: "", notes: "" });
    setErrors({});
    setSubmitError("");
    setCopied(false);
    setStep(1);
  };

  const copyCode = (code) => {
    try { navigator.clipboard?.writeText(code); } catch { /* noop */ }
    setCopied(true);
    push("Booking code copied");
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-[62rem] px-4 py-6 sm:px-6 lg:px-8">
      {/* ---------- header band ---------- */}
      <header className="relative overflow-hidden rounded-xl bg-[#074C3A] px-7 py-9 text-[#F8FAEA] shadow-[0_30px_60px_-30px_rgba(1,10,8,0.6)] sm:px-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(209,254,23,0.05) 0px, rgba(209,254,23,0.05) 1px, transparent 1px, transparent 14px)" }}
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[26px] border-[rgba(209,254,23,0.14)]" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-4 -top-8 h-32 w-32 rounded-full border-[14px] border-[rgba(248,250,234,0.08)]" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-24 right-28 h-56 w-56 rounded-full bg-[rgba(209,254,23,0.16)] blur-3xl" aria-hidden="true" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(209,254,23,0.4)] bg-[rgba(209,254,23,0.12)] px-3.5 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.22em] text-[#D1FE17]">
            <WrenG className="h-3.5 w-3.5" /> BOOK A SERVICE
          </span>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.04] tracking-tight">
            Tell us what's broken.
            <br />
            We'll send someone who can <span className="text-[#D1FE17]">fix it.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-[#F8FAEA]/70">
            Plumbing, electrical, appliances or IT devices — one booking, one visit, one bill.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {[
              [ShieldG, "Verified technicians"],
              [ClockG, "Slot confirmed in ~30 min"],
              [CoinG, "Pay after the job is done"],
            ].map(([Ico, t]) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-[rgba(248,250,234,0.2)] bg-[rgba(248,250,234,0.07)] px-3.5 py-1.5 text-[12px] font-bold text-[#F8FAEA]/85 transition-colors duration-200 hover:border-[#D1FE17]/50">
                <Ico className="h-3.5 w-3.5 text-[#D1FE17]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {confirmedTicket ? (
        <ConfirmationView ticket={confirmedTicket} onNewBooking={handleNewBooking} onCopy={copyCode} copied={copied} />
      ) : (
        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_330px]">
          {/* ---------- main flow ---------- */}
          <div>
            <ol className="mb-6 flex flex-wrap items-center gap-2.5" aria-label="Booking steps">
              <StepPill index={1} label="Category" active={step === 1} done={Boolean(category)} onClick={() => setStep(1)} />
              <StepPill index={2} label="Service" active={step === 2} done={Boolean(service)} onClick={() => category && setStep(2)} disabled={!category} />
              <StepPill index={3} label="Details" active={step === 3} done={false} onClick={() => service && setStep(3)} disabled={!service} />
            </ol>

            <div key={step} className="fade-up">
              {/* STEP 1 — category */}
              {step === 1 && (
                <section className="rounded-xl border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)] sm:p-7" aria-label="Choose a service category">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-extrabold text-[#010A08]">What needs attention?</h2>
                    <span className="mt-1 font-mono text-[11px] font-bold tracking-[0.2em] text-[#9aa89d]">01 / 03</span>
                  </div>

                  {isLoadingCatalog ? (
                    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading categories">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-[122px] animate-pulse rounded-xl bg-[#ECEEE0]" />
                      ))}
                    </div>
                  ) : industries.length > 0 ? (
                    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                      {industries.map((c) => {
                        const Ico = categoryIcon(c.name);
                        const sel = c.id === categoryId;
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => handleSelectCategory(c.id)}
                            className={`group rounded-xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1 ${
                              sel
                                ? "border-transparent bg-[#074C3A] shadow-[6px_6px_0_0_#D1FE17]"
                                : "border-[#E3E5D6] bg-white hover:border-[#074C3A] hover:shadow-[0_22px_40px_-24px_rgba(1,10,8,0.35)]"
                            }`}
                          >
                            <span className="flex items-start justify-between">
                              <span className={`grid h-11 w-11 place-items-center rounded-lg transition-colors duration-200 ${sel ? "bg-[#D1FE17] text-[#010A08]" : "bg-[#F8FAEA] text-[#074C3A] group-hover:bg-[#D1FE17]"}`}>
                                <Ico className="h-5.5 w-5.5" style={{ width: "1.35rem", height: "1.35rem" }} />
                              </span>
                              <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.14em] ${sel ? "bg-[rgba(248,250,234,0.12)] text-[#D1FE17]" : "bg-[#F8FAEA] text-[#5C6B60]"}`}>
                                {categoryCode(c.name)}
                              </span>
                            </span>
                            <span className={`mt-3.5 block font-display text-lg font-extrabold leading-tight ${sel ? "text-[#F8FAEA]" : "text-[#010A08]"}`}>{c.name}</span>
                            {c.tagline && (
                              <span className={`mt-1 block text-[12.5px] leading-snug ${sel ? "text-[#F8FAEA]/65" : "text-[#5C6B60]"}`}>{c.tagline}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-lg bg-[#F8FAEA] px-4 py-8 text-center text-sm font-semibold text-[#5C6B60]">
                      No service categories available right now.
                    </p>
                  )}
                </section>
              )}

              {/* STEP 2 — service */}
              {step === 2 && category && (
                <section className="rounded-xl border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)] sm:p-7" aria-label="Choose a specific service">
                  <button type="button" onClick={() => setStep(1)} className="mb-3 inline-flex items-center gap-1.5 font-mono text-[12px] font-bold text-[#074C3A] transition-colors hover:text-[#4f6b00]">
                    ← {category.name}
                  </button>
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-extrabold text-[#010A08]">Pick the exact job</h2>
                    <span className="mt-1 font-mono text-[11px] font-bold tracking-[0.2em] text-[#9aa89d]">02 / 03</span>
                  </div>

                  {isLoadingCatalog ? (
                    <div className="space-y-2.5" aria-label="Loading services">
                      {[0, 1, 2, 3].map((i) => <div key={i} className="h-[62px] animate-pulse rounded-xl bg-[#ECEEE0]" />)}
                    </div>
                  ) : categoryServices.length > 0 ? (
                    <ul className="space-y-2.5">
                      {categoryServices.map((s) => {
                        const sel = s.id === serviceId;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => handleSelectService(s.id)}
                              className={`group flex w-full items-center justify-between gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                                sel
                                  ? "border-transparent bg-[#074C3A] shadow-[5px_5px_0_0_#D1FE17]"
                                  : "border-[#E3E5D6] bg-white hover:translate-x-1 hover:border-[#074C3A]"
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                {sel && (
                                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#D1FE17]">
                                    <CheckSmG className="h-3 w-3 text-[#010A08]" />
                                  </span>
                                )}
                                <span className={`truncate text-[14.5px] font-bold ${sel ? "text-[#F8FAEA]" : "text-[#010A08]"}`}>{s.name}</span>
                              </span>
                              <span className="flex shrink-0 items-center gap-3">
                                <span className={`hidden rounded px-2 py-1 font-mono text-[11px] font-bold sm:inline ${sel ? "bg-[rgba(248,250,234,0.12)] text-[#F8FAEA]/75" : "bg-[#F8FAEA] text-[#5C6B60]"}`}>
                                  {s.duration ? `${s.duration}m` : "—"}
                                </span>
                                <span className={`font-mono text-[13.5px] font-bold ${sel ? "text-[#D1FE17]" : "text-[#074C3A]"}`}>{formatRs(s.price)}</span>
                                <span className={`transition-transform duration-200 group-hover:translate-x-1 ${sel ? "text-[#D1FE17]" : "text-[#9aa89d]"}`}>→</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="rounded-lg bg-[#F8FAEA] px-4 py-8 text-center text-sm font-semibold text-[#5C6B60]">
                      No jobs listed under this category yet.
                    </p>
                  )}
                </section>
              )}

              {/* STEP 3 — details */}
              {step === 3 && category && service && (
                <section className="rounded-xl border border-[#E3E5D6] bg-white p-6 shadow-[0_16px_32px_-26px_rgba(1,10,8,0.3)] sm:p-7" aria-label="Enter booking details">
                  <button type="button" onClick={() => setStep(2)} className="mb-3 inline-flex items-center gap-1.5 font-mono text-[12px] font-bold text-[#074C3A] transition-colors hover:text-[#4f6b00]">
                    ← {service.name}
                  </button>
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <h2 className="font-display text-xl font-extrabold text-[#010A08]">Where and when</h2>
                    <span className="mt-1 font-mono text-[11px] font-bold tracking-[0.2em] text-[#9aa89d]">03 / 03</span>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField id="fullName" label="Full name" value={form.fullName} onChange={(v) => updateField("fullName", v)} error={errors.fullName} autoComplete="name" />
                      <FormField id="phone" label="Phone number" value={form.phone} onChange={(v) => updateField("phone", v)} error={errors.phone} type="tel" autoComplete="tel" placeholder="+977 98X-XXXXXXX" />
                    </div>
                    <FormField id="address" label="Address" value={form.address} onChange={(v) => updateField("address", v)} error={errors.address} autoComplete="street-address" placeholder="Street, area, city" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField id="date" label="Preferred date" value={form.date} onChange={(v) => updateField("date", v)} error={errors.date} type="date" min={todayIso} />
                      <FormField id="slot" label="Preferred time" value={form.slot} onChange={(v) => updateField("slot", v)} error={errors.slot} type="time" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#5C6B60]" htmlFor="notes">
                        Notes for the technician <span className="font-semibold normal-case tracking-normal text-[#9aa89d]">(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        placeholder="Gate code, parking instructions, symptoms you've noticed…"
                        className="w-full resize-none rounded-lg border-2 border-[#E3E5D6] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#010A08] outline-none transition-all duration-150 placeholder:font-medium placeholder:text-[#9aa89d] focus:border-[#074C3A] focus:ring-2 focus:ring-[#D1FE17]/60"
                      />
                    </div>

                    {submitError && (
                      <p className="rounded-lg bg-[rgba(192,57,43,0.1)] px-4 py-3 text-[13px] font-bold text-[#C0392B]">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-hard group flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#D1FE17] px-6 py-3.5 font-display text-[15px] font-extrabold text-[#010A08] transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#010A08]/25 border-t-[#010A08]" aria-hidden="true" />
                          Confirming…
                        </>
                      ) : (
                        <>
                          Confirm booking
                          <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                        </>
                      )}
                    </button>
                  </form>
                </section>
              )}
            </div>
          </div>

          {/* ---------- ticket rail ---------- */}
          <aside className="hidden lg:block" aria-label="Booking summary">
            <div className="sticky top-24">
              <div className="relative rounded-xl border border-[#E3E5D6] bg-white shadow-[0_24px_48px_-28px_rgba(1,10,8,0.45)]">
                <div className="flex items-center justify-between gap-2 px-5 pb-4 pt-5">
                  <span className="font-mono text-[10.5px] font-bold tracking-[0.24em] text-[#5C6B60]">WORK ORDER</span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
                    style={{ background: ticketStatus.bg, color: ticketStatus.fg }}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${ticketStatus.pulse ? "blink-dot" : ""}`} style={{ background: ticketStatus.dot }} aria-hidden="true" />
                    {ticketStatus.label}
                  </span>
                </div>

                <dl className="space-y-2.5 px-5">
                  {[
                    ["Category", category ? category.name : "—"],
                    ["Service", service ? service.name : "—"],
                    ["Est. duration", service?.duration ? `${service.duration} mins` : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[12.5px] text-[#5C6B60]">{k}</dt>
                      <dd className="max-w-[58%] truncate text-right font-mono text-[12.5px] font-bold text-[#010A08]">{v}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-3 rounded-lg bg-[#F8FAEA] px-3 py-2">
                    <dt className="text-[12.5px] font-bold text-[#074C3A]">Est. price</dt>
                    <dd className="font-mono text-[15px] font-bold text-[#074C3A]">{service ? formatRs(service.price) : "—"}</dd>
                  </div>
                  {[
                    ["Date", formatDateLabel(form.date)],
                    ["Time", formatTime(form.slot)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[12.5px] text-[#5C6B60]">{k}</dt>
                      <dd className="font-mono text-[12.5px] font-bold text-[#010A08]">{v}</dd>
                    </div>
                  ))}
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-[12.5px] text-[#5C6B60]">Address</dt>
                    <dd className="max-w-[58%] break-words text-right font-mono text-[12.5px] font-bold text-[#010A08]">{form.address || "—"}</dd>
                  </div>
                </dl>

                <Perforation />
                <div className="px-5 pb-1">
                  <Barcode label="PRE-CONFIRMATION" />
                </div>
                <p className="px-5 pb-5 pt-3 text-[11.5px] leading-relaxed text-[#9aa89d]">
                  A technician confirms your slot within 30 minutes of booking. Final price may vary after inspection.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ---------- footer strip ---------- */}
      <footer className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-mono text-[10.5px] font-bold tracking-[0.28em] text-[#9aa89d]">
        WOWSEWA
        <span className="h-1.5 w-1.5 rounded-full bg-[#A3C500]" aria-hidden="true" />
        ONE VISIT, ONE BILL
        <span className="h-1.5 w-1.5 rounded-full bg-[#A3C500]" aria-hidden="true" />
        KATHMANDU
      </footer>
      <ToastHost toasts={toasts} />
    </div>
  );
}