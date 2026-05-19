import { Link } from 'react-router-dom';
import {
  FaFaucet,
  FaBolt,
  FaNetworkWired,
  FaScrewdriverWrench,
  FaArrowRight,
} from 'react-icons/fa6';
import './ServiceHighlights.css';

const highlights = [
  {
    icon: <FaFaucet />,
    title: 'Plumbing',
    desc: 'Expert repairs for leaks, pipes, geysers and modern bathroom fittings.',
  },
  {
    icon: <FaBolt />,
    title: 'Electrical',
    desc: 'Safe wiring, panel upgrades, MCB fixes and lighting installations.',
  },
  {
    icon: <FaNetworkWired />,
    title: 'IT & Networking',
    desc: 'Office networking, mesh WiFi, CCTV and on-site hardware support.',
  },
  {
    icon: <FaScrewdriverWrench />,
    title: 'General Repair',
    desc: 'AC, fridge and home-appliance maintenance done right the first time.',
  },
];

const ServiceHighlights = () => {
  return (
    <section className="highlights-section section-ec sec-light">
      <div className="container">
        <div className="ds-head">
          <span className="eyebrow eyebrow--center">Our Expertise</span>
          <h2>
            One team for <span className="accent-text-primary">every</span> repair
          </h2>
          <p>Professional, all-in-one solutions for your home and workspace.</p>
        </div>

        <div className="highlights-grid">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="highlight-card reveal-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="highlight-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <Link to="/services" className="learn-more">
                View Details <FaArrowRight className="icon-right" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
