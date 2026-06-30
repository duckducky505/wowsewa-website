import { Link } from 'react-router-dom';
import FAQ from '../../components/FAQ/FAQ';
import StatsBar from '../../components/Statsbar/Statsbar';
import MainBanner from '../../components/MainBanner/MainBanner';
import './Services.css';
import {
  FaMicrochip,
  FaFaucet,
  FaBolt,
  FaCheck,
  FaCalendarCheck,
  FaArrowRight,
} from 'react-icons/fa';

const phoneNumber = "9779762424318"; 
const message = "Hello WowSewa! I would like to book a package.";
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

const serviceStats = [
  { number: '500+', label: 'Repairs Completed' },
  { number: '15+', label: 'Expert Technicians' },
  { number: '4.9', label: 'Customer Rating' },
  { number: '30m', label: 'Response Time' },
];

const servicesFaqData = [
  { question: 'What is Wow Sewa?', answer: 'Wow Sewa is a comprehensive repair and service company offering a wide range of services for both residential and commercial customers.' },
  { question: 'What services do we provide?', answer: 'We provide electrical installation, plumbing, computer/laptop repair and servicing, and general installation and maintenance of home appliances.' },
  { question: 'How can I book an appointment?', answer: 'Call us at 9762424318 or email wowsewaa@gmail.com to book an appointment.' },
];

const servicesData = [
  {
    category: 'Digital & IT Solutions',
    icon: <FaMicrochip />,
    items: [
      { title: 'IT Networking & WiFi', description: 'Complete LAN/WAN setup and WiFi dead-zone elimination for homes and offices.', tag: 'Popular', image: 'src/assets/images/networking.webp', features: ['Mesh WiFi Setup', 'Router Config'] },
      { title: 'Laptop Repair & Servicing', description: 'Deep cleaning, thermal paste replacement and hardware upgrades to boost performance.', tag: null, image: 'src/assets/images/laptopservicing.webp', features: ['OS Setup', 'Screen & Hinge Fix'] },
      { title: 'CCTV Camera Installation', description: 'Complete security surveillance setup with remote mobile viewing and DVR/NVR config.', tag: 'Security', image: 'src/assets/images/cctv.webp', features: ['Night Vision', 'IP Camera Mapping'] },
    ],
  },
  {
    category: 'Plumbing & Water Systems',
    icon: <FaFaucet />,
    items: [
      { title: 'Emergency Leak Repair', description: 'Rapid response for burst pipes, hidden leaks and high-pressure system failures.', tag: '24/7', image: 'src/assets/images/leak-repair.webp', features: ['Pipe Soldering', 'Drain Unclogging'] },
      { title: 'Solar & Geyser Servicing', description: 'Tank descaling, glass-tube cleaning and repair of leaking solar water heaters.', tag: null, image: 'src/assets/images/solar.webp', features: ['Pipe Insulation', 'Pressure Fix'] },
      { title: 'Sanitary Fitting', description: 'Installation of modern commodes, showers and luxury bathroom fixtures with precision.', tag: null, image: 'src/assets/images/sanitary-fitting.webp', features: ['Tap Install', 'PPR/CPVC Mapping'] },
    ],
  },
  {
    category: 'Electrical & Power',
    icon: <FaBolt />,
    items: [
      { title: 'House Rewiring', description: 'Full house rewiring and circuit-breaker panel upgrades to ensure fire safety.', tag: 'Safety', image: 'src/assets/images/home-rewiring.webp', features: ['MCB Install', 'Short-Circuit Fix'] },
      { title: 'AC & Fridge Maintenance', description: 'Gas refilling, filter cleaning and compressor repair for all major cooling brands.', tag: 'Popular', image: 'src/assets/images/ac-repair.webp', features: ['Deep Cleaning', 'Gas Leak Fix'] },
      { title: 'Inverter & UPS Setup', description: 'Backup power solutions and battery maintenance to keep your home running in outages.', tag: null, image: 'src/assets/images/inverter.webp', features: ['Battery Check', 'Load Balancing'] },
    ],
  },
];

const ServiceCard = ({ item, index }) => (
  
  <article
    className="sp-card reveal-up"
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    <div className="sp-card__image-wrap">
      <img src={item.image} alt={item.title} className="sp-card__img" loading="lazy" />
      {item.tag && <span className="sp-card__tag">{item.tag}</span>}
    </div>
    <div className="sp-card__body">
      <h3 className="sp-card__title">{item.title}</h3>
      <p className="sp-card__desc">{item.description}</p>
      <ul className="sp-card__features">
        {item.features.map((f) => (
          <li key={f} className="sp-card__feature">
            <FaCheck className="sp-card__check" /> {f}
          </li>
        ))}
      </ul>
    </div>
    <div className="sp-card__footer">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sp-card__cta"
      >
        Book Now <FaArrowRight className="sp-card__cta-icon" />
      </a>
    </div>
  </article>
);

const Services = () => {
  return (
    <main className="services-page">
      <MainBanner
        badge="What We Do"
        title={<>Our <span className="accent-text-primary">Specialized</span> services</>}
        subtitle="Precision installation, expert repair and proactive maintenance — for every corner of your home and business."
        compact
      />

      <StatsBar stats={serviceStats} />

      {/* Categories */}
      <section className="sp-body">
        <div className="container">
          {servicesData.map((cat) => (
            <div className="sp-category" key={cat.category}>
              <div className="sp-category__header">
                <span className="sp-category__icon">{cat.icon}</span>
                <h2 className="sp-category__title">{cat.category}</h2>
                <span className="sp-category__count">
                  {cat.items.length} services
                </span>
              </div>
              <div className="sp-category__grid">
                {cat.items.map((item, i) => (
                  <ServiceCard key={item.title} item={item} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banners */}
      <section className="sp-banners">
        <div className="container">
          <div className="sp-banner sp-banner--lime">
            <div className="sp-banner__content">
              <p className="sp-banner__label">Fast Booking</p>
              <h2 className="sp-banner__title">Need a professional?</h2>
              <p className="sp-banner__sub">
                Book your service online in less than 60 seconds.
              </p>
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeS8Hh4Jrfmro0vhR1a_diqDQjrTF8fa7MiV0KgCw0jyYYcbw/viewform?safe=active"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-darkgreen btn-large"
            >
              <FaCalendarCheck /> Book a Service
            </a>
          </div>

          <div className="sp-banner sp-banner--green">
            <div className="sp-banner__content">
              <p className="sp-banner__label">Custom Work</p>
              <h2 className="sp-banner__title">Don&apos;t see what you need?</h2>
              <p className="sp-banner__sub">
                We handle custom requirements for businesses and homes alike.
              </p>
            </div>
            <a href="tel:9762424318" className="btn btn-primary btn-large">
              Talk to Us <FaArrowRight />
            </a>
          </div>
        </div>
      </section>

      <FAQ data={servicesFaqData} title="Frequently Asked Questions" />
    </main>
  );
};

export default Services;
