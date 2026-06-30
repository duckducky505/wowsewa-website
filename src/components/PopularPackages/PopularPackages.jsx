import { FaArrowRight, FaStar } from 'react-icons/fa';
import './PopularPackages.css';

import acImg from '../../assets/images/ac-repair.webp';
import leakImg from '../../assets/images/leak-repair.webp';
import netImg from '../../assets/images/networking.webp';
import laptopImg from '../../assets/images/laptopservicing.webp';
import wiringImg from '../../assets/images/home-rewiring.webp';
import cctvImg from '../../assets/images/cctv.webp';
import solarImg from '../../assets/images/solar.webp';
import fridgeImg from '../../assets/images/fridge-maintainence.webp';

const packages = [
  { img: acImg, name: 'AC Deep Cleaning', tag: 'Most Booked', price: 'NPR 1,499' },
  { img: leakImg, name: 'Emergency Leak Fix', tag: 'Popular', price: 'NPR 999' },
  { img: netImg, name: 'Office WiFi Setup', tag: 'Business', price: 'NPR 3,999' },
  { img: laptopImg, name: 'Laptop Servicing', tag: 'Popular', price: 'NPR 1,299' },
  { img: wiringImg, name: 'House Rewiring', tag: 'Safety', price: 'NPR 4,999' },
  { img: cctvImg, name: 'CCTV Installation', tag: 'Security', price: 'NPR 5,999' },
  { img: solarImg, name: 'Solar Geyser Service', tag: 'Eco', price: 'NPR 1,799' },
  { img: fridgeImg, name: 'Fridge Gas Refill', tag: 'Popular', price: 'NPR 1,499' },
];


const phoneNumber = "9779762424318"; 
const message = "Hello WowSewa! I would like to book a package.";
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

const PackageCard = ({ p }) => (
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="pp-card"
  >
    <div className="pp-card__media">
      <img src={p.img} alt={p.name} className="pp-card__img" loading="lazy" />
      <span className="pp-card__tag">{p.tag}</span>
    </div>
    <div className="pp-card__body">
      <div className="pp-card__rating" aria-hidden="true">
        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
      </div>
      <h3 className="pp-card__name">{p.name}</h3>
      <div className="pp-card__foot">
        <span className="pp-card__go">
          Book <FaArrowRight />
        </span>
      </div>
    </div>
  </a>
);

const PopularPackages = () => {
  return (
    <section className="pp-section section-ec sec-light">
      <div className="container">
        <div className="ds-head">
          <span className="eyebrow eyebrow--center accent-text-lime-dark">Popular Packages</span>
          <h2>
            Our most <span className="accent-text-lime-dark">requested</span> services
          </h2>
          <p>Fixed-price packages Kathmandu books again and again.</p>
        </div>
      </div>

      <div className="pp-marquee">
        <div className="pp-track">
          {packages.map((p) => (
            <PackageCard key={`a-${p.name}`} p={p} />
          ))}
          {packages.map((p) => (
            <PackageCard key={`b-${p.name}`} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
