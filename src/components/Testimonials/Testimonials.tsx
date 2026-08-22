import { Reveal,  CountUp } from "../../lib/lib";
import { StarRow, IconChat } from "../../assets/icons/Icons";
import { TESTIMONIALS, STATS } from "../../data/data";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default function Voices() {
  const [big, ...rest] = TESTIMONIALS;

  return (
    <section id="reviews" className="relative overflow-hidden bg-pine pb-24 pt-24 sm:pb-28 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full opacity-[0.1] blur-3xl"
        style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                <span className="h-[3px] w-10 bg-lime" /> NEIGHBOURHOOD WORD — 8,200+ REVIEWS
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-tight text-cream">
                Talk of the <span className="text-lime">tole.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="flex items-center gap-4 rounded-md border border-cream/12 bg-ink/35 px-5 py-4">
              <p className="font-display text-4xl font-extrabold leading-none text-lime">4.9</p>
              <div>
                <StarRow />
                <p className="mt-1 font-mono text-[10.5px] tracking-wide text-cream/55">ACROSS GOOGLE & APP STORE</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* featured quote */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <figure className="card-lift group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border-2 border-lime/40 bg-pine-deep p-8 hover:border-lime hover:shadow-hard-lime sm:p-10">
              <IconChat className="absolute -right-6 -top-6 h-40 w-40 text-lime/[0.07] transition-transform duration-500 group-hover:rotate-12" />
              <div>
                <span className="font-display text-7xl font-extrabold leading-none text-lime">"</span>
                <blockquote className="mt-2 font-display text-[clamp(1.25rem,2.4vw,1.8rem)] font-bold leading-snug tracking-tight text-cream">
                  {big.quote}
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="flex h-13 w-13 items-center justify-center rounded-md bg-lime font-display text-lg font-extrabold text-ink" style={{ width: "3.25rem", height: "3.25rem" }}>
                  {initials(big.name)}
                </span>
                <div>
                  <p className="font-display text-base font-bold text-cream">{big.name}</p>
                  <p className="font-mono text-[11px] tracking-wide text-cream/55">{big.place}</p>
                </div>
                <span className="ml-auto rounded-sm border border-lime/40 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-lime">
                  {big.service.toUpperCase()}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* smaller quotes */}
          {rest.map((t, i) => (
            <Reveal key={t.name} delay={(i + 1) * 110} className="lg:col-span-5">
              <figure className="card-lift group relative h-full rounded-lg border-2 border-cream/10 bg-pine-deep p-7 hover:border-lime hover:shadow-hard-lime">
                <div className="flex items-center justify-between">
                  <StarRow className="h-3 w-3" />
                  <span className="rounded-sm bg-ink/60 px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-[0.16em] text-lime">
                    {t.service.toUpperCase()}
                  </span>
                </div>
                <blockquote className="mt-4 text-[14.5px] leading-relaxed text-cream/80">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-cream/10 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cream font-display text-sm font-extrabold text-pine">
                    {initials(t.name)}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-cream">{t.name}</p>
                    <p className="font-mono text-[10.5px] tracking-wide text-cream/50">{t.place}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
