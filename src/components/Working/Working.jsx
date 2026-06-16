import './Working.css';

const Search = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
const Calendar = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);
const Shield = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const Working = () => {
  return (
    <section className="working bg-light" id="how">
      <div className="container">
        <div className="wc-head">
          <div>
            <div className="wc-eyebrow">
              <span className="section-num"><span className="ln"></span>02 — How it works<span className="ln"></span></span>
              <span className="mono">Three taps. One pro. Done.</span>
            </div>
            <h2 className="wc-title">
              Booked in a<br />minute,<br />fixed in <span className="it">an hour.</span>
            </h2>
          </div>
          <p className="lead">
            No call centres, no quoting circus. Pick what's broken, pick a slot,
            and we send the closest vetted technician with the right parts in
            their bag.
          </p>
        </div>

        <div className="wc-steps">
          {/* 01 */}
          <div className="wc-step s1">
            <span className="wc-no">01</span>
            <div className="wc-label">Tell us</div>
            <h3>What's the<br />problem?</h3>
            <p>Pick a category, snap a photo, scribble a note. Our triage bot
              estimates a fair price before anyone steps into your home.</p>
            <div className="wc-foot">
              <div className="wc-divider"></div>
              <div className="wc-illu"><Search /> Geyser not heating</div>
            </div>
          </div>

          {/* 02 */}
          <div className="wc-step s2">
            <span className="wc-no">02</span>
            <div className="wc-label">We match</div>
            <h3>A pro on<br />your street.</h3>
            <p>The closest verified technician — ID, background check, training
              cert — accepts the job and starts heading over.</p>
            <div className="wc-foot">
              <div className="wc-divider"></div>
              <div className="wc-illu"><Calendar /> Track ETA live</div>
            </div>
          </div>

          {/* 03 */}
          <div className="wc-step s3">
            <span className="wc-no">03</span>
            <div className="wc-label">Done. Paid.</div>
            <h3>Fixed before<br />the kettle boils.</h3>
            <p>Pay after the job, in app or cash. Every repair is covered by a
              90-day warranty. Re-book the same pro any time.</p>
            <div className="wc-foot">
              <div className="wc-divider"></div>
              <div className="wc-illu"><Shield s={18} /> 90-day warranty included</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;