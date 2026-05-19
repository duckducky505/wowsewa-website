import { useEffect, useRef, useState } from 'react';
import './StatsBar.css';

const StatsBar = ({ stats = [] }) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Trigger animations only when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // fire once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!stats.length) return null;

  return (
    <section
      className={`stats-bar${visible ? ' stats-bar--visible' : ''}`}
      ref={sectionRef}
      aria-label="Key statistics"
    >
      <div className="stats-bar__container">
        {/* Top decorative line */}
        <span className="stats-bar__accent-line" aria-hidden="true" />

        <div className="stats-bar__grid" role="list">
          {stats.map((item, index) => (
            <div
              className="stats-bar__item"
              key={index}
              role="listitem"
            >
              {/* Rolling number */}
              <div className="stats-bar__rolling" aria-hidden="true">
                <span className="stats-bar__number">{item.number}</span>
              </div>

              {/* Accessible version for screen readers */}
              <p className="stats-bar__label">
                <span className="sr-only">{item.number} </span>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom decorative line */}
        <span className="stats-bar__accent-line stats-bar__accent-line--bottom" aria-hidden="true" />
      </div>
    </section>
  );
};

export default StatsBar;