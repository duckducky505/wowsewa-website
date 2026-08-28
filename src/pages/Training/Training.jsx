import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Reveal } from "../../lib/lib";
import { IconArrow, IconCheck, IconWrench, IconClock, IconLevels } from "../../assets/icons/Icons";
import {
  TRAINING_COURSES,
  TRAINING_STEPS,
  TRAINING_STEP_STYLES,
  PHONE_DISPLAY,
} from "../../data/data";
import training from "../../assets/images/training.jpeg";

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Training() {
  const [open, setOpen] = useState({ plumbing: true });
  const [track, setTrack] = useState(TRAINING_COURSES[0].name);
  const [form, setForm] = useState({ name: "", phone: "+977 ", city: "" });
  const [errs, setErrs] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "WowSewa — Training & Academy";
  }, []);

  const enrollIn = (name) => {
    setTrack(name);
    setSent(false);
    scrollToId("enrol");
  };

  const submit = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name";
    if (!/^[0-9+\s-]{7,15}$/.test(form.phone.trim())) next.phone = "Enter a valid phone";
    if (!form.city.trim()) next.city = "Enter your city";
    setErrs(next);
    if (Object.keys(next).length) return;
    setSent(true);
  };

  const inp = (bad) =>
    `w-full rounded-md border-2 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink/35 ${
      bad ? "border-[#C0392B]" : "border-pine/20 focus:border-pine"
    }`;

  return (
    <>
      <Navbar />
      <div className="bg-cream text-ink">
        {/* hero */}
        <section className="relative overflow-hidden bg-pine pb-16 pt-32 text-cream sm:pt-36">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.15] blur-3xl"
            style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-full bg-dots-dark opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.2em] text-cream/50">
                <Link to="/" className="transition-colors hover:text-lime">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-lime">Training &amp; Academy</span>
              </p>
            </Reveal>

            <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <Reveal delay={80}>
                  <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                    <span className="h-[3px] w-10 bg-lime" /> WOWSEWA ACADEMY · MACHHAPOKHARI
                  </p>
                </Reveal>
                <h1 className="mt-6 font-display font-extrabold leading-[0.98] tracking-tight">
                  <Reveal delay={140}><span className="block text-[clamp(2.5rem,5.6vw,4.4rem)]">Learn a trade.</span></Reveal>
                  <Reveal delay={230}><span className="text-outline-cream block text-[clamp(2.5rem,5.6vw,4.4rem)]">Earn a badge.</span></Reveal>
                  <Reveal delay={320}><span className="block text-[clamp(2.5rem,5.6vw,4.4rem)] text-lime">Join the network.</span></Reveal>
                </h1>
                <Reveal delay={400}>
                  <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream/75">
                    Hands-on certification courses that turn beginners into job-ready
                    professionals — taught by the same experts who run WowSewa's{" "}
                    <strong className="font-semibold text-cream">482-strong pro network</strong> across seven cities.
                  </p>
                </Reveal>
                <Reveal delay={480}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => scrollToId("catalogue")}
                      className="btn-hard inline-flex items-center gap-2.5 rounded-md bg-lime px-7 py-3.5 font-display text-base font-bold text-ink"
                    >
                      Browse courses <IconArrow className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => scrollToId("how")}
                      className="rounded-md border-2 border-cream/25 px-6 py-3 font-display text-base font-bold text-cream transition-colors duration-300 hover:border-lime hover:text-lime"
                    >
                      How it works
                    </button>
                  </div>
                </Reveal>
                <Reveal delay={560}>
                  <p className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-cream/50">
                    <span className="flex items-center gap-2"><span className="blink-dot h-1.5 w-1.5 rounded-full bg-lime" /> NEXT BATCH · 1 JULY 2026</span>
                    <span>24 SEATS PER TRACK</span>
                    <span>EMI FROM RS. 1,500/MO</span>
                  </p>
                </Reveal>
              </div>

              <Reveal dir="right" delay={260} className="relative">
                <div className="relative mx-auto max-w-[540px]">
                  <div className="rotate-2 overflow-hidden rounded-lg border-2 border-lime/50 shadow-hard-lime transition-transform duration-500 hover:rotate-0">
                    <img src={training} alt="Inside a WowSewa Academy workshop" className="img-breathe aspect-[5/4] w-full object-cover" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden="true" />
                  </div>
                  <div className="absolute -bottom-5 left-4 rounded-md bg-cream px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.2em] text-pine shadow-[5px_5px_0_0_rgba(3,32,26,0.7)]">
                    INSIDE A WOWSEWA ACADEMY WORKSHOP
                  </div>
                  <div className="absolute -top-7 right-2 sm:-right-5">
                    <div className="relative" style={{ width: "6.8rem", height: "6.8rem" }}>
                      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full text-lime">
                        <defs><path id="tr-circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none" /></defs>
                        <text fontSize="10.5" letterSpacing="2.6" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                          <textPath href="#tr-circ">CERTIFIED BY DOING • HANDS-ON • 6 TRACKS •</textPath>
                        </text>
                      </svg>
                      <span className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-lime text-ink" style={{ width: "3.2rem", height: "3.2rem" }}>
                        <IconWrench className="h-6 w-6" />
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* course ticker */}
        <div className="marquee-wrap marquee-paused border-y-2 border-pine bg-cream py-3 text-pine">
          <div className="marquee-track items-center">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center">
                {TRAINING_COURSES.map((c) => (
                  <span key={`${k}-${c.id}`} className="flex items-center whitespace-nowrap font-display text-[14px] font-bold tracking-wide">
                    <span className="px-5">{c.name.toUpperCase()} · RS. {c.price}</span>
                    <span className="text-lime-deep" aria-hidden="true">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* catalogue */}
        <section id="catalogue" className="relative scroll-mt-24 bg-cream py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <Reveal>
                  <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-pine">
                    <span className="h-[3px] w-10 bg-lime-deep" /> THE CATALOGUE
                  </p>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-tight text-pine">
                    Six tracks,<br />one <span className="font-display italic text-lime-deep">career path.</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={200}>
                <p className="max-w-sm text-[15px] leading-relaxed text-ink/65">
                  Each course mixes classroom theory with live, on-site practicals. Fees include
                  tools-kit access, materials and the certification assessment.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {TRAINING_COURSES.map((c, i) => {
                const dark = i % 2 === 0;
                const isOpen = !!open[c.id];
                return (
                  <Reveal key={c.id} delay={(i % 2) * 110}>
                    <article className={`card-lift flex h-full flex-col rounded-lg border-2 p-6 sm:p-7 ${dark ? "border-pine bg-pine text-cream" : "border-pine/20 bg-white text-ink hover:border-pine"}`}>
                      <div className="flex items-start gap-4">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md transition-transform duration-300 hover:-rotate-6 ${dark ? "bg-lime text-ink" : "bg-pine text-lime"}`}>
                          <c.icon className="h-6 w-6" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-[22px] font-extrabold leading-tight tracking-tight">{c.name}</h3>
                          <p className={`mt-0.5 text-[13px] ${dark ? "text-cream/60" : "text-ink/55"}`}>{c.sub}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-display text-[22px] font-extrabold leading-none">
                            <span className={`text-[13px] font-bold ${dark ? "text-lime" : "text-lime-deep"}`}>Rs. </span>{c.price}
                          </p>
                          <p className={`mt-1 font-mono text-[9px] font-bold tracking-[0.2em] ${dark ? "text-cream/45" : "text-ink/40"}`}>ALL-IN</p>
                        </div>
                      </div>

                      <div className={`my-5 border-t border-dashed ${dark ? "border-cream/20" : "border-pine/20"}`} aria-hidden="true" />

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                        <span className={`flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wide ${dark ? "text-lime" : "text-pine"}`}>
                          <IconClock className="h-3.5 w-3.5" /> {c.weeks}
                        </span>
                        <span className={`flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wide ${dark ? "text-lime" : "text-pine"}`}>
                          <IconLevels className="h-3.5 w-3.5" /> {c.level}
                        </span>
                      </div>

                      <p className={`mt-3.5 text-[14px] leading-relaxed ${dark ? "text-cream/70" : "text-ink/65"}`}>{c.desc}</p>

                      {isOpen && (
                        <div className="pop-in mt-5">
                          <p className={`font-mono text-[10px] font-bold tracking-[0.24em] ${dark ? "text-lime" : "text-lime-deep"}`}>CURRICULUM · 6 MODULES</p>
                          <ul className="mt-3 space-y-2">
                            {c.modules.map((m, mi) => (
                              <li key={m} className="flex items-start gap-3 text-[13px] font-medium">
                                <span className={`font-mono text-[11px] font-bold ${dark ? "text-lime/80" : "text-lime-deep"}`}>{String(mi + 1).padStart(2, "0")}</span>
                                <span className={dark ? "text-cream/85" : "text-ink/80"}>{m}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => enrollIn(c.name)}
                            className={`btn-hard mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-sm font-bold ${dark ? "bg-lime text-ink" : "bg-pine text-lime"}`}
                          >
                            Enroll in {c.name} <IconArrow className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))}
                        className={`mt-auto pt-5 text-left font-mono text-[11px] font-bold tracking-[0.16em] underline decoration-2 underline-offset-4 transition-colors ${dark ? "text-cream/60 hover:text-lime" : "text-pine/60 hover:text-pine"}`}
                      >
                        {isOpen ? "HIDE CURRICULUM −" : "VIEW CURRICULUM +"}
                      </button>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* how it works */}
        <section id="how" className="relative scroll-mt-24 overflow-hidden bg-pine py-24 text-cream">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(209,254,23,0.05) 0px, rgba(209,254,23,0.05) 1px, transparent 1px, transparent 15px)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <Reveal>
                  <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                    <span className="h-[3px] w-10 bg-lime" /> HOW IT WORKS
                  </p>
                </Reveal>
                <Reveal delay={100}>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-tight">
                    From sign-up<br />to <span className="font-display italic text-lime">first job.</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={200}>
                <p className="max-w-sm text-[15px] leading-relaxed text-cream/65">
                  A clear, four-step path. No prior experience needed for most tracks — just the
                  willingness to learn a trade properly.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TRAINING_STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 120} className={i % 2 === 1 ? "lg:translate-y-8" : ""}>
                  <div className={`group h-full rounded-lg border-2 p-6 transition-all duration-300 hover:-translate-y-1.5 ${TRAINING_STEP_STYLES[s.v]}`}>
                    <p className={`font-display text-[52px] font-extrabold leading-none ${s.v === "lime" ? "text-ink/20" : "text-lime/25"}`}>{s.n}</p>
                    <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight">{s.h}</h3>
                    <p className={`mt-2.5 text-[13.5px] leading-relaxed ${s.v === "lime" ? "text-ink/70" : "text-cream/65"}`}>{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* enroll */}
        <section id="enrol" className="relative scroll-mt-24 overflow-hidden bg-pine-deep py-24 text-cream">
          <div className="pointer-events-none absolute inset-0 bg-dots-dark opacity-30" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.1] blur-3xl"
            style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 60%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
            <div>
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                  <span className="h-[3px] w-10 bg-lime" /> ENROLL
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="mt-5 font-display text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight">
                  Start your trade<br />career this <span className="font-display italic text-lime">month.</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-cream/70">
                  Tell us which track interests you and our admissions team will reach out with the
                  next batch dates, EMI options and campus details. Scholarships available for
                  eligible candidates.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2.5 rounded-md border border-lime/40 bg-lime/10 px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.14em] text-lime">
                    <span className="blink-dot h-1.5 w-1.5 rounded-full bg-lime" /> NEXT BATCH · 1 JULY 2026
                  </span>
                  <span className="rounded-md border border-cream/20 px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.14em] text-cream/70">
                    EMI FROM RS. 1,500/MO
                  </span>
                </div>
              </Reveal>
              <Reveal delay={380}>
                <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-cream/40">
                  TOOLS-KIT &amp; MATERIALS INCLUDED · SCHOLARSHIPS FOR ELIGIBLE CANDIDATES
                  <br />QUESTIONS? CALL {PHONE_DISPLAY}
                </p>
              </Reveal>
            </div>

            <Reveal dir="right" delay={240}>
              <div className="rounded-lg border-2 border-pine bg-cream p-7 text-ink shadow-hard-lime sm:p-8">
                {sent ? (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                    <span className="pop-badge flex h-16 w-16 items-center justify-center rounded-full bg-lime">
                      <IconCheck className="h-8 w-8 text-ink" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-pine">We'll call you back.</h3>
                    <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-ink/60">
                      Admissions has your request for <strong className="font-bold text-pine">{track}</strong>.
                      Expect a call within one working day, {form.name.split(" ")[0] || "friend"}.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", phone: "+977 ", city: "" }); }}
                      className="mt-6 font-mono text-[11px] font-bold tracking-[0.16em] text-pine underline decoration-2 underline-offset-4 hover:text-lime-deep"
                    >
                      SUBMIT ANOTHER REQUEST
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-pine/60">ADMISSIONS · CALLBACK REQUEST</p>
                    <h3 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-pine">Request a call back</h3>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="tr-name" className="mb-1.5 block font-mono text-[10px] font-bold tracking-[0.2em] text-pine/70">FULL NAME</label>
                        <input id="tr-name" value={form.name} placeholder="Your name"
                          onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrs((x) => ({ ...x, name: "" })); }}
                          className={inp(errs.name)} />
                        {errs.name && <p className="pop-in mt-1 text-[11.5px] font-semibold text-[#C0392B]">⚠ {errs.name}</p>}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="tr-phone" className="mb-1.5 block font-mono text-[10px] font-bold tracking-[0.2em] text-pine/70">PHONE</label>
                          <input id="tr-phone" value={form.phone} inputMode="tel"
                            onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrs((x) => ({ ...x, phone: "" })); }}
                            className={inp(errs.phone)} />
                          {errs.phone && <p className="pop-in mt-1 text-[11.5px] font-semibold text-[#C0392B]">⚠ {errs.phone}</p>}
                        </div>
                        <div>
                          <label htmlFor="tr-city" className="mb-1.5 block font-mono text-[10px] font-bold tracking-[0.2em] text-pine/70">CITY</label>
                          <input id="tr-city" value={form.city} placeholder="Kathmandu"
                            onChange={(e) => { setForm((f) => ({ ...f, city: e.target.value })); setErrs((x) => ({ ...x, city: "" })); }}
                            className={inp(errs.city)} />
                          {errs.city && <p className="pop-in mt-1 text-[11.5px] font-semibold text-[#C0392B]">⚠ {errs.city}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="tr-track" className="mb-1.5 block font-mono text-[10px] font-bold tracking-[0.2em] text-pine/70">INTERESTED TRACK</label>
                        <select id="tr-track" value={track} onChange={(e) => setTrack(e.target.value)}
                          className="w-full cursor-pointer rounded-md border-2 border-pine/20 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition-colors focus:border-pine">
                          {TRAINING_COURSES.map((c) => (
                            <option key={c.id} value={c.name}>{c.name} — Rs. {c.price}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={submit}
                        className="btn-hard btn-hard-lime inline-flex w-full items-center justify-center gap-2 rounded-md bg-pine px-6 py-3.5 font-display text-base font-bold text-lime">
                        Request a call back <IconArrow className="h-5 w-5" />
                      </button>
                      <p className="text-center font-mono text-[10px] tracking-[0.14em] text-ink/40">NO SPAM — ONE CALL FROM A REAL HUMAN</p>
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-lime py-16 text-ink">
          <div className="pointer-events-none absolute inset-0 bg-dots-dark opacity-20" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <Reveal>
              <div>
                <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-tight tracking-tight">
                  Hiring a trained technician instead?
                </h2>
                <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink/70">
                  Every WowSewa technician is Academy-certified. Book one and see the difference training makes.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <Link
                to="/#book"
                className="btn-hard inline-flex shrink-0 items-center gap-2.5 rounded-md bg-ink px-7 py-3.5 font-display text-base font-bold text-lime"
              >
                Book a technician now <IconArrow className="h-5 w-5" />
              </Link>
            </Reveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}