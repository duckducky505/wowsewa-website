import { Reveal, emitPrefill } from "../..//lib/lib";
import { IconArrow, IconCheck } from "../../assets/icons/Icons";
import { SERVICES, type Service } from "../../data/data";

const SPANS: Record<string, string> = {
  plumbing: "sm:col-span-6 lg:col-span-5",
  electrical: "sm:col-span-6 lg:col-span-4",
  appliance: "sm:col-span-6 lg:col-span-3",
  it: "sm:col-span-6 lg:col-span-4",
  ac: "sm:col-span-6 lg:col-span-4",
  carpentry: "sm:col-span-6 lg:col-span-4",
  cleaning: "sm:col-span-6 lg:col-span-6",
  painting: "sm:col-span-6 lg:col-span-6",
};

function ServiceCard({ s, index }: { s: Service; index: number }) {
  const accent = s.accent;
  const book = () => {
    emitPrefill({ service: s.id });
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Reveal delay={(index % 3) * 110} className={SPANS[s.id] ?? "sm:col-span-6"}>
      <article
        className={`card-lift group relative flex h-full flex-col overflow-hidden rounded-lg border-2 p-6 sm:p-7 ${
          accent
            ? "border-ink bg-lime text-ink hover:shadow-[8px_8px_0_0_#074C3A]"
            : "border-pine-deep bg-pine-deep text-cream hover:border-lime hover:shadow-hard-lime"
        }`}
      >
        {/* corner index */}
        <span
          className={`absolute right-5 top-4 font-display text-4xl font-extrabold leading-none ${
            accent ? "text-pine/15" : "text-cream/10"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex items-start gap-4">
          <span
            className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-md p-3 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
              accent ? "bg-ink text-lime" : "bg-lime text-ink"
            }`}
            style={{ width: "3.25rem", height: "3.25rem" }}
          >
            <s.Icon className="h-6 w-6" />
          </span>
          <div>
            <p className={`font-mono text-[10px] font-bold tracking-[0.22em] ${accent ? "text-pine" : "text-lime"}`}>
              {s.tag}
            </p>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{s.name}</h3>
          </div>
        </div>

        <p className={`mt-4 text-[14.5px] leading-relaxed ${accent ? "text-ink/75" : "text-cream/70"}`}>{s.desc}</p>

        <ul className="mt-5 grid gap-2">
          {s.items.map((it) => (
            <li key={it} className="flex items-start gap-2.5 text-[13.5px] font-medium">
              <IconCheck className={`mt-0.5 h-4 w-4 shrink-0 ${accent ? "text-pine" : "text-lime"}`} />
              <span className={accent ? "text-ink/85" : "text-cream/85"}>{it}</span>
            </li>
          ))}
        </ul>

        <div className={`mt-auto flex items-end justify-between border-t pt-5 ${accent ? "border-ink/15" : "border-cream/10"}`}>
          <div>
            <p className={`font-mono text-[10px] tracking-[0.2em] ${accent ? "text-pine/70" : "text-cream/45"}`}>STARTS AT</p>
            <p className="font-display text-2xl font-extrabold leading-tight">
              Rs. {s.price.toLocaleString("en-IN")}
              <span className={`text-sm font-bold ${accent ? "text-pine/60" : "text-cream/50"}`}>+</span>
            </p>
          </div>
          <button
            onClick={book}
            className={`flex items-center gap-2 font-display text-sm font-bold transition-all duration-300 hover:gap-3.5 ${
              accent ? "text-ink" : "text-lime"
            }`}
          >
            Book <IconArrow className="h-4 w-4" />
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative bg-cream pb-24 pt-24 text-ink sm:pb-28 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* heading row */}
        <div className="mb-14 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 font-mono text-[14px] font-bold tracking-[0.3em] text-pine">
                <span className="h-[3px] w-10 bg-lime" /> WHAT WE FIX — 08 CORE CREWS
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-tight text-pine">
                One crew for the
                <br />
                <span className="relative inline-block">
                  whole house.
                  <svg viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                    <path d="M3 9c60-6 180-6 294-3" stroke="#D1FE17" strokeWidth="6" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink/65">
              Eight specialist crews, one dispatch desk. Every technician is trained at our Naxal
              centre, carries original spare parts, and leaves a photo report before leaving your gate.
            </p>
          </Reveal>
        </div>

        {/* bento grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} s={s} index={i} />
          ))}

          {/* CTA tile */}
          <Reveal delay={140} className="sm:col-span-12">
            <article className="card-lift group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg border-2 border-pine bg-pine p-7 text-cream hover:shadow-hard-lime sm:p-8 lg:flex-row lg:items-center">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-dots-dark opacity-50" aria-hidden="true" />
              <div>
                <p className="font-mono text-[12px] font-bold tracking-[0.22em] text-lime">CAN'T FIND YOUR PROBLEM?</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight">
                  Something else broken?
                  <br />
                  <span className="text-lime">Ask the desk.</span>
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-cream/70">
                  From intercom repair to modular kitchen builds — we handle 40+ home services under one
                  warranty. Describe it, and a supervisor quotes you within 15 minutes.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    emitPrefill({ service: "other" });
                    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-hard btn-hard-lime inline-flex items-center gap-2 rounded-md bg-cream px-6 py-3 font-display text-sm font-bold text-pine"
                >
                  Describe the problem <IconArrow className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] tracking-wide text-cream/50">AVG. QUOTE TIME — 15 MIN</span>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
