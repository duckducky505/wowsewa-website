import { useState } from "react";
import { Reveal } from "../../lib/lib";
import { IconPlus, IconPhone, IconChat, IconClock } from "../../assets/icons/Icons";
import { FAQS, PHONE_TEL, PHONE_DISPLAY } from "../../data/data";

export default function Faq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="relative bg-cream pb-24 pt-24 text-ink sm:pb-28 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-50" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
        {/* sticky intro + support card */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-pine">
              <span className="h-[3px] w-10 bg-pine" /> BEFORE YOU ASK
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight text-pine">
              Honest answers,
              <br />
              <span className="text-outline-ink">no runaround.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">
              The six questions every household asks us — answered the way we'd answer our own
              family. Anything else, the desk picks up in under 30 seconds.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 overflow-hidden rounded-lg border-2 border-pine bg-pine text-cream shadow-hard-ink">
              <div className="border-b border-cream/12 px-6 py-4">
                <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-lime">TALK TO A HUMAN</p>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <a href={`tel:${PHONE_TEL}`} className="group flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-lime text-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <IconPhone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-extrabold leading-tight">{PHONE_DISPLAY}</span>
                    <span className="font-mono text-[10.5px] tracking-wide text-cream/55">24/7 EMERGENCY DISPATCH</span>
                  </span>
                </a>
                <a href="#book" className="group flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-lime text-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <IconChat className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-extrabold leading-tight">Viber / WhatsApp</span>
                    <span className="font-mono text-[10.5px] tracking-wide text-cream/55">SEND A PHOTO OF THE PROBLEM</span>
                  </span>
                </a>
                <p className="flex items-center gap-2 border-t border-cream/12 pt-4 font-mono text-[11px] tracking-wide text-cream/60">
                  <IconClock className="h-4 w-4 text-lime" /> AVG. PICKUP — 28 SECONDS
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* accordion */}
        <div className="flex flex-col gap-3.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 70}>
                <div
                  className={`rounded-lg border-2 transition-all duration-300 ${
                    isOpen ? "border-pine bg-mist shadow-hard-ink" : "border-pine/15 bg-cream hover:border-pine/50"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={`font-mono text-[11px] font-bold tracking-widest ${isOpen ? "text-pine" : "text-ink/35"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[17px] font-extrabold tracking-tight text-pine sm:text-lg">{f.q}</span>
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                        isOpen ? "rotate-45 border-pine bg-pine text-lime" : "border-pine/25 text-pine"
                      }`}
                    >
                      <IconPlus className="h-4 w-4" />
                    </span>
                  </button>
                  <div className={`acc-panel ${isOpen ? "open" : ""}`}>
                    <div className="acc-inner">
                      <p className="px-6 pb-6 pl-[4.35rem] text-[14.5px] leading-relaxed text-ink/70">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
