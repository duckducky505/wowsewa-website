import React from 'react';
import './IT.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Categories from '../../components/CategoriesServices/Categories';
import CTA from '../../components/CTA/CTA';
import StatsBar from '../../components/Statsbar/Statsbar';

import pc from '../../assets/images/IT.jpg'
import cctv from  '../../assets/images/cctv-installation.jpg'
import smartHome from  '../../assets/images/smarthome.jpg'
import networking from  '../../assets/images/networking.webp'
import laptopRepair from  '../../assets/images/laptop-repair.jpg'
import printer from  '../../assets/images/printer.jpg'


const IT_HERO_IMAGE = pc;

const ChipIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
    <rect x="10" y="10" width="4" height="4" rx="0.5"/>
  </svg>
);
const ArrowIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
);
const SearchIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const ShieldIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);
const CalendarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M16 3v4M8 3v4M3 10h18"/>
  </svg>
);
const SparkIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>
  </svg>
);
const ImgIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="m21 15-5-5L5 21"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const IT_SERVICES = [
  { num: '04.1', name: 'Wi-Fi & mesh setup',      price: '449', time: '45–90 min', image: networking, desc: 'Router, mesh nodes and dead-zone fixing for full-home coverage.' },
  { num: '04.2', name: 'Laptop & desktop repair',  price: '499', time: 'Varies',    image: laptopRepair, desc: 'Boot issues, screen, battery, storage upgrades and OS setup.' },
  { num: '04.3', name: 'Printer & peripherals',    price: '399', time: '30–60 min', image: printer, desc: 'Install, network sharing, driver setup and cartridge fixes.' },
  { num: '04.4', name: 'CCTV & video doorbell',    price: '699', time: '90+ min',   image: cctv, desc: 'Camera mounting, DVR/NVR config and remote-view setup.' },
  { num: '04.5', name: 'Smart-home install',        price: '549', time: '60+ min',   image: smartHome, desc: 'Smart lights, locks, speakers and hubs configured end-to-end.' }
];

const ASSURANCE_ITEMS = [
  { icon: <SearchIcon />, heading: 'Up-front pricing',       body: 'Flat starting prices shown before a pro is dispatched. The visit fee adjusts into your final bill.' },
  { icon: <ShieldIcon />, heading: 'Vetted & insured',       body: 'Every technician is ID-verified, background-checked and trained before they take a single job.' },
  { icon: <CalendarIcon />, heading: '90-day warranty',      body: 'Every repair is covered for 90 days. Something off? We send the same pro back, free.' },
  { icon: <SparkIcon />,  heading: 'One number, six trades', body: 'Plumbing to IT, no juggling contacts. Book it all from one app, one helpline.' },
] 

const IT_STATS = [
  { value: 5,    sup: '+',    label: 'Services in IT & Devices' },
  { value: 449,  prefix: '₹', label: 'Starting price' },
  { value: 90,   sup: 'd',    label: 'Warranty on repairs' },
  { value: 4.92, decimals: 2, sup: '★', label: 'Average pro rating' },
];

// ── Sub-components that stay local to this page ─────────────────────────────
function Hero() {
  return (
    <header className="it-hero bg-main">
      <div className="container">
        <div className="it-crumbs">
          <a href="index.html">Home</a>
          <span className="it-crumbs-sep">/</span>
          <a href="services.html">Services</a>
          <span className="it-crumbs-sep">/</span>
          <span style={{ color: 'var(--primary-color)' }}>IT &amp; Devices</span>
        </div>

        <div className="it-hero-grid">
          <div className="it-hero-text">
            <div className="it-hero-id">
              <span className="it-badge"><ChipIcon size={26} /></span>
              <div>
                <div className="it-cat-label">04 — Service category</div>
                <h1 className="it-hero-title">IT &amp; Devices</h1>
              </div>
            </div>

            <div className="it-tagline">
              Wi-Fi, laptops, printers &amp; <span className="accent-text-main">smart-home,</span> set up right.
            </div>

            <p className="it-hero-desc">
              Brand-certified technicians for the tech in your home and office — from a dead laptop
              to a full mesh Wi-Fi and CCTV rollout, configured and handed over working.
            </p>

            <div className="it-meta-pills">
              <span className="it-pill"><span className="it-dot" />Visit from ₹449</span>
              <span className="it-pill"><span className="it-dot" />Brand-certified</span>
              <span className="it-pill"><span className="it-dot" />On-site &amp; remote</span>
            </div>

            <div className="it-hero-ctas">
              <a href="index.html#book" className="btn btn-primary">
                Book an IT &amp; Devices visit <ArrowIcon />
              </a>
              <a href="services.html" className="it-btn-outline">All services</a>
            </div>
          </div>

          <div className="it-hero-media">
            <div className="it-hero-img">
              {IT_HERO_IMAGE ? (
                <img src={IT_HERO_IMAGE} alt="IT & Devices" className="it-hero-img-photo" />
              ) : (
                <>
                  <span className="it-hero-img-icon"><ImgIcon size={36} /></span>
                  <span className="it-hero-img-label">Drop an IT &amp; Devices photo</span>
                </>
              )}
            </div>
            <span className="it-img-tag">
              <ChipIcon size={13} /> IT &amp; Devices
            </span>
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
          <a href="index.html#book" className="it-book-btn">
            Book <ArrowIcon size={12} />
          </a>
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
              Everything under IT &amp; Devices
            </div>
            <h2 className="text-xl" style={{ color: 'var(--light-color)', margin: 0 }}>
              All IT &amp; Devices<br />services.
            </h2>
          </div>
          <p className="it-section-lead">
            Flat starting prices shown up front. Pick a service and the closest
            vetted pro is dispatched with the right parts in their bag.
          </p>
        </div>

        <div className="it-cards-grid">
          {IT_SERVICES.map((svc, i) => (
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
          <div className="it-section-label">Why book IT &amp; Devices with us</div>
          <h2 className="text-xl" style={{ color: '#032118', margin: 0 }}>
            Same standard,{' '}
            <span style={{ fontFamily: '"UniNeue-Italic", sans-serif', color: '#074C3A' }}>
              every
            </span>{' '}
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

// ── Page component ────────────────────────────────────────────────────────
export default function IT() {
  React.useEffect(() => {
    document.title = 'WowSewa — IT & Devices';
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar stats={IT_STATS} />
      <ServicesList />
      <Assurance />
      <Categories exclude="it-devices" />
      <CTA service="IT & Devices" />
      <Footer />
    </>
  );
}