import type { ComponentType } from "react";
import {
  IconWrench,
  IconBolt,
  IconWasher,
  IconChip,
  IconSnow,
  IconRoller,
  IconHammer,
  IconSpray,
  /* AMC verticals + items */
  IconStore,
  IconCafe,
  IconClinic,
  IconSchool,
  IconRestaurant,
  IconBriefcase,
  IconHotel,
  IconCity,
  IconNetwork,
  IconSun,
  IconFridge,
  IconRouter,
  IconSwitch,
  IconRack,
  IconCable,
  IconWaves,
  IconGauge,
  IconFilter,
  IconDrop,
  IconBattery,
  IconGear,
  /* trust + training + about */
  IconHardHat,
  IconClock,
  IconVerified,
  IconHeadset,
  IconPipe,
  IconSparkle,
  IconShield,
  IconSearch,
  IconCalendar,
} from "../assets/icons/Icons";



/* ---------------- services ---------------- */
export type Service = {
  id: string;
  name: string;
  tag: string;
  desc: string;
  items: string[];
  price: number;
  Icon: ComponentType<{ className?: string }>;
  accent?: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    tag: "LEAK-FREE GUARANTEE",
    desc: "From dripping taps to full bathroom refits — our plumbers arrive with parts, not promises.",
    items: [
      "Water Leakage Detection & Repair",
      "Tap, Faucet & Sanitary Installation",
      "Bathroom & Kitchen Plumbing",
      "Drainage Blockage & Cleaning",
      "Water Pump Installation & Repair",
      "New Plumbing Installation & Maintenance",
    ],
    price: 1000,
    Icon: IconWrench,
  },
  {
    id: "electrical",
    name: "Electrical",
    tag: "LICENSED & INSURED",
    desc: "Certified electricians for wiring, switchboards and everything that sparks — done to code.",
    items: [
      "House & Commercial Wiring",
      "Electrical Fault Detection & Repair",
      "Lighting Installation & Repair",
      "Switch, Socket & Electrical Fittings",
      "Electrical Panel & Distribution Board",
      "New Electrical Setup & Maintenance",
    ],
    price: 1000,
    Icon: IconBolt,
  },
  {
    id: "it",
    name: "IT & Device Repair",
    tag: "NO-FIX, NO-FEE",
    desc: "Laptops, phones, printers, Wi-Fi dead zones — our bench techs and field IT crew handle it all.",
    items: [
      "Laptop, MacBook & Desktop Repair",
      "Gaming Laptop & PC Servicing",
      // "Mobile Phone & Tablet Repair",
      "Printer & Scanner Repair",
      "Hardware & Software Troubleshooting",
      "Computer Upgrades & Maintenance",
      "Toner & Ink Refilling",
    ],
    price: 1500,
    Icon: IconChip,
    accent: true,
  },
  {
    id: "appliance-installation",
    name: "Appliance Installation",
    tag: "SAME-DAY FIT",
    desc: "Washing machine to wall-mounted TV — levelled, tested and warrantied on the spot.",
    items: [
      "Home Appliance Installation & Setup",
      "Kitchen Appliance Installation",
      "TV Installation & Wall Mounting",
      "Water Purifier Installation",
      "Appliance Relocation & Reinstallation",
    ],
    price: 1000,
    Icon: IconWasher,
  },
  {
    id: "ac-heating",
    name: "AC & Heating",
    tag: "GAS-CHECK INCLUDED",
    desc: "Split or window AC, room heaters, air purifiers — serviced with pressure gauges, not guesswork.",
    items: [
      "AC Installation, Repair & Servicing",
      "AC Gas Refilling & Leakage Repair",
      "Electric & Gas Geyser Services",
      "Solar Water Heater Services",
      "Room Heater Repair & Maintenance",
      "Heating System Installation & Repair",
    ],
    price: 1000,
    Icon: IconSnow,
  },
  {
    id: "cctv-networking",
    name: "CCTV & Networking",
    tag: "SECURE & CONNECTED",
    desc: "Complete surveillance and network infrastructure setup for homes and commercial spaces.",
    items: [
      "CCTV Installation, Repair & Maintenance",
      "DVR & NVR Setup & Configuration",
      "Wi-Fi Router Installation & Troubleshooting",
      "LAN & Office Networking",
      "Network Cabling & Maintenance",
      "Biometric & Access Control Systems",
    ],
    price: 1000,
    Icon: IconShield,
  },
  {
    id: "solar-ups",
    name: "Solar & UPS",
    tag: "UNINTERRUPTED POWER",
    desc: "Reliable green energy solutions and backup systems to keep your home and office running.",
    items: [
      "Solar Panel Installation & Maintenance",
      "Solar Inverter Installation & Repair",
      "UPS & Inverter Repair & Maintenance",
      "Battery Installation & Replacement",
      "Home & Office Power Backup Solutions",
    ],
    price: 999,
    Icon: IconSwitch,
  },
  {
    id: "appliance-repair",
    name: "Home & Kitchen Appliance Repair",
    tag: "EXPERT REPAIR",
    desc: "Fast, reliable repair services for all major home and kitchen appliances right at your doorstep.",
    items: [
      "Microwave Oven & Induction Cooker Repair",
      "Washing Machine Repair & Servicing",
      "Refrigerator & Deep Freezer Repair",
      "Electric Oven & Kitchen Appliance Repair",
      "Rice Cooker, Mixer & Grinder Repair",
      "Vacuum Cleaner & Small Appliance Repair",
    ],
    price: 1000,
    Icon: IconWrench,
  },
];

/* ---------------- technicians ---------------- */
export type Tech = {
  name: string;
  role: string;
  img: string;
  rating: number;
  jobs: number;
  years: number;
  tags: string[];
};


/* ---------------- process ---------------- */
export const STEPS = [
  { n: "01", title: "Book in 60 seconds", desc: "Pick a service, drop your address and time slot — on the web, the app, or one call to our hotline. No signup wall, no nonsense." },
  { n: "02", title: "Get matched instantly", desc: "WowSewa assigns the verified technician." },
  { n: "03", title: "Watch it get fixed", desc: "WowSewa ensures you are fully satisfied with the job our technicians do." },
  { n: "04", title: "Pay after the job is done.", desc: "Cash, eSewa, Khalti, FonePay or card — after the job passes your check. Every repair carries a 30-day service warranty." },
];

/* ---------------- stats ---------------- */
export const STATS = [
  { value: 12480, suffix: "+", label: "Jobs completed" },
  { value: 50, suffix: "+", label: "Verified technicians" },
  { value: 45, suffix: " min", label: "Avg. arrival time" },
  { value: 98, suffix: "%", label: "Would rebook" },
];

/* ---------------- rates ---------------- */
export const RATES = [
  { service: "Plumbing Inspection & Diagnosis", includes: "Thorough check and diagnostic report for plumbing issues", price: 1000 },
  { service: "Water Leakage Repair", includes: "Locating and repairing pipe leaks, valves, or fittings", price: 1500 },

  { service: "Basic Electrical Repair", includes: "Fixing switches, sockets, light fixtures, or minor shorts", price: 1000 },

  { service: "Normal Laptop & Desktop Servicing", includes: "Internal cleaning, thermal paste replacement, and software check", price: 1500 },
  { service: "Gaming Laptop & PC Servicing", includes: "High-performance rig cleaning, thermal service, and diagnostic test", price: 2500 },
  { service: "Normal Laptop Motherboard Repair", includes: "Component-level diagnosis and repair for standard laptops", price: 4500 },
  { service: "Gaming Laptop Motherboard Repair", includes: "Advanced diagnostic and component repair for high-end gaming laptops", price: 8500 },

  // Solar & UPS
  { service: "Site Visit & Inspection", includes: "On-site assessment for solar, UPS, and backup requirements", price: 1000 },
];

/* ---------------- testimonials ---------------- */
export const TESTIMONIALS = [
  { quote: "Their technicians fixed my office network issue within just a few hours! The service was fast, efficient, and very affordable. The team was friendly, professional, and clearly knew what they where doing. Truly a trusted handyman service you can count on.", name: "Sutput Official", place: "Gongabu, Kathmandu", service: "Networking", big: true },
  { quote: "My gaming pc was like a turtle extremely slow i gave it  wow sewa . they did a super clean gaming laptop servicing  clean my software trash and then now my laptop super fast and smooth . than you so much wow sewa. and they also pick and dorp my loptop its really a wow service and they also speak so politely .its amazing to find service provider like them. thank you again", name: "Harish Dhital", place: ",Kathmandu", service: "IT and Repair", big: false },
  { quote: "Wowsewa ensures the safety and functionality of electrical systems, handling everything from routine maintenance to complex installations with precaution and care. ", name: "Vek Rum Tamang", place: "Jhamsikhel, Lalitpur", service: "Electrical Service", big: false },
  { quote: "We’ve been using WOW Sewa services for quite some time now for various needs like plumbing, electrical work, TV and washing machine repairs, and more — and the experience has been consistently excellent.", name: "Niranjana Jha ", place: "New Baneshwor, Kathmandu", service: "Plumbing", big: false },
  { quote: "Had a good experience with Wow Sewa. This was my first time with the company.Repaired my brothers printer with them and the work was satisfactory and prices seems to be reasonable as well. I definitely recommend Wow Sewa .",name: "Niranjana Jha ", service: "IT Repair", big: false },
  { quote: "I was so stressed out about my laptop as it had some issues with motherboard but fortunately found out about WowSewa and their services through Twitter. Saved me my commute time as they provided pick and drop service as well. As it was urgently needed, they provided prompt service and got it repaired in the same day, took couple of hours. Technician Jiwan Sir was professional, transparent and communicated well about the repair process and provided me full assurance regarding the repair. Krishna Sir was also prompt with the delivery and very professional. Overall, Wow Sewa is a good place to have your laptop promptly serviced and I will surely be using their service again if needed! Thank you, WowSewa!", name: "Law Rijal", service: "IT and Repair", big: false },
];

/* ---------------- FAQ ---------------- */
export const FAQS = [
  { q: "How fast can a technician actually reach me?", a: "Inside the Kathmandu valley ring-road our average arrival is 45 minutes. Emergency electrical and plumbing calls are prioritised 24/7." },
  { q: "Are your technicians verified?", a: "Every technician passes a 3-step check: citizenship and background verification, a trade skill test, and a 2-week supervised apprenticeship." },
  { q: "How does pricing work? Any hidden charges?", a: "You see a starting price before booking and we will provide a firm quote before work begins. If the final job differs from the quote, you approve the change first — always." },
  { q: "What if the problem comes back after repair?", a: "Every job carries a 30-day service warranty. Report the issue from the app and the same technician returns free of cost — usually within 24 hours. Parts carry their own manufacturer warranty on top." },
  { q: "Which payment methods do you accept?", a: "Cash on completion, eSewa, Khalti, FonePay QR, connectIPS and all major cards. For corporate and building contracts we also do monthly invoicing with 13% VAT bills." },
  { q: "Do you handle offices, shops and new-build projects?", a: "Yes. Our projects team handles AMC contracts for offices, hotels and housing colonies — annual electrical audits, plumbing AMCs, IT fleet care and scheduled deep cleaning with a single monthly invoice." },
];

/* ---------------- AMC plans ---------------- */
export const AMC_PLANS = [
  {
    no: "01", name: "Starter Plan", price: "8,000", icon: IconStore,
    tagline: "Reliable Care. Every Month.", featured: false,
    suitableFor: [
      { icon: IconStore, label: "Shops" },
      { icon: IconCafe, label: "Cafes" },
      { icon: IconClinic, label: "Clinics" },
    ],
    includes: ["1 scheduled visit", "Phone support", "Priority service", "AMC discount 10%"],
  },
  {
    no: "02", name: "Business Plan", price: "15,000", icon: IconBriefcase,
    tagline: "Peace of Mind. Every Day.", featured: true,
    suitableFor: [
      { icon: IconSchool, label: "Schools" },
      { icon: IconRestaurant, label: "Restaurants" },
      { icon: IconBriefcase, label: "Medium offices" },
    ],
    includes: ["2 visits/month", "Emergency support", "AMC discount 12%", "Preventive maintenance"],
  },
  {
    no: "03", name: "Corporate Plan", price: "25,000", icon: IconCity,
    tagline: "Expert Care. Maximum Uptime.", featured: false,
    suitableFor: [
      { icon: IconHotel, label: "Hotels" },
      { icon: IconBriefcase, label: "Corporate offices" },
      { icon: IconCity, label: "Large facilities" },
    ],
    includes: ["Weekly visits", "Emergency response", "AMC discount 15%", "Dedicated technician support", "Monthly reports"],
  },
];

/* ---------------- AMC specialized verticals ---------------- */
export const AMC_SERVICES = [
  {
    id: "networking", title: "Networking AMC", icon: IconNetwork, no: "01",
    tagline: "Strong Network. Seamless Connection.", badge: "Expert care for stable networks",
    services: [
      { icon: IconRouter, name: "Router Maintenance", desc: "Regular checkup, updates, and performance optimization for smooth internet access." },
      { icon: IconSwitch, name: "Switch Maintenance", desc: "Port check, updates, and configuration to ensure stable network performance." },
      { icon: IconRack, name: "Rack Organization", desc: "Neat and professional rack setup for better airflow and easy access." },
      { icon: IconCable, name: "Cable Management", desc: "Proper cable labeling, bundling, and routing for a clean and reliable network." },
      { icon: IconWaves, name: "WiFi Troubleshooting", desc: "Resolve WiFi issues, optimize signal strength, and ensure uninterrupted wireless connectivity." },
    ],
    benefits: ["Stable Internet", "Less Downtime", "Improved Performance", "Enhanced Security", "Cost Savings", "Expert Support"],
  },
  {
    id: "ac", title: "AC AMC", icon: IconSnow, no: "02",
    tagline: "Cooler Spaces. Happier Places.", badge: "Expert care for your comfort",
    services: [
      { icon: IconSpray, name: "AC Cleaning", desc: "Deep cleaning of indoor & outdoor unit for better cooling." },
      { icon: IconGauge, name: "Gas Pressure Inspection", desc: "Check and adjust gas pressure for optimal performance." },
      { icon: IconFilter, name: "Filter Cleaning", desc: "Clean filters to ensure clean air and efficient cooling." },
      { icon: IconDrop, name: "Drain Cleaning", desc: "Clear drain line to prevent water leakage and blockage." },
      { icon: IconBolt, name: "Electrical Inspection", desc: "Inspect wiring, connections, and electrical components for safe operation." },
    ],
    benefits: ["Lower Electricity Bill", "Better Cooling", "Longer AC Lifespan", "Cleaner Air", "Fewer Breakdowns"],
  },
  {
    id: "solar", title: "Solar & Inverter AMC", icon: IconSun, no: "03",
    tagline: "Clean Energy. Reliable Power.", badge: "Expert care for your energy",
    services: [
      { icon: IconSun, name: "Panel Cleaning", desc: "Remove dust, dirt, and debris to ensure maximum sunlight absorption and efficiency." },
      { icon: IconBattery, name: "Battery Inspection", desc: "Check battery health, charge level, terminals, and connections for reliable backup." },
      { icon: IconChip, name: "Inverter Maintenance", desc: "Inspect and service inverter components for smooth and safe operation." },
      { icon: IconGauge, name: "Performance Testing", desc: "Test system performance, voltage, current, and output for maximum efficiency." },
    ],
    benefits: ["Higher Output", "Longer Battery Life", "System Reliability", "Lower Maintenance Cost", "Eco-Friendly & Efficient"],
  },
  {
    id: "refrigerator", title: "Refrigerator AMC", icon: IconFridge, no: "04",
    tagline: "Cool Inside. Fresh Always.", badge: "Expert care for your appliances",
    services: [
      { icon: IconSnow, name: "Cooling Inspection", desc: "Check cooling performance to ensure optimum temperature and freshness." },
      { icon: IconGear, name: "Compressor Testing", desc: "Test compressor for proper functioning and long life." },
      { icon: IconGauge, name: "Gas Pressure Check", desc: "Check and adjust gas pressure for efficient cooling." },
      { icon: IconFilter, name: "Condenser Cleaning", desc: "Clean the condenser coils to remove dust and improve heat exchange." },
      { icon: IconBolt, name: "Electrical Inspection", desc: "Inspect wiring, connections, and components for safe and reliable operation." },
    ],
    benefits: ["Reduced Spoilage", "Improved Efficiency", "Longer Appliance Life", "Cost Savings", "Timely Service"],
  },
];

export const AMC_TRUST = [
  { icon: IconHardHat, t: "Expert Technicians", d: "Skilled. Reliable. Dedicated." },
  { icon: IconClock, t: "Timely Service", d: "On-time visits, every single time." },
  { icon: IconVerified, t: "100% Reliability", d: "Preventive care, zero surprises." },
  { icon: IconHeadset, t: "Phone Support", d: "One call away — 9762424318." },
];

export const AMC_MARQUEE = ["Plumbing", "Electrical", "IT & Devices", "Appliance Installation", "AC Service", "Solar & Inverter", "Refrigerator Repair", "Networking", "Monthly AMC Plans"];

/* ---------------- training & academy ---------------- */
export const TRAINING_COURSES = [
  {
    id: "electrician",
    name: "Electrician Training (Upto Level 2)",
    icon: IconBolt,
    sub: "Wiring, boards and safe power.",
    price: "15,000",
    level: "Beginner → Level 2",
    desc: "Residential and commercial wiring with a heavy focus on electrical safety codes, switchboards, and fault diagnostics.",
    modules: [
      "Electrical Safety & Tools",
      "House & Commercial Wiring",
      "Switches, Sockets, Lights & Fans",
      "MCB, MCCB, RCCB & Distribution Boards",
      "Single-Phase & Three-Phase Systems",
      "Earthing & Electrical Protection",
      "Motor Control & Star-Delta Connections",
      "Electrical Fault Detection & Troubleshooting",
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing Training",
    icon: IconPipe,
    sub: "Pipes, fittings and leak-free installs.",
    price: "15,000",
    level: "Beginner → Job-ready",
    desc: "Master domestic plumbing end-to-end — from reading layouts to pressure-testing finished bathrooms.",
    modules: [
      "Plumbing Tools & Materials",
      "Water Supply & Drainage Systems",
      "Pipe Cutting, Joining & Fittings",
      "Tap, Faucet, Basin & Toilet Installation",
      "Bathroom & Kitchen Plumbing",
      "Water Pump & Pressure Systems",
      "Leakage Detection & Repair",
      "Plumbing Maintenance & Troubleshooting",
    ],
  },
  {
    id: "cctv-installation",
    name: "CCTV Installation & Maintenance Training",
    icon: IconShield,
    sub: "Surveillance, NVR setup and remote views.",
    price: "15,000",
    level: "Beginner → Technician",
    desc: "Complete surveillance setup for homes and commercial locations covering analog, IP, and PoE systems.",
    modules: [
      "CCTV Camera Types & Components",
      "Analog & IP Camera Installation",
      "DVR & NVR Configuration",
      "CCTV Cabling & Connections",
      "Remote Viewing & Mobile Access",
      "Recording & Storage Management",
      "PoE Camera Systems",
      "CCTV Fault Detection & Maintenance",
    ],
  },
  {
    id: "computer-networking",
    name: "Computer Networking Training",
    icon: IconChip,
    sub: "LAN, routers, Wi-Fi and network security.",
    price: "15,000",
    level: "Beginner → Pro",
    desc: "Build network infrastructure from scratch—covering RJ45 crimping, MikroTik routers, VLANs, and Wi-Fi grids.",
    modules: [
      "Networking Fundamentals",
      "LAN Cabling & RJ45 Crimping",
      "IP Addressing & Subnetting",
      "Router & Switch Configuration",
      "Wi-Fi & Access Point Setup",
      "MikroTik Router Configuration",
      "VLAN, DHCP & Network Security",
      "Network Troubleshooting & Maintenance",
    ],
  },
  {
    id: "computer-hardware",
    name: "Computer Hardware & Software Training",
    icon: IconChip,
    sub: "Assembly, OS install and component servicing.",
    price: "15,000",
    level: "Beginner",
    desc: "Desktop assembly, laptop maintenance, OS installations, and hardware fault diagnostics.",
    modules: [
      "Computer Components & Hardware",
      "Desktop Assembly & Disassembly",
      "Laptop Hardware Maintenance",
      "Windows Installation & Configuration",
      "Drivers & Software Installation",
      "RAM, SSD & Storage Upgrades",
      "Hardware Fault Diagnosis",
      "Computer Servicing & Troubleshooting",
    ],
  },
  // --- Not available yet: uncomment when these courses launch ---
  // {
  //   id: "ac-refrigeration",
  //   name: "AC & Refrigeration Training",
  //   icon: IconSnow,
  //   sub: "Split ACs, gas charging and cooling systems.",
  //   price: "Contact for Details",
  //   level: "Intermediate",
  //   desc: "Diagnose, service, and repair air conditioners, refrigerators, and deep freezers with proper gas handling.",
  //   modules: [
  //     "AC & Refrigeration Fundamentals",
  //     "Split AC Installation & Servicing",
  //     "Refrigeration Cycle & Components",
  //     "Refrigerant Handling & Charging",
  //     "Compressor & Electrical Components",
  //     "Leakage Detection & Troubleshooting",
  //     "Refrigerator & Deep Freezer Repair",
  //     "Preventive Maintenance",
  //   ],
  // },
  // {
  //   id: "washing-machine",
  //   name: "Washing Machine & Home Appliance Training",
  //   icon: IconWasher,
  //   sub: "Front/top loads, PCBs and home appliance care.",
  //   price: "Contact for Details",
  //   level: "Intermediate",
  //   desc: "Master motor diagnostics, error codes, PCB troubleshooting, and general home appliance repairs.",
  //   modules: [
  //     "Washing Machine Components",
  //     "Front Load & Top Load Systems",
  //     "Motor, Pump & Sensor Diagnosis",
  //     "Washing Machine Error Codes",
  //     "PCB & Electrical Troubleshooting",
  //     "Microwave & Induction Cooker Basics",
  //     "Geyser & Home Appliance Maintenance",
  //     "Practical Fault Detection & Repair",
  //   ],
  // },
  {
    id: "printer-scanner",
    name: "Printer & Scanner Repair Training",
    icon: IconBolt,
    sub: "Cartridges, printheads, and network printing.",
    price: "15,000",
    level: "Beginner → Tech",
    desc: "Inkjet, laser, and multifunction printer servicing, cartridge refilling, and component-level repairs.",
    modules: [
      "Printer Types & Working Principles",
      "Inkjet, Laser & Multifunction Printers",
      "Printer Assembly & Disassembly",
      "Ink & Toner Cartridge Refilling",
      "Printhead Cleaning & Maintenance",
      "Paper Jam & Roller Repair",
      "Printer Hardware & Component Diagnosis",
      "Scanner Repair & Troubleshooting",
      "Printer Installation & Network Configuration",
      "Common Printer Errors & Troubleshooting",
      "Printer Servicing & Preventive Maintenance",
    ],
  },
];
export const TRAINING_STEPS = [
  { n: "01", h: "Enroll & assess", v: "pine-deep", body: "Pick a trade track, complete a short aptitude check, and we place you at the right level." },
  { n: "02", h: "Learn hands-on", v: "ink", body: "Classroom theory paired with real tools and live job sites — not just slides and videos." },
  { n: "03", h: "Get certified", v: "lime", body: "Pass the practical assessment and earn a verified WowSewa Academy badge for that trade." },
  { n: "04", h: "Join the network", v: "pine", body: "Top graduates are fast-tracked into the WowSewa pro network with their first jobs lined up." },
];

export const TRAINING_STEP_STYLES: Record<string, string> = {
  "pine-deep": "bg-pine-deep border-cream/15 text-cream hover:border-lime/50",
  ink: "bg-ink border-cream/10 text-cream hover:border-lime/50",
  lime: "bg-lime border-ink text-ink hover:-translate-y-1.5",
  pine: "bg-pine border-lime/30 text-cream hover:border-lime",
};



/* ---------------- about ---------------- */
export const ABOUT_TRADES = ["Plumbing", "Electrical", "Appliances", "IT & Devices", "Deep Cleaning", "24×7 Emergency"];

export const ABOUT_VALUES = [
  { icon: IconSearch, t: "Honest pricing", d: "Flat rates shown up front — no surprise bills, no invented quotes." },
  { icon: IconShield, t: "Vetted & insured", d: "ID-verified, background-checked and trained before the first job." },
  { icon: IconCalendar, t: "On time, on warranty", d: "Live ETA tracking and a 90-day guarantee on every repair." },
  { icon: IconSparkle, t: "One app, six trades", d: "From a dripping tap to a Wi-Fi setup — handled in one place." },
];

export const ABOUT_JOURNEY = [
  { year: "2023", t: "WowSewa is born", d: "Launched in Kathmandu with 20 local plumbers and electricians and a single promise: show up on time, price it fairly." },
  { year: "2024", t: "Four trades, one app", d: "Launched our official mobile platform, added appliances and IT & devices to the lineup, and introduced our signature 90-day repair warranty." },
  { year: "2025", t: "Full Valley expansion", d: "Expanded operations seamlessly across Kathmandu, backing up residents with our 24×7 emergency desk." },
  { year: "2026", t: "38,000 homes & counting", d: "Over 50+ vetted local pros, a 4.9-star average, and the launch of annual maintenance packages trusted by families across the capital." },
];

/* ---------------- legal ---------------- */
export const LEGAL_PRIVACY = [
  "We collect only what a booking needs — your name, phone, address and job details. Nothing is sold, rented or traded.",
  "Demo accounts and sessions on this site live entirely in your browser's local storage and never leave your device.",
  "Technicians see your address only for the jobs assigned to them, and only until the job is closed.",
  "Call recordings (if any) exist for quality checks and are deleted after 90 days.",
  "You can request a full export or deletion of your data by emailing wowsewaa@gmail.com — we comply within 7 days.",
];

export const LEGAL_TERMS = [
  "Quotes are fixed before work starts. If the scope changes mid-job, the technician pauses and re-quotes — you approve, we proceed.",
  "All labour carries a 30-day warranty. Spare parts carry manufacturer warranty, passed through to you in full.",
  "No-fix, no-fee applies to repairs: if we can't fix it, the visit and diagnosis are free.",
  "Emergency slots (24×7 line) carry a transparent night surcharge, stated on the call before dispatch.",
  "Payments are collected after completion, via cash, eSewa, Khalti, FonePay or bank transfer. Never advance, never off-app.",
];

/* ---------------- misc ---------------- */
export const AREAS = ["Kathmandu", "Lalitpur", "Bhaktapur"];

export const SLOTS = ["Morning · 8–11 AM", "Midday · 11 AM–2 PM", "Afternoon · 2–5 PM", "Evening · 5–8 PM", "Emergency · ASAP"];

export const TICKER_ITEMS = [
  "PLUMBING",
  "ELECTRICAL",
  "IT & DEVICE REPAIR",
  "APPLIANCE INSTALLATION",
  "AC & HEATING",
  "CCTV AND NETWORKING",
  "SOLAR & UPS",
  "HOME & KITCHEN APPLIANCE REPAIR",
];

export const PHONE_DISPLAY = "9762424318";
export const PHONE_TEL = "+977 9762424318";
export const PHONE_2_DISPLAY = "9824232439";
export const PHONE_2_TEL = "+977 9824232439";
export const EMAIL = "wowsewaa@gmail.com";
export const ADDRESS = "Machhapokhari, Kathmandu, Nepal";

export const SOCIALS = [
  { name: "Facebook", url: "https://www.facebook.com/wowsewaa" },
  { name: "Instagram", url: "https://www.instagram.com/wowsewaa/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/wowsewaa/" },
  { name: "X", url: "https://x.com/WowSewa" },
];