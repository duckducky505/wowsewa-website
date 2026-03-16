import FAQ from '../components/FAQ';
import './Services.css'

const Services = () => {

    const servicesData = [
    {
        category: "Digital & IT Solutions",
        icon: "fas fa-microchip",
        items: [
            {
                title: "IT Networking & WiFi",
                description: "Complete LAN/WAN setup and WiFi dead-zone elimination for homes and offices.",
                tag: "Business Favorite",
                image: "src/assets/images/networking.jpg", 
                features: ["Mesh WiFi Setup", "Router Configuration"]
            },

            {
                title: "Laptop Repair and Servicing",
                description: "Deep cleaning, thermal paste replacement, and hardware upgrades to boost performance.",
                image: "src/assets/images/laptop-repair.jpg", 
                features: ["Windows/OS Setup", "Hinges & Screen Fix"]
            },
            {
                title: "CCTV Camera Installation",
                description: "Complete security surveillance setup with remote mobile viewing and DVR/NVR config.",
                tag: "Security",
                image: "src/assets/images/cctv.jpg",
                features: ["Night Vision Setup", "IP Camera Mapping"]
            }
        ]
    },
    {
        category: "Plumbing & Water Systems",
        icon: "fas fa-faucet",
        items: [
            {
                title: "Emergency Leak Repair",
                description: "Rapid response for burst pipes, hidden leaks, and high-pressure system failures.",
                tag: "24/7 Service",
                image: "src/assets/images/plumbing-leak.jpg",
                features: ["Pipe Soldering", "Drain Unclogging"]
            },

            {
                title: "Solar Geyser Servicing",
                description: "Tank descaling, glass tube cleaning, and repair of leaking solar water heaters.",
                tag: "Eco-Friendly",
                image: "src/assets/images/solar-geyser.jpg",
                features: ["Pipe Insulation", "Water Pressure Fix"]
            },

            {
                title: "Sanitary Fitting",
                description: "Installation of modern commodes, showers, and luxury bathroom fixtures with precision.",
                tag: null,
                image: "src/assets/images/sanitary.jpg",
                features: ["Tap Installation", "PPR/CPVC Mapping"]
            }
        ]
    },
    {
        category: "Electrical & Power",
        icon: "fas fa-bolt",
        items: [
            {
                title: "Electrical Rewiring",
                description: "Full house rewiring and circuit breaker panel upgrades to ensure fire safety.",
                tag: "Safety First",
                image: "src/assets/images/electrical.jpg",
                features: ["MCB Installation", "Short Circuit Fix"]
            },
            {
                title: "AC & Fridge Maintenance",
                description: "Gas refilling, filter cleaning, and compressor repair for all major cooling brands.",
                tag: "Hot Seller",
                image: "src/assets/images/ac-service.jpg",
                features: ["AC Deep Cleaning", "Fridge Gas Leak Fix"]
            },
            {
                title: "Inverter & UPS Setup",
                description: "Backup power solutions and battery maintenance to keep your home running during outages.",
                tag: null,
                image: "src/assets/images/ups.jpg",
                features: ["Battery Health Check", "Load Balancing"]
            }
        ]
    }];


    return (
        <>
            <section className="services-page bg-black">
                <div className="container">
                    <header className="services-header">
                        <h1 className="text-xxl">Our <span className="accent-text">Specialized</span> Services</h1>
                        <p className="subtitle">Precision installation, expert repair, and proactive maintenance for every corner of your life.</p>
                    </header>

                    <div className="services-grid-layout">
                        {servicesData.map((cat, index) => (
                            <div className="service-category-block" key={index}>
                                <h2 className="category-title">
                                    <i className={cat.icon}></i> {cat.category}
                                </h2>
                                
                                <div className="service-items-grid">
                                    {cat.items.map((item, i) => (
                                        <div className="service-item" key={i}>
                                            <div className="service-image-box">
                                                <img src={item.image} alt={item.title} className="card-img" />
                                            </div>

                                            <div className="item-head">
                                                <h3>{item.title}</h3>
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
                                                        <i className="fas fa-check"></i> {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Support Banner */}
                    <div className="support-banner">
                        <div className="banner-content">
                            <h2>Don't see what you're looking for?</h2>
                            <p>We handle custom technical requirements for businesses and homes alike.</p>
                        </div>
                        <button className="btn btn-primary">Custom Request</button>
                    </div>
                </div>
            </section>
            <FAQ />
        </>
    );
} 

export default Services;