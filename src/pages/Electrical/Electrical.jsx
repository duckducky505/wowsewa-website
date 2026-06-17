import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Electrical.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Categories from '../../components/CategoriesServices/Categories';
import CTA from '../../components/CTA/CTA';
import StatsBar from '../../components/Statsbar/Statsbar';

import Electric from '../../assets/images/electrical.jpg'
import  switchboard from '../../assets/images/switchboard.jpg'
import  fuse from '../../assets/images/sanitary-fitting.webp'
import  ac from '../../assets/images/ac-repair.webp'
import  rewiring from '../../assets/images/rewiring.webp'
import  inverter from '../../assets/images/inverter.webp'
import  appliance from '../../assets/images/sanitary-fitting.webp'


const ELEC_HERO_IMAGE = Electric;

// ── Icons ───────────────────────────────────────────────────────────────────
const BoltIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
const ArrowIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);
const ImgIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
);
const SearchIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
const ShieldIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
);
const CalendarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
);
const SparkIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>
);

// ── Data ────────────────────────────────────────────────────────────────────
const ELEC_SERVICES = [
  { num: '02.1', name: 'Switchboard & sockets', price: '249', time: '30–45 min', image: switchboard, desc: 'Loose, sparking or dead switches, sockets and modular plates replaced.' },
  { num: '02.2', name: 'AC Repair and installation',   price: '299', time: '30–60 min', image: ac, desc: 'Ac intallation and its related services.' },
  { num: '02.3', name: 'MCB & fuse repair',      price: '349', time: '45–60 min', image: fuse, desc: 'Tripping breakers, blown fuses and DB-box faults traced and fixed.' },
  { num: '02.4', name: 'Wiring & rewiring',      price: '599', time: '90+ min',   image: rewiring, desc: 'New points, concealed wiring and full-room rewires done to code.' },
  { num: '02.5', name: 'Inverter & stabilizer',  price: '449', time: '60–90 min', image: inverter, desc: 'Inverter, battery and stabilizer install, wiring and load setup.' },
  { num: '02.6', name: 'Appliance power point',  price: '399', time: '45–60 min', image: appliance, desc: 'Dedicated points for AC, geyser and chimney with the right load.' },
];

const ASSURANCE_ITEMS = [
  { icon: <SearchIcon />,   heading: 'Up-front pricing',       body: 'Flat starting prices shown before a pro is dispatched. The visit fee adjusts into your final bill.' },
  { icon: <ShieldIcon />,   heading: 'Vetted & insured',       body: 'Every technician is ID-verified, background-checked and trained before they take a single job.' },
  { icon: <CalendarIcon />, heading: '90-day warranty',        body: 'Every repair is covered for 90 days. Something off? We send the same pro back, free.' },
  { icon: <SparkIcon />,    heading: 'One number, six trades', body: 'Plumbing to IT, no juggling contacts. Book it all from one app, one helpline.' },
];

const ELEC_STATS = [
  { value: 6,    sup: '+',    label: 'Services in electrical' },
  { value: 249,  prefix: '₹', label: 'Starting price' },
  { value: 90,   sup: 'd',    label: 'Warranty on repairs' },
  { value: 4.92, decimals: 2, sup: '★', label: 'Average pro rating' },
];

// ── Sections ─────────────────────────────────────────────────────────────────
function Hero() {

  const navigate  = useNavigate();

  const handleServices = (e) => {
    e.preventDefault();
    close();
    if (location.pathname === '/') {
      scrollToServices();
    } else {
      navigate('/');
      setTimeout(scrollToServices, 150);
    }
  };

    const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="it-hero bg-main">
      <div className="container">
        <div className="it-crumbs">
          <a href="/">Home</a>
          <span className="it-crumbs-sep">/</span>
          <a href="/#services" onClick={handleServices}>Services</a>
          <span className="it-crumbs-sep">/</span>
          <span style={{ color: 'var(--primary-color)' }}>Electrical</span>
        </div>

        <div className="it-hero-grid">
          <div className="it-hero-text">
            <div className="it-hero-id">
              <span className="it-badge"><BoltIcon size={26} /></span>
              <div>
                <div className="it-cat-label">02 — Service category</div>
                <h1 className="it-hero-title">Electrical</h1>
              </div>
            </div>

            <div className="it-tagline">
              Wiring, switches, MCBs &amp; <span className="accent-text-main">lighting,</span> done safe.
            </div>

            <p className="it-hero-desc">
              Licensed electricians for everything from a tripping MCB to a full rewire —
              tested, certified and left tidy, with no live wires hanging about.
            </p>

            <div className="it-meta-pills">
              <span className="it-pill"><span className="it-dot" />Visit from ₹249</span>
              <span className="it-pill"><span className="it-dot" />ISI-grade parts</span>
              <span className="it-pill"><span className="it-dot" />Same-day available</span>
            </div>
          </div>

          <div className="it-hero-media">
            <div className="it-hero-img">
              {ELEC_HERO_IMAGE ? (
                <img src={ELEC_HERO_IMAGE} alt="Electrical" className="it-hero-img-photo" />
              ) : (
                <>
                  <span className="it-hero-img-icon"><ImgIcon size={36} /></span>
                  <span className="it-hero-img-label">Drop an electrical photo</span>
                </>
              )}
            </div>
            <span className="it-img-tag"><BoltIcon size={13} /> Electrical</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function ServiceCard({ service }) {
  return (
    <div className="it-card">
      <div className="it-card-media">
        <span className="it-card-num">{service.num}</span>
        {service.image ? (
          <img src={service.image} alt={service.name} className="it-card-media-photo" />
        ) : (
          <>
            <ImgIcon size={28} />
            <span style={{ fontSize: 12, opacity: 0.6 }}>Add {service.name.toLowerCase()} photo</span>
          </>
        )}
      </div>
      <div className="it-card-body">
        <div className="it-card-top">
          <h3 className="it-card-name">{service.name}</h3>
          <span className="it-card-price"><em>₹</em>{service.price}</span>
        </div>
        <p className="it-card-desc">{service.desc}</p>
        <div className="it-card-foot">
          <span className="it-card-time">{service.time}</span>
          <a href="/#book" className="it-book-btn">Book <ArrowIcon size={12} /></a>
        </div>
      </div>
    </div>
  );
}

function ServicesList() {
  return (
    <section className="it-svc-list bg-main">
      <div className="container">
        <div className="it-section-head">
          <div>
            <div className="it-section-label">
              <span className="it-section-label-line" />
              Everything under Electrical
            </div>
            <h2 className="text-xl" style={{ color: 'var(--light-color)', margin: 0 }}>
              All electrical<br />services.
            </h2>
          </div>
          <p className="it-section-lead">
            Flat starting prices shown up front. Pick a service and the closest
            vetted pro is dispatched with the right parts in their bag.
          </p>
        </div>

        <div className="it-cards-grid">
          {ELEC_SERVICES.map((svc, i) => (
            <ServiceCard key={i} service={svc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Assurance() {
  return (
    <section className="it-assure bg-light">
      <div className="container it-assure-inner">
        <div style={{ maxWidth: '24ch' }}>
          <div className="it-section-label">Why book electrical with us</div>
          <h2 className="text-xl" style={{ color: '#032118', margin: 0 }}>
            Same standard,{' '}
            <span style={{ fontFamily: '"UniNeue-Italic", sans-serif', color: '#074C3A' }}>every</span>{' '}
            visit.
          </h2>
        </div>

        <div className="it-assure-grid">
          {ASSURANCE_ITEMS.map((item, i) => (
            <div className="it-acard" key={i}>
              <span className="it-acard-icon">{item.icon}</span>
              <div>
                <h3>{item.heading}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Electrical() {
  React.useEffect(() => {
    document.title = 'WowSewa — Electrical';
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar stats={ELEC_STATS} />
      <ServicesList />
      <Assurance />
      <Categories exclude="electrical" />
      <CTA service="Electrical" />
      <Footer />
    </>
  );
}