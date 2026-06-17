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
              <h3>Starter Plan</h3>
              <span className="ptag">Most flexible</span>
            </div>
            <div className="price-amt"><span className="cur">Rs</span>8000<small>/month</small></div>
            <p className="pdesc">
              Reliable Care. Every Month. Peace of mind. Every Day.
            </p>
            <ul className="pfeats">
              <li><span className="ck">✓</span>1 Scheduled Visit</li>
              <li><span className="ck">✓</span>Phone Support</li>
              <li><span className="ck">✓</span>Priority Service</li>
              <li><span className="ck">✓</span>AMC Discount 10%</li>
            </ul>
          </div>

          {/* Card 2 — featured */}
          <div className="pcard featured">
            <div className="ptier">
              <h3>Business Plan</h3>
              <span className="ptag">Recommended</span>
            </div>
            <div className="price-amt"><span className="cur">Rs</span>15,000<small>/month</small></div>
            <p className="pdesc">
              Unlimited basic visits across all four services. Free AC service
              twice a year. Priority dispatch under an hour.
            </p>
            <ul className="pfeats">
              <li><span className="ck">✓</span>2× visits/month</li>
              <li><span className="ck">✓</span>Preventive maintainence</li>
              <li><span className="ck">✓</span>Emergency Support</li>
              <li><span className="ck">✓</span>AMC discount 12%</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="pcard">
            <div className="ptier">
              <h3>Corporate Plan</h3>
              <span className="ptag">By contract</span>
            </div>
            <div className="price-amt"><span className="cur">Rs</span>25,000<small>/month</small></div>
            <p className="pdesc">
              A dedicated supervisor, on-site SLA targets, a monthly maintenance
              check and a single invoice for the whole society or office.
            </p>
            <ul className="pfeats">
              <li><span className="ck">✓</span>Weekly Visits</li>
              <li><span className="ck">✓</span>Emergency Response</li>
              <li><span className="ck">✓</span>Monthly reports</li>
              <li><span className="ck">✓</span>AMC discount 15%</li>
              <li><span className="ck">✓</span>Dedicated Technical Support</li>
              <li><span className="ck">✓</span>Monthly reports</li>
            </ul>
          </div>
        </div>

        <div className="pricing-footer">
          <a href="/amc" className="btn btn-view-more">
            View all AMC plans <span className="arr">→</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default Pricing;