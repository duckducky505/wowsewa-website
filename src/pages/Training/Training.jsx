import React, { useState } from 'react';
import './Training.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import  training from '../../assets/images/training.jpeg'

/* Drop a real workshop photo here later (import a file and set this). */
const TRAINING_HERO_IMAGE = training;

// ── Icons ───────────────────────────────────────────────────────────────────
const Arrow = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);
const Plumb = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v6a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v6" /><rect x="4" y="2" width="6" height="3" rx="1" /><rect x="14" y="19" width="6" height="3" rx="1" /></svg>
);
const Bolt = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
const Snow = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" /></svg>
);
const Chip = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /><rect x="10" y="10" width="4" height="4" rx="0.5" /></svg>
);
const Spark = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>
);
const Shield = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
);
const Clock = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const Level = ({ s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
const ImgIcon = ({ s = 30 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
);

// ── Course catalogue ─────────────────────────────────────────────────────────
const COURSES = [
  {
    id: 'plumbing', name: 'Plumbing Pro', icon: <Plumb />,
    sub: 'Pipes, fittings and leak-free installs.', price: '₹14,000',
    weeks: '6 weeks', level: 'Beginner → Job-ready',
    desc: 'Master domestic plumbing end-to-end — from reading layouts to pressure-testing a finished bathroom.',
    modules: ['Tools, materials & safety', 'Tap, mixer & sanitaryware fitting', 'Leak detection & sealing', 'Geyser & pump installation', 'Drainage & unclogging', 'Live on-site practicals'],
  },
  {
    id: 'electrical', name: 'Electrical Pro', icon: <Bolt />,
    sub: 'Wiring, boards and safe power.', price: '₹16,500',
    weeks: '8 weeks', level: 'Beginner → Licensed-ready',
    desc: 'Residential wiring and load management with an emphasis on safety codes and certification readiness.',
    modules: ['Electrical safety & tools', 'Circuits, loads & wiring', 'Switchboards & DB boxes', 'MCBs, fuses & earthing', 'Lighting & appliance points', 'Live on-site practicals'],
  },
  {
    id: 'appliance', name: 'Appliance Repair', icon: <Snow />,
    sub: 'AC, fridge & washing machine mastery.', price: '₹18,000',
    weeks: '8 weeks', level: 'Intermediate',
    desc: 'Diagnose and repair the big machines, including gas handling and brand-specific install procedures.',
    modules: ['Diagnostics & tools', 'Refrigeration & gas handling', 'AC install & service', 'Washing machine repair', 'Brand-specific procedures', 'Live on-site practicals'],
  },
  {
    id: 'it', name: 'IT & Devices', icon: <Chip />,
    sub: 'Networks, devices & smart homes.', price: '₹13,500',
    weeks: '5 weeks', level: 'Beginner',
    desc: 'Set up and troubleshoot the connected home — Wi-Fi, CCTV, printers, smart devices and basic hardware.',
    modules: ['Networking basics', 'Wi-Fi & mesh setup', 'CCTV & video doorbells', 'Printers & peripherals', 'Smart-home devices', 'Live on-site practicals'],
  },
  {
    id: 'cleaning', name: 'Pro Deep-Clean', icon: <Spark />,
    sub: 'Commercial-grade cleaning craft.', price: '₹9,500',
    weeks: '4 weeks', level: 'Beginner',
    desc: 'Operate professional equipment and chemicals safely for spotless, repeatable results at speed.',
    modules: ['Chemicals & safety', 'Equipment handling', 'Kitchen & bathroom deep-clean', 'Floor & surface care', 'Sofa & upholstery care', 'Live on-site practicals'],
  },
  {
    id: 'service', name: 'Service Excellence', icon: <Shield />,
    sub: 'The WowSewa way with customers.', price: '₹4,500',
    weeks: '2 weeks', level: 'All tracks',
    desc: 'The soft-skills layer every WowSewa pro completes — communication, pricing transparency and trust.',
    modules: ['Customer communication', 'Pricing transparency', 'On-site etiquette', 'Handling complaints', 'The WowSewa promise', 'Final assessment'],
  },
];

const STEPS = [
  { n: '01', h: 'Enroll & assess', v: 'green', body: 'Pick a trade track, complete a short aptitude check, and we place you at the right level.' },
  { n: '02', h: 'Learn hands-on', v: 'dark', body: 'Classroom theory paired with real tools and live job sites — not just slides and videos.' },
  { n: '03', h: 'Get certified', v: 'lime', body: 'Pass the practical assessment and earn a verified WowSewa Academy badge for that trade.' },
  { n: '04', h: 'Join the network', v: 'green', body: 'Top graduates are fast-tracked into the WowSewa pro network with their first jobs lined up.' },
];

const pad = (i) => String(i + 1).padStart(2, '0');

// ── Course card ──────────────────────────────────────────────────────────────
function CourseCard({ course, variant, open, onToggle }) {
  return (
    <article className={`ac-card ${variant}${open ? ' is-open' : ''}`}>
      <div className="ac-card-top">
        <span className="ac-ic">{course.icon}</span>
        <div className="ac-card-id">
          <div className="ac-name">{course.name}</div>
          <div className="ac-sub">{course.sub}</div>
        </div>
        <div className="ac-price-wrap">
          <div className="ac-price">{course.price}</div>
          <div className="ac-allin">all-in</div>
        </div>
      </div>

      <hr className="ac-div" />

      <div className="ac-meta-row">
        <span className="ac-meta"><Clock /> {course.weeks}</span>
        <span className="ac-meta"><Level /> {course.level}</span>
      </div>

      <p className="ac-desc">{course.desc}</p>

      {open && (
        <>
          <div className="ac-cur-label">Curriculum · 6 modules</div>
          <div className="ac-mods">
            {course.modules.map((m, i) => (
              <div className="ac-mod" key={i}>
                <span className="ac-mod-no">{pad(i)}</span>{m}
              </div>
            ))}
          </div>
          <button className="ac-enrol-btn" onClick={() => {}}>
            Enroll in {course.name} <span className="ac-arrow"><Arrow s={14} /></span>
          </button>
        </>
      )}

      <div>
        <button className="ac-toggle" onClick={() => onToggle(course.id)}>
          {open ? 'Hide curriculum −' : 'View curriculum +'}
        </button>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Training() {
  const [open, setOpen] = useState({ plumbing: true });
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  React.useEffect(() => { document.title = 'WowSewa — Training & Academy'; }, []);

  return (
    <>
      <Navbar />

      <main className="academy">
        {/* ── HERO ── */}
        <header className="ac-hero bg-main">
          <div className="container">
            <div className="ac-crumbs">
              <a href="/">Home</a>
              <span>/</span>
              <span className="here">Training &amp; Academy</span>
            </div>

            <div className="ac-hero-grid">
              <div>
                <div className="ac-eyebrow"><span className="ln" /> WowSewa Academy</div>
                <h1 className="ac-hero-title">
                  Learn a trade.<br />
                  Earn a <span className="accent-text-main">badge.</span><br />
                  Join the<br />network.
                </h1>
                <p className="ac-hero-desc">
                  Hands-on certification courses that turn beginners into job-ready
                  professionals — taught by the same experts who run WowSewa's
                  482-strong pro network across seven cities.
                </p>
                <div className="ac-hero-ctas">
                  <a href="#catalogue" className="btn btn-primary">
                    Browse courses <span className="ac-arrow"><Arrow /></span>
                  </a>
                  <a href="#how" className="ac-btn-outline">How it works</a>
                </div>
              </div>

              <div className="ac-hero-media">
                <div className="ac-hero-img">
                  {TRAINING_HERO_IMAGE ? (
                    <img src={TRAINING_HERO_IMAGE} alt="Inside a WowSewa Academy workshop" className="ac-hero-img-photo" />
                  ) : (
                    <>
                      <ImgIcon />
                      <span className="ac-hero-img-label">Drop a training / workshop photo</span>
                      <span className="ac-hero-img-browse">or <u>browse files</u></span>
                    </>
                  )}
                </div>
                <span className="ac-img-tag">Inside a WowSewa Academy workshop</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── CATALOGUE ── */}
        <section className="ac-cat bg-main" id="catalogue">
          <div className="container">
            <div className="ac-cat-head">
              <div>
                <div className="ac-eyebrow"><span className="ln" /> The catalogue</div>
                <h2 className="ac-cat-title">Six tracks,<br />one career path.</h2>
              </div>
              <p className="ac-cat-lead">
                Each course mixes classroom theory with live, on-site practicals.
                Fees include tools-kit access, materials and the certification assessment.
              </p>
            </div>

            <div className="ac-grid">
              {COURSES.map((c, i) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  variant={i % 2 === 0 ? 'green' : 'cream'}
                  open={!!open[c.id]}
                  onToggle={toggle}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="ac-how bg-light" id="how">
          <div className="container">
            <div className="ac-how-head">
              <div>
                <div className="ac-eyebrow"><span className="ln" /> How it works</div>
                <h2 className="ac-how-title">From sign-up<br />to first job.</h2>
              </div>
              <p className="ac-how-lead">
                A clear, four-step path. No prior experience needed for most tracks —
                just the willingness to learn a trade properly.
              </p>
            </div>

            <div className="ac-steps">
              {STEPS.map((s) => (
                <div className={`ac-step ${s.v}`} key={s.n}>
                  <div className="ac-step-no">{s.n}</div>
                  <div className="ac-step-h">{s.h}</div>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ENROL ── */}
        <section className="ac-enrol bg-dark" id="enrol">
          <div className="container">
            <div className="ac-enrol-grid">
              <div>
                <div className="ac-eyebrow"><span className="ln" /> Enroll</div>
                <h2 className="ac-enrol-title">
                  Start your trade<br />career this <span className="accent-text-main">month.</span>
                </h2>
                <p className="ac-enrol-lead">
                  Tell us which track interests you and our admissions team will reach
                  out with the next batch dates, EMI options and campus details.
                  Scholarships available for eligible candidates.
                </p>
                <div className="ac-pills">
                  <span className="ac-pill"><span className="d" /> Next batch · 1 July 2026</span>
                  <span className="ac-pill"><span className="d" /> EMI from ₹1,500/mo</span>
                </div>
              </div>

              <div className="ac-form">
                <div className="ac-field">
                  <label className="ac-flabel" htmlFor="ac-name">Full name</label>
                  <input id="ac-name" className="ac-input" type="text" placeholder="Your name" />
                </div>
                <div className="ac-field ac-field-row">
                  <div>
                    <label className="ac-flabel" htmlFor="ac-phone">Phone</label>
                    <input id="ac-phone" className="ac-input" type="tel" defaultValue="+977 " />
                  </div>
                  <div>
                    <label className="ac-flabel" htmlFor="ac-city">City</label>
                    <input id="ac-city" className="ac-input" type="text" placeholder="Kathmandu" />
                  </div>
                </div>
                <div className="ac-field">
                  <label className="ac-flabel" htmlFor="ac-track">Interested track</label>
                  <select id="ac-track" className="ac-input" defaultValue="Plumbing Pro">
                    {COURSES.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <button className="ac-submit" type="button">
                  Request a call back <span className="ac-arrow"><Arrow s={14} /></span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}