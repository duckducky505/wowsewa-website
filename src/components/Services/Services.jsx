import { Link } from 'react-router-dom';
import './Services.css';

/* up-right arrow used in the round tile buttons */
const ArrowUR = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const Glyph = ({ children }) => <div className="glyph">{children}</div>;

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-num"><span className="ln"></span>01 — Services</div>
            <h2>One number<br />for every<br /><span className="serif-it">fix</span> in the house.</h2>
          </div>
          <p className="lead">
            Four core practices, hundreds of sub-services. Whether it's a dripping
            kitchen tap or a freshly-delivered split AC, the same app, the same
            uniform, the same fixed price.
          </p>
        </div>

        <div className="bento">
          {/* Plumbing */}
          <Link to="/services/Plumbing-wowsewa" className="tile t-plumb lime">
            <div>
              <div className="t-meta">01 · Plumbing</div>
              <h3 style={{ marginTop: 10 }}>From a stuck<br />tap to a full<br />bathroom re-do.</h3>
              <div className="tags">
                <span className="tag">Leak fixing</span>
                <span className="tag">Geyser install</span>
                <span className="tag">Drain clearing</span>
                <span className="tag">Sanitary fitting</span>
                <span className="tag">Pipe replacement</span>
              </div>
            </div>
            <div className="tile-foot">
              <div className="t-meta">Visit from ₹299 · 90-day warranty</div>
              <div className="t-go"><ArrowUR /></div>
            </div>
            <Glyph><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="16" /></svg></Glyph>
          </Link>

          {/* Electrical */}
          <Link to="/services/Electrical-wowsewa" className="tile t-elec">
            <div>
              <div className="t-meta">02 · Electrical</div>
              <h3 style={{ marginTop: 10 }}>Wiring, switches,<br />MCBs &amp; lighting.</h3>
            </div>
            <div className="tile-foot">
              <div className="t-meta">Visit from ₹249</div>
              <div className="t-go"><ArrowUR /></div>
            </div>
            <Glyph><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><path d="M55 5 20 55h25l-5 40 35-50H50l5-40z" /></svg></Glyph>
          </Link>

          {/* Appliances — tall cream */}
          <Link to="/services/Appliances-wowsewa" className="tile t-app cream">
            <div>
              <div className="t-meta">03 · Appliances</div>
              <h3 style={{ marginTop: 10 }}>Install &amp;<br />repair, any<br />brand.</h3>
              <p className="t-desc">AC, fridge, washing machine, microwave, geyser, chimney, dishwasher — install on delivery day, or service annually.</p>
            </div>
            <div className="tile-foot">
              <div className="t-meta">From ₹399 · same-day install</div>
              <div className="t-go"><ArrowUR /></div>
            </div>
            <Glyph><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="15" y="20" width="70" height="60" rx="6" /><path d="M15 40h70M30 60h12M50 60h20" /></svg></Glyph>
          </Link>

          {/* IT & Devices */}
          <Link to="/services/IT-wowsewa" className="tile t-it">
            <div>
              <div className="t-meta">04 · IT &amp; Devices</div>
              <h3 style={{ marginTop: 10 }}>Wi-Fi, printers, laptops,<br />CCTV &amp; smart-home installs.</h3>
            </div>
            <div className="tile-foot">
              <div className="t-meta">Visit from ₹449 · technicians certified by partner brands</div>
              <div className="t-go"><ArrowUR /></div>
            </div>
            <Glyph><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><rect x="25" y="25" width="50" height="50" rx="3" /><rect x="42" y="42" width="16" height="16" /><path d="M38 5v15M62 5v15M38 80v15M62 80v15M5 38h15M5 62h15M80 38h15M80 62h15" /></svg></Glyph>
          </Link>

          {/* Deep cleaning */}
          <Link to="/" className="tile t-clean">
            <div>
              <div className="t-meta">05 · Deep cleaning</div>
              <h3 style={{ marginTop: 10 }}>Sofas, kitchens,<br />bathrooms &amp; full-home.</h3>
            </div>
            <div className="tile-foot">
              <div className="t-meta">Visit from ₹999 · 4-pro crew</div>
              <div className="t-go"><ArrowUR /></div>
            </div>
            <Glyph><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="50" cy="50" r="34" /><path d="M30 50h40M50 30v40" /></svg></Glyph>
          </Link>

          {/* Emergency */}
          <Link to="/" className="tile t-emerg">
            <div>
              <div className="t-meta">06 · Emergency</div>
              <h3 style={{ marginTop: 10 }}>11pm flood?<br />We pick up.</h3>
            </div>
            <div className="tile-foot">
              <div className="t-meta">24×7 dispatch · 60-min target ETA in metros</div>
              <div className="t-go"><ArrowUR /></div>
            </div>
            <Glyph><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3"><path d="M50 10 10 50l40 40 40-40-40-40z" /><path d="M50 30v25M50 65v5" /></svg></Glyph>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;