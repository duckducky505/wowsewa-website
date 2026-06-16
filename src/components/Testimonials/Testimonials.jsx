import './Testimonials.css';

const REVIEWS = [
  { who: "Aarti M.", role: "Indiranagar, Bangalore", text: "Booked at 10pm, technician at the door by 9am. Fixed a leaking trap and re-sealed the wash basin without making a mess." },
  { who: "Rohit K.", role: "Pimple Saudagar, Pune", text: "WowSewa installed our new 1.5T AC and the wall-mount kit they used was visibly sturdier than the one our previous brand used.", wide: true, lime: true },
  { who: "Sneha D.", role: "HSR Layout, Bangalore", text: "My MacBook wouldn't charge — they diagnosed a port issue, ordered a part, came back two days later, and only charged for the part." },
  { who: "Imran F.", role: "Andheri West, Mumbai", text: "Got the 'Home Plus' annual plan. Already used it three times this monsoon for plumbing — paid for itself in a month." },
  { who: "Nikhil R.", role: "Sector 22, Gurgaon", text: "Honest pricing. They told me the geyser didn't need replacement, just a heating element. Saved me \u20b94,000." },
];

const Testimonials = () => {
  return (
    <section className="testimonials bg-light" id="testimonials">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-num"><span className="ln"></span>04 — Reviews</div>
            <h2>What 38,000<br />homes <span className="accent-text-main">say</span> back.</h2>
          </div>
          <p className="lead text-md">
            Reviews are collected after every job — verified by booking ID, not
            scraped. We publish the bad ones too.{" "}
            <a href="#">See all 12,400 reviews →</a>
          </p>
        </div>

        <div className="tgrid">
          {REVIEWS.map((r, i) => (
            <div key={i} className={"tcard" + (r.wide ? " wide" : "") + (r.lime ? " lime" : "")}>
              <span className="qmark">“</span>
              <p className="ttext">{r.text}</p>
              <div className="tperson">
                <div className="tavatar">{r.who.charAt(0)}</div>
                <div>
                  <div className="tname">{r.who}</div>
                  <div className="tmeta">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;