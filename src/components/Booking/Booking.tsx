import { useEffect, useState } from "react";
import { Reveal, usePrefillListener } from "../../lib/lib";
import { IconArrow, IconCheck, IconShield, IconClock, IconUser, IconPhone, LogoMark } from "../../assets/icons/Icons";
import { SERVICES, AREAS, SLOTS, PHONE_TEL } from "../../data/data";

type Form = {
  service: string;
  area: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
  note: string;
};

const EMPTY: Form = { service: "", area: "", date: "", slot: "", name: "", phone: "", note: "" };

const inputCls =
  "w-full rounded-md border-2 border-pine/15 bg-cream px-3.5 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink/35 outline-none transition-colors focus:border-pine";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] font-bold tracking-[0.22em] text-pine">{label}</span>
      {children}
    </label>
  );
}

export default function Booking() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [ref, setRef] = useState("");

  usePrefillListener((p) => {
    setForm((f) => ({
      ...f,
      service: p.service !== undefined ? p.service : f.service,
      area: p.area !== undefined ? p.area : f.area,
      phone: p.phone !== undefined ? p.phone : f.phone,
    }));
  });

  useEffect(() => {
    const onNote = (e: Event) => {
      const service = (e as CustomEvent<string>).detail;
      setForm((f) => ({ ...f, note: `Re: ${service}` }));
    };
    window.addEventListener("mh:note", onNote);
    return () => window.removeEventListener("mh:note", onNote);
  }, []);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().length < 2) errs.name = "Please tell us your name";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 7) errs.phone = "Enter a valid phone number";
    if (!form.service) errs.service = "Pick a service";
    if (!form.area) errs.area = "Pick your area";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    setTimeout(() => {
      setRef(`MH-${Math.floor(1000 + Math.random() * 9000)}`);
      setStatus("done");
    }, 1100);
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
  };

  const serviceName = (id: string) => SERVICES.find((s) => s.id === id)?.name ?? "General visit";
  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="book" className="relative overflow-hidden bg-pine-deep pb-24 pt-24 sm:pb-32 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 left-1/3 h-[460px] w-[460px] rounded-full opacity-[0.13] blur-3xl"
        style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* left rail */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
              <span className="h-[3px] w-10 bg-lime" /> DISPATCH DESK — OPEN NOW
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-cream">
              Book a Sewa.
              <br />
              <span className="text-outline-cream">Breathe easy.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-cream/70">
              Fill the desk form and a dispatcher calls you back within
              <strong className="text-lime"> 5 minutes</strong> to confirm price and arrival window. Or just call —
              a human picks up, day or night.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-8 grid gap-3.5">
              {[
                { Icon: IconClock, text: "45-minute average arrival inside ring-road" },
                { Icon: IconShield, text: "30-day warranty — free revisit, same technician" },
                { Icon: IconUser, text: "You approve the technician after seeing their profile" },
                { Icon: IconPhone, text: "24/7 emergency line: 9762424318"}
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3.5 text-[14.5px] font-medium text-cream/80">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-lime/40 bg-ink/40 text-lime">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </Reveal>

        </div>

        {/* form card */}
        <Reveal dir="right" delay={200} className="lg:col-span-7">
          <div className="relative rounded-lg border-2 border-ink bg-cream p-6 text-ink shadow-hard-lime sm:p-8">
            <div className="absolute -top-4 left-7 rounded-md bg-lime px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-ink shadow-[4px_4px_0_0_rgba(3,32,26,0.85)]">
              BOOKING DESK · NO SIGNUP NEEDED
            </div>

            {status === "done" ? (
              /* ---------- success state ---------- */
              <div className="pop-in py-6 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pine text-lime">
                  <IconCheck className="h-8 w-8" />
                </span>
                <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-pine">
                  Sewa dispatched!
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-ink/65">
                  Reference <strong className="font-mono text-pine">{ref}</strong> — our dispatcher will call{" "}
                  <strong>{form.name.trim()}</strong> on <strong>{form.phone}</strong> within 5 minutes to confirm
                  the <strong>{serviceName(form.service).toLowerCase()}</strong> visit in{" "}
                  <strong>{form.area}</strong>.
                </p>
                <div className="mx-auto mt-6 grid max-w-sm gap-2 rounded-md border-2 border-dashed border-pine/25 bg-mist p-4 text-left">
                  {[
                    ["SERVICE", serviceName(form.service)],
                    ["AREA", form.area],
                    ["WHEN", `${form.date || "Today"} · ${form.slot || "ASAP"}`],
                    ["WARRANTY", "30-day service guarantee"],
                  ].map(([k, v]) => (
                    <p key={k} className="flex justify-between gap-4 font-mono text-[11px] tracking-wide">
                      <span className="font-bold text-pine/60">{k}</span>
                      <span className="font-bold text-pine">{v}</span>
                    </p>
                  ))}
                </div>
                <button
                  onClick={reset}
                  className="btn-hard mt-7 inline-flex items-center gap-2 rounded-md bg-pine px-6 py-3 font-display text-sm font-bold text-lime"
                >
                  Book another service <IconArrow className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* ---------- form ---------- */
              <form onSubmit={submit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="SERVICE NEEDED *">
                    <select value={form.service} onChange={set("service")} className={inputCls}>
                      <option value="">Select a service…</option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                      <option value="other">Something else — I'll describe it</option>
                    </select>
                    {errors.service && <p className="mt-1 text-[11px] font-semibold text-red-700">{errors.service}</p>}
                  </Field>
                  <Field label="AREA / CITY *">
                    <select value={form.area} onChange={set("area")} className={inputCls}>
                      <option value="">Select your area…</option>
                      {AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    {errors.area && <p className="mt-1 text-[11px] font-semibold text-red-700">{errors.area}</p>}
                  </Field>
                  <Field label="PREFERRED DATE">
                    <input type="date" min={today} value={form.date} onChange={set("date")} className={inputCls} />
                  </Field>
                  <Field label="TIME SLOT">
                    <select value={form.slot} onChange={set("slot")} className={inputCls}>
                      <option value="">First available</option>
                      {SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="YOUR NAME *">
                    <input value={form.name} onChange={set("name")} placeholder="e.g. Sita Sharma" className={inputCls} />
                    {errors.name && <p className="mt-1 text-[11px] font-semibold text-red-700">{errors.name}</p>}
                  </Field>
                  <Field label="PHONE / WHATSAPP *">
                    <input
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="98XXXXXXXX"
                      inputMode="tel"
                      className={inputCls}
                    />
                    {errors.phone && <p className="mt-1 text-[11px] font-semibold text-red-700">{errors.phone}</p>}
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="DESCRIBE THE PROBLEM (OPTIONAL)">
                    <textarea
                      value={form.note}
                      onChange={set("note")}
                      rows={3}
                      placeholder="e.g. Kitchen tap dripping since last night, geyser shows E4 error…"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>

                <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[260px] font-mono text-[10.5px] leading-relaxed tracking-wide text-ink/50">
                    NO ADVANCE PAYMENT · DISPATCHER CONFIRMS PRICE BEFORE THE VISIT
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-hard inline-flex items-center justify-center gap-2.5 rounded-md bg-pine px-8 py-3.5 font-display text-base font-bold text-lime disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-lime/30 border-t-lime" />
                        Contacting dispatch…
                      </>
                    ) : (
                      <>
                        Request a Sewa <IconArrow className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
