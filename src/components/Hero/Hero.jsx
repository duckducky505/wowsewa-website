import './Hero.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* icons */
const Arrow = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const Plumb = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3v6a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v6" /><rect x="4" y="2" width="6" height="3" rx="1" /><rect x="14" y="19" width="6" height="3" rx="1" />
  </svg>
);
const Bolt = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
const Snow = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" /></svg>
);
const Chip = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /><rect x="10" y="10" width="4" height="4" rx="0.5" />
  </svg>
);
const Shield = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const ICONS = { plumb: <Plumb />, bolt: <Bolt />, snow: <Snow />, chip: <Chip />, shield: <Shield /> };

/* pool of live jobs across Nepal — the feed pulls from these at random */
const JOB_POOL = [
  { name: 'Geyser installation',     place: 'Baluwatar, Kathmandu',   icon: 'shield', status: 'done' },
  { name: 'Refrigerator repair',     place: 'Lakeside, Pokhara',      icon: 'snow',   status: 'progress' },
  { name: 'Leak detection & fixing', place: 'Pulchowk, Lalitpur',     icon: 'plumb',  status: 'done' },
  { name: 'AC install & service',    place: 'Dharan, Sunsari',        icon: 'snow',   status: 'progress' },
  { name: 'Wi-Fi mesh setup',        place: 'Bhaktapur Durbar Sq.',   icon: 'chip',   status: 'progress' },
  { name: 'Switchboard repair',      place: 'Itahari, Sunsari',       icon: 'bolt',   status: 'done' },
  { name: 'Washing machine fix',     place: 'Butwal, Rupandehi',      icon: 'snow',   status: 'progress' },
  { name: 'CCTV camera install',     place: 'Birgunj, Parsa',         icon: 'chip',   status: 'done' },
  { name: 'Pipe & motor work',       place: 'Hetauda, Makwanpur',     icon: 'plumb',  status: 'progress' },
  { name: 'Inverter & battery set',  place: 'Biratnagar, Morang',     icon: 'bolt',   status: 'done' },
  { name: 'Printer & network setup', place: 'New Road, Kathmandu',    icon: 'chip',   status: 'done' },
  { name: 'Chimney & hob service',   place: 'Jhamsikhel, Lalitpur',   icon: 'snow',   status: 'progress' },
];

const SEED = [
  { ...JOB_POOL[2], mins: 0, key: 0 },
  { ...JOB_POOL[0], mins: 2, key: 1 },
  { ...JOB_POOL[4], mins: 5, key: 2 },
  { ...JOB_POOL[3], mins: 9, key: 3 },
];

const ago = (m) => (m <= 0 ? 'just now' : `${m} min ago`);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const Hero = () => {
  const navigate = useNavigate();
  const idRef = useRef(SEED.length);
  const [feed, setFeed] = useState(SEED);
  const [stats, setStats] = useState({ pros: 124, resp: 38 });

  // simulate a live, self-updating feed
  useEffect(() => {
    const tick = setInterval(() => {
      setFeed((prev) => {
        let job = JOB_POOL[Math.floor(Math.random() * JOB_POOL.length)];
        // avoid repeating the current top entry
        let guard = 0;
        while (prev[0] && job.name === prev[0].name && guard++ < 5) {
          job = JOB_POOL[Math.floor(Math.random() * JOB_POOL.length)];
        }
        const aged = prev.slice(0, 3).map((r) => ({ ...r, mins: r.mins + 1 + Math.floor(Math.random() * 2) }));
        idRef.current += 1;
        return [{ ...job, mins: 0, key: idRef.current }, ...aged];
      });
      setStats((s) => ({
        pros: clamp(s.pros + (Math.floor(Math.random() * 7) - 3), 96, 168),
        resp: clamp(s.resp + (Math.floor(Math.random() * 5) - 2), 31, 46),
      }));
    }, 2800);
    return () => clearInterval(tick);
  }, []);

  return (
    <section className="hero bg-main">
      <div className="container">
        {/* Left */}
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-line"></span>
            Nepal · Home Services · Est. 2023
          </p>
          <h1 className="hero-heading">
            Your home,<br />
            <span className="hero-heading-accent">handled</span> by<br />
            one number.
          </h1>
          <p className="hero-text">
            Plumbers, electricians, appliance experts and IT technicians —
            vetted, insured, on-time. Book a pro in 60 seconds, track them
            live, pay only after the job is done right.
          </p>
          <div className="hero-buttons">
            <a href="#" className="btn btn-primary">
              Book a pro now <span className="hero-arrow"><Arrow /></span>
            </a>
            <a href="#" className="btn hero-btn-outline">Browse services</a>
          </div>
          <div className="hero-rating">
            <span className="hero-stars">★★★★★</span>
            <span className="hero-rating-score">4.92</span>
            <span>from 38,400+ jobs · Google &amp; in-app verified</span>
          </div>
        </div>

        {/* Right — live network card */}
        <div className="hero-visual">
          <span className="hero-tag"><span className="ln"></span> avg response 38 min</span>

          <div className="hero-live">
            <div className="live-head">
              <span className="live-dot-lg" aria-hidden="true"></span>
              <div>
                <h4>Live on the network</h4>
                <p className="live-sub">Updating in real time · 7 cities</p>
              </div>
              <span className="live-now">NOW</span>
            </div>

            <hr className="live-divider" />

            <div className="live-stats">
              <div className="live-stat">
                <div className="live-stat-val"><span key={stats.pros} className="live-flash">{stats.pros}</span></div>
                <div className="live-stat-lbl">Pros on the job</div>
              </div>
              <div className="live-stat">
                <div className="live-stat-val"><span key={stats.resp} className="live-flash">{stats.resp}</span><span className="u">min</span></div>
                <div className="live-stat-lbl">Avg response</div>
              </div>
              <div className="live-stat">
                <div className="live-stat-val">4.92<sup>★</sup></div>
                <div className="live-stat-lbl">Live rating</div>
              </div>
            </div>

            <div className="live-feed">
              {feed.map((row, i) => (
                <div key={row.key} className={'live-row' + (i === 0 ? ' is-new' : '')}>
                  <span className="live-row-icon">{ICONS[row.icon]}</span>
                  <div className="live-row-main">
                    <div className="live-row-name">{row.name}</div>
                    <div className="live-row-meta">{row.place} · {ago(row.mins)}</div>
                  </div>
                  <span className={'live-status ' + row.status}>
                    <span className="s-dot"></span>
                    {row.status === 'done' ? 'Completed' : 'In progress'}
                  </span>
                </div>
              ))}
            </div>

            <button className="live-book" onClick={() => navigate('/services')}>
              Book a pro near you <span className="book-arrow"><Arrow s={14} /></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;