import "./Testimonials.css"

const Testimonials = () => {
  return(
    <section class="testimonials bg-dark">
      <div class="container">
        <h3 class="testimonials-heading text-xl">
          Dont just take our word for it, see the success sories from businesses
          just like yours.
        </h3>
        <div class="testimonials-grid">
          <div class="card">
            <p>
              "Our business has seen significant increase in productivity since
              we started using the Growth app."
            </p>
            <p>Katherine Smith</p>
            <p>Capodopera</p>
          </div>
          <div class="card">
            <p>
              "The dashboards and reporting feature has provided valuable
              insights into our performance and helped us make data-driven
              decisions. Its a game changer for us"
            </p>
            <p>David Wilson</p>
            <p>Slide</p>
          </div>
          <div class="card">
            <p>
              "As a small business owner its important to have a tool that can
              help me keep track of everything. The Growth app has been a
              lifesaver for me, allowing me to manage my contacts, schedule
              appointments, and track progress all in one place.."
            </p>
            <p>Jonathan Lee</p>
            <p>Red Bolt</p>
          </div>
        </div>
      </div>
    </section>
    )
}

export default Testimonials;