import './Testimonials.css';

const REVIEWS = [
  { 
    who: "Law Rijal", 
    role: "Laptop Repair • 1 month ago", 
    text: "I was so stressed out about my laptop as it had some issues with the motherboard, but fortunately found out about Wow Sewa. Saved me my commute time as they provided pick and drop service as well." 
  },
  { 
    who: "Niranjana Beverage Udhyog", 
    role: "Corporate Client • 2 months ago", 
    text: "We’ve been using WOW Sewa services for quite some time now for various needs like plumbing, electrical work, TV and washing machine repairs — and the experience has been consistently excellent.", 
    wide: true, 
    lime: true 
  },
  { 
    who: "Daniel Dq", 
    role: "Networking Setup • 4 months ago", 
    text: "Their technicians fixed my office network issue within just a few hours! The service was fast, efficient, and very affordable. The team was friendly, professional, and clearly knew what they were doing." 
  },
  { 
    who: "BG Courier", 
    role: "Electrical Services • 2 months ago", 
    text: "WOW Sewa’s electrician service was very reliable. The technician was punctual, knowledgeable, and handled the electrical issue safely and efficiently. I appreciated the professionalism and transparent pricing." 
  },
  { 
    who: "Aman Pal", 
    role: "CCTV Installation • 3 weeks ago", 
    text: "I booked for CCTV camera installation. They came very fast and installed it the same day. Very fast and reliable CCTV camera service from Wow Sewa. Thank you so much!" 
  },
  { 
    who: "Bishow Shrestha", 
    role: "TV & WiFi Setup • 2 months ago", 
    text: "Excellent service from Wow Sewa! They helped me fix my TV and also set up my home WiFi/networking properly. The team was very professional and explained everything clearly. Now everything works perfectly." 
  }
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
            <a href="https://maps.app.goo.gl/1VeyWvcZXFfa2QQ37">See all reviews →</a>
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