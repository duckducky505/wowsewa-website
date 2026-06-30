import { FaPhoneAlt, FaUserCheck, FaTools, FaThumbsUp } from 'react-icons/fa';
import './HowItWorks.css';

const steps = [
  {
    icon: <FaPhoneAlt />,
    title: 'Tell us the problem',
    desc: 'Call or book online. Describe the issue — we will match the right specialist.',
  },
  {
    icon: <FaUserCheck />,
    title: 'Verified pro assigned',
    desc: 'A background-checked technician is dispatched with a clear, upfront estimate.',
  },
  {
    icon: <FaTools />,
    title: 'Fixed the right way',
    desc: 'Quality parts, tidy work and real engineering — not a quick patch.',
  },
  {
    icon: <FaThumbsUp />,
    title: 'Guaranteed result',
    desc: 'We stress-test every job and stand behind it with a service guarantee.',
  },
];

const HowItWorks = () => {
  return (
    <section className="how-section section-ec sec-light">
      <div className="container">
        <div className="ds-head">
          <span className="eyebrow eyebrow--center">How It Works</span>
          <h2>
            Help in <span className="accent-text-lime-dark">four simple</span> steps
          </h2>
          <p>From first call to a job well done — transparent every step of the way.</p>
        </div>

        <div className="how-grid">
          {steps.map((s, i) => (
            <div
              className="how-step reveal-up"
              key={s.title}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="how-step__num">{String(i + 1).padStart(2, '0')}</div>
              <div className="how-step__icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
