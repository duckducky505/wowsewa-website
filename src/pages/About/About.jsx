import './About.css';
import Book from '../../components/Book';
import MainBanner from '../../components/MainBanner/MainBanner';
import founderImg from '../../assets/images/founderIMG.png';
import {
  FaMicrochip,
  FaShieldAlt,
  FaFileInvoice,
  FaVial,
} from 'react-icons/fa';

const values = [
  { n: '01', t: 'Technical Mastery', d: "We don't just patch problems — we understand the engineering behind your appliances and IT systems for long-term fixes." },
  { n: '02', t: 'Transparent Pricing', d: 'No hidden costs or surprise surcharges. You get an honest estimate before we touch a single screw.' },
  { n: '03', t: 'Verified Reliability', d: 'Every technician is background-checked and trained to respect your space, privacy and time.' },
  { n: '04', t: 'Emergency Ready', d: 'From burst pipes to crashed servers, we prioritise urgent technical failures to get life back on track fast.' },
];

const standards = [
  { icon: <FaMicrochip />, t: 'Zero-Compromise Parts', d: 'No generic clones. Only OEM or certified grade-A components so your tech stays fixed for years.' },
  { icon: <FaShieldAlt />, t: 'Fortress-Grade Safety', d: 'Beyond basic fixes — we verify grounding, insulation and data security to protect your home.' },
  { icon: <FaFileInvoice />, t: 'Total Tech Clarity', d: 'Ditch the jargon. A transparent breakdown of the why and the how, backed by digital logs.' },
  { icon: <FaVial />, t: 'Extreme Load Testing', d: "We don't just turn it on — we stress-test every repair under real conditions to guarantee durability." },
];

const About = () => {
  return (
    <div className="about-page">
      <MainBanner
        badge="Reliable · Professional · Technical"
        title={<>Service at the speed of <span className="accent-text-primary">WOW</span>.</>}
        subtitle="WowSewa is Kathmandu's premier all-in-one technical partner, bridging the gap between traditional utility and modern technology."
        compact
      />

      {/* Founder */}
      <section className="founder-section section-ec">
        <div className="container">
          <div className="founder-layout">
            <div className="founder-image-container reveal-up">
              <img src={founderImg} alt="Mr. Jiwan Joshi" className="founder-img" />
              <div className="founder-image-container__ring" aria-hidden="true" />
            </div>
            <div className="founder-content reveal-up">
              <span className="eyebrow">Meet the Visionary</span>
              <h2 className="founder-name">Mr. Jiwan Joshi</h2>
              <p className="founder-title">Founder &amp; Head Technician</p>
              <p>
                Founded on the principle of technical excellence, WowSewa bridges
                the gap between traditional utility and modern technology. Mr. Joshi
                established WowSewa to provide a reliable, all-in-one technical
                solution for the community.
              </p>
              <p>
                With years of hands-on experience in both industrial hardware and
                residential systems, his dual expertise ensures every project meets
                the highest standards of safety and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section section-ec">
        <div className="container">
          <div className="ds-head">
            <span className="eyebrow eyebrow--center">Our DNA</span>
            <h2>The <span className="accent-text-primary">WOW</span> difference</h2>
            <p>The principles behind every job we take on.</p>
          </div>
          <div className="values-grid">
            {values.map((v) => (
              <div className="value-item" key={v.n}>
                <div className="value-number">{v.n}</div>
                <h4>{v.t}</h4>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="standards-section section-ec">
        <div className="container">
          <div className="ds-head">
            <span className="eyebrow eyebrow--center">The Gold Standard</span>
            <h2>Built on <span className="accent-text-primary">precision</span></h2>
            <p>Our commitment to technical excellence goes beyond the surface.</p>
          </div>
          <div className="standards-grid">
            {standards.map((s) => (
              <div className="standard-card" key={s.t}>
                <div className="standard-icon">{s.icon}</div>
                <div className="standard-info">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Book />
    </div>
  );
};

export default About;
