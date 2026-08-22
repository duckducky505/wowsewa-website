import { Reveal, emitPrefill } from "../../lib/lib";
import { IconArrow, IconShield, IconClock, IconSpark } from "../../assets/icons/Icons";
import { RATES } from "../../data/data";

export default function Rates() {
  const book = (service: string) => {
    emitPrefill({ service: "" });
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("mh:note", { detail: service }));
  };

  return (
    <section id="rates" className="relative bg-cream pb-24 pt-24 text-ink sm:pb-28 sm:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-dots-light opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 font-mono text-[12px] font-bold tracking-[0.3em] text-pine">
                <span className="h-[3px] w-10 bg-pine" /> STRAIGHT PRICING — NO SURPRISES
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-tight text-pine">
                The rate card,
                <br />
                <span className="text-outline-ink">printed in public.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="flex items-center gap-3 rounded-md border-2 border-pine bg-mist px-5 py-4">
              <IconSpark className="h-5 w-5 shrink-0 text-pine" />
              <p className="max-w-[260px] text-[13px] font-medium leading-snug text-pine/80">
                Parts billed at MRP with bill photo attached. Quote changes need your approval first.
              </p>
            </div>
          </Reveal>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-lg border-2 border-pine">
          {/* header row */}
          <div className="hidden grid-cols-[1.1fr_1.5fr_140px_110px] items-center gap-4 bg-pine px-6 py-3.5 font-mono text-[10.5px] font-bold tracking-[0.22em] text-lime md:grid">
            <span>SERVICE</span>
            <span>WHAT'S INCLUDED</span>
            <span className="text-right">STARTS AT</span>
            <span className="text-right">BOOK</span>
          </div>

          {RATES.map((r, i) => (
            <Reveal key={r.service} delay={(i % 4) * 70}>
              <div
                className={`group grid cursor-pointer grid-cols-1 gap-2 px-6 py-5 transition-all duration-300 hover:bg-pine md:grid-cols-[1.1fr_1.5fr_140px_110px] md:items-center md:gap-4 ${
                  i !== RATES.length - 1 ? "border-b border-pine/12" : ""
                }`}
                onClick={() => book(r.service)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && book(r.service)}
              >
                <span className="font-display text-lg font-extrabold tracking-tight text-pine transition-colors duration-300 group-hover:text-lime">
                  {r.service}
                </span>
                <span className="text-[13.5px] leading-snug text-ink/60 transition-colors duration-300 group-hover:text-cream/75">
                  {r.includes}
                </span>
                <span className="font-mono text-[15px] font-bold text-pine transition-colors duration-300 group-hover:text-lime md:text-right">
                  Rs. {r.price.toLocaleString("en-IN")}
                </span>
                <span className="flex md:justify-end">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border-2 border-pine/25 text-pine transition-all duration-300 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                    <IconArrow className="h-4.5 w-4.5 -rotate-45" />
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* footnote chips */}
        <Reveal delay={150}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="flex items-center gap-2 font-mono text-[11.5px] font-medium tracking-wide text-ink/60">
              <IconShield className="h-4.5 w-4.5 text-pine" /> 30-day service warranty on every job
            </span>
            <span className="flex items-center gap-2 font-mono text-[11.5px] font-medium tracking-wide text-ink/60">
              <IconClock className="h-4.5 w-4.5 text-pine" /> Free revisit if the issue repeats
            </span>
            <span className="ml-auto font-mono text-[11px] tracking-wide text-ink/40">
              * Complex jobs quoted on-site before work begins
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
