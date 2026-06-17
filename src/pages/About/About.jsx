import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import image from '../../assets/images/founderIMG.jpg'
import mainImage  from '../../assets/images/whychooseus.jpeg'

// ── Icons ───────────────────────────────────────────────────────────────────
const ImgIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="ic">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
  </svg>
);
const Arrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);
const ArrowUR = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
);
const Search = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
const Shield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
);
const Calendar = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
);
const Spark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>
);

/* Drop-image zone. Pass `src` later and it fills the rounded box (object-fit:cover);
   with no `src` it shows the placeholder exactly like the mockups. */
function DropImage({ src, alt = '', label, tag, size = 'about-media-wide', dark = false }) {
  return (
    <div className={`about-drop ${size}${dark ? ' on-dark' : ''}`}>
      {src ? (
        <img src={src} alt={alt} className="about-drop-img" />
      ) : (
        <div className="about-drop-ph">
          <ImgIcon size={32} />
          <span className="about-drop-label">{label}</span>
          <span className="about-drop-sub">or <u>browse files</u></span>
        </div>
      )}
      {tag && <span className="about-drop-tag">{tag}</span>}
    </div>
  );
}

const TRADES = ['Plumbing', 'Electrical', 'Appliances', 'IT & Devices', 'Deep Cleaning', '24×7 Emergency'];

const VALUES = [
  { icon: <Search />,   h: 'Honest pricing',      p: 'Flat rates shown up front — no surprise bills, no invented quotes.' },
  { icon: <Shield />,   h: 'Vetted & insured',    p: 'ID-verified, background-checked and trained before the first job.' },
  { icon: <Calendar />, h: 'On time, on warranty', p: 'Live ETA tracking and a 90-day guarantee on every repair.' },
  { icon: <Spark />,    h: 'One app, six trades', p: 'From a dripping tap to a Wi-Fi setup — handled in one place.' },
];

const JOURNEY = [
  { year: '2023', h: 'WowSewa is born',          p: 'Launched in Bengaluru with 20 plumbers and electricians and a single promise: show up on time, price it fairly.' },
  { year: '2024', h: 'Four trades, one app',     p: 'Added appliances and IT & devices, crossed 10,000 jobs and introduced the 90-day repair warranty.' },
  { year: '2025', h: 'Seven cities',             p: 'Expanded to Mumbai, Pune, Hyderabad, Chennai, Delhi NCR and Gurgaon with a 24×7 emergency desk.' },
  { year: '2026', h: '38,000 homes & counting',  p: '482 vetted pros, a 4.92-star average and the Home Plus annual plan trusted by thousands of families.' },
];

// ── Sections ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <header className="about-hero bg-main">
      <div className="container">
        <div className="about-crumbs">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span className="cur">About us</span>
        </div>
        <div className="about-eyebrow"><span className="about-eyebrow-line" />Our story</div>

        <div className="about-hero-grid">
          <h1 className="about-hero-title">
            One trusted number for the <span className="accent-text-main">whole</span> home.
          </h1>

          <div className="about-hero-copy">
            <p className="text-md">
              WowSewa began with a simple frustration: a leaking tap meant three phone
              calls, two no-shows and a price invented on the spot. We built the company
              we wished existed — vetted pros, honest pricing, and a single app for
              plumbing, electrical, appliances and IT.
            </p>
            <div className="about-hero-stats">
              <div>
                <div className="about-stat-val">2023</div>
                <div className="about-stat-label">Founded in Nepal</div>
              </div>
              <div>
                <div className="about-stat-val">38k+</div>
                <div className="about-stat-label">Jobs completed</div>
              </div>
              <div>
                <div className="about-stat-val">482</div>
                <div className="about-stat-label">Vetted pros</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-trades">
        <div className="container about-trades-row">
          {TRADES.map((t, i) => (
            <React.Fragment key={t}>
              {i > 0 && <span className="tdot">✦</span>}
              <span>{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  );
}

function DrivesUs() {
  return (
    <section className="about-drives bg-light">
      <div className="container about-drives-grid">
        <img src={mainImage} alt="why-choose-us-image" />

        <div>
          <div className="about-eyebrow on-light"><span className="about-eyebrow-line" />What drives us</div>
          <h2>
            We treat your home like{' '}
            <span style={{ fontFamily: '"UniNeue-Italic", sans-serif', color: '#074C3A' }}>ours.</span>
          </h2>
          <p className="about-drives-lead">
            Every WowSewa pro is background-checked, trained and rated after each visit.
            We show flat starting prices before anyone steps inside, settle payment only
            after the job is done, and back every repair with a 90-day warranty.
          </p>

          <div className="about-values">
            {VALUES.map((v) => (
              <div className="about-value" key={v.h}>
                <span className="about-value-icon">{v.icon}</span>
                <div>
                  <h4>{v.h}</h4>
                  <p>{v.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Visionary() {
  return (
    <section className="about-vision bg-main">
      <div className="container">
        <div className="about-vision-head">
          <div className="about-eyebrow"><span className="about-eyebrow-line" />Meet the visionary</div>
          <h2>The mind behind<br />the mission.</h2>
        </div>

        <div className="about-vision-grid">
          <img src={image} alt="founder-image" />

          <div>
            <h3 className="about-founder-name">Mr. Jiwan Joshi</h3>
            <div className="about-founder-role">Founder &amp; Chief Executive · WowSewa</div>
            <hr className="about-divider" />

            <p className="about-quote">
              “A home runs on a hundred small things working. We exist so you never have
              to worry about a single one of them.”
            </p>

            <div className="about-bio">
              <p>
                Founded on the principle of technical excellence, WowSewa bridges the gap between traditional utility and modern technology. Mr. Joshi established WowSewa to provide a reliable, all-in-one technical solution for the community.
              </p>
              <p>
                Under his leadership, WowSewa has grown to 40 trained professionals across
                seven cities, completing over 38,000 jobs with a 4.92-star average — while
                keeping the promise that started it all: one trusted number for the whole home.
              </p>
            </div>

            <hr className="about-divider" />
            <div className="about-author">
              <span className="about-author-avatar">AS</span>
              <div>
                <div className="about-author-name">Mr. Jiwan Joshi</div>
                <div className="about-author-sub">Founder &amp; CEO, WowSewa Home Services</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="about-journey bg-light">
      <div className="container">
        <div className="about-eyebrow on-light"><span className="about-eyebrow-line" />The journey</div>
        <h2>From one van<br />to seven cities.</h2>

        <div className="about-journey-grid">
          {JOURNEY.map((j) => (
            <div className="about-jcard" key={j.year}>
              <div className="about-jcard-year">{j.year}</div>
              <h4>{j.h}</h4>
              <p>{j.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  return (
    <section className="about-cta bg-dark text-center">
      <div className="container">
        <div className="about-eyebrow"><span className="about-eyebrow-line" />Join the network</div>
        <h2 className="about-cta-title">
          Your home,<br /><span className="accent-text-main">handled.</span>
        </h2>
        <p className="about-cta-sub">
          Book a vetted pro in 60 seconds — or come build the future of home services with us.
        </p>
        <div className="about-cta-btns">
          <Link to="/#book" className="btn btn-primary">Book a pro now <Arrow /></Link>
          <Link to="/pro" className="about-btn-outline">Become a WowSewa pro</Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  React.useEffect(() => {
    document.title = 'WowSewa — About us';
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <DrivesUs />
      <Visionary />
      <Journey />
      <AboutCTA />
      <Footer />
    </>
  );
}