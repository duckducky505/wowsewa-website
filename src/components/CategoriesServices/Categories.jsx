import { Link } from 'react-router-dom';
import './Categories.css';


/* category icons */
const Plumb = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3v6a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v6" /><rect x="4" y="2" width="6" height="3" rx="1" /><rect x="14" y="19" width="6" height="3" rx="1" />
  </svg>
);
const Bolt = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
const Snow = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" /></svg>
);
const Chip = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /><rect x="10" y="10" width="4" height="4" rx="0.5" />
  </svg>
);
const Spark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);
const Shield = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

/* every service category in one place — the page hides its own via `exclude` */
const ALL_CATEGORIES = [
  { slug: 'plumbing',      name: 'Plumbing',       path: '/services/Plumbing-wowsewa',      icon: <Plumb /> },
  { slug: 'electrical',    name: 'Electrical',     path: '/services/electrical-wowsewa',    icon: <Bolt /> },
  { slug: 'appliances',    name: 'Appliances',     path: '/services/appliances-wowsewa',    icon: <Snow /> },
  { slug: 'it-devices',    name: 'IT & Devices',   path: '/services/IT-wowsewa',            icon: <Chip /> },
  { slug: 'deep-cleaning', name: 'Deep Cleaning',  path: '/services/deep-cleaning-wowsewa', icon: <Spark /> },
  { slug: 'emergency',     name: '24×7 Emergency', path: '/services/emergency-wowsewa',     icon: <Shield /> },
];

export default function Categories({ exclude }) {
  const categories = ALL_CATEGORIES.filter((c) => c.slug !== exclude);

  return (
    <section className="it-others bg-main">
      <div className="container">
        <div className="it-section-head">
          <div>
            <div className="it-section-label">
              <span className="it-section-label-line" />
              Explore more
            </div>
            <h2 className="text-xl" style={{ color: 'var(--light-color)', margin: 0 }}>
              Other services.
            </h2>
          </div>
          <p className="it-section-lead">
            One app for the whole house. Browse the rest of what WowSewa handles.
          </p>
        </div>

        <div className="it-others-grid">
          {categories.map((cat) => (
            <Link className="it-ocard" to={cat.path} key={cat.slug}>
              <span className="it-ocard-icon">{cat.icon}</span>
              <div>
                <h4>{cat.name}</h4>
                <div className="it-ocard-count">6 services →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}