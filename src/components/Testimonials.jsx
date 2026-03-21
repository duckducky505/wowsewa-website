import "./Testimonials.css";

const testimonialData = [
  {
    quote: "Wow Sewa is the best handyman company in Nepal for plumbing services. I had a serious water leakage problem, and their professional plumbing technician arrived very fast. The work was clean, affordable, and efficient. Highly recommended for fast plumbing service in Nepal.",
    name: "Griwan Lamichhane",
    position: "Home Owner, Kathmandu",
    image: "src/assets/images/person-1.webp" 
  },
  {
    quote: "Their technicians fixed my office network issue within just a few hours! The service was fast, efficient, and very affordable. The team was friendly, professional, and clearly knew what they were doing.",
    name: "Daniel DQ",
    position: "Office, Kathmandu",
    image: "src/assets/images/danialdq.webp"
  },
  {
    quote: "I used Wow Sewa for electrical repair service in Kathmandu, and the experience was excellent. The electrician was skilled, polite, and fixed the issue quickly. If you need reliable electrical service in Nepal, Wow Sewa is the best choice.",
    name: "Santos Paudel",
    position: "Founder, Red Bolt Studio",
    image: "src/assets/images/wowLogo.png"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials bg-darkgreen">
      <div className="container">
        <h3 className="testimonials-heading text-xl">
          Don't just take our word for it, see how <span className="accent-text">WowSewa</span> is 
          powering homes and businesses just like yours.
        </h3>
        
        <div className="testimonials-grid">
          {testimonialData.map((item, index) => (
            <div className="card" key={index}>
              <p>"{item.quote}"</p>
              
              <div className="testimonial-footer">
                <img src={item.image} alt={item.name} className="profile-img" />
                <div className="author-details">
                  <p className="author-name">{item.name}</p>
                  <p className="author-pos">{item.position}</p>
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