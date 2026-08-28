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

/* ---------------- images (employees & work) ---------------- */
export const IMG = {
  team: "https://image.qwenlm.ai/generated-images/ccedcf31-a2a7-4d44-b1bb-e46cfb56cb3f/_result.png",
  plumber: "https://image.qwenlm.ai/generated-images/f97ec1a6-0218-48e9-86d5-0165166f9107/_result.png",
  electrician: "https://image.qwenlm.ai/generated-images/3c06cf75-06d8-4069-9d8e-f2ffbe9bfe93/_result.png",
  appliance: "https://image.qwenlm.ai/generated-images/405249b2-e457-4f5f-b4be-1df5a0478df2/_result.png",
  it: "https://image.qwenlm.ai/generated-images/aa2fc5d6-e109-4d22-bde1-58fd9001f2e1/_result.png",
  ac: "https://image.qwenlm.ai/generated-images/66b89f36-38f5-47e7-a924-72ffcdd762ff/_result.png",
  painter: "https://image.qwenlm.ai/generated-images/ebfb78fb-d903-41cc-b86d-490c2f357d09/_result.png",
  working: "https://image.qwenlm.ai/generated-images/20487d2b-d553-4f64-a194-0ee1493cb159/_result.png",
  founder: "https://image.qwenlm.ai/generated-images/7a28877f-5de2-4cf8-9fd9-a7f50388905d/_result.png",
  training: "https://image.qwenlm.ai/generated-images/53ecee50-3beb-4ad1-8565-66c14b1144ef/_result.png",
};

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
    items: ["Tap, mixer & shower repair", "Geyser installation & descaling", "Toilet & drainage unblocking", "Pipe leakage detection"],
    price: 399,
    Icon: IconWrench,
  },
  {
    id: "electrical",
    name: "Electrical",
    tag: "LICENSED & INSURED",
    desc: "Certified electricians for wiring, switchboards and everything that sparks — done to code.",
    items: ["Full house wiring & rewiring", "Switchboard & MCB upgrade", "Fan, light & inverter setup", "Short-circuit emergency call"],
    price: 449,
    Icon: IconBolt,
  },
  {
    id: "appliance",
    name: "Appliance Installation",
    tag: "SAME-DAY FIT",
    desc: "Washing machine to wall-mounted TV — levelled, tested and warrantied on the spot.",
    items: ["Washing machine & dryer install", "Fridge, microwave & oven setup", "TV wall mounting & bracket", "Water purifier & RO service"],
    price: 499,
    Icon: IconWasher,
  },
  {
    id: "it",
    name: "IT & Device Repair",
    tag: "NO-FIX, NO-FEE",
    desc: "Laptops, phones, printers, Wi-Fi dead zones — our bench techs and field IT crew handle it all.",
    items: ["Laptop & PC repair / upgrades", "Phone screen & battery swap", "Printer & CCTV servicing", "Router, mesh & NAS setup"],
    price: 549,
    Icon: IconChip,
    accent: true,
  },
  {
    id: "ac",
    name: "AC & Heating",
    tag: "GAS-CHECK INCLUDED",
    desc: "Split or window AC, room heaters, air purifiers — serviced with pressure gauges, not guesswork.",
    items: ["AC service & gas top-up", "AC installation / relocation", "Heater & radiator repair", "Air purifier filter care"],
    price: 699,
    Icon: IconSnow,
  },
  {
    id: "painting",
    name: "Painting & Wall Care",
    tag: "ZERO-MESS PROMISE",
    desc: "Interior, exterior and texture work with damp-proofing — floors covered, lines crisp.",
    items: ["Interior & exterior painting", "Damp proofing & seepage fix", "Wall texture & POP work", "Minor cracks & putty repair"],
    price: 2999,
    Icon: IconRoller,
  },
  {
    id: "carpentry",
    name: "Carpentry & Furniture",
    tag: "MM-PERFECT",
    desc: "Squeaky hinges to full modular builds — precise joinery from our in-house carpenters.",
    items: ["Door, lock & hinge repair", "Modular wardrobe & kitchen", "Bed, sofa & table restoration", "Curtain & blind fitting"],
    price: 449,
    Icon: IconHammer,
  },
  {
    id: "cleaning",
    name: "Deep Cleaning",
    tag: "ECO CHEMICALS",
    desc: "Homes, offices and water tanks — a trained crew with machine scrubbers and eco chemicals.",
    items: ["Full home / office deep clean", "Kitchen, chimney & exhaust", "Water tank cleaning", "Sofa, carpet & pest control"],
    price: 1199,
    Icon: IconSpray,
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

export const TECHS: Tech[] = [
  { name: "Ramesh Shrestha", role: "Master Plumber", img: IMG.plumber, rating: 4.9, jobs: 1240, years: 9, tags: ["Geyser", "Leak detection", "Bathroom fittings"] },
  { name: "Bikash Gurung", role: "Licensed Electrician", img: IMG.electrician, rating: 4.8, jobs: 1560, years: 11, tags: ["Rewiring", "Inverter", "Emergency"] },
  { name: "Sunita Tamang", role: "Appliance Specialist", img: IMG.appliance, rating: 4.9, jobs: 980, years: 6, tags: ["Washer", "RO purifier", "TV mounts"] },
  { name: "Anisha Karki", role: "IT & Device Technician", img: IMG.it, rating: 5.0, jobs: 720, years: 5, tags: ["Laptops", "Screens", "Wi-Fi mesh"] },
  { name: "Deepak Maharjan", role: "AC & Heating Expert", img: IMG.ac, rating: 4.8, jobs: 890, years: 8, tags: ["Gas refill", "Split AC", "Heaters"] },
  { name: "Prakash Thapa", role: "Painting Contractor", img: IMG.painter, rating: 4.7, jobs: 460, years: 12, tags: ["Interior", "Damp-proof", "Texture"] },
];

/* ---------------- process ---------------- */
export const STEPS = [
  { n: "01", title: "Book in 60 seconds", desc: "Pick a service, drop your address and time slot — on the web, the app, or one call to our hotline. No signup wall, no nonsense." },
  { n: "02", title: "Get matched instantly", desc: "Our dispatcher assigns the nearest verified technician. You see their photo, rating and live location before they knock." },
  { n: "03", title: "Watch it get fixed", desc: "Upfront pricing shown before work starts. The technician shares before/after photos of every job — you approve each step." },
  { n: "04", title: "Pay only when satisfied", desc: "Cash, eSewa, Khalti, FonePay or card — after the job passes your check. Every repair carries a 30-day service warranty." },
];

/* ---------------- stats ---------------- */
export const STATS = [
  { value: 12480, suffix: "+", label: "Jobs completed" },
  { value: 350, suffix: "+", label: "Verified technicians" },
  { value: 45, suffix: " min", label: "Avg. arrival time" },
  { value: 98, suffix: "%", label: "Would rebook" },
];

/* ---------------- rates ---------------- */
export const RATES = [
  { service: "Tap / mixer repair", includes: "Washer, cartridge or full tap swap incl. testing", price: 399 },
  { service: "Ceiling fan installation", includes: "Mounting, wiring, capacitor check & balancing", price: 449 },
  { service: "Washing machine install", includes: "Inlet/drain fitting, levelling & trial wash", price: 499 },
  { service: "Laptop diagnosis + service", includes: "Deep clean, thermal paste, SSD-ready report", price: 549 },
  { service: "Split AC full service", includes: "Jet-pump wash, gas pressure check, filter care", price: 699 },
  { service: "Water tank cleaning (1000 L)", includes: "Desludge, scrub, disinfectant & refill test", price: 1199 },
  { service: "Room repaint (12×12 ft)", includes: "2-coat emulsion, putty touch-up, floor masking", price: 2999 },
];

/* ---------------- testimonials ---------------- */
export const TESTIMONIALS = [
  { quote: "Geyser burst at 7 AM before Dashain guests arrived. Ramesh ji was at my door in 40 minutes, fixed the valve and descaled the whole unit. The before/after photos in the app? Chef's kiss.", name: "Sandhya R.", place: "Lazimpat, Kathmandu", service: "Plumbing", big: true },
  { quote: "Booked a washing machine install at 11, Sunita did the trial wash by 1 PM. Levelled perfectly, no extra 'bhauda' charges.", name: "Nabin P.", place: "Jhamsikhel, Lalitpur", service: "Appliance", big: false },
  { quote: "Anisha replaced my laptop screen at my office desk in New Baneshwor. Same-day, genuine panel, 6-month warranty slip.", name: "Pratiksha M.", place: "New Baneshwor, Kathmandu", service: "IT Repair", big: false },
  { quote: "Full house repaint done in 4 days — crisp lines, zero paint on my parquet, and they even re-hung the frames. The 30-day warranty is real; they came back for one touch-up without arguing.", name: "Kishor & Ritu S.", place: "Budhanilkantha, Kathmandu", service: "Painting", big: false },
];

/* ---------------- FAQ ---------------- */
export const FAQS = [
  { q: "How fast can a technician actually reach me?", a: "Inside the Kathmandu valley ring-road our average arrival is 45 minutes. Emergency electrical and plumbing calls are prioritised 24/7. For Pokhara, Chitwan and Butwal we offer same-day or next-morning slots depending on zone." },
  { q: "Are your technicians verified?", a: "Every technician passes a 3-step check: citizenship and background verification, a trade skill test at our Naxal training centre, and a 2-week supervised apprenticeship. Electricians hold NEA-recognised licenses." },
  { q: "How does pricing work? Any hidden charges?", a: "You see a starting price before booking and a firm quote on the app before work begins. Spare parts are billed at MRP with the bill photo attached. If the final job differs from the quote, you approve the change first — always." },
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
  { id: "plumbing", name: "Plumbing Pro", icon: IconPipe, sub: "Pipes, fittings and leak-free installs.", price: "14,000", weeks: "6 weeks", level: "Beginner → Job-ready", desc: "Master domestic plumbing end-to-end — from reading layouts to pressure-testing a finished bathroom.", modules: ["Tools, materials & safety", "Tap, mixer & sanitaryware fitting", "Leak detection & sealing", "Geyser & pump installation", "Drainage & unclogging", "Live on-site practicals"] },
  { id: "electrical", name: "Electrical Pro", icon: IconBolt, sub: "Wiring, boards and safe power.", price: "16,500", weeks: "8 weeks", level: "Beginner → Licensed-ready", desc: "Residential wiring and load management with an emphasis on safety codes and certification readiness.", modules: ["Electrical safety & tools", "Circuits, loads & wiring", "Switchboards & DB boxes", "MCBs, fuses & earthing", "Lighting & appliance points", "Live on-site practicals"] },
  { id: "appliance", name: "Appliance Repair", icon: IconSnow, sub: "AC, fridge & washing machine mastery.", price: "18,000", weeks: "8 weeks", level: "Intermediate", desc: "Diagnose and repair the big machines, including gas handling and brand-specific install procedures.", modules: ["Diagnostics & tools", "Refrigeration & gas handling", "AC install & service", "Washing machine repair", "Brand-specific procedures", "Live on-site practicals"] },
  { id: "it", name: "IT & Devices", icon: IconChip, sub: "Networks, devices & smart homes.", price: "13,500", weeks: "5 weeks", level: "Beginner", desc: "Set up and troubleshoot the connected home — Wi-Fi, CCTV, printers, smart devices and basic hardware.", modules: ["Networking basics", "Wi-Fi & mesh setup", "CCTV & video doorbells", "Printers & peripherals", "Smart-home devices", "Live on-site practicals"] },
  { id: "cleaning", name: "Pro Deep-Clean", icon: IconSparkle, sub: "Commercial-grade cleaning craft.", price: "9,500", weeks: "4 weeks", level: "Beginner", desc: "Operate professional equipment and chemicals safely for spotless, repeatable results at speed.", modules: ["Chemicals & safety", "Equipment handling", "Kitchen & bathroom deep-clean", "Floor & surface care", "Sofa & upholstery care", "Live on-site practicals"] },
  { id: "service", name: "Service Excellence", icon: IconShield, sub: "The WowSewa way with customers.", price: "4,500", weeks: "2 weeks", level: "All tracks", desc: "The soft-skills layer every WowSewa pro completes — communication, pricing transparency and trust.", modules: ["Customer communication", "Pricing transparency", "On-site etiquette", "Handling complaints", "The WowSewa promise", "Final assessment"] },
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
  { year: "2026", t: "38,000 homes & counting", d: "Over 480 vetted local pros, a 4.92-star average, and the launch of annual maintenance packages trusted by families across the capital." },
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
export const AREAS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Kirtipur", "Pokhara", "Chitwan", "Butwal", "Dharan"];

export const SLOTS = ["Morning · 8–11 AM", "Midday · 11 AM–2 PM", "Afternoon · 2–5 PM", "Evening · 5–8 PM", "Emergency · ASAP"];

export const TICKER_ITEMS = [
  "PLUMBING",
  "ELECTRICAL",
  "APPLIANCE INSTALL",
  "IT & DEVICES",
  "AC & HEATING",
  "PAINTING",
  "CARPENTRY",
  "DEEP CLEANING",
  "24/7 EMERGENCY",
];

export const PHONE_DISPLAY = "9762-424-318";
export const PHONE_TEL = "+9779762424318";
export const PHONE_2_DISPLAY = "9824-232-439";
export const PHONE_2_TEL = "+9779824232439";
export const EMAIL = "wowsewaa@gmail.com";
export const ADDRESS = "Machhapokhari, Kathmandu, Nepal";

export const SOCIALS = [
  { name: "Facebook", url: "https://www.facebook.com/wowsewaa" },
  { name: "Instagram", url: "https://www.instagram.com/wowsewaa/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/wowsewaa/" },
  { name: "X", url: "https://x.com/WowSewa" },
];