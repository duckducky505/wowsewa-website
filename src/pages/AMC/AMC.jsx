import React, { useEffect, useState } from 'react';
import {
  MdCheckCircle, MdNetworkCheck, MdAcUnit, MdSolarPower, MdKitchen,
  MdPhone, MdLocationOn, MdStar, MdShield, MdStore, MdLocalCafe,
  MdLocalHospital, MdSchool, MdRestaurant, MdBusiness, MdApartment,
  MdLocationCity, MdWifi, MdDevices, MdViewModule, MdCable, MdWifiTethering,
  MdCleaningServices, MdSpeed, MdFilterAlt, MdWaterDrop, MdElectricBolt,
  MdWbSunny, MdBatteryFull, MdMemory, MdSettings,
  MdEco, MdCurrencyRupee, MdShoppingCart, MdAccessTime, MdHeadsetMic,
  MdVerifiedUser, MdEngineering, MdArrowForward, MdLanguage, MdTimeline
} from 'react-icons/md';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './AMC.css';

// ── Image Imports ─────────────────────────────────────────────
import starterImg from '../../assets/images/starter.jpg';
import businessImg from '../../assets/images/business.jpg';
import corporateImg from '../../assets/images/corporate.jpg';
import acImg from '../../assets/images/AC AMC.jpg';
import solarImg from '../../assets/images/SolarAMC.jpg';
import refrigeratorImg from '../../assets/images/RefrigeratorAMC.jpg';


const AMC_PLANS = [
  {
    name: 'Starter Plan',
    price: '8,000',
    image: starterImg,
    tagline: 'Reliable Care. Every Month.',
    featured: false,
    suitableFor: [
      { icon: <MdStore />, label: 'Shops' },
      { icon: <MdLocalCafe />, label: 'Cafes' },
      { icon: <MdLocalHospital />, label: 'Clinics' }
    ],
    includes: ['1 scheduled visit', 'Phone support', 'Priority service', 'AMC discount 10%']
  },
  {
    name: 'Business Plan',
    price: '15,000',
    image: businessImg,
    tagline: 'Peace of Mind. Every Day.',
    featured: true,
    suitableFor: [
      { icon: <MdSchool />, label: 'Schools' },
      { icon: <MdRestaurant />, label: 'Restaurants' },
      { icon: <MdBusiness />, label: 'Medium offices' }
    ],
    includes: ['2 visits/month', 'Emergency support', 'AMC discount 12%', 'Preventive maintenance']
  },
  {
    name: 'Corporate Plan',
    price: '25,000',
    image: corporateImg,
    tagline: 'Expert Care. Maximum Uptime.',
    featured: false,
    suitableFor: [
      { icon: <MdApartment />, label: 'Hotels' },
      { icon: <MdBusiness />, label: 'Corporate offices' },
      { icon: <MdLocationCity />, label: 'Large facilities' }
    ],
    includes: ['Weekly visits', 'Emergency response', 'AMC discount 15%', 'Dedicated technician support', 'Monthly reports']
  }
];

const AMC_SERVICES = [
  {
    id: 'networking',
    title: 'Networking AMC',
    tagline: 'Strong Network. Seamless Connection.',
    icon: <MdNetworkCheck />,
    badge: 'Expert care for stable networks',
    image: null,
    services: [
      { icon: <MdWifi />, name: 'Router Maintenance', desc: 'Regular checkup, updates, and performance optimization for smooth internet access.' },
      { icon: <MdDevices />, name: 'Switch Maintenance', desc: 'Port check, updates, and configuration to ensure stable network performance.' },
      { icon: <MdViewModule />, name: 'Rack Organization', desc: 'Neat and professional rack setup for better airflow and easy access.' },
      { icon: <MdCable />, name: 'Cable Management', desc: 'Proper cable labeling, bundling, and routing for a clean and reliable network.' },
      { icon: <MdWifiTethering />, name: 'WiFi Troubleshooting', desc: 'Resolve WiFi issues, optimize signal strength, and ensure uninterrupted wireless connectivity.' }
    ],
    benefits: ['Stable Internet', 'Less Downtime', 'Improved Performance', 'Enhanced Security', 'Cost Savings', 'Expert Support']
  },
  {
    id: 'ac',
    title: 'AC AMC',
    tagline: 'Cooler Spaces. Happier Places.',
    icon: <MdAcUnit />,
    badge: 'Expert care for your comfort',
    image: acImg,
    services: [
      { icon: <MdCleaningServices />, name: 'AC Cleaning', desc: 'Deep cleaning of indoor & outdoor unit for better cooling.' },
      { icon: <MdSpeed />, name: 'Gas Pressure Inspection', desc: 'Check and adjust gas pressure for optimal performance.' },
      { icon: <MdFilterAlt />, name: 'Filter Cleaning', desc: 'Clean filters to ensure clean air and efficient cooling.' },
      { icon: <MdWaterDrop />, name: 'Drain Cleaning', desc: 'Clear drain line to prevent water leakage and blockage.' },
      { icon: <MdElectricBolt />, name: 'Electrical Inspection', desc: 'Inspect wiring, connections, and electrical components for safe operation.' }
    ],
    benefits: ['Lower Electricity Bill', 'Better Cooling', 'Longer AC Lifespan', 'Cleaner Air', 'Fewer Breakdowns']
  },
  {
    id: 'solar',
    title: 'Solar & Inverter AMC',
    tagline: 'Clean Energy. Reliable Power.',
    icon: <MdSolarPower />,
    badge: 'Expert care for your energy',
    image: solarImg,
    services: [
      { icon: <MdWbSunny />, name: 'Panel Cleaning', desc: 'Remove dust, dirt, and debris to ensure maximum sunlight absorption and efficiency.' },
      { icon: <MdBatteryFull />, name: 'Battery Inspection', desc: 'Check battery health, charge level, terminals, and connections for reliable backup.' },
      { icon: <MdMemory />, name: 'Inverter Maintenance', desc: 'Inspect and service inverter components for smooth and safe operation.' },
      { icon: <MdSpeed />, name: 'Performance Testing', desc: 'Test system performance, voltage, current, and output for maximum efficiency.' }
    ],
    benefits: ['Higher Output', 'Longer Battery Life', 'System Reliability', 'Lower Maintenance Cost', 'Eco-Friendly & Efficient']
  },
  {
    id: 'refrigerator',
    title: 'Refrigerator AMC',
    tagline: 'Cool Inside. Fresh Always.',
    icon: <MdKitchen />,
    badge: 'Expert care for your appliances',
    image: refrigeratorImg,
    services: [
      { icon: <MdAcUnit />, name: 'Cooling Inspection', desc: 'Check cooling performance to ensure optimum temperature and freshness.' },
      { icon: <MdSettings />, name: 'Compressor Testing', desc: 'Test compressor for proper functioning and long life.' },
      { icon: <MdSettings />, name: 'Gas Pressure Check', desc: 'Check and adjust gas pressure for efficient cooling.' },
      { icon: <MdFilterAlt />, name: 'Condenser Cleaning', desc: 'Clean the condenser coils to remove dust and improve heat exchange.' },
      { icon: <MdElectricBolt />, name: 'Electrical Inspection', desc: 'Inspect wiring, connections, and components for safe and reliable operation.' }
    ],
    benefits: ['Reduced Spoilage', 'Improved Efficiency', 'Longer Appliance Life', 'Cost Savings', 'Timely Service']
  }
];

const TRUST = [
  { icon: <MdEngineering />, t: 'Expert Technicians', d: 'Skilled. Reliable. Dedicated.' },
  { icon: <MdAccessTime />, t: 'Timely Service', d: 'On-time visits, every single time.' },
  { icon: <MdVerifiedUser />, t: '100% Reliability', d: 'Preventive care, zero surprises.' },
  { icon: <MdHeadsetMic />, t: 'Phone Support', d: 'One call away — 9762424318.' }
];

const MARQUEE = ['Plumbing', 'Electrical', 'IT & Devices', 'Appliance Installation', 'AC Service', 'Solar & Inverter', 'Refrigerator Repair', 'Networking', 'Monthly AMC Plans'];

/* ── Scroll-reveal hook ── */
const useReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ── Tagline splitter: "A. B." → A. <span>B.</span> ── */
const Tagline = ({ text, className }) => {
  const parts = text.split('. ');
  return (
    <p className={className}>
      {parts[0]}. <span>{parts.slice(1).join('. ')}</span>
    </p>
  );
};

export default function AMC() {
  const [activeTab, setActiveTab] = useState('networking');
  const activeService = AMC_SERVICES.find((s) => s.id === activeTab);
  useReveal();

  return (
    <>
      <Navbar />
      <div className="amc-page">

        {/* ═════════ HERO ═════════ */}
        <section className="ws-hero" id="top">
          <div className="ws-hero__grid">
            <div className="ws-hero__copy">
              <p className="ws-eyebrow" data-reveal>Annual &amp; Monthly Maintenance Contracts</p>
              <h1 className="ws-hero__title" data-reveal>
                You rest. <span>We care.</span>
              </h1>
              <p className="ws-hero__sub" data-reveal>
                One AMC for your entire space — AC, solar &amp; inverter, refrigeration,
                networking, plus plumbing, electrical, IT and home-appliance care by
                WOW SEWA's expert technicians in Kathmandu.
              </p>
              <div className="ws-hero__actions" data-reveal>
                <a className="btn btn--primary" href="#plans">View monthly plans <MdArrowForward /></a>
                <a className="btn btn--ghost" href="#programs">Explore AMC programs</a>
              </div>
              <ul className="ws-hero__stats" data-reveal>
                {['Expert Technicians', 'Timely Service', '100% Reliability', 'Phone Support'].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="ws-hero__art" data-reveal>
              <img className="ws-hero__img ws-hero__img--a" src={acImg} alt="WOW SEWA AC AMC brochure" />
              <img className="ws-hero__img ws-hero__img--b" src={starterImg} alt="WOW SEWA Starter plan brochure" />
              <div className="ws-hero__chip ws-hero__chip--a"><MdVerifiedUser /> 100% Reliability</div>
              <div className="ws-hero__chip ws-hero__chip--b"><MdAccessTime /> On-time service</div>
            </div>
          </div>
        </section>

        {/* ═════════ MARQUEE ═════════ */}
        <div className="ws-marquee" aria-hidden="true">
          <div className="ws-marquee__track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span className="ws-marquee__item" key={i}>{m}<i>✦</i></span>
            ))}
          </div>
        </div>

        {/* ═════════ PLANS ═════════ */}
        <section className="ws-plans" id="plans">
          <div className="ws-plans__inner">
            <header className="ws-section-head ws-section-head--light" data-reveal>
              <p className="ws-eyebrow">Monthly AMC Plans</p>
              <h2 className="ws-section-head__title">Reliable care. <span>Every month.</span></h2>
              <p className="ws-section-head__sub">Peace of mind. Every day. Choose the tier built for your scale of operations.</p>
            </header>

            <div className="ws-plans__grid">
              {AMC_PLANS.map((plan, i) => (
                <article
                  key={plan.name}
                  className={`ws-plan ${plan.featured ? 'is-featured' : ''}`}
                  data-reveal
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  {plan.featured && <span className="ws-plan__flag"><MdStar /> Most Popular</span>}

                  <div className="ws-plan__media">
                    <img src={plan.image} alt={`${plan.name} poster`} />
                  </div>

                  <div className="ws-plan__body">
                    <h3 className="ws-plan__name">{plan.name}</h3>
                    <Tagline text={plan.tagline} className="ws-plan__tagline" />
                    <p className="ws-plan__price"><small>Rs.</small>{plan.price}<span>/ month</span></p>

                    <div className="ws-plan__suit">
                      <h4>Suitable for</h4>
                      <div className="ws-chips">
                        {plan.suitableFor.map((s) => (
                          <span className="ws-chip" key={s.label}>{s.icon} {s.label}</span>
                        ))}
                      </div>
                    </div>

                    <div className="ws-plan__inc">
                      <h4>What's included</h4>
                      <ul>
                        {plan.includes.map((x) => (
                          <li key={x}><MdCheckCircle /> {x}</li>
                        ))}
                      </ul>
                    </div>

                    <a href="tel:+9779762424318"
                      className={`btn btn--full ${plan.featured ? 'btn--primary' : 'btn--dark'}`}>
                      Start this plan
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ PROGRAMS / VERTICALS ═════════ */}
        <section className="ws-programs" id="programs">
          <div className="ws-programs__inner">
            <header className="ws-section-head" data-reveal>
              <p className="ws-eyebrow ws-eyebrow--dark">Our Specialized Verticals</p>
              <h2 className="ws-section-head__title">Pick your <span>peace of mind</span></h2>
              <p className="ws-section-head__sub">Select a category to explore dedicated services and key benefits.</p>
            </header>

            <div className="ws-programs__tabs" role="tablist" data-reveal>
              {AMC_SERVICES.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={activeTab === s.id}
                  className={`ws-tab ${activeTab === s.id ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(s.id)}
                >
                  {s.icon} <span>{s.title}</span>
                </button>
              ))}
            </div>

            {activeService && (
              <div className="ws-program" key={activeService.id}>

                {/* Poster (or designed fallback for Networking) */}
                {activeService.image ? (
                  <figure className="ws-program__poster">
                    <img src={activeService.image} alt={`${activeService.title} brochure`} />
                    <figcaption>{activeService.badge}</figcaption>
                  </figure>
                ) : (
                  <div className="ws-program__poster ws-program__poster--fallback">
                    <span className="ws-program__poster-icon">{activeService.icon}</span>
                    <strong>{activeService.title}</strong>
                    <Tagline text={activeService.tagline} className="ws-fallback-tag" />
                  </div>
                )}

                <div className="ws-program__body">
                  <p className="ws-badge"><MdShield /> {activeService.badge}</p>
                  <h3 className="ws-program__title">{activeService.title}</h3>
                  <Tagline text={activeService.tagline} className="ws-program__tagline" />

                  <div className="ws-program__cols">
                    {/* Scope of work */}
                    <div className="ws-list">
                      <h4>Scope of Work</h4>
                      {activeService.services.map((item) => (
                        <article className="ws-list__item" key={item.name}>
                          <span className="ws-list__icon">{item.icon}</span>
                          <div>
                            <strong>{item.name}</strong>
                            <p>{item.desc}</p>
                          </div>
                        </article>
                      ))}
                    </div>

                    {/* Benefits + team stamp */}
                    <div className="ws-side">
                      <div className="ws-benefits">
                        <h4>Key Benefits</h4>
                        <ul>
                          {activeService.benefits.map((b) => (
                            <li key={b}><MdCheckCircle /> <span>{b}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="ws-stamp">
                        <div className="ws-stamp__text">
                          <span>Our Expert Team</span>
                          <strong>Skilled • Reliable • Dedicated</strong>
                        </div>
                        <MdShield />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═════════ WHY US ═════════ */}
        <section className="ws-why" id="why">
          <div className="ws-why__inner">
            <header className="ws-section-head ws-section-head--light" data-reveal>
              <p className="ws-eyebrow">The WOW SEWA promise</p>
              <h2 className="ws-section-head__title">Skilled. Reliable. <span>Dedicated.</span></h2>
            </header>
            <div className="ws-why__grid">
              {TRUST.map((w, i) => (
                <article className="ws-why__card" key={w.t} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="ws-why__icon">{w.icon}</span>
                  <strong>{w.t}</strong>
                  <p>{w.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ CTA ═════════ */}
        <section className="ws-cta" id="contact">
          <div className="ws-cta__inner" data-reveal>
            <h2>Your comfort. <span>Our priority.</span></h2>
            <p>Ready to secure your operations? Book a site evaluation or set up your monthly AMC today.</p>
            <div className="ws-cta__actions">
              <a className="btn btn--dark" href="tel:+9779762424318"><MdPhone /> 9762424318</a>
              <a className="btn btn--outline-dark" href="https://www.wowsewa.com" target="_blank" rel="noreferrer">
                <MdLanguage /> www.wowsewa.com
              </a>
            </div>
            <p className="ws-cta__loc"><MdLocationOn /> Machhapokhari, Kathmandu</p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}