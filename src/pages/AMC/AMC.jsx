import './AMC.css';
import FAQ from '../../components/FAQ/FAQ';
import MainBanner from '../../components/MainBanner/MainBanner';
import {
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaClock,
  FaWallet,
  FaArrowRight,
} from 'react-icons/fa';

const AMCFaqData = [
  { question: "What exactly does 'Unlimited Calls' mean?", answer: "It means you don't pay any labour or visiting charges, no matter how many times you call us. Whether it's a leaky tap or a complete power failure, your service fee is zero." },
  { question: 'Does the AMC cover spare parts?', answer: 'The annual fee covers 100% of the labour and expertise. Spare parts are billed separately, but AMC members enjoy an exclusive 10–15% discount on all materials.' },
  { question: 'Can I transfer my AMC if I move houses?', answer: 'Yes! If you move within the Kathmandu Valley, we can transfer your remaining contract to your new address after a quick site audit.' },
  { question: 'Is there a limit on appliances covered?', answer: 'Essential and Standard plans cover all major fixed systems (plumbing & electrical). For IT and high-end appliance coverage, the Enterprise plan is the best fit.' },
  { question: 'Do you offer AMC for offices or restaurants?', answer: "Yes — our Enterprise packages are designed for high-usage environments like offices, banks and cafes where uptime is critical." },
];

const plans = [
  {
    tag: 'Basic',
    name: 'Essential',
    featured: false,
    features: [
      { ok: true, t: '2 Scheduled Inspections' },
      { ok: true, t: 'Unlimited Plumbing Fixes' },
      { ok: true, t: '10% Off Spare Parts' },
      { ok: false, t: 'IT Support' },
    ],
  },
  {
    tag: 'Best Value',
    name: 'Standard',
    featured: true,
    features: [
      { ok: true, t: '4 Scheduled Inspections' },
      { ok: true, t: 'Full Electrical & Plumbing' },
      { ok: true, t: 'Priority Emergency Callouts' },
      { ok: true, t: 'Basic IT / WiFi Support' },
    ],
  },
  {
    tag: 'Advanced',
    name: 'Enterprise',
    featured: false,
    features: [
      { ok: true, t: 'Monthly Tech Audits' },
      { ok: true, t: 'Solar & AC Maintenance' },
      { ok: true, t: 'Full Networking Support' },
      { ok: true, t: 'Dedicated Account Pro' },
    ],
  },
];

const benefits = [
  { icon: <FaShieldAlt />, t: 'Predictive Repairs', d: 'We fix issues before they become expensive breakdowns.' },
  { icon: <FaClock />, t: '24/7 Priority', d: 'AMC members skip the queue with 30-minute response times.' },
  { icon: <FaWallet />, t: 'Cost Savings', d: 'Save up to 40% compared to individual one-time repairs.' },
];

const AMC = () => {
  return (
    <div className="amc-page">
      <MainBanner
        badge="Annual Maintenance Contract"
        title={<>Zero stress. <span className="accent-text-primary">Total maintenance.</span></>}
        subtitle="Join the WowSewa AMC and let our experts handle your home and office repairs around the clock. One contract, infinite solutions."
        compact
      />

      <section className="amc-plans section-ec">
        <div className="container">
          <div className="ds-head">
            <span className="eyebrow eyebrow--center">Pricing</span>
            <h2>Choose your <span className="accent-text-primary">plan</span></h2>
            <p>Annual packages tailored for every need.</p>
          </div>

          <div className="amc-grid">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`amc-card ${p.featured ? 'amc-card--featured' : ''}`}
              >
                <span className="amc-card__tag">{p.tag}</span>
                <h3 className="amc-card__name">{p.name}</h3>
                <ul className="amc-card__features">
                  {p.features.map((f) => (
                    <li key={f.t} className={f.ok ? '' : 'is-off'}>
                      {f.ok ? <FaCheck /> : <FaTimes />} {f.t}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeS8Hh4Jrfmro0vhR1a_diqDQjrTF8fa7MiV0KgCw0jyYYcbw/viewform?safe=active"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-block ${p.featured ? 'btn-primary' : 'btn-outline-green'}`}
                >
                  Get Started <FaArrowRight />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="amc-benefits section-ec">
        <div className="container">
          <div className="ds-head">
            <span className="eyebrow eyebrow--center">Why AMC</span>
            <h2>Why choose an <span className="accent-text-lime-dark">AMC?</span></h2>
          </div>
          <div className="amc-benefits__grid">
            {benefits.map((b) => (
              <div className="amc-benefit" key={b.t}>
                <div className="amc-benefit__icon">{b.icon}</div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ data={AMCFaqData} title="Frequently Asked Questions" />
    </div>
  );
};

export default AMC;
