import { Reveal } from "../../lib/lib";
import { IconArrow, IconShield, IconClock, IconCheck, IconBolt } from "../../assets/icons/Icons";
import { STEPS } from "../../data/data";

export default function Process() {
  return (
    <section id="how" className="relative overflow-hidden bg-pine-deep pb-24 pt-24 sm:pb-32 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        {/* sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 font-mono text-[12px] font-bold tracking-[0.3em] text-lime">
              <span className="h-[3px] w-10 bg-lime" /> THE PROCESS
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-tight text-cream">
              सजिलो छ —<br />
              <span className="text-outline-lime">it really is</span>
              <br />
              <span className="text-lime">that simple.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-cream/70">
              We built WowSewa because hiring a Sewa shouldn't mean three phone calls, a vague
              "bholi aaunchu" and surprise bills. Four steps. Zero drama.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-md border border-cream/12 bg-ink/40 p-4 transition-colors duration-300 hover:border-lime/60">
                <IconShield className="h-6 w-6 text-lime" />
                <p className="mt-2 font-display text-sm font-bold text-cream">30-day warranty</p>
                <p className="mt-0.5 text-[12px] text-cream/55">Free revisit, same tech</p>
              </div>
              <div className="rounded-md border border-cream/12 bg-ink/40 p-4 transition-colors duration-300 hover:border-lime/60">
                <IconClock className="h-6 w-6 text-lime" />
                <p className="mt-2 font-display text-sm font-bold text-cream">45-min arrival</p>
                <p className="mt-0.5 text-[12px] text-cream/55">Inside ring-road, 24/7</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={380}>
            <a
              href="#book"
              className="group mt-9 inline-flex items-center gap-3 font-display text-lg font-bold text-lime"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-lime transition-all duration-300 group-hover:bg-lime group-hover:text-ink">
                <IconArrow className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
              </span>
              Skip the scroll — book now
            </a>
          </Reveal>
        </div>

        {/* steps */}
        <div className="relative flex flex-col gap-5">
          {/* connector line */}
          <div className="pointer-events-none absolute bottom-8 left-[27px] top-8 hidden w-[2px] bg-gradient-to-b from-lime/60 via-lime/20 to-transparent sm:block" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 130}>
              <article className="group relative flex gap-5 rounded-lg border-2 border-cream/10 bg-pine p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-lime hover:shadow-hard-lime sm:gap-7 sm:p-7">
                <div className="relative z-10 flex flex-col items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-lime/50 bg-ink font-display text-lg font-extrabold text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-ink">
                    {step.n}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-[22px] font-extrabold tracking-tight text-cream">
                    {step.title}
                    {i === 0 && (
                      <span className="ml-3 inline-flex items-center gap-1 rounded-sm bg-lime px-2 py-0.5 align-middle font-mono text-[9px] font-bold tracking-[0.15em] text-ink">
                        <IconBolt className="h-3 w-3" /> 60 SEC
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-cream/65">{step.desc}</p>
                  {i === STEPS.length - 1 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Cash", "eSewa", "Khalti", "FonePay", "Card"].map((p) => (
                        <span
                          key={p}
                          className="rounded-sm border border-lime/35 px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-wide text-lime transition-colors duration-200 hover:bg-lime hover:text-ink"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <IconCheck className="ml-auto h-6 w-6 shrink-0 self-center text-cream/15 transition-all duration-300 group-hover:scale-125 group-hover:text-lime" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
