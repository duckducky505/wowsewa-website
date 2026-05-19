import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaArrowRight, FaStar } from 'react-icons/fa';
import { FaFaucet, FaBolt, FaNetworkWired, FaScrewdriverWrench } from 'react-icons/fa6';
import './MainBanner.css';

import banner from '../../assets/images/wowLogo2.png';

const defaultChips = [
  { icon: <FaFaucet />, label: 'Plumbing' },
  { icon: <FaBolt />, label: 'Electrical' },
  { icon: <FaNetworkWired />, label: 'IT & Networking' },
  { icon: <FaScrewdriverWrench />, label: 'Appliances' },
];

const MainBanner = ({
  badge = "Kathmandu's all-in-one service partner",
  title,
  subtitle = 'From leaking pipes to complex IT networking, WowSewa delivers elite, on-demand maintenance and installation — verified technicians, honest pricing, and work that lasts.',
  primary = { label: 'Explore Services', to: '/services' },
  chips = defaultChips,
  compact = false,
}) => {
  const heading = title ?? (
    <>
      Your Home. <span className="accent-text-primary">Fixed.</span>
      <br />
      Your Office. <span className="accent-text-primary">Connected.</span>
    </>
  );

  /* Compact: title-only hook line for inner pages (no buttons / visual) */
  if (compact) {
    return (
      <section className="home-hero home-hero--compact">
        <div className="home-hero__glow home-hero__glow--a" aria-hidden="true" />
        <div className="home-hero__grid-lines" aria-hidden="true" />
        <div className="container">
          <div className="hero-content hero-content--compact reveal-up">
            <span className="pill-badge">
              <span className="dot" /> {badge}
            </span>
            <h1 className="hero-title">{heading}</h1>
            <p className="hero-subtitle">{subtitle}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-hero">
      <div className="home-hero__glow home-hero__glow--a" aria-hidden="true" />
      <div className="home-hero__grid-lines" aria-hidden="true" />

      <div className="container hero-flex">
        <div className="hero-content reveal-up">
          <span className="pill-badge">
            <span className="dot" /> {badge}
          </span>

          <h1 className="hero-title">{heading}</h1>

          <p className="hero-subtitle">{subtitle}</p>

          <div className="hero-cta-group">
            <Link to={primary.to} className="btn btn-primary btn-large">
              {primary.label} <FaArrowRight />
            </Link>
            <a href="tel:9762424318" className="btn btn-hero-ghost btn-large">
              <FaPhoneAlt /> Call Now
            </a>
          </div>

          <div className="hero-proof">
            <div className="hero-stars" aria-hidden="true">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p>
              <strong>4.9/5</strong> from 500+ jobs across homes &amp; businesses
            </p>
          </div>
        </div>

        <div className="hero-visual reveal-up">
          <div className="hero-image-frame">
            <img src={banner} alt="WowSewa technicians at work" className="hero-img" />
          </div>

          <div className="hero-chips">
            {chips.map((c) => (
              <span className="hero-chip" key={c.label}>
                <span className="hero-chip__icon">{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
