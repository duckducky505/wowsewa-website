import React, { useEffect, useRef, useState } from 'react';
import './Statsbar.css';

/* format an in-progress value: integers get thousands separators,
   decimals are fixed to the requested precision */
const fmt = (v, decimals) =>
  decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();

/*
  StatsBar — a reusable animated stats band.
  Numbers count up (ease-out) the first time the bar scrolls into view,
  and each item fades/rises in with a small stagger.

  Usage:
    <StatsBar stats={[
      { value: 6,    sup: '+',  label: 'Services in plumbing' },
      { value: 299,  prefix: '₹', label: 'Starting price' },
      { value: 90,   sup: 'd',  label: 'Warranty on repairs' },
      { value: 4.92, decimals: 2, sup: '★', label: 'Average pro rating' },
    ]} />
*/
const StatsBar = ({ stats = [], className = '', duration = 1300 }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [vals, setVals] = useState(() => stats.map(() => 0));

  // reveal when the bar enters the viewport (once)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // respect reduced-motion: show final values immediately
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVals(stats.map((s) => s.value));
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []); 

  // count-up animation
  useEffect(() => {
    if (!shown) return;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = easeOutCubic(p);
      setVals(stats.map((s) => s.value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVals(stats.map((s) => s.value));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown]); 

  return (
    <div ref={ref} className={`statsbar ${className}`.trim()}>
      <div className="container statsbar-row">
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="statsbar-sep" aria-hidden="true" />}
            <div
              className={`statsbar-item${shown ? ' in' : ''}`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="statsbar-val">
                {s.prefix && <span className="statsbar-cur">{s.prefix}</span>}
                {fmt(vals[i] ?? 0, s.decimals)}
                {s.sup && <sup>{s.sup}</sup>}
              </div>
              <div className="statsbar-label">{s.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
