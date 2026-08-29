import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Reveal, CountUp } from "../../lib/lib";
import { IconArrow, IconBolt, IconShield, IconCheck } from "../../assets/icons/Icons";
import { ABOUT_TRADES, ABOUT_VALUES, ABOUT_JOURNEY } from "../../data/data";
import founderImg from "../../assets/images/founderIMG.jpg";
import mainImage from "../../assets/images/whychooseus.jpeg";

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function About() {
  useEffect(() => {
    document.title = "WowSewa — About us";
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-pine text-cream">
        {/* opening */}
        <section className="relative overflow-hidden bg-pine pb-16 pt-32 sm:pt-36">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[540px] w-[540px] rounded-full opacity-[0.15] blur-3xl"
            style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.2em] text-cream/50">
                  <Link to="/" className="transition-colors hover:text-lime">Home</Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-lime">About us</span>
                </p>
                <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.24em] text-cream/40">
                  <span className="blink-dot h-1.5 w-1.5 rounded-full bg-lime" /> FIELD LEDGER · EST. 2023 · KATHMANDU
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div>
                <h1 className="font-display font-extrabold leading-[0.97] tracking-tight">
                  <Reveal delay={80}><span className="block text-[clamp(2.7rem,6.4vw,5rem)] text-cream">ONE NUMBER.</span></Reveal>
                  <Reveal delay={180}><span className="text-outline-cream block text-[clamp(2.7rem,6.4vw,5rem)]">SIX TRADES.</span></Reveal>
                  <Reveal delay={280}><span className="block text-[clamp(2.7rem,6.4vw,5rem)] text-lime italic">ZERO NO-SHOWS.</span></Reveal>
                </h1>
                <Reveal delay={380}>
                  <p className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-cream/75">
                    WowSewa began with a simple frustration: a leaking tap meant three phone calls,
                    two no-shows and a price invented on the spot. We built the company we wished
                    existed — <strong className="font-semibold text-cream">vetted pros, honest pricing, and a single app</strong>{" "}
                    for plumbing, electrical, appliances and IT.
                  </p>
                </Reveal>
                <Reveal delay={460}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => scrollToId("drives")}
                      className="btn-hard inline-flex items-center gap-2.5 rounded-md bg-lime px-7 py-3.5 font-display text-base font-bold text-ink"
                    >
                      Read our story <IconArrow className="h-5 w-5 rotate-90" />
                    </button>
                    <button
                      onClick={() => scrollToId("founder")}
                      className="rounded-md border-2 border-cream/25 px-6 py-3 font-display text-base font-bold text-cream transition-colors duration-300 hover:border-lime hover:text-lime"
                    >
                      Meet the founder
                    </button>
                  </div>
                </Reveal>
              </div>

              {/* framed photo — reuses the same shot as the "what drives us" section */}
              <Reveal dir="right" delay={250} className="relative">
                <div className="relative mx-auto max-w-[460px]">
                  <div className="absolute -left-3 -top-3 h-full w-full rounded-lg border-2 border-lime/50" aria-hidden="true" />
                  <div className="relative overflow-hidden rounded-lg border-2 border-cream/20 shadow-hard-lime">
                    <img src={mainImage} alt="A WowSewa technician at work in a Kathmandu home" className="img-breathe aspect-[4/3] w-full object-cover" loading="eager" />
                  </div>
                  <div className="absolute -top-4 right-3 sm:-right-5">
                    <div className="relative" style={{ width: "6.2rem", height: "6.2rem" }}>
                      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full text-lime">
                        <defs><path id="ab-circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none" /></defs>
                        <text fontSize="10" letterSpacing="2.4" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                          <textPath href="#ab-circ">ONE TRUSTED NUMBER • SINCE 2023 • KTM •</textPath>
                        </text>
                      </svg>
                      <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-cream text-pine">
                        <IconBolt className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                  <div className="absolute -left-2 bottom-6 -rotate-3 rounded-md bg-lime px-3.5 py-2 font-mono text-[11px] font-bold tracking-[0.12em] text-ink shadow-[5px_5px_0_0_rgba(1,10,8,0.6)] sm:-left-6">
                    482 PROS ON CALL
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-cream/15 pt-8 lg:grid-cols-4">
                {[
                  { n: <><CountUp to={38} />k+</>, l: "HOMES SERVED" },
                  { n: <CountUp to={482} />, l: "VETTED PROS" },
                  { n: <>4.92<span className="text-[0.6em]">★</span></>, l: "AVERAGE RATING" },
                  { n: <CountUp to={7} />, l: "CITIES COVERED" },
                ].map((s) => (
                  <div key={s.l} className="group">
                    <p className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none text-lime transition-transform duration-300 group-hover:-translate-y-1">{s.n}</p>
                    <p className="mt-2 font-mono text-[10px] font-bold tracking-[0.22em] text-cream/45">{s.l}</p>
                    <span className="mt-3 block h-[3px] w-10 bg-lime/50 transition-all duration-300 group-hover:w-16 group-hover:bg-lime" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* trades marquee */}
        <div className="marquee-wrap marquee-paused border-y-2 border-pine bg-lime py-3 text-ink">
          <div className="marquee-track items-center">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center">
                {ABOUT_TRADES.map((t) => (
                  <span key={`${k}-${t}`} className="flex items-center whitespace-nowrap font-display text-[15px] font-bold tracking-wide">
                    <span className="px-5">{t}</span>
                    <span aria-hidden="true" className="text-pine">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* what drives us — real photo + values list */}
        <section id="drives" className="relative scroll-mt-24 bg-cream py-24 text-ink">
          <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="overflow-hidden rounded-lg border-2 border-pine/15 shadow-hard-lime">
                  <img src={mainImage} alt="Why customers choose WowSewa" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                </div>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-pine">
                  <span className="h-[3px] w-10 bg-lime-deep" /> WHAT DRIVES US
                </p>
              </Reveal>
              <Reveal delay={160}>
                <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-tight text-pine">
                  We treat your home<br />like <span className="font-display italic text-lime-deep">ours.</span>
                </h2>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
                  Every WowSewa pro is background-checked, trained and rated after each visit. We show
                  flat starting prices before anyone steps inside, settle payment only after the job is
                  done, and back every repair with a 90-day warranty.
                </p>
              </Reveal>
              <Reveal delay={280}>
                <div className="mt-8 rounded-lg border-2 border-pine bg-pine p-6 text-cream shadow-hard-lime">
                  <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.22em] text-lime">
                    <IconShield className="h-4 w-4" /> THE 90-DAY PROMISE
                  </p>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-cream/75">
                    If the same fault returns within 90 days, we come back and fix it free. No forms,
                    no arguments — that's the whole policy.
                  </p>
                </div>
              </Reveal>
            </div>

            <div>
              {ABOUT_VALUES.map((v, i) => (
                <Reveal key={v.t} delay={i * 90}>
                  <div className="group flex items-start gap-5 border-b border-dashed border-pine/20 py-7 first:pt-0 last:border-0">
                    <span className="font-display text-[40px] font-extrabold leading-none text-pine/15 transition-colors duration-300 group-hover:text-lime-deep/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-pine text-lime transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <v.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-pine">{v.t}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink/65">{v.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* founder */}
        <section id="founder" className="relative scroll-mt-24 overflow-hidden bg-pine-deep py-24 text-cream">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(209,254,23,0.05) 0px, rgba(209,254,23,0.05) 1px, transparent 1px, transparent 15px)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                <span className="h-[3px] w-10 bg-lime" /> MEET THE VISIONARY
              </p>
            </Reveal>
            <div className="mt-12 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Reveal dir="left">
                <div className="relative max-w-md">
                  <div className="absolute -left-3 -top-3 h-full w-full rounded-lg border-2 border-lime/50" aria-hidden="true" />
                  <div className="relative overflow-hidden rounded-lg border-2 border-cream/20 shadow-hard-lime">
                    <img src={founderImg} alt="Mr. Jiwan Joshi — Founder & Chief Executive of WowSewa" className="img-breathe aspect-[4/5] w-full object-cover" loading="lazy" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-cream/95 px-4 py-3">
                      <div>
                        <p className="font-display text-lg font-extrabold leading-tight text-pine">Mr. Jiwan Joshi</p>
                        <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-pine/60">FOUNDER &amp; CEO</p>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime font-display text-sm font-extrabold text-ink">JJ</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div>
                <Reveal>
                  <blockquote className="relative rounded-lg border-2 border-cream/15 bg-ink/30 p-7 sm:p-8">
                    <span className="absolute -top-7 left-5 font-display text-[90px] font-extrabold leading-none text-lime" aria-hidden="true">"</span>
                    <p className="relative font-display text-[clamp(1.3rem,2.6vw,1.8rem)] font-bold leading-snug text-cream">
                      A home runs on a hundred small things working. We exist so you never have to
                      worry about a single one of them.
                    </p>
                  </blockquote>
                </Reveal>
                <Reveal delay={150}>
                  <div className="mt-7 space-y-4 text-[14.5px] leading-relaxed text-cream/70">
                    <p>
                      Founded on the principle of technical excellence, WowSewa bridges the gap between
                      traditional utility and modern technology. Mr. Joshi established WowSewa to provide
                      a reliable, all-in-one technical solution for the community.
                    </p>
                    <p>
                      Under his leadership, WowSewa has grown to 40 trained professionals across seven
                      cities, completing over 38,000 jobs with a 4.92-star average — while keeping the
                      promise that started it all: one trusted number for the whole home.
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={250}>
                  <div className="mt-7 flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.2em] text-lime/70">
                    <span className="h-[2px] w-8 bg-lime" /> FOUNDER &amp; CHIEF EXECUTIVE · WOWSEWA
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* journey */}
        <section className="relative bg-cream py-24 text-ink">
          <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-pine">
                <span className="h-[3px] w-10 bg-lime-deep" /> THE JOURNEY
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-tight text-pine">
                From one technician to the capital's <span className="font-display italic text-lime-deep">trusted choice.</span>
              </h2>
            </Reveal>

            <div className="relative mt-16">
              <div className="absolute left-2 top-0 h-full w-[3px] bg-pine/15 lg:left-0 lg:top-2 lg:h-[3px] lg:w-full" aria-hidden="true" />
              <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
                {ABOUT_JOURNEY.map((j, i) => (
                  <Reveal key={j.year} delay={i * 120} className="relative pl-10 lg:pl-0 lg:pt-10">
                    <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-cream bg-lime-deep ring-2 ring-lime-deep/30 lg:left-0 lg:top-0" aria-hidden="true" />
                    <p className="font-display text-[44px] font-extrabold leading-none text-pine/15">{j.year}</p>
                    <div className="card-lift mt-3 rounded-lg border-2 border-pine/15 bg-white p-6 hover:border-pine">
                      <h3 className="font-display text-lg font-extrabold leading-tight text-pine">{j.t}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink/65">{j.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-pine-deep py-24 text-center text-cream">
          <div className="pointer-events-none absolute inset-0 bg-dots-dark opacity-30" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 60%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <p className="flex items-center justify-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                <span className="h-[3px] w-10 bg-lime" /> JOIN THE NETWORK <span className="h-[3px] w-10 bg-lime" />
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-extrabold leading-[1] tracking-tight">
                Your home,<br /><span className="font-display italic text-lime">handled.</span>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-cream/70">
                Book a vetted pro in 60 seconds — or come build the future of home services with us.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/#book"
                  className="btn-hard inline-flex items-center gap-2.5 rounded-md bg-lime px-7 py-3.5 font-display text-base font-bold text-ink"
                >
                  Book a pro now <IconArrow className="h-5 w-5" />
                </Link>
                <Link
                  to="/pro"
                  className="inline-flex items-center gap-2.5 rounded-md border-2 border-cream/30 px-7 py-3.5 font-display text-base font-bold text-cream transition-colors duration-300 hover:border-lime hover:text-lime"
                >
                  Become a WowSewa pro
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}