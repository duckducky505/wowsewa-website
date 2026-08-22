import React from "react";

type P = { className?: string };

const S = (props: React.SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/* ============ BRAND ============ */
export function LogoMark({ className = "h-10 w-10" }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="#074C3A" />
      <rect x="1.25" y="1.25" width="45.5" height="45.5" rx="9" fill="none" stroke="#D1FE17" strokeOpacity="0.45" strokeWidth="1.5" />
      <path d="M28.5 5 12.5 26h9l-3.5 17L34 22h-9l3.5-17z" fill="#D1FE17" />
      <circle cx="9.5" cy="9.5" r="1.8" fill="#D1FE17" />
      <circle cx="38.5" cy="38.5" r="1.8" fill="#D1FE17" />
    </svg>
  );
}

export function Wordmark({ dark = false, className = "" }: P & { dark?: boolean }) {
  return (
    <span className={`font-display font-extrabold tracking-tight leading-none ${className}`}>
      Wow<span className={dark ? "text-pine" : "text-lime"}>Sewa</span>
    </span>
  );
}

/* ============ SERVICE ICONS ============ */
export const IconWrench = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <path d="M14.5 6.2a4.3 4.3 0 0 0-5.7 5.5L3.2 17.3a2.1 2.1 0 0 0 0 3l.5.5a2.1 2.1 0 0 0 3 0l5.6-5.6a4.3 4.3 0 0 0 5.5-5.7L15 12.3l-2.8-2.8 2.3-3.3z" />
    <path d="M15.5 15.5 20 20" />
    <circle cx="18.6" cy="5.4" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconBolt = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <path d="M13.2 2.5 4.8 13.4h5.4L9 21.5l8.4-10.9h-5.4l1.2-8.1z" />
    <path d="M18.5 4.5v2M19.5 5.5h-2" strokeWidth="1.4" />
  </svg>
);

export const IconWasher = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <rect x="4" y="2.8" width="16" height="18.4" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <path d="M8.2 12.2c1.3 1.1 2.5-1 3.8 0s2.5 1 3.8 0" strokeWidth="1.4" />
    <path d="M7 6h4M15.5 6h1.5" strokeWidth="1.6" />
  </svg>
);

export const IconChip = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
    <rect x="10" y="10" width="4" height="4" strokeWidth="1.4" />
    <path d="M9 6.5V3.5M12 6.5V3.5M15 6.5V3.5M9 20.5v-3M12 20.5v-3M15 20.5v-3M6.5 9h-3M6.5 12h-3M6.5 15h-3M20.5 9h-3M20.5 12h-3M20.5 15h-3" strokeWidth="1.4" />
  </svg>
);

export const IconSnow = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <path d="M12 2.5v19M12 5l-2.2-1.6M12 5l2.2-1.6M12 19l-2.2 1.6M12 19l2.2 1.6" strokeWidth="1.5" />
    <path d="M3.8 7.25l16.4 9.5M5 6l.4 2.7M5 6 2.4 6.9M19 18l-2.6-.9M19 18l-.4-2.7" strokeWidth="1.5" />
    <path d="M3.8 16.75 20.2 7.25M5 18l-.4-2.7M5 18l-2.6-.9M19 6l-2.6.9M19 6l-.4 2.7" strokeWidth="1.5" />
  </svg>
);

export const IconRoller = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <rect x="3" y="4" width="15" height="6.5" rx="1.5" />
    <path d="M18 6h2.5a1 1 0 0 1 1 1v3.5a2 2 0 0 1-2 2h-6.5v2.5" />
    <rect x="11.4" y="15" width="3.2" height="6" rx="1" />
    <path d="M6 7.2h6" strokeWidth="1.3" />
  </svg>
);

export const IconHammer = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <path d="m13.6 7.6 6.7 6.7a1.8 1.8 0 0 1 0 2.6l-1 1a1.8 1.8 0 0 1-2.6 0l-6.7-6.7" />
    <path d="M12.2 3.4 8 4.6a3.4 3.4 0 0 0-2.4 2.4L4.4 11.2l3 3 4.2-1.2a3.4 3.4 0 0 0 2.4-2.4l1.2-4.2-3-3z" />
    <path d="m8.9 11.6-5 5a1.7 1.7 0 0 0 2.4 2.4l5-5" />
  </svg>
);

export const IconSpray = ({ className = "h-6 w-6" }: P) => (
  <svg {...S({ className })}>
    <path d="M9 8.5h6l1.5 11a1.5 1.5 0 0 1-1.5 1.7H9a1.5 1.5 0 0 1-1.5-1.7L9 8.5z" />
    <path d="M10 8.5V6h4v2.5M11 6V4h2M13.5 2.5h3M14 4.7l2.6 1M14 1.4l2.6-1" strokeWidth="1.4" />
    <path d="M10.2 13.5c.6.5 1.2-.4 1.8 0s1.2.5 1.8 0" strokeWidth="1.3" />
  </svg>
);

/* ============ UI ICONS ============ */
export const IconStar = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 16.9 6.3 20l1.2-6.3L2.8 9.3l6.4-.8L12 2.6z" />
  </svg>
);

export const IconArrow = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />
  </svg>
);

export const IconCheck = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M4.5 12.8 9.6 18 19.5 6.5" />
  </svg>
);

export const IconPlus = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconPhone = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M8.4 3.8 6.2 3.2A1.8 1.8 0 0 0 4 4.7 17.6 17.6 0 0 0 19.3 20a1.8 1.8 0 0 0 1.5-2.2l-.6-2.2a1.8 1.8 0 0 0-1.3-1.3l-2.6-.7a1.8 1.8 0 0 0-1.9.6l-1 1.2a13.2 13.2 0 0 1-5.4-5.4l1.2-1a1.8 1.8 0 0 0 .6-1.9l-.7-2.5z" />
  </svg>
);

export const IconClock = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconShield = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M12 2.8 5 5.4v5.3c0 4.6 3 8.4 7 10.5 4-2.1 7-5.9 7-10.5V5.4L12 2.8z" />
    <path d="m8.8 11.8 2.3 2.3 4.1-4.6" />
  </svg>
);

export const IconPin = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M12 21.5s-6.8-6-6.8-11A6.8 6.8 0 0 1 12 3.7a6.8 6.8 0 0 1 6.8 6.8c0 5-6.8 11-6.8 11z" />
    <circle cx="12" cy="10.4" r="2.4" />
  </svg>
);

export const IconSpark = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 1.8 14.5 9.5 22.2 12l-7.7 2.5L12 22.2 9.5 14.5 1.8 12l7.7-2.5L12 1.8z" />
  </svg>
);

export const IconCalendar = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 10h17M8 2.8V6.5M16 2.8V6.5" />
  </svg>
);

export const IconChat = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M8 10.2h8M8 13.4h5" strokeWidth="1.5" />
  </svg>
);

export const IconUser = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </svg>
);

/* ============ SOCIAL ============ */
export const IconFacebook = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M15.5 8H13V6.2c0-.8.3-1.2 1.2-1.2h1.3V2.6h-2c-2.3 0-3.5 1.4-3.5 3.6V8H8v2.6h2v9.8h3v-9.8h2.3l.2-2.6z" />
  </svg>
);

export const IconInstagram = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconYoutube = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <rect x="2.8" y="5.5" width="18.4" height="13" rx="3.5" />
    <path d="m10.2 9.3 4.6 2.7-4.6 2.7z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTiktok = ({ className = "h-5 w-5" }: P) => (
  <svg {...S({ className })}>
    <path d="M14.5 3.5c.4 2.4 2 4 4.5 4.3v3a7.6 7.6 0 0 1-4.5-1.4v5.8a5.8 5.8 0 1 1-5.8-5.8c.3 0 .7 0 1 .1v3.1a2.8 2.8 0 1 0 1.8 2.7V3.5h3z" />
  </svg>
);

/* ============ MISC ============ */
export function StarRow({ n = 5, className = "h-3.5 w-3.5" }: { n?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-lime">
      {Array.from({ length: n }).map((_, i) => (
        <IconStar key={i} className={className} />
      ))}
    </span>
  );
}
