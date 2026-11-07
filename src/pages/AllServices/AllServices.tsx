import { useMemo, useState, type ComponentType } from "react";
import { SERVICES, PHONE_DISPLAY, PHONE_TEL } from "../../data/data";
import { emitPrefill } from "../../lib/lib";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  IconArrow, IconClock, IconClose, IconPhone, IconSearch, IconShield, IconCheckCircle,
} from "../../assets/icons/Icons";

const TOTAL_ITEMS = SERVICES.reduce((n, s) => n + s.items.length, 0);
const TEL = PHONE_TEL.replace(/\s/g, "");

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

/* Photo with a safe fallback: no image or a wrong file name shows an icon tile */
function Pic({ src, alt, Icon, className }: {
  src?: string; alt: string; Icon: ComponentType<{ className?: string }>; className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-pine to-pine-deep text-lime/40 ${className ?? ""}`}
      >
        <Icon className="h-12 w-12" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className ?? ""}`}
    />
  );
}

export default function AllServicesPage() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  // categories that match the chip + search; inside each, only the matching services
  const sections = useMemo(
    () =>
      SERVICES.filter((s) => cat === "all" || s.id === cat)
        .map((s) => {
          const categoryHit =
            !!needle &&
            (s.name.toLowerCase().includes(needle) ||
              s.tag.toLowerCase().includes(needle) ||
              s.desc.toLowerCase().includes(needle));
          const items = !needle || categoryHit ? s.items : s.items.filter((it) => it.name.toLowerCase().includes(needle));
          return { service: s, items };
        })
        .filter((x) => x.items.length > 0),
    [cat, needle],
  );

  const chips = [
    { id: "all", label: "All services", count: TOTAL_ITEMS },
    ...SERVICES.map((s) => ({ id: s.id, label: s.name, count: s.items.length })),
  ];

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
              From a single dripping tap to a full house rewiring — browse everything we do, grouped by trade, with
              transparent starting prices. Pick a category, search a problem, book in a click.
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

        {/* ---------------- no results ---------------- */}
        {sections.length === 0 && (
          <section className="bg-pine py-14 text-cream">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <div className="rounded-2xl border-2 border-dashed border-cream/25 p-14 text-center">
                <p className="font-display text-xl font-bold text-cream">No service matches “{q.trim()}”.</p>
                <p className="mt-2 text-sm text-fog">We still fix it — call the hotline and describe the problem.</p>
                <a
                  href={`tel:${TEL}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lime px-5 py-3 font-display text-sm font-bold text-ink shadow-[4px_4px_0_0_#03201a] transition-transform hover:-translate-y-0.5"
                >
                  <IconPhone className="h-4 w-4" /> Call {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- one section per category ---------------- */}
        {sections.map(({ service: s, items }, i) => {
          const light = i % 2 === 1;
          return (
            <section
              key={s.id}
              id={s.id}
              className={`relative scroll-mt-28 overflow-hidden py-14 [content-visibility:auto] [contain-intrinsic-size:auto_900px] ${
                light ? "bg-cream text-pine" : "bg-pine text-cream"
              }`}
            >
              <div className={`pointer-events-none absolute inset-0 ${light ? "bg-grid-light" : "bg-dots-dark opacity-40"}`} />

              <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                {/* category banner */}
                <div
                  className={`mb-9 grid overflow-hidden rounded-2xl border-2 md:grid-cols-[280px_1fr] ${
                    light ? "border-pine/15 bg-white/60" : "border-cream/15 bg-ink/30"
                  }`}
                >
                  <Pic src={s.image} alt={s.name} Icon={s.Icon} className="h-44 w-full md:h-full" />
                  <div className="flex flex-col justify-center gap-3 p-6">
                    <p className={`font-mono text-[10.5px] font-bold uppercase tracking-[0.24em] ${light ? "text-pine/55" : "text-lime"}`}>
                      {s.tag}
                    </p>
                    <h2 className={`font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl ${light ? "text-pine" : "text-cream"}`}>
                      {s.name}
                    </h2>
                    <p className={`max-w-2xl text-[14px] leading-relaxed ${light ? "text-pine/75" : "text-cream/70"}`}>{s.desc}</p>
                    <p className={`font-display text-sm font-extrabold ${light ? "text-pine" : "text-cream"}`}>
                      Starting at Rs. {s.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* every service in this category */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((it) => (
                    <article
                      key={it.name}
                      className="group flex flex-col overflow-hidden rounded-xl border-2 border-pine/15 bg-cream text-pine shadow-[5px_5px_0_0_rgba(3,32,26,0.15)] transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-pine hover:shadow-[8px_8px_0_0_#d1fe17]"
                    >
                      <Pic
                        src={it.image ?? s.image}
                        alt={it.name}
                        Icon={s.Icon}
                        className="h-40 w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <h3 className="flex-1 font-display text-[1.2rem] font-extrabold leading-snug">{it.name}</h3>
                        <div className="flex items-end justify-between border-t-2 border-dashed border-pine/15 pt-3.5">
                          <div>
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-pine/55">Starts at</p>
                            <p className="mt-0.5 font-display text-[1.5rem] font-extrabold leading-none tracking-tight text-pine">
                              Rs. {s.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => book(it.name)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-pine px-3.5 py-2 font-display text-xs font-bold text-lime transition-colors duration-200 hover:bg-lime hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                          >
                            Book now <IconArrow className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

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
                href={`tel:${TEL}`}
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