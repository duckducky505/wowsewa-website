import './Pricing.css';

const Pricing = () => {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="pricing-head">
          <div>
            <div className="pricing-eyebrow"><span className="ln"></span>03 — Plans</div>
            <h2 className="pricing-title">
              Pay per visit,<br />
              or pay <span className="it">nothing</span><br />
              all year.
            </h2>
          </div>
          <p className="pricing-lead">
            Single visits are flat-priced before a pro shows up. For a family
            home, an annual plan pays for itself in three jobs.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Card 1 */}
          <div className="pcard">
            <div className="ptier">
              <h3>Pay-as-you-go</h3>
              <span className="ptag">Most flexible</span>
            </div>
            <div className="price-amt"><span className="cur">Rs</span>249<small>/visit</small></div>
            <p className="pdesc">
              Book any single service. Diagnostic + visit fee adjusted into the
              final bill if you proceed with the work.
            </p>
            <ul className="pfeats">
              <li><span className="ck">✓</span>Flat-priced before the pro arrives</li>
              <li><span className="ck">✓</span>90-day warranty on the fix</li>
              <li><span className="ck">✓</span>Cash, UPI or card</li>
            </ul>
            <a href="#" className="btn btn-ghost btn-block">
              Book a single visit <span className="arr">→</span>
            </a>
          </div>

          {/* Card 2 — featured */}
          <div className="pcard featured">
            <div className="ptier">
              <h3>Home Plus</h3>
              <span className="ptag">Recommended</span>
            </div>
            <div className="price-amt"><span className="cur">Rs</span>3,499<small>/year, 2-3 BHK</small></div>
            <p className="pdesc">
              Unlimited basic visits across all four services. Free AC service
              twice a year. Priority dispatch under an hour.
            </p>
            <ul className="pfeats">
              <li><span className="ck">✓</span>Unlimited basic visits — all services</li>
              <li><span className="ck">✓</span>2× AC service · 1× geyser service</li>
              <li><span className="ck">✓</span>1-hour priority dispatch</li>
              <li><span className="ck">✓</span>20% off parts &amp; installation</li>
            </ul>
            <a href="#" className="btn btn-dark btn-block">
              Start Home Plus <span className="arr">→</span>
            </a>
          </div>

          {/* Card 3 */}
          <div className="pcard">
            <div className="ptier">
              <h3>Society &amp; SMB</h3>
              <span className="ptag">By contract</span>
            </div>
            <div className="price-amt">Custom<small>50+ units</small></div>
            <p className="pdesc">
              A dedicated supervisor, on-site SLA targets, a monthly maintenance
              check and a single invoice for the whole society or office.
            </p>
            <ul className="pfeats">
              <li><span className="ck">✓</span>Dedicated supervisor &amp; account lead</li>
              <li><span className="ck">✓</span>Same-day SLA, contractual</li>
              <li><span className="ck">✓</span>Monthly preventive sweep</li>
            </ul>
            <a href="#" className="btn btn-ghost btn-block">
              Talk to sales <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;