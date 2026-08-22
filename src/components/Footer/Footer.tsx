import { Reveal, emitPrefill } from "../../lib/lib";
import { LogoMark, IconPhone, IconChat, IconPin } from "../../assets/icons/Icons";
import {
  PHONE_TEL, PHONE_DISPLAY,
  EMAIL, ADDRESS, SOCIALS,
} from "../../data/data";

function BigRow() {
  return (
    <span className="flex items-center">
      <span
        className="whitespace-nowrap font-display text-[clamp(3.5rem,9vw,7.5rem)] font-extrabold leading-none tracking-tight"
        style={{ color: "transparent", WebkitTextStroke: "2px rgba(248,250,234,0.22)" }}
      >
        WOWSEWA
      </span>
      <svg viewBox="0 0 24 24" className="mx-10 h-10 w-10 shrink-0 text-lime" fill="currentColor" aria-hidden="true">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    </span>
  );
}

/* social icons — inline SVG */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H16.4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H10z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5-6.5L5.5 22H2.4l8.1-9.3L1.7 2h6.9l4.5 6 5.8-6zm-2.4 18h1.9L7.6 4H5.6z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.76-1.6 1.5V12h2.7l-.43 2.9h-2.27v7A10 10 0 0 0 22 12z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, () => React.ReactElement> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
};

const SERVICE_LINKS = [
  { label: "Plumbing", svc: "plumbing" },
  { label: "Electrical", svc: "electrical" },
  { label: "Appliances", svc: "appliance" },
  { label: "IT & Devices", svc: "it" },
  { label: "Deep Cleaning", svc: "cleaning" },
];

const parseHome = () =>
  !/^#\/(login|signup|forgot|amc|training|about|legal)/.test(window.location.hash);

export default function Footer() {
  const year = new Date().getFullYear();

  const bookSvc = (svc: string) => () => {
    const onHome = parseHome();
    const dispatch = () => {
      emitPrefill({ service: svc });
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
    };
    if (onHome) {
      dispatch();
    } else {
      window.location.hash = "#/";
      setTimeout(dispatch, 350);
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden border-t-2 border-lime/25 bg-ink text-cream">

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* brand */}
          <Reveal>
            <div>
              <a href="#top" className="inline-flex items-center gap-3">
                <LogoMark className="h-11 w-11" />
                <span className="font-display text-2xl font-extrabold leading-none text-cream">
                  Wow<span className="text-lime">Sewa</span>
                </span>
              </a>
              <p className="mt-5 max-w-[38ch] text-[14.5px] leading-relaxed text-cream/60">
                WowSewa is your one number for every home fix — plumbing, electrical, appliances and IT.
                Vetted, insured technicians at fixed, up-front prices, booked in under a minute.
              </p>
              <div className="mt-6 flex gap-3">
                {SOCIALS.map((s) => {
                  const Ico = SOCIAL_ICONS[s.name] ?? FacebookIcon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.name}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream transition-all duration-200 hover:-translate-y-0.5 hover:border-lime hover:bg-lime hover:text-ink"
                    >
                      <Ico />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* services */}
          <Reveal delay={90}>
            <div>
              <h4 className="mb-4 font-mono text-[14px] font-bold tracking-[0.3em] text-lime">SERVICES</h4>
              <ul className="space-y-2.5">
                {SERVICE_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={bookSvc(l.svc)}
                      className="text-[14px] font-medium text-cream/65 transition-colors hover:text-lime"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                <li>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="text-[14px] font-medium text-cream/65 transition-colors hover:text-lime"
                  >
                    24×7 Emergency
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* company */}
          <Reveal delay={160}>
            <div>
              <h4 className="mb-4 font-mono text-[14px] font-bold tracking-[0.3em] text-lime">COMPANY</h4>
              <ul className="space-y-2.5 text-[15px] font-medium">
                <li><a href="/about-us" className="text-cream/65 transition-colors hover:text-lime">About Us</a></li>
                <li><a href="/training-wowsewa" className="text-cream/65 transition-colors hover:text-lime">Training</a></li>
                <li><a href="/amc" className="text-cream/65 transition-colors hover:text-lime">AMC Plans</a></li>
                <li><a href="/privacy-policy" className="text-cream/65 transition-colors hover:text-lime">Privacy Policy</a></li>
                <li><a href="/terms-and-conditions" className="text-cream/65 transition-colors hover:text-lime">Terms &amp; Conditions</a></li>
              </ul>
            </div>
          </Reveal>

          {/* contact */}
          <Reveal delay={230}>
            <div>
              <h4 className="mb-4 font-mono text-[14px] font-bold tracking-[0.3em] text-lime">CONTACT</h4>
              <ul className="space-y-3.5 text-[15px] font-medium">
                <li className="flex items-start gap-3">
                  <IconChat className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  <a href={`mailto:${EMAIL}`} className="text-cream/70 transition-colors hover:text-lime">
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  <span className="flex flex-wrap gap-x-2 text-cream/70">
                    <a href={`tel:${PHONE_DISPLAY}`} className="transition-colors hover:text-lime">{PHONE_TEL}</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  <span className="text-cream/70">{ADDRESS}</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="font-mono text-[13px] tracking-wide text-cream/40">
            © {year} WowSewa Pvt. Ltd. All rights reserved.
          </p>
          <p className="font-mono text-[13px] tracking-wide text-cream/40">
             ONE CALL FIXES HOME
          </p>
        </div>
      </div>
    </footer>
  );
}