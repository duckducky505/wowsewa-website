import { useMemo, useState } from "react";
import { SERVICES, PHONE_DISPLAY, PHONE_TEL } from "../../data/data"; // or siteContent
import { emitPrefill } from "../../lib/lib";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  IconArrow, IconCheck, IconClock, IconClose, IconPhone, IconSearch, IconShield, IconCheckCircle,
} from "../../assets/icons/Icons";

type CatId = "all" | string;

const TOTAL_ITEMS = SERVICES.reduce((n, s) => n + s.items.length, 0);

const TRUST_ITEMS = [
  { Icon: IconShield, text: "30-day workmanship warranty" },
  { Icon: IconClock, text: "37-min avg. emergency ETA" },
  { Icon: IconCheckCircle, text: "Police-verified technicians" },
  { Icon: IconPhone, text: `Hotline ${PHONE_DISPLAY} · 24/7` },
];

function book(service: string) {
  emitPrefill({ service });
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
}

export default function AllServicesPage() {
  const [cat, setCat] = useState<CatId>("all");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      SERVICES.filter(
        (s) =>
          (cat === "all" || s.id === cat) &&
          (!needle ||
            s.name.toLowerCase().includes(needle) ||
            s.desc.toLowerCase().includes(needle) ||
            s.tag.toLowerCase().includes(needle) ||
            s.items.some((it) => it.toLowerCase().includes(needle))),
      ),
    [cat, needle],
  );

  const chips = [{ id: "all", label: "All services", count: TOTAL_ITEMS }, ...SERVICES.map((s) => ({ id: s.id, label: s.name, count: s.items.length }))];

  return (
    <>
      <Navbar />

      <main id="top">
        {/* ---------------- hero ---------------- */}
        <section className="relative overflow-hidden bg-pine-deep">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70" />
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:pt-24">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-lime">
              <span className="h-[3px] w-8 bg-lime" /> Service catalogue · {TOTAL_ITEMS} specialised services
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight text-cream">
              Every service your home
              <br />
              will ever need<span className="text-lime">.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fog">
              From a single dripping tap to a full house rewiring — browse everything we do, with transparent
              starting prices. Pick a category, search a problem, book in a click.
            </p>

            {/* search */}
            <div className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border-2 border-cream/20 bg-ink/40 px-4 py-3 transition-colors focus-within:border-lime">
              <IconSearch className="h-5 w-5 shrink-0 text-lime" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Try "leakage", "laptop", "CCTV", "AC gas"…'
                className="w-full bg-transparent font-body text-sm text-cream outline-none placeholder:text-fog/60"
                aria-label="Search services"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} className="text-fog hover:text-lime" aria-label="Clear search">
                  <IconClose className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* category chips */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {chips.map((c) => {
                const active = cat === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCat(c.id)}
                    className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 font-display text-[13px] font-bold transition-colors duration-200 ${
                      active
                        ? "border-lime bg-lime text-ink shadow-[4px_4px_0_0_#03201a]"
                        : "border-cream/20 text-cream/80 hover:border-lime/60 hover:text-lime"
                    }`}
                  >
                    {c.label}
                    <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${active ? "bg-ink text-lime" : "bg-cream/10 text-fog"}`}>
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* trust strip */}
          <div className="relative border-t-2 border-lime/25 bg-ink/50">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 py-3.5 md:grid-cols-4">
              {TRUST_ITEMS.map(({ Icon, text }) => (
                <p key={text} className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-cream/75">
                  <Icon className="h-4 w-4 shrink-0 text-lime" /> {text}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- results ---------------- */}
        <section className="relative bg-pine py-14 text-cream">
          <div className="pointer-events-none absolute inset-0 bg-dots-dark opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-cream">
                {needle ? (
                  <>Results for <span className="text-lime">“{q.trim()}”</span></>
                ) : cat === "all" ? (
                  "All categories"
                ) : (
                  SERVICES.find((s) => s.id === cat)?.name
                )}
                <span className="ml-3 rounded-md bg-lime px-2 py-0.5 align-middle font-mono text-xs font-bold text-ink">
                  {filtered.length}
                </span>
              </h2>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-cream/25 p-14 text-center">
                <p className="font-display text-xl font-bold text-cream">No service matches “{q.trim()}”.</p>
                <p className="mt-2 text-sm text-fog">We still fix it — call the hotline and describe the problem.</p>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lime px-5 py-3 font-display text-sm font-bold text-ink shadow-[4px_4px_0_0_#03201a] transition-transform hover:-translate-y-0.5"
                >
                  <IconPhone className="h-4 w-4" /> Call {PHONE_DISPLAY}
                </a>
              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <article
                    key={s.id}
                    className={`group flex flex-col rounded-2xl border-2 p-6 shadow-[6px_6px_0_0_rgba(3,32,26,0.25)] transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#d1fe17] ${
                      s.accent ? "border-lime bg-lime text-ink" : "border-pine/15 bg-cream text-pine"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          s.accent ? "bg-ink text-lime" : "bg-pine text-lime"
                        }`}
                      >
                        <s.Icon className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.22em] ${s.accent ? "text-ink/60" : "text-pine/50"}`}>
                          {s.tag}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-extrabold leading-tight tracking-tight">{s.name}</h3>
                      </div>
                    </div>

                    <p className={`mt-4 text-[13.5px] leading-relaxed ${s.accent ? "text-ink/75" : "text-pine/75"}`}>{s.desc}</p>

                    <ul className="mt-4 flex-1 space-y-2">
                      {s.items.map((it) => {
                        const hit = needle && it.toLowerCase().includes(needle);
                        return (
                          <li key={it} className="flex items-start gap-2.5 text-[13px] font-medium">
                            <IconCheck className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${s.accent ? "text-ink" : "text-lime-deep"}`} />
                            <span className={hit ? "rounded bg-lime px-1 font-bold text-ink" : ""}>{it}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className={`mt-5 flex items-center justify-between border-t-2 border-dashed pt-4 ${s.accent ? "border-ink/25" : "border-pine/15"}`}>
                      <p className="font-display text-base font-extrabold">
                        Rs. {s.price.toLocaleString("en-IN")}
                        <span className={`ml-1 font-mono text-[10px] font-normal uppercase tracking-wider ${s.accent ? "text-ink/60" : "text-pine/50"}`}>
                          starting
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => book(s.name)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-display text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime ${
                          s.accent ? "bg-ink text-lime hover:bg-pine" : "bg-pine text-lime hover:bg-lime hover:text-ink"
                        }`}
                      >
                        Book now <IconArrow className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------------- CTA band ---------------- */}
        <section id="book" className="relative scroll-mt-24 overflow-hidden bg-lime text-ink">
          <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-14 lg:flex-row">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-pine/70">Can’t find your problem? Good news.</p>
              <h2 className="mt-2 max-w-2xl font-display text-[clamp(1.7rem,3.4vw,2.8rem)] font-extrabold leading-tight">
                If it’s broken, leaking, blinking or buffering — we fix it. One call covers everything.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 rounded-lg bg-pine px-6 py-4 font-display text-base font-bold text-lime shadow-[4px_4px_0_0_#03201a] transition-transform hover:-translate-y-0.5"
              >
                <IconPhone className="h-5 w-5" /> Call {PHONE_DISPLAY}
              </a>
              <a
                href={`https://wa.me/${PHONE_TEL.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-ink px-6 py-4 font-display text-base font-bold text-ink transition-colors hover:bg-ink hover:text-lime"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}