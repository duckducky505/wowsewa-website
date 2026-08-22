import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* prefers-reduced-motion                                              */
/* ------------------------------------------------------------------ */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* IntersectionObserver visibility                                     */
/* ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement>(
  threshold = 0.2,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ------------------------------------------------------------------ */
/* <Reveal> — scroll-reveal wrapper                                    */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  dir,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "left" | "right";
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.12);
  const dirClass = dir === "left" ? "rv-left" : dir === "right" ? "rv-right" : "";
  return (
    <div
      ref={ref}
      className={`rv ${dirClass} ${inView ? "in" : ""} ${className}`}
      style={{ ["--rv-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* <Scramble> — decode-in headline text                                */
/* ------------------------------------------------------------------ */
const GLYPHS = "#/\\<>+=*%&$@!?";

export function Scramble({
  text,
  className = "",
  delay = 0,
  speed = 45,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>(0.3);
  const [display, setDisplay] = useState(reduced ? text : "");
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    if (!inView || done.current) return;
    done.current = true;
    let frame = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        const settled = Math.floor(frame / 2.2);
        const out = text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < settled) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
        setDisplay(out);
        if (settled >= text.length && interval) {
          clearInterval(interval);
          setDisplay(text);
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [inView, reduced, text, delay, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display || "\u00A0"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* <CountUp> — animated stat number                                    */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
  className = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>(0.4);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* cross-section prefill bus (quick-book → booking form)               */
/* ------------------------------------------------------------------ */
export type PrefillPayload = { service?: string; area?: string; phone?: string };

export function emitPrefill(payload: PrefillPayload) {
  window.dispatchEvent(new CustomEvent<PrefillPayload>("mh:prefill", { detail: payload }));
}

export function usePrefillListener(cb: (p: PrefillPayload) => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const handler = (e: Event) => cbRef.current((e as CustomEvent<PrefillPayload>).detail);
    window.addEventListener("mh:prefill", handler);
    return () => window.removeEventListener("mh:prefill", handler);
  }, []);
}
