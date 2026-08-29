import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  IconArrow, IconCheck, IconStar, IconPhone, IconPin, IconGlobe, IconShield, IconWrench,
} from "../../assets/icons/Icons";
import {
  PHONE_TEL, PHONE_DISPLAY, ADDRESS,
  AMC_PLANS, AMC_SERVICES, AMC_TRUST, AMC_MARQUEE,
} from "../../data/data";

import starterImg from "../../assets/images/starter.jpg";
import businessImg from "../../assets/images/business.jpg";
import corporateImg from "../../assets/images/corporate.jpg";
import acImg from "../../assets/images/AC AMC.jpg";
import solarImg from "../../assets/images/SolarAMC.jpg";
import refrigeratorImg from "../../assets/images/RefrigeratorAMC.jpg";
import networkingAMC from "../../assets/images/NetworkingAMC.jpg"

const PLAN_IMAGES = {
  "Starter Plan": starterImg,
  "Business Plan": businessImg,
  "Corporate Plan": corporateImg,
};

const SERVICE_IMAGES = {
  ac: acImg,
  solar: solarImg,
  refrigerator: refrigeratorImg,
  networking: networkingAMC,
};

/* "A. B." → A. <accent>B.</accent> */
const SplitTag = ({ text, className = "", accent = "text-lime" }) => {
  const i = text.indexOf(". ");
  if (i === -1) return <p className={className}>{text}</p>;
  return (
    <p className={className}>
      {text.slice(0, i + 1)} <span className={accent}>{text.slice(i + 2)}</span>
    </p>
  );
};

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function AMC() {
  const [activeTab, setActiveTab] = useState(AMC_SERVICES[0].id);
  const activeService = AMC_SERVICES.find((s) => s.id === activeTab);

  useEffect(() => {
    document.title = "WowSewa — AMC";
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-cream text-ink">
        {/* hero */}
        <section className="relative overflow-hidden bg-pine pb-20 pt-36 text-cream sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.15] blur-3xl"
            style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.2em] text-cream/50">
                <a href="/" className="transition-colors hover:text-lime">Home</a>
                <span aria-hidden="true">/</span>
                <span className="text-lime">AMC</span>
              </p>
              <p className="mt-6 flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                <span className="h-[3px] w-10 bg-lime" /> ANNUAL &amp; MONTHLY MAINTENANCE
              </p>
              <h1 className="mt-5 font-display font-extrabold leading-[0.98] tracking-tight">
                <span className="block text-[clamp(2.6rem,5.8vw,4.6rem)]">You rest.</span>
                <span className="block text-[clamp(2.6rem,5.8vw,4.6rem)] text-lime italic">We care.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream/75">
                One AMC for your entire space — AC, solar &amp; inverter, refrigeration,
                networking, plus plumbing, electrical, IT and home-appliance care by
                WowSewa's expert technicians in Kathmandu.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToId("plans")}
                  className="btn-hard inline-flex items-center gap-2.5 rounded-md bg-lime px-7 py-3.5 font-display text-base font-bold text-ink"
                >
                  View monthly plans <IconArrow className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollToId("programs")}
                  className="rounded-md border-2 border-cream/25 px-6 py-3 font-display text-base font-bold text-cream transition-colors duration-300 hover:border-lime hover:text-lime"
                >
                  Explore AMC programs
                </button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2.5">
                {AMC_TRUST.map((t) => (
                  <span key={t.t} className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.14em] text-cream/60">
                    <span className="blink-dot h-1.5 w-1.5 rounded-full bg-lime" /> {t.t.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* brochure art — real plan photos */}
            <div className="relative">
              <div className="relative mx-auto h-[400px] max-w-[480px] sm:h-[430px]">
                <div className="group absolute left-0 top-4 w-[64%] -rotate-[4deg] overflow-hidden rounded-lg border-2 border-lime/50 shadow-hard-lime transition-all duration-500 hover:z-20 hover:rotate-0">
                  <img src={acImg} alt="AC AMC" className="aspect-[4/5] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-pine-deep/90 px-4 py-3 backdrop-blur-sm">
                    <p className="font-mono text-[9px] font-bold tracking-[0.24em] text-lime">WOWSEWA AMC</p>
                    <p className="mt-1 font-display text-lg font-extrabold text-cream">AC AMC</p>
                  </div>
                </div>
                <div className="group absolute bottom-2 right-0 w-[52%] overflow-hidden rounded-lg border-2 border-cream/20 rotate-[3deg] shadow-[12px_14px_0_0_rgba(209,254,23,0.3)] transition-all duration-500 hover:z-20 hover:rotate-0">
                  <img src={starterImg} alt="Starter plan" className="aspect-[5/4] w-full object-cover" />
                  <div className="bg-cream px-4 py-3 text-ink">
                    <p className="font-mono text-[9px] font-bold tracking-[0.22em] text-pine/60">STARTER PLAN</p>
                    <p className="mt-1 font-display text-2xl font-extrabold text-pine">
                      <span className="text-sm font-bold text-lime-deep">Rs. </span>8,000
                      <span className="text-xs font-bold text-ink/45">/mo</span>
                    </p>
                  </div>
                </div>
                <div className="absolute -top-3 right-6 rounded-md bg-lime px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.16em] text-ink shadow-[4px_4px_0_0_rgba(1,10,8,0.6)]">
                  100% RELIABILITY
                </div>
                <div className="absolute bottom-16 -left-2 rounded-md bg-ink px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.16em] text-lime shadow-[4px_4px_0_0_rgba(209,254,23,0.4)] sm:-left-5">
                  ON-TIME SERVICE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* marquee */}
        <div className="marquee-wrap marquee-paused border-y-2 border-pine bg-lime py-3 text-ink">
          <div className="marquee-track items-center">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center">
                {AMC_MARQUEE.map((m) => (
                  <span key={`${k}-${m}`} className="flex items-center whitespace-nowrap font-display text-[15px] font-bold tracking-wide">
                    <span className="px-5">{m}</span>
                    <span aria-hidden="true" className="text-pine">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* plans */}
        <section id="plans" className="relative scroll-mt-24 bg-cream py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="flex items-center justify-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-pine">
                <span className="h-[3px] w-10 bg-lime-deep" /> MONTHLY AMC PLANS <span className="h-[3px] w-10 bg-lime-deep" />
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.03] tracking-tight text-pine">
                Reliable care. <span className="font-display italic text-lime-deep">Every month.</span>
              </h2>
              <p className="mt-3 text-[15px] text-ink/65">Peace of mind, every day. Choose the tier built for your scale of operations.</p>
            </div>

            <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
              {AMC_PLANS.map((p) => (
                <article
                  key={p.name}
                  className={`card-lift relative flex h-full flex-col overflow-hidden rounded-lg border-2 ${
                    p.featured ? "border-pine bg-pine text-cream shadow-hard-lime lg:-translate-y-4" : "border-pine/15 bg-white text-ink hover:border-pine"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute right-0 top-0 z-10 flex items-center gap-1.5 rounded-bl-lg bg-lime px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-ink">
                      <IconStar className="h-3 w-3" /> MOST POPULAR
                    </span>
                  )}

                  <div className="relative">
                    <img src={PLAN_IMAGES[p.name]} alt={`${p.name} poster`} className="aspect-[16/9] w-full object-cover" />
                    <span className={`absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-md ${p.featured ? "bg-lime text-ink" : "bg-pine text-lime"}`}>
                      <p.icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[22px] font-extrabold tracking-tight">{p.name}</h3>
                    <SplitTag text={p.tagline} className={`mt-1 text-[13px] ${p.featured ? "text-cream/60" : "text-ink/55"}`} accent={p.featured ? "text-lime" : "text-lime-deep"} />
                    <p className="mt-4 font-display text-4xl font-extrabold tracking-tight">
                      <span className={`text-base font-bold ${p.featured ? "text-lime" : "text-lime-deep"}`}>Rs. </span>
                      {p.price}
                      <span className={`text-sm font-bold ${p.featured ? "text-cream/50" : "text-ink/45"}`}> / month</span>
                    </p>

                    <p className={`mt-5 font-mono text-[10px] font-bold tracking-[0.2em] ${p.featured ? "text-lime" : "text-pine/60"}`}>SUITABLE FOR</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {p.suitableFor.map((s) => (
                        <span key={s.label} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold ${p.featured ? "border-cream/25 text-cream/85" : "border-pine/20 text-ink/70"}`}>
                          <s.icon className="h-3.5 w-3.5" /> {s.label}
                        </span>
                      ))}
                    </div>

                    <p className={`mt-5 font-mono text-[10px] font-bold tracking-[0.2em] ${p.featured ? "text-lime" : "text-pine/60"}`}>WHAT'S INCLUDED</p>
                    <ul className="mt-2.5 space-y-2">
                      {p.includes.map((x) => (
                        <li key={x} className="flex items-start gap-2.5 text-[13.5px] font-medium">
                          <IconCheck className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-lime" : "text-pine"}`} />
                          <span className={p.featured ? "text-cream/85" : "text-ink/80"}>{x}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`tel:${PHONE_TEL}`}
                      className={`btn-hard mt-7 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-sm font-bold ${
                        p.featured ? "bg-lime text-ink" : "bg-pine text-lime"
                      }`}
                    >
                      Start this plan <IconArrow className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* specialized verticals */}
        <section id="programs" className="relative scroll-mt-24 overflow-hidden bg-pine py-24 text-cream">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(209,254,23,0.05) 0px, rgba(209,254,23,0.05) 1px, transparent 1px, transparent 15px)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="flex items-center justify-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-lime">
                <span className="h-[3px] w-10 bg-lime" /> OUR SPECIALIZED VERTICALS <span className="h-[3px] w-10 bg-lime" />
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.03] tracking-tight">
                Pick your <span className="font-display italic text-lime">peace of mind.</span>
              </h2>
              <p className="mt-3 text-[15px] text-cream/65">Select a category to explore dedicated services and key benefits.</p>
            </div>

            {/* tabs */}
            <div className="mt-12 flex flex-wrap justify-center gap-2.5" role="tablist">
              {AMC_SERVICES.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={activeTab === s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`flex items-center gap-2.5 rounded-md border-2 px-4 py-2.5 font-display text-sm font-bold transition-all duration-200 ${
                    activeTab === s.id
                      ? "border-lime bg-lime text-ink shadow-hard"
                      : "border-cream/20 text-cream/70 hover:border-lime hover:text-lime"
                  }`}
                >
                  <s.icon className="h-[1.1rem] w-[1.1rem]" />
                  {s.title}
                </button>
              ))}
            </div>

            {/* active program */}
            <div key={activeService.id} className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              {/* poster */}
              {SERVICE_IMAGES[activeService.id] ? (
                <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg border-2 border-lime/40 shadow-hard-lime">
                  <img src={SERVICE_IMAGES[activeService.id]} alt={`${activeService.title} poster`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/90 via-pine-deep/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-display text-2xl font-extrabold tracking-tight text-cream">{activeService.title}</p>
                    <SplitTag text={activeService.tagline} className="mt-1 text-[13px] text-cream/70" accent="text-lime" />
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-lime/40 bg-pine-deep/60 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.16em] text-lime">
                      <IconShield className="h-3.5 w-3.5" /> {activeService.badge.toUpperCase()}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full min-h-[300px] flex-col justify-between rounded-lg border-2 border-lime/40 bg-pine-deep p-7 shadow-hard-lime"
                  style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(209,254,23,0.06) 0px, rgba(209,254,23,0.06) 1px, transparent 1px, transparent 14px)" }}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-md bg-lime text-ink">
                      <activeService.icon className="h-7 w-7" />
                    </span>
                    <span className="font-display text-[64px] font-extrabold leading-none text-lime/20">{activeService.no}</span>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-extrabold tracking-tight">{activeService.title}</p>
                    <SplitTag text={activeService.tagline} className="mt-2 text-[14px] text-cream/60" accent="text-lime" />
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-lime/40 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.16em] text-lime">
                      <IconShield className="h-3.5 w-3.5" /> {activeService.badge.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* body */}
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[0.22em] text-lime">SCOPE OF WORK</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {activeService.services.map((item) => (
                    <div key={item.name} className="group flex h-full items-start gap-3.5 rounded-lg border border-cream/12 bg-ink/25 p-4 transition-all duration-200 hover:border-lime/50 hover:bg-ink/40">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lime/12 text-lime transition-transform duration-200 group-hover:scale-110">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[14px] font-bold text-cream">{item.name}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-cream/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-5 rounded-lg border border-cream/12 bg-ink/25 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] font-bold tracking-[0.22em] text-lime">KEY BENEFITS</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {activeService.benefits.map((b) => (
                        <span key={b} className="flex items-center gap-1.5 rounded-full bg-cream/8 px-2.5 py-1 text-[11.5px] font-semibold text-cream/85">
                          <IconCheck className="h-3 w-3 text-lime" /> {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 rounded-md border border-lime/40 bg-pine px-4 py-3">
                    <IconWrench className="h-6 w-6 text-lime" />
                    <div>
                      <p className="font-display text-sm font-extrabold text-cream">Our Expert Team</p>
                      <p className="font-mono text-[9px] tracking-[0.14em] text-lime">SKILLED · RELIABLE · DEDICATED</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* trust ledger */}
        <section className="relative bg-cream py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="flex items-center gap-3 font-mono text-[11px] font-bold tracking-[0.3em] text-pine">
              <span className="h-[3px] w-10 bg-lime-deep" /> THE WOWSEWA PROMISE
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.03] tracking-tight text-pine">
              Skilled. Reliable. <span className="font-display italic text-lime-deep">Dedicated.</span>
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {AMC_TRUST.map((w) => (
                <div key={w.t} className="card-lift group h-full rounded-lg border-2 border-pine/15 bg-white p-6 hover:border-pine">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-pine text-lime transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <w.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 font-display text-lg font-extrabold tracking-tight text-pine">{w.t}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">{w.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-pine-deep py-24 text-center text-cream">
          <div className="pointer-events-none absolute inset-0 bg-dots-dark opacity-30" aria-hidden="true" />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 60%)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.02] tracking-tight">
              Your comfort. <span className="font-display italic text-lime">Our priority.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-cream/70">
              Ready to secure your operations? Book a site evaluation or set up your monthly AMC today.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${PHONE_TEL}`}
                className="btn-hard inline-flex items-center gap-2.5 rounded-md bg-lime px-7 py-3.5 font-display text-base font-bold text-ink"
              >
                <IconPhone className="h-5 w-5" /> {PHONE_DISPLAY.replace(/-/g, "")}
              </a>
              <a
                href="https://www.wowsewa.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-md border-2 border-cream/30 px-7 py-3.5 font-display text-base font-bold text-cream transition-colors duration-300 hover:border-lime hover:text-lime"
              >
                <IconGlobe className="h-5 w-5" /> www.wowsewa.com
              </a>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.18em] text-cream/50">
              <IconPin className="h-4 w-4 text-lime" /> {ADDRESS.toUpperCase()}
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}