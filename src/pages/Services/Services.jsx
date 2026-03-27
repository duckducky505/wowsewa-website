import { Link } from 'react-router-dom';
import FAQ from '../../components/FAQ/FAQ';
import './Services.css'
import { 
  FaMicrochip, 
  FaFaucet, 
  FaBolt, 
  FaCheck, 
  FaCalendarCheck 
} from 'react-icons/fa';
import StatsBar from '../../components/Statsbar/Statsbar';

const Services = () => {

    const servicesFaqData = [
        {
            question: "What is Wow Sewa?",
            answer: "Wow Sewa is a comprehensive repair and service company offering a wide range of services for both residential and commercial customers."
        },
        {
            question: "What services do we provide?",
            answer: "We provide services mostly related to electrical problems and installation, plumbing-related, computer/laptop repair and servicing, any kind of electrical services and general installation and maintainence of home appliances."
        },
        {
            question: "How can I book an appointment?",
            answer: "You can call us at 9762424318 or email us at wowsewa@gmail.com to book an appointment."
        }
    ];

    const servicesData = [
    {
        category: "Digital & IT Solutions",
        icon: <FaMicrochip />, 
        items: [
            {
                title: "IT Networking & WiFi",
                description: "Complete LAN/WAN setup and WiFi dead-zone elimination for homes and offices.",
                tag: "Business Favorite",
                image: "src/assets/images/networking.webp", 
                features: ["Mesh WiFi Setup", "Router Configuration"]
            },
            {
                title: "Laptop Repair and Servicing",
                description: "Deep cleaning, thermal paste replacement, and hardware upgrades to boost performance.",
                image: "src/assets/images/laptopservicing.webp", 
                features: ["Windows/OS Setup", "Hinges & Screen Fix"]
            },
            {
                title: "CCTV Camera Installation",
                description: "Complete security surveillance setup with remote mobile viewing and DVR/NVR config.",
                tag: "Security",
                image: "src/assets/images/cctv.webp",
                features: ["Night Vision Setup", "IP Camera Mapping"]
            }
        ]
    },
    {
        category: "Plumbing & Water Systems",
        icon: <FaFaucet />, 
        items: [
            {
                title: "Emergency Leak Repair",
                description: "Rapid response for burst pipes, hidden leaks, and high-pressure system failures.",
                tag: "24/7 Service",
                image: "src/assets/images/leak-repair.webp",
                features: ["Pipe Soldering", "Drain Unclogging"]
            },
            {
                title: "Solar and Geyser Servicing",
                description: "Tank descaling, glass tube cleaning, and repair of leaking solar water heaters.",
                tag: "Eco-Friendly",
                image: "src/assets/images/solar.webp",
                features: ["Pipe Insulation", "Water Pressure Fix"]
            },
            {
                title: "Sanitary Fitting",
                description: "Installation of modern commodes, showers, and luxury bathroom fixtures with precision.",
                tag: null,
                image: "src/assets/images/sanitary-fitting.webp",
                features: ["Tap Installation", "PPR/CPVC Mapping"]
            }
        ]
    },
    {
        category: "Electrical & Power",
        icon: <FaBolt />, 
        items: [
            {
                title: "House Rewiring",
                description: "Full house rewiring and circuit breaker panel upgrades to ensure fire safety.",
                tag: "Safety First",
                image: "src/assets/images/home-rewiring.webp",
                features: ["MCB Installation", "Short Circuit Fix"]
            },
            {
                title: "AC & Fridge Maintenance",
                description: "Gas refilling, filter cleaning, and compressor repair for all major cooling brands.",
                tag: "Hot Seller",
                image: "src/assets/images/ac-repair.webp",
                features: ["AC Deep Cleaning", "Fridge Gas Leak Fix"]
            },
            {
                title: "Inverter & UPS Setup",
                description: "Backup power solutions and battery maintenance to keep your home running during outages.",
                tag: null,
                image: "src/assets/images/inverter.webp",
                features: ["Battery Health Check", "Load Balancing"]
            }
        ]
    }];

    return (
        <>
        <StatsBar/>
            <section className="services-page bg-dark">
                <div className="container">
                    <header className="services-header">
                        <h1 className="text-xxl">Our <span className="accent-text-primary">Specialized</span> Services</h1>
                        <p className="text-md">Precision installation, expert repair, and proactive maintenance for every corner of your life.</p>
                    </header>

                    <div className="services-grid-layout">
                        {servicesData.map((cat, index) => (
                            <div className="service-category-block" key={index}>
                                <h2 className="category-title">
                                    <span className="cat-icon-wrapper">{cat.icon}</span> {cat.category}
                                </h2>
                                
                                <div className="service-items-grid">
                                    {cat.items.map((item, i) => (
                                        <div className="service-item bg-light" key={i}>
                                            <div className="service-image-box">
                                                <img src={item.image} alt={item.title} className="card-img" />
                                            </div>

                                            <div className="item-head">
                                                <h3 className='accent-text-dark'>{item.title}</h3>
                                                {item.tag && (
                                                    <span className={`service-tag ${item.tag === 'Safety First' ? 'tag-red' : ''}`}>
                                                        {item.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <p>{item.description}</p>
                                            <ul className="item-features">
                                                {item.features.map((feature, fIndex) => (
                                                    <li key={fIndex}>
                                                        <FaCheck className="feature-check-icon accent-text-lime-dark" /> {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="support-banner bg-dark booking-banner">
                            <div className="banner-content">
                                <h2 className="text-black">Need a Professional?</h2>
                                <p className="text-black-muted">Book your service online in less than 60 seconds. Expert help is just a click away.</p>
                            </div>
                        <a href="https://docs.google.com/forms/..." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            <FaCalendarCheck className="btn-icon-left" /> Book a Service
                        </a>
                    </div>
                    
                    <div className="support-banner bg-dark">
                        <div className="banner-content">
                            <h2>Don't see what you're looking for?</h2>
                            <p>We handle custom technical requirements for businesses and homes alike.</p>
                        </div>
                        <a className="btn btn-primary" href="https://docs.google.com/forms/..." target="_blank">Custom Request</a>
                    </div>
                </div>
            </section>
            <FAQ data={servicesFaqData}/>
        </>
    );
} 

export default Services;