import "./Testimonials.css"

const Testimonials = () => {
  return (
    <section className="testimonials bg-dark">
      <div className="container">
        <h3 className="testimonials-heading text-xl">
          Don't just take our word for it, see how <span className="accent-text">WowSewa</span> is 
          powering homes and businesses just like yours.
        </h3>
        <div className="testimonials-grid">
          <div className="card">
            <p>
              "Our office networking was a mess until WowSewa stepped in. They set up a 
              seamless mesh WiFi and installed our smart boards perfectly. Highly professional 
              tech support!"
            </p>
            <p>Katherine Smith</p>
            <p>Operations Manager, Capodopera</p>
          </div>

          <div className="card">
            <p>
              "The plumbing and appliance maintenance plan has provided valuable peace of mind. 
              Knowing a reliable expert is just a call away for any leak or repair is 
              a game changer for us."
            </p>
            <p>David Wilson</p>
            <p>Property Lead, Slide Properties</p>
          </div>

          <div className="card">
            <p>
              "As a small business owner, it's a lifesaver to have one place for everything. 
              WowSewa manages our laptop repairs, solar geysers, and electrical fixes 
              all in one place. Truly unmatched service."
            </p>
            <p>Jonathan Lee</p>
            <p>Founder, Red Bolt Studio</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials;