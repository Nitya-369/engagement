import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import doorAsset from "@/assets/door-bg.jpg.asset.json";
import sunriseAsset from "@/assets/sunrise-bg.jpg.asset.json";
import invitationAsset from "@/assets/invitation-bg.jpg.asset.json";
import pichwaiFrame from "@/assets/pichwai-frame-v2.jpg.asset.json";
import pichwaiBg from "@/assets/pichwai-frame.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deven & Nitya — Engagement Invitation" },
      { name: "description", content: "With blessings, the Patel & Shah families invite you to the engagement of Deven & Nitya on 28th June 2026, Rajkot." },
      { property: "og:title", content: "Deven & Nitya — Engagement Invitation" },
      { property: "og:description", content: "Join us in celebrating the engagement of Deven & Nitya — 28th June 2026, Rajkot." },
      { property: "og:image", content: invitationAsset.url },
      { name: "twitter:image", content: invitationAsset.url },
    ],
  }),
  component: Index,
});

const CONFIG = {
  eventDate: "2026-07-12T08:30:00+05:30",
  eventDateLabel: "Sunday, 12th July 2026",
  venueName: "RIO CARNIVAL",
  venueSub: "Multi Cuisine Restaurant & Banquets",
  venueAddress: "Gota, SG Highway, Ahmedabad",
  mapsUrl: "https://share.google/Ab0b7UdsKy7qNklAS",
  mapEmbed:
    "https://www.google.com/maps?q=RIO+CARNIVAL+Gota+SG+Highway+Ahmedabad&output=embed",
  whatsappMessage:
    "🙏 You're invited to Deven & Nitya's Engagement!\n📅 Sunday, 12th July 2026 · 8:30 AM\n📍 RIO CARNIVAL, Gota, SG Highway, Ahmedabad\n\nView invite: ",
  contact: "+91 98765 43210",
};

function useCountdown(target: string) {
  const t = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, t - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { days: pad(days), hours: pad(hours), mins: pad(mins) };
}

function makePetals() {
  const palettes = [
    { a: "#ff5d7a", b: "#b8002b", c: "#7a0017" }, // crimson rose
    { a: "#ffa8c0", b: "#e0476b", c: "#8a1d3a" }, // pink rose
    { a: "#ffd0c0", b: "#e36a3a", c: "#7a2a10" }, // peach rose
    { a: "#ffe0e6", b: "#ff7a9a", c: "#a3334f" }, // blush
  ];
  return Array.from({ length: 22 }, (_, i) => {
    const p = palettes[i % palettes.length];
    return {
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 12 + Math.random() * 14,
      size: 18 + Math.random() * 18,
      rot: Math.random() * 360,
      tilt: -25 + Math.random() * 50,
      ...p,
    };
  });
}

function Petals() {
  const [petals, setPetals] = useState<ReturnType<typeof makePetals>>([]);
  useEffect(() => {
    setPetals(makePetals());
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[500] overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-5vh",
            width: p.size,
            height: p.size,
            animation: `petal-sway ${p.duration}s cubic-bezier(.45,.05,.55,.95) ${p.delay}s infinite`,
            filter: "drop-shadow(0 4px 6px rgba(120,0,30,.35))",
            transformOrigin: "center",
          }}
        >
          <svg viewBox="0 0 32 32" width="100%" height="100%" style={{ transform: `rotate(${p.tilt}deg)` }}>
            <defs>
              <radialGradient id={`pg${i}`} cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor={p.a} />
                <stop offset="55%" stopColor={p.b} />
                <stop offset="100%" stopColor={p.c} />
              </radialGradient>
            </defs>
            <path
              d="M16 2 C24 6 30 14 28 22 C26 28 20 30 16 30 C12 30 6 28 4 22 C2 14 8 6 16 2 Z"
              fill={`url(#pg${i})`}
              opacity="0.95"
            />
            <path
              d="M16 4 C16 14 16 22 16 30"
              stroke={p.c}
              strokeWidth="0.6"
              opacity="0.4"
              fill="none"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

function Index() {
  const [phase, setPhase] = useState<
    "loading" | "door" | "sunrise" | "done"
  >("loading");
  const [doorOpen, setDoorOpen] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [muted, setMuted] = useState(true);
  const [confetti, setConfetti] = useState<
    { left: number; color: string; delay: number; rot: number }[]
  >([]);
  const inviteRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const { days, hours, mins } = useCountdown(CONFIG.eventDate);

  useEffect(() => {
    const t = setTimeout(() => setPhase("door"), 1500);
    return () => clearTimeout(t);
  }, []);

  const openDoor = () => {
    if (phase !== "door") return;
    setDoorOpen(true);
    setShowPetals(true);
    setTimeout(() => setPhase("sunrise"), 1500);
    setTimeout(() => {
      setPhase("done");
      inviteRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1500 + 3500);
  };

  const triggerRsvp = () => {
    const colors = ["#D4AF37", "#800020", "#0D5C63", "#1a1a5e", "#2ecc71", "#ff6b8a", "#9b59b6"];
    setConfetti(
      Array.from({ length: 100 }, () => ({
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8,
        rot: Math.random() * 360,
      })),
    );
    setRsvpDone(true);
    setShowThanks(true);
    setTimeout(() => setConfetti([]), 3500);
  };

  const shareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const msg = encodeURIComponent(CONFIG.whatsappMessage + url);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const timeline = [
    { icon: "🪔", title: "Ganesh Pooja", time: "8:30 AM", note: "Seeking divine blessings" },
    { icon: "🌾", title: "Gol Dhana", time: "9:00 AM", note: "Traditional ceremony" },
    { icon: "💍", title: "Ring Ceremony", time: "9:30 AM", note: "Exchange of rings" },
    { icon: "🍽️", title: "Lunch", time: "11:00 AM", note: "Traditional feast" },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--color-pichwai)] font-body text-[var(--color-ink)]">
      {/* LOADING */}
      {phase === "loading" && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a5e] to-[#0a0a3a] text-[var(--color-gold-light)]">
          <div className="text-7xl" style={{ animation: "soft-pulse 1.2s ease-in-out infinite" }}>
            🙏
          </div>
          <p className="mt-4 font-display tracking-widest">Loading...</p>
        </div>
      )}

      {showPetals && <Petals />}

      {/* HERO: door + sunrise + shlok stacked */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        {/* Sunrise (mandir) background — blurs during shlok phase */}
        <div
          className="absolute inset-0 transition-[filter,transform] duration-[1200ms] ease-out"
          style={{
            backgroundImage: `url(${sunriseAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: phase === "sunrise" ? "blur(14px) brightness(.55) saturate(1.2)" : "none",
            transform: phase === "sunrise" ? "scale(1.08)" : "scale(1)",
          }}
        />
        {phase === "sunrise" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-black/40 via-transparent to-black/60 px-6">
            {/* Rotating golden ring */}
            <div
              className="pointer-events-none absolute h-[88vw] max-h-[420px] w-[88vw] max-w-[420px] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, rgba(212,175,55,.0) 30%, rgba(255,220,120,.65) 50%, rgba(212,175,55,0) 70%, transparent)",
                animation: "ring-rotate 6s linear infinite",
                filter: "blur(1px)",
              }}
            />
            <div
              className="relative text-center"
              style={{ animation: "shlok-pop 1.1s cubic-bezier(.2,.9,.25,1.2) both" }}
            >
              <div className="mx-auto mb-4 text-5xl" style={{ animation: "soft-pulse 1.8s ease-in-out infinite" }}>
                🕉️
              </div>
              <div
                className="font-sanskrit text-[var(--color-gold-light)]"
                style={{ animation: "shlok-glow 2.4s ease-in-out infinite" }}
                lang="sa"
              >
                <p className="text-3xl leading-[1.6] tracking-wide">
                  स्नेहस्य विश्वासस्य च
                </p>
                <p className="mt-2 text-3xl leading-[1.6] tracking-wide">
                  देवेन नित्या च
                </p>
                <p className="mt-2 text-3xl leading-[1.6] tracking-wide">
                  सहजीवनव्रतस्य
                </p>
                <p className="mt-2 text-3xl leading-[1.6] tracking-wide">
                  शुभारम्भः
                </p>
              </div>
              <div className="mx-auto mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
              <p className="mt-4 font-cursive text-3xl text-[var(--color-gold)]">
                Shubh Aarambh
              </p>
            </div>
          </div>
        )}
        {/* DOOR overlay */}
        {phase === "door" && (
          <div
            className={`absolute inset-0 z-40 transition-opacity duration-700 ${
              doorOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* golden glow behind */}
            <div className="absolute inset-0 bg-gradient-radial from-amber-300 via-amber-600 to-transparent" />
            {/* Door panels */}
            <button
              type="button"
              onClick={openDoor}
              className="absolute inset-0 grid grid-cols-2"
              aria-label="Tap to open the doors"
              style={{ perspective: "1400px" }}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                style={{
                  transformOrigin: "left center",
                  transform: doorOpen ? "rotateY(-105deg)" : "rotateY(0deg)",
                  transition: "transform 1.4s cubic-bezier(.6,.05,.3,1)",
                  backgroundImage: `url(${doorAsset.url})`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "left center",
                  boxShadow: "inset -2px 0 0 #D4AF37",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%)",
                    mixBlendMode: "screen",
                    animation: "shimmer-sweep 3.5s ease-in-out infinite",
                  }}
                />
              </div>
              <div
                className="relative h-full w-full overflow-hidden"
                style={{
                  transformOrigin: "right center",
                  transform: doorOpen ? "rotateY(105deg)" : "rotateY(0deg)",
                  transition: "transform 1.4s cubic-bezier(.6,.05,.3,1)",
                  backgroundImage: `url(${doorAsset.url})`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: "right center",
                  boxShadow: "inset 2px 0 0 #D4AF37",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(-115deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%)",
                    mixBlendMode: "screen",
                    animation: "shimmer-sweep 3.5s ease-in-out infinite",
                  }}
                />
              </div>
            </button>

            {/* Bottom tap-to-open */}
            <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 text-center">
              <p
                className="font-tangerine text-6xl leading-none text-[var(--color-gold-light)] drop-shadow-[0_3px_10px_rgba(0,0,0,.9)]"
                style={{
                  animation: "tap-bounce 1.8s ease-in-out infinite",
                  textShadow: "0 0 22px rgba(212,175,55,.55)",
                }}
              >
                ✦ Tap to Open ✦
              </p>
              <p className="mt-1 font-royal text-[10px] uppercase tracking-[0.45em] text-[var(--color-gold)]/85">
                The Doors of Destiny
              </p>
            </div>

            {/* Center golden seam */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent" />
          </div>
        )}
      </section>

      {/* SCROLLABLE CONTENT */}
      <div
        ref={inviteRef}
        className="relative"
        style={{
          backgroundImage: `url(${pichwaiBg.url})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[var(--color-pichwai)]/85 backdrop-blur-sm">
          <div className="mx-auto max-w-md px-5 py-12 space-y-10">
            {/* INVITATION CARD (static display) */}
            <div
              className="relative block w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-[var(--color-gold)]/40"
              style={{
                aspectRatio: "1080 / 1920",
                backgroundImage: `url(${pichwaiFrame.url})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Content printed inside the pichwai frame */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-[14%] text-center text-[var(--color-gold-light)]">
                <p
                  className="font-cursive text-4xl text-[var(--color-gold)] drop-shadow-[0_2px_6px_rgba(0,0,0,.55)]"
                  style={{ textShadow: "0 0 14px rgba(212,175,55,.45)" }}
                >
                  By grace of god
                </p>
                <div className="my-3 flex items-center gap-2 text-[var(--color-gold)]/80">
                  <span className="h-px w-8 bg-[var(--color-gold)]/70" />
                  <span className="text-xs">✦</span>
                  <span className="h-px w-8 bg-[var(--color-gold)]/70" />
                </div>
                <p className="font-royal text-[11px] uppercase tracking-[0.45em] text-[var(--color-gold-light)]/90">
                  Engagement of
                </p>
                <h2
                  className="mt-3 font-cursive text-[3.6rem] leading-[1] text-[var(--color-gold)]"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,.55), 0 0 22px rgba(212,175,55,.5)" }}
                >
                  Deven
                </h2>
                <p className="my-1 font-cursive text-3xl italic text-[var(--color-gold-light)]">&amp;</p>
                <h2
                  className="font-cursive text-[3.6rem] leading-[1] text-[var(--color-gold)]"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,.55), 0 0 22px rgba(212,175,55,.5)" }}
                >
                  Nitya
                </h2>
                <div className="mt-5 flex items-center gap-2 text-[var(--color-gold)]/80">
                  <span className="h-px w-6 bg-[var(--color-gold)]/70" />
                  <span className="text-[10px]">✦</span>
                  <span className="h-px w-6 bg-[var(--color-gold)]/70" />
                </div>
              </div>
            </div>

            {/* TIMELINE — zig-zag with ornate medallions */}
            <section className="relative overflow-hidden rounded-2xl border border-[var(--color-gold)]/40 bg-gradient-to-b from-[var(--color-pichwai)]/90 to-[#0f0f3a]/90 p-6 shadow-[0_0_40px_rgba(212,175,55,.18)] ring-1 ring-[var(--color-gold)]/30">
              {/* Corner flourishes */}
              <div className="pointer-events-none absolute -top-8 -right-8 text-[140px] opacity-[0.08] rotate-12">🪷</div>
              <div className="pointer-events-none absolute -bottom-10 -left-10 text-[140px] opacity-[0.08] -rotate-12">🪷</div>
              <div className="pointer-events-none absolute top-3 left-3 text-xl text-[var(--color-gold)]/60">❦</div>
              <div className="pointer-events-none absolute top-3 right-3 text-xl text-[var(--color-gold)]/60 scale-x-[-1]">❦</div>

              <div className="relative text-center">
                <p className="font-cursive text-4xl text-[var(--color-gold)]" style={{ textShadow: "0 0 18px rgba(212,175,55,.4)" }}>
                  Engagement
                </p>
                <p className="font-royal text-[11px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]/90">
                  Sunday · 12 July 2026
                </p>
                <div className="mx-auto mt-2 flex items-center justify-center gap-2">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
                  <span className="text-[var(--color-gold)]">✦</span>
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
                </div>
              </div>

              {/* Zig-zag spine */}
              <div className="relative mt-8">
                {/* Vertical center line */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
                  <div className="h-full w-full bg-[repeating-linear-gradient(to_bottom,var(--color-gold)_0_6px,transparent_6px_12px)] opacity-60" />
                </div>

                <ol className="relative space-y-7">
                  {timeline.map((e, i) => {
                    const left = i % 2 === 0;
                    return (
                      <li key={i} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        {/* Left side card */}
                        <div className={left ? "" : "invisible"}>
                          {left && (
                            <div className="rounded-xl border border-[var(--color-gold)]/50 bg-black/40 p-3 text-right backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,.4)]">
                              <p className="font-royal text-[10px] uppercase tracking-[0.25em] text-[var(--color-gold-light)]">
                                {e.time}
                              </p>
                              <p className="mt-1 font-cursive text-2xl leading-tight text-[var(--color-gold)]">
                                {e.title}
                              </p>
                              <p className="mt-0.5 text-[10px] italic text-[var(--color-gold-light)]/70">
                                {e.note}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Center medallion */}
                        <div className="relative z-10 grid place-items-center">
                          <div
                            className="absolute h-14 w-14 rounded-full"
                            style={{
                              background:
                                "conic-gradient(from 0deg, #D4AF37, #F5E6A3, #9c7a1e, #D4AF37)",
                              animation: "ring-rotate 8s linear infinite",
                              filter: "blur(2px)",
                              opacity: 0.7,
                            }}
                          />
                          <div
                            className="relative grid h-11 w-11 place-items-center rounded-full text-base shadow-[0_4px_12px_rgba(0,0,0,.5)] ring-2 ring-[var(--color-gold-light)]"
                            style={{
                              background:
                                "radial-gradient(circle at 30% 30%, #F5E6A3, #D4AF37 55%, #6b5012)",
                            }}
                          >
                            {e.icon}
                          </div>
                        </div>

                        {/* Right side card */}
                        <div className={!left ? "" : "invisible"}>
                          {!left && (
                            <div className="rounded-xl border border-[var(--color-gold)]/50 bg-black/40 p-3 text-left backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,.4)]">
                              <p className="font-royal text-[10px] uppercase tracking-[0.25em] text-[var(--color-gold-light)]">
                                {e.time}
                              </p>
                              <p className="mt-1 font-cursive text-2xl leading-tight text-[var(--color-gold)]">
                                {e.title}
                              </p>
                              <p className="mt-0.5 text-[10px] italic text-[var(--color-gold-light)]/70">
                                {e.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            {/* COUNTDOWN */}
            <section className="relative overflow-hidden rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-pichwai)]/80 p-6 text-center text-[var(--color-gold-light)] shadow-[0_0_30px_rgba(212,175,55,.15)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 text-center text-3xl opacity-20">🪷</div>
              <p className="relative font-display tracking-[0.3em] text-[var(--color-gold)]">⏳ COUNTING DOWN ⏳</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { l: "DAYS", v: days },
                  { l: "HOURS", v: hours },
                  { l: "MINS", v: mins },
                ].map((c) => (
                  <div key={c.l} className="rounded-xl bg-black/40 py-4 ring-1 ring-[var(--color-gold)]/60">
                    <div className="font-display text-4xl font-black text-[var(--color-gold)]">
                      {c.v}
                    </div>
                    <div className="mt-1 text-[10px] tracking-[0.3em]">{c.l}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* MAP */}
            <section className="rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-pichwai)]/80 p-4 shadow-[0_0_30px_rgba(212,175,55,.15)]">
              <div className="mb-3 text-center">
                <p className="font-cursive text-3xl text-[var(--color-gold)]" style={{ textShadow: "0 0 14px rgba(212,175,55,.35)" }}>
                  Venue
                </p>
                <p className="mt-1 font-royal text-base font-bold tracking-[0.18em] text-[var(--color-gold-light)]">
                  {CONFIG.venueName}
                </p>
                <p className="text-[11px] italic text-[var(--color-gold-light)]/80">
                  {CONFIG.venueSub}
                </p>
                <p className="text-[11px] text-[var(--color-gold-light)]/70">
                  📍 {CONFIG.venueAddress}
                </p>
              </div>
              <div className="overflow-hidden rounded-lg ring-1 ring-[var(--color-gold)]/40">
                <iframe
                  title="Venue map"
                  src={CONFIG.mapEmbed}
                  className="h-56 w-full"
                  loading="lazy"
                />
              </div>
              <a
                href={CONFIG.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block rounded-lg bg-gradient-to-r from-[var(--color-gold)] to-[#9c7a1e] py-3 text-center font-semibold text-[var(--color-pichwai)] active:scale-[0.98]"
              >
                🗺️ Get Directions
              </a>
            </section>

            {/* RSVP */}
            <section className="relative overflow-hidden rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-pichwai)]/80 p-6 text-center shadow-[0_0_30px_rgba(212,175,55,.15)]">
              <div className="pointer-events-none absolute -bottom-8 -right-8 text-[100px] opacity-10">🪷</div>
              <p className="relative font-guj text-lg font-bold text-[var(--color-gold)]">
                આશીર્વાદ આપવા પધારો
              </p>
              <p className="relative text-xs italic text-[var(--color-gold-light)]/70">
                Grace us with your blessings
              </p>
              <div className="relative mt-4 space-y-3">
                <button
                  onClick={triggerRsvp}
                  disabled={rsvpDone}
                  className="w-full rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[#9c7a1e] py-3 font-semibold text-[var(--color-pichwai)] shadow-lg active:scale-[0.98] disabled:opacity-80"
                >
                  {rsvpDone ? "Thank You! ✓" : "💚 Yes, We'll Attend!"}
                </button>
                <button
                  onClick={shareWhatsApp}
                  className="w-full rounded-xl bg-[#25D366] py-3 font-semibold text-white active:scale-[0.98]"
                >
                  📤 Share on WhatsApp
                </button>
              </div>
              <div className="relative mt-5">
                <a
                  href={`tel:${CONFIG.contact.replace(/\s/g, "")}`}
                  className="font-display text-[var(--color-gold)]"
                >
                  📞 {CONFIG.contact}
                </a>
              </div>
            </section>

            <footer className="pt-2 text-center text-[var(--color-gold-light)]">
              <p className="text-lg">🪔 ════════ 🪔</p>
              <p className="mt-2 text-sm">
                Made with <span className="text-[#ff6b8a]">❤️</span> for Deven & Nitya
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* MUTE BUTTON */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="fixed bottom-4 right-4 z-[800] grid h-12 w-12 place-items-center rounded-full bg-[var(--color-maroon)] text-xl text-[var(--color-gold-light)] shadow-lg ring-2 ring-[var(--color-gold)]"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* CONFETTI */}
      {confetti.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[900] overflow-hidden">
          {confetti.map((c, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: "-10vh",
                left: `${c.left}%`,
                width: 10,
                height: 14,
                background: c.color,
                transform: `rotate(${c.rot}deg)`,
                animation: `confetti-fall ${2 + Math.random() * 1.5}s linear ${c.delay}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* THANKS MODAL */}
      {showThanks && (
        <div className="fixed inset-0 z-[950] grid place-items-center bg-black/60 p-6 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--color-cream)] p-6 text-center ring-4 ring-[var(--color-gold)]">
            <div className="text-5xl">🎉</div>
            <h4 className="mt-2 font-display text-2xl font-bold text-[var(--color-maroon)]">
              Thank You!
            </h4>
            <p className="mt-3 font-guj text-base text-[var(--color-ink)]">
              ધન્યવાદ! તમારી હાજરી અમારું સૌભાગ્ય!
            </p>
            <p className="mt-1 text-sm italic text-[var(--color-ink)]/70">
              Your presence will be our fortune!
            </p>
            <button
              onClick={() => setShowThanks(false)}
              className="mt-5 rounded-xl bg-[var(--color-maroon)] px-6 py-2 font-semibold text-[var(--color-gold-light)] active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* INVITATION ZOOM MODAL */}
      {zoom && (
        <div
          className="fixed inset-0 z-[960] flex items-center justify-center bg-black/85 p-4 animate-fade-in"
          onClick={() => setZoom(false)}
        >
          <button
            onClick={() => setZoom(false)}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-maroon)] text-xl text-[var(--color-gold-light)] ring-2 ring-[var(--color-gold)]"
            aria-label="Close"
          >
            ✕
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-[420px] overflow-hidden rounded-2xl shadow-2xl ring-2 ring-[var(--color-gold)]"
            style={{
              aspectRatio: "1080 / 1920",
              backgroundImage: `url(${pichwaiFrame.url})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              animation: "shlok-pop .7s cubic-bezier(.2,.9,.25,1.2) both",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[14%] text-center text-[var(--color-gold-light)]">
              <p
                className="font-tangerine text-5xl text-[var(--color-gold)]"
                style={{ textShadow: "0 0 18px rgba(212,175,55,.55)" }}
              >
                By grace of god
              </p>
              <div className="my-4 flex items-center gap-2 text-[var(--color-gold)]/80">
                <span className="h-px w-10 bg-[var(--color-gold)]/70" />
                <span className="text-xs">✦</span>
                <span className="h-px w-10 bg-[var(--color-gold)]/70" />
              </div>
              <p className="font-royal text-xs uppercase tracking-[0.5em] text-[var(--color-gold-light)]/95">
                Engagement of
              </p>
              <h2
                className="mt-4 font-tangerine text-[5.5rem] leading-[1] text-[var(--color-gold)]"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,.6), 0 0 26px rgba(212,175,55,.55)" }}
              >
                Deven
              </h2>
              <p className="my-1 font-tangerine text-4xl italic text-[var(--color-gold-light)]">&amp;</p>
              <h2
                className="font-tangerine text-[5.5rem] leading-[1] text-[var(--color-gold)]"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,.6), 0 0 26px rgba(212,175,55,.55)" }}
              >
                Nitya
              </h2>
              <div className="mt-6 flex items-center gap-2 text-[var(--color-gold)]/80">
                <span className="h-px w-8 bg-[var(--color-gold)]/70" />
                <span className="text-[10px]">✦</span>
                <span className="h-px w-8 bg-[var(--color-gold)]/70" />
              </div>
              <p className="mt-3 font-royal text-[11px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]/95">
                Sunday · 12 July 2026
              </p>
              <p className="mt-1 font-royal text-[11px] tracking-[0.35em] text-[var(--color-gold-light)]/90">
                8:30 AM onwards
              </p>
              <p className="mt-3 font-cursive text-xl text-[var(--color-gold)]">
                {CONFIG.venueName}
              </p>
              <p className="text-[10px] italic text-[var(--color-gold-light)]/80">
                {CONFIG.venueSub}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
