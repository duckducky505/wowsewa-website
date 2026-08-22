import { useEffect, useRef, useState } from "react";
import { Reveal, Scramble, emitPrefill } from "../../lib/lib";
import { IconArrow, IconStar, IconCheck, IconUser } from "../../assets/icons/Icons";
import { SERVICES, AREAS, PHONE_TEL } from "../../data/data";
// import {fieldVideo} from "../../assets/videos/field-work.mp4"; 

const SLIDE_MS = 14000;

/* ---- feed icons (match the network card exactly) ---- */
const Plumb = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3v6a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v6" /><rect x="4" y="2" width="6" height="3" rx="1" /><rect x="14" y="19" width="6" height="3" rx="1" />
  </svg>
);
const Bolt = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
);
const Snow = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" /></svg>
);
const Chip = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /><rect x="10" y="10" width="4" height="4" rx="0.5" />
  </svg>
);
const Shield = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const ICONS: Record<string, React.ReactElement> = {
  plumb: <Plumb />, bolt: <Bolt />, snow: <Snow />, chip: <Chip />, shield: <Shield />,
};

/* ---- pool of live jobs across the valley — the feed pulls from these ---- */
const JOB_POOL = [
  { name: "Geyser installation", place: "Baluwatar, Kathmandu", icon: "shield", status: "done" },
  { name: "Refrigerator repair", place: "Thamel, Kathmandu", icon: "snow", status: "progress" },
  { name: "Leak detection & fixing", place: "New Baneshwor, Kathmandu", icon: "plumb", status: "done" },
  { name: "AC install & service", place: "Maharajgunj, Kathmandu", icon: "snow", status: "progress" },
  { name: "Wi-Fi mesh setup", place: "Bouddha, Kathmandu", icon: "chip", status: "progress" },
  { name: "Switchboard repair", place: "Kalanki, Kathmandu", icon: "bolt", status: "done" },
  { name: "Washing machine fix", place: "Koteshwor, Kathmandu", icon: "snow", status: "progress" },
  { name: "CCTV camera install", place: "Lazimpat, Kathmandu", icon: "chip", status: "done" },
  { name: "Pipe & motor work", place: "Tinkune, Kathmandu", icon: "plumb", status: "progress" },
  { name: "Inverter & battery set", place: "Gongabu, Kathmandu", icon: "bolt", status: "done" },
  { name: "Printer & network setup", place: "New Road, Kathmandu", icon: "chip", status: "done" },
  { name: "Chimney & hob service", place: "Chabahil, Kathmandu", icon: "snow", status: "progress" },
];

const SEED = [
  { ...JOB_POOL[2], mins: 0, key: 0 },
  { ...JOB_POOL[0], mins: 2, key: 1 },
  { ...JOB_POOL[4], mins: 5, key: 2 },
  { ...JOB_POOL[3], mins: 9, key: 3 },
];

const ago = (m: number) => (m <= 0 ? "just now" : `${m} min ago`);
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/* ---------------- LIVE FEED PANEL ---------------- */

function LiveFeedPanel({ active }: { active: boolean }) {
  const [feed, setFeed] = useState(SEED);
  const [stats, setStats] = useState({ pros: 124, resp: 38 });
  const idRef = useRef(SEED.length);

  useEffect(() => {
    if (!active) return;
    const tick = window.setInterval(() => {
      setFeed((prev) => {
        let job = JOB_POOL[Math.floor(Math.random() * JOB_POOL.length)];
        let guard = 0;
        while (prev[0] && job.name === prev[0].name && guard++ < 5) {
          job = JOB_POOL[Math.floor(Math.random() * JOB_POOL.length)];
        }
        const aged = prev.slice(0, 3).map((r) => ({ ...r, mins: r.mins + 1 + Math.floor(Math.random() * 2) }));
        idRef.current += 1;
        return [{ ...job, mins: 0, key: idRef.current }, ...aged];
      });
      setStats((s) => ({
        pros: clamp(s.pros + (Math.floor(Math.random() * 7) - 3), 96, 168),
        resp: clamp(s.resp + (Math.floor(Math.random() * 5) - 2), 31, 46),
      }));
    }, 2800);
    return () => window.clearInterval(tick);
  }, [active]);

  return (
    <div className="flex h-full flex-col bg-cream p-5 text-pine-deep">
      {/* head */}
      <div className="flex items-center gap-3">
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-lime/25">
          <span className="hero-dot-pulse h-[11px] w-[11px] rounded-full bg-lime" />
        </span>
        <div className="min-w-0">
          <h4 className="font-display text-[1.1rem] font-bold leading-tight text-pine-deep">Live on the network</h4>
          <p className="mt-0.5 font-mono text-[0.68rem] tracking-[0.04em] text-pine-deep/60">Updating in real time</p>
        </div>
        <span className="hero-now-blink ml-auto self-start rounded-full bg-pine-deep px-2.5 py-[5px] font-display text-[0.6rem] font-bold tracking-[0.12em] text-lime">
          NOW
        </span>
      </div>

      <hr className="my-[18px] border-0 border-t border-dashed border-pine-deep/20" />

      {/* stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-[14px] bg-pine-deep/[0.06] px-3 pb-2.5 pt-3">
          <div className="font-display text-[1.45rem] font-bold leading-none text-pine-deep">
            <span key={stats.pros} className="hero-stat-flash inline-block">{stats.pros}</span>
          </div>
          <div className="mt-[7px] font-mono text-[0.56rem] uppercase tracking-[0.08em] text-pine-deep/55">Pros on the job</div>
        </div>
        <div className="rounded-[14px] bg-pine-deep/[0.06] px-3 pb-2.5 pt-3">
          <div className="font-display text-[1.45rem] font-bold leading-none text-pine-deep">
            <span key={stats.resp} className="hero-stat-flash inline-block">{stats.resp}</span>
            <span className="ml-0.5 font-body text-[0.7rem] font-medium">min</span>
          </div>
          <div className="mt-[7px] font-mono text-[0.56rem] uppercase tracking-[0.08em] text-pine-deep/55">Avg response</div>
        </div>
        <div className="rounded-[14px] bg-pine-deep/[0.06] px-3 pb-2.5 pt-3">
          <div className="font-display text-[1.45rem] font-bold leading-none text-pine-deep">
            4.92<sup className="text-[0.7rem]">★</sup>
          </div>
          <div className="mt-[7px] font-mono text-[0.56rem] uppercase tracking-[0.08em] text-pine-deep/55">Live rating</div>
        </div>
      </div>

      {/* feed */}
      <div className="mt-3.5 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        {feed.map((row, i) => (
          <div
            key={row.key}
            className={`flex items-center gap-3 rounded-[14px] bg-pine-deep/[0.05] px-3 py-[10px] ${i === 0 ? "hero-row-in" : ""}`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-pine-deep text-lime">
              {ICONS[row.icon]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-[0.9rem] font-bold leading-tight text-pine-deep">{row.name}</div>
              <div className="mt-0.5 truncate font-mono text-[0.66rem] tracking-[0.02em] text-pine-deep/55">
                {row.place} · {ago(row.mins)}
              </div>
            </div>
            <span
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-[9px] py-[5px] font-mono text-[0.62rem] tracking-[0.03em] ${
                row.status === "done" ? "bg-[rgba(7,76,58,0.10)] text-[#0c6b46]" : "bg-[rgba(214,158,46,0.16)] text-[#9a6b00]"
              }`}
            >
              <span className={`h-[6px] w-[6px] rounded-full ${row.status === "done" ? "bg-[#16a34a]" : "bg-[#e0a106]"}`} />
              {row.status === "done" ? "Completed" : "In progress"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FIELD FILM PANEL (real video) ---------------- */

function FilmPanel({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  // Pause the video when this slide isn't showing, resume when it comes back
  // into view (matches how the other panels gate their intervals on `active`).
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (active && playing) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [active, playing]);

  const togglePlay = () => setPlaying((p) => !p);
  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* film header */}
      <div className="flex items-center justify-between border-b border-cream/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${playing ? "blink-dot bg-[#ff5a4e]" : "bg-cream/30"}`} />
          <p className="font-mono text-[11px] font-bold tracking-[0.22em] text-lime">FIELD CAM · KTM VALLEY</p>
        </div>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="font-mono text-[11px] font-bold tracking-widest text-cream/70 transition-colors hover:text-lime"
        >
          {muted ? "MUTED" : "SOUND ON"}
        </button>
      </div>

      {/* screen */}
      <div className="group relative flex-1 overflow-hidden bg-ink">
        <video
          ref={videoRef}
          // src={fieldVideo}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" aria-hidden="true" />

        {/* play / pause */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
          className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime text-ink shadow-hard transition-all duration-300 hover:scale-110 ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------- SHOWCASE SHELL ---------------- */

const SLIDES = [
  { id: "live", label: "LIVE FEED" },
  { id: "film", label: "FIELD FILM" },
] as const;

function Showcase() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(reduced);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
      setCycle((c) => c + 1);
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [idx, paused, cycle]);

  const panels = [
    <LiveFeedPanel key="live" active={idx === 0} />,
    <FilmPanel key="film" active={idx === 1} />,
  ];

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-lime/40 bg-pine-deep shadow-hard-lime">
      {/* tab header */}
      <div className="flex items-center justify-between gap-2 border-b border-cream/10 bg-ink/40 px-3 py-2.5">
        <div className="flex flex-1 items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setIdx(i); setCycle((c) => c + 1); }}
              className={`rounded-md px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.14em] transition-all duration-300 ${
                i === idx
                  ? "bg-lime text-ink"
                  : "text-cream/55 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              0{i + 1} {s.label}
            </button>
          ))}
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest sm:flex">
          <span className={`h-2 w-2 rounded-full ${paused ? "bg-cream/35" : "blink-dot bg-[#ff5a4e]"}`} />
          <span className={paused ? "text-cream/45" : "text-[#ff5a4e]"}>{paused ? "HOLD" : "ON AIR"}</span>
        </span>
      </div>

      {/* cycle timer */}
      <div className="h-1 w-full bg-cream/10">
        <div
          key={`${idx}-${cycle}-${paused}`}
          className="timer-bar h-full bg-lime"
          style={{
            animationPlayState: paused ? "paused" : "running",
            ["--timer-ms" as string]: `${SLIDE_MS}ms`,
          } as React.CSSProperties}
        />
      </div>

      {/* panels */}
      <div className="relative h-[468px] sm:h-[478px]">
        {panels.map((p, i) => (
          <div
            key={SLIDES[i].id}
            className={`absolute inset-0 transition-all duration-500 ${
              i === idx
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            }`}
            aria-hidden={i !== idx}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   HERO
   ================================================================ */

export default function Hero() {
  const [service, setService] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [dispatching, setDispatching] = useState(false);
  const [flash, setFlash] = useState(false);

  const quickBook = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);
    setFlash(true);
    setTimeout(() => {
      emitPrefill({ service, area, phone });
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
      setDispatching(false);
      setTimeout(() => setFlash(false), 1600);
    }, 700);
  };

  return (
    <section id="top" className="relative overflow-hidden bg-pine pb-20 pt-32 sm:pt-36 lg:pb-28">
      {/* ambient layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid-dark" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, #D1FE17 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-full bg-dots-dark opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-8">
        {/* ---------------- left : copy ---------------- */}
        <div>
          <Reveal>
            <p className="mb-6 inline-flex items-center gap-3 rounded-md border border-lime/30 bg-ink/40 px-4 py-2 text-[10px] font-medium tracking-[0.22em] text-lime font-mono">
              <span className="blink-dot h-2 w-2 rounded-full bg-lime" />
              LIVE — 42 TECHNICIANS ON CALL IN THE VALLEY
            </p>
          </Reveal>

          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight">
            <Reveal delay={80}>
              <span className="block text-[clamp(2.6rem,6vw,4.6rem)] text-cream">FROM DRIPS</span>
            </Reveal>
            <Reveal delay={180}>
              <span className="text-outline-cream block text-[clamp(2.6rem,6vw,4.6rem)]">TO DEAD PIXELS,</span>
            </Reveal>
            <Reveal delay={280}>
              <span className="block text-[clamp(2.6rem,6vw,4.6rem)] text-lime">
                <Scramble text="WE FIX HOME." delay={500} />
              </span>
            </Reveal>
          </h1>

          <Reveal delay={380}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-cream/75">
              Nepal's all-in-one home service crew — <strong className="font-semibold text-cream">plumbers, electricians,
              appliance installers and IT technicians</strong> dispatched to your door across the valley.
              Watch them work on the live feed — priced up-front, backed by a 30-day warranty.
            </p>
          </Reveal>

          <Reveal delay={460}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#book"
                className="btn-hard inline-flex items-center gap-2.5 rounded-md bg-lime px-7 py-3.5 font-display text-base font-bold text-ink"
              >
                Book a technician
                <IconArrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2.5 rounded-md border-2 border-cream/25 px-6 py-3 font-display text-base font-bold text-cream transition-colors duration-300 hover:border-lime hover:text-lime"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
                </span>
                Emergency line
              </a>
            </div>
          </Reveal>

          {/* quick-book bar */}
          <Reveal delay={560}>
            <form
              onSubmit={quickBook}
              className={`mt-10 rounded-lg border-2 p-3 transition-colors duration-300 sm:p-3.5 ${
                flash ? "border-lime bg-ink/60" : "border-cream/15 bg-ink/35"
              }`}
            >
              <div className="grid gap-3 sm:grid-cols-[1.1fr_1fr_1fr_auto]">
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-lime/80">SERVICE</span>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="rounded-md border border-cream/15 bg-pine-deep px-3 py-2.5 text-sm font-semibold text-cream outline-none transition-colors focus:border-lime"
                  >
                    <option value="">What's broken?</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    <option value="other">Something else</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-lime/80">AREA</span>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="rounded-md border border-cream/15 bg-pine-deep px-3 py-2.5 text-sm font-semibold text-cream outline-none transition-colors focus:border-lime"
                  >
                    <option value="">Where to?</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-lime/80">PHONE</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    inputMode="tel"
                    className="rounded-md border border-cream/15 bg-pine-deep px-3 py-2.5 text-sm font-semibold text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-lime"
                  />
                </label>
                <button
                  type="submit"
                  className="btn-hard btn-hard-lime self-end rounded-md bg-cream px-6 py-2.5 font-display text-sm font-bold text-pine"
                >
                  {dispatching ? "Dispatching…" : "Get a technician"}
                </button>
              </div>
              {flash && (
                <p className="pop-in mt-2.5 flex items-center gap-2 font-mono text-[11px] tracking-wide text-lime">
                  <IconCheck className="h-4 w-4" /> Routing you to the booking desk…
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={640}>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 font-mono text-[11px] tracking-wide text-cream/55">
              <span className="flex items-center gap-1.5"><IconStar className="h-3.5 w-3.5 text-lime" /> 4.9 · 8,200+ reviews</span>
              <span className="flex items-center gap-1.5"><IconUser className="h-4 w-4 text-lime" /> Background-verified crew</span>
              <span className="flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-lime" /> Pay after the job</span>
            </div>
          </Reveal>
        </div>

        {/* ---------------- right : on-air showcase ---------------- */}
        <Reveal dir="right" delay={250} className="relative">
          <Showcase />
        </Reveal>
      </div>
    </section>
  );
}