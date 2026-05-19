import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import './Testimonials.css';

const testimonialData = [
  {
    quote:
      'WowSewa is the best handyman company in Nepal for plumbing. I had a serious water leakage, and their technician arrived very fast. The work was clean, affordable and efficient. Highly recommended.',
    name: 'Griwan Lamichhane',
    position: 'Home Owner, Kathmandu',
    image: 'src/assets/images/person-1.webp',
  },
  {
    quote:
      'Their technicians fixed my office network issue within just a few hours. The service was fast, efficient and very affordable. The team was friendly, professional and clearly knew what they were doing.',
    name: 'Daniel DQ',
    position: 'Office, Kathmandu',
    image: 'src/assets/images/danialdq.webp',
  },
  {
    quote:
      'I used WowSewa for electrical repair in Kathmandu and the experience was excellent. The electrician was skilled, polite and fixed the issue quickly. The best choice for reliable service in Nepal.',
    name: 'Santos Paudel',
    position: 'Founder, Red Bolt Studio',
    image: 'src/assets/images/santospaudel.webp',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials section-ec">
      <div className="container">
        <div className="ds-head">
          <span className="eyebrow eyebrow--center">Testimonials</span>
          <h2>
            Trusted by homes &amp; businesses{' '}
            <span className="accent-text-primary">like yours</span>
          </h2>
          <p>
            Don&apos;t just take our word for it — see how WowSewa is powering
            Kathmandu&apos;s homes and offices.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonialData.map((item, index) => (
            <article
              className="t-card reveal-up"
              key={item.name}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FaQuoteLeft className="t-card__quote" />
              <div className="t-card__stars" aria-hidden="true">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="t-card__text">{item.quote}</p>

              <div className="t-card__footer">
                <img src={item.image} alt={item.name} className="t-card__avatar" />
                <div>
                  <p className="t-card__name">{item.name}</p>
                  <p className="t-card__pos">{item.position}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
