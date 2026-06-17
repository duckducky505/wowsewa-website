import { Link,useNavigate } from 'react-router-dom';
import './CTA.css';


const ArrowIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default function CTA({ service = 'your home' }) {

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
  }

  return (
    <section className="it-cta bg-dark text-center">
      <div className="container">
        <div className="it-section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
          Ready when you are
        </div>
        <h2 className="it-cta-heading">
          Need {service} sorted?<br />
          <span className="accent-text-main">Book</span> in 60 seconds.
        </h2>
        <p className="it-cta-sub">
          Tell us what's wrong, pick a slot, and a vetted technician is on the way —
          or dial 9762424318 and we'll handle the rest.
        </p>
        <div className="it-cta-btns">
          <Link to="tel:9824232439" className="btn btn-primary">Book now <ArrowIcon /></Link>
          <Link to="/#services" onClick={handleServices}className="it-btn-outline">Back to all services</Link>
        </div>
      </div>
    </section>
  );
}