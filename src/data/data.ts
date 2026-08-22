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



/* ---------------- process ---------------- */
export const STEPS = [
  {
    n: "01",
    title: "Book in 60 seconds",
    desc: "Pick a service, drop your address and time slot — on the web, the app, or one call to our hotline. No signup wall, no nonsense.",
  },
  {
    n: "02",
    title: "Get matched instantly",
    desc: "Our dispatcher assigns the nearest verified technician. You see their photo, rating and live location before they knock.",
  },
  {
    n: "03",
    title: "Watch it get fixed",
    desc: "Upfront pricing shown before work starts. The technician shares before/after photos of every job — you approve each step.",
  },
  {
    n: "04",
    title: "Pay only when satisfied",
    desc: "Cash, eSewa, Khalti, FonePay or card — after the job passes your check. Every repair carries a 30-day service warranty.",
  },
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
  {
    quote:
      "Geyser burst at 7 AM before Dashain guests arrived. Ramesh ji was at my door in 40 minutes, fixed the valve and descaled the whole unit. The before/after photos in the app? Chef's kiss.",
    name: "Sandhya R.",
    place: "Lazimpat, Kathmandu",
    service: "Plumbing",
    big: true,
  },
  {
    quote:
      "Booked a washing machine install at 11, Sunita did the trial wash by 1 PM. Levelled perfectly, no extra 'bhauda' charges.",
    name: "Nabin P.",
    place: "Jhamsikhel, Lalitpur",
    service: "Appliance",
    big: false,
  },
  {
    quote:
      "Anisha replaced my laptop screen at my office desk in New Baneshwor. Same-day, genuine panel, 6-month warranty slip.",
    name: "Pratiksha M.",
    place: "New Baneshwor, Kathmandu",
    service: "IT Repair",
    big: false,
  },
  {
    quote:
      "Full house repaint done in 4 days — crisp lines, zero paint on my parquet, and they even re-hung the frames. The 30-day warranty is real; they came back for one touch-up without arguing.",
    name: "Kishor & Ritu S.",
    place: "Budhanilkantha, Kathmandu",
    service: "Painting",
    big: false,
  },
];

/* ---------------- FAQ ---------------- */
export const FAQS = [
  {
    q: "How fast can a technician actually reach me?",
    a: "Inside the Kathmandu valley ring-road our average arrival is 45 minutes. Emergency electrical and plumbing calls are prioritised 24/7. For Pokhara, Chitwan and Butwal we offer same-day or next-morning slots depending on zone.",
  },
  {
    q: "Are your technicians verified?",
    a: "Every technician passes a 3-step check: citizenship and background verification, a trade skill test at our Naxal training centre, and a 2-week supervised apprenticeship. Electricians hold NEA-recognised licenses.",
  },
  {
    q: "How does pricing work? Any hidden charges?",
    a: "You see a starting price before booking and a firm quote on the app before work begins. Spare parts are billed at MRP with the bill photo attached. If the final job differs from the quote, you approve the change first — always.",
  },
  {
    q: "What if the problem comes back after repair?",
    a: "Every job carries a 30-day service warranty. Report the issue from the app and the same technician returns free of cost — usually within 24 hours. Parts carry their own manufacturer warranty on top.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cash on completion, eSewa, Khalti, FonePay QR, connectIPS and all major cards. For corporate and building contracts we also do monthly invoicing with 13% VAT bills.",
  },
  {
    q: "Do you handle offices, shops and new-build projects?",
    a: "Yes. Our projects team handles AMC contracts for offices, hotels and housing colonies — annual electrical audits, plumbing AMCs, IT fleet care and scheduled deep cleaning with a single monthly invoice.",
  },
];

export const AREAS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kirtipur",
  "Pokhara",
  "Chitwan",
  "Butwal",
  "Dharan",
];

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

export const PHONE_DISPLAY = "9762424318";
export const PHONE_TEL = "9762424318,9824232439";
export const EMAIL = "wowsewaa@gmail.com";
export const ADDRESS = "Machhapokhari, Kathmandu, Nepal";


export const SOCIALS = [
  { name: "Facebook", url: "https://www.facebook.com/wowsewaa" },
  { name: "Instagram", url: "https://www.instagram.com/wowsewaa/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/wowsewaa/" },
  { name: "X", url: "https://x.com/WowSewa" },
];