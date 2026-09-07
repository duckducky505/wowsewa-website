// src/components/ui/index.jsx
import React, { useEffect, useState } from "react";

/* ---------------------------- design tokens ---------------------------- */
export const TONES = {
  pine:  { bg: "rgba(7,76,58,0.1)",    text: "#074C3A", bar: "#074C3A", dot: "#074C3A" },
  lime:  { bg: "rgba(209,254,23,0.28)", text: "#4f6b00", bar: "#D1FE17", dot: "#9db800" },
  teal:  { bg: "rgba(13,148,136,0.12)", text: "#0d6d64", bar: "#0d9488", dot: "#0d9488" },
  amber: { bg: "rgba(217,119,6,0.12)",  text: "#92620a", bar: "#d97706", dot: "#d97706" },
  red:   { bg: "rgba(192,57,43,0.1)",   text: "#C0392B", bar: "#C0392B", dot: "#C0392B" },
  muted: { bg: "#F0F2E2",               text: "#5C6B60", bar: "#9aa89d", dot: "#9aa89d" },
};

export const inputCls =
  "w-full rounded-lg border border-[#E3E5D6] bg-white px-3.5 py-2.5 text-[13.5px] font-semibold text-[#010A08] outline-none transition-colors focus:border-[#074C3A]";

/* -------------------------------- icons -------------------------------- */
const Ic = (d) => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {d}
  </svg>
);
export const SearchIc = Ic(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const PlusIc = Ic(<path d="M12 5v14M5 12h14" />);
export const CloseIc = Ic(<path d="M6 6l12 12M18 6 6 18" />);
export const EditIc = Ic(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);
export const TrashIc = Ic(<><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>);
export const WalletIc = Ic(<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 9.5h18" /><circle cx="16.5" cy="13.5" r="1" fill="currentColor" stroke="none" /></>);
export const ReceiptIc = Ic(<><path d="M6 3h12v18l-2-1.4L14 21l-2-1.4L10 21l-2-1.4L6 21V3z" /><path d="M9 8h6M9 12h6" /></>);
export const ArrowIc = Ic(<path d="M5 12h14M13 6l6 6-6 6" />);
export const ClockIc = Ic(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const StarIc = Ic(<path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8L12 3z" />);
export const BackIc = Ic(<path d="M19 12H5M12 19l-7-7 7-7" />);

/* --------------------------------- misc --------------------------------- */
export function CountUp({ to = 0, duration = 800 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const target = Number(to) || 0;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val.toLocaleString("en-IN")}</>;
}

export function PageHead({ eyebrow, title, sub, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[#E3E5D6] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">{eyebrow}</span>}
        <h1 className="mt-1 font-display text-3xl font-extrabold text-[#010A08]">{title}</h1>
        {sub && <p className="mt-1.5 max-w-2xl text-sm text-[#5C6B60]">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}

export function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-[#E3E5D6] bg-white ${className}`}>{children}</div>;
}

export function SectionLabel({ children }) {
  return (
    <p className="mb-3 flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#5C6B60]">
      <span className="h-[2px] w-3.5 bg-[#D1FE17]" aria-hidden="true" />
      {children}
    </p>
  );
}

export function StatTile({ label, value, icon: Icon, tone = "pine", prefix = "", suffix = "", count = true }) {
  const t = TONES[tone] || TONES.muted;
  return (
    <div className="rounded-xl border border-[#E3E5D6] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#5C6B60]">{label}</span>
        {Icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: t.bg, color: t.text }}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-extrabold text-[#010A08]">
        {prefix}
        {count ? <CountUp to={value} /> : value}
        {suffix}
      </p>
    </div>
  );
}

export function Pill({ tone = "muted", pulse = false, children }) {
  const t = TONES[tone] || TONES.muted;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-bold" style={{ background: t.bg, color: t.text }}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full opacity-60" style={{ background: t.dot }} />
          <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: t.dot }} />
        </span>
      )}
      {children}
    </span>
  );
}

export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${on ? "bg-[#074C3A]" : "bg-[#E3E5D6]"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

export function Avatar({ name, tone = "pine", size = "h-10 w-10 text-[13px]" }) {
  const initials = (name || "").split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const bg = tone === "lime" ? "#D1FE17" : "#074C3A";
  const color = tone === "lime" ? "#010A08" : "#D1FE17";
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-extrabold ${size}`} style={{ background: bg, color }}>
      {initials || "?"}
    </span>
  );
}

export function LimeButton({ onClick, className = "", children, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-[#D1FE17] px-4 py-2 text-[13px] font-bold text-[#010A08] shadow-[3px_3px_0_0_rgba(1,10,8,0.35)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ onClick, className = "", children, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-[#E3E5D6] bg-white px-4 py-2 text-[13px] font-bold text-[#074C3A] transition-colors duration-150 hover:border-[#074C3A] hover:bg-[#F8FAEA] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={active === t}
          onClick={() => onChange(t)}
          className={`rounded-full px-3 py-1.5 text-[12.5px] font-bold transition-colors duration-150 ${
            active === t ? "bg-[#074C3A] text-[#D1FE17]" : "bg-[#F8FAEA] text-[#5C6B60] hover:text-[#074C3A]"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12.5px] font-bold text-[#074C3A]">
        {label} {optional && <span className="font-normal text-[#9aa89d]">(optional)</span>}
      </span>
      {children}
    </label>
  );
}

export function Modal({ title, onClose, children, narrow }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#010A08]/45 px-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-[0_30px_60px_-20px_rgba(1,10,8,0.5)] ${narrow ? "max-w-sm" : "max-w-md"}`}>
        <div className="flex items-center justify-between border-b border-[#E3E5D6] px-5 py-4">
          <h2 className="font-display text-lg font-extrabold text-[#010A08]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-md text-[#5C6B60] transition-colors hover:bg-[#F8FAEA]">
            <CloseIc className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

/* --------------------------------- toast --------------------------------- */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, tone = "pine") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, msg, tone }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  };
  return { toasts, push };
}

export function ToastHost({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-lg border border-[#E3E5D6] bg-white px-4 py-3 text-[13px] font-bold text-[#010A08] shadow-[0_16px_32px_-16px_rgba(1,10,8,0.4)]"
          style={{ borderLeft: `3px solid ${(TONES[t.tone] || TONES.pine).bar}` }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}