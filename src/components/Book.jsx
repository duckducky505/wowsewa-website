import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';

const Book = () => {
  return (
    <section className="final-cta-section sec-light">
      <div className="container">
        <div className="cta-box">
          <div className="cta-box__content">
            <span className="eyebrow">Get Started</span>
            <h2>
              Ready for a <span className="accent-text-primary">WOW</span> experience?
            </h2>
            <p>
              Join hundreds of homeowners and businesses across Kathmandu who
              trust our technical expertise — book in under 60 seconds.
            </p>
          </div>
          <div className="cta-buttons">
            <a
              href="https://docs.google.com/forms/..."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-darkgreen btn-large"
            >
              Book Now <FaArrowRight />
            </a>
            <a href="tel:9762424318" className="btn btn-outline-green btn-large">
              <FaPhoneAlt /> Call Technician
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Book;
