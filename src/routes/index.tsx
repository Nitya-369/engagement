import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

// Images stored locally in /public — copy from Lovable if missing
const ASSETS = {
  door: "/door-bg.jpg",
  sunrise: "/sunrise-bg.jpg",
  invitation: "/invitation-bg.jpg",
  pichwaiFrame: "/pichwai-frame-v2.jpg",
  pichwaiBg: "/pichwai-frame.jpg",
  shlokaBg: "/shloka-bg.png",
  shlokaFrame: "/shloka-frame.png",
};


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deven & Nitya — Engagement Invitation" },
      { name: "description", content: "With blessings, the Patel & Shah families invite you to the engagement of Deven & Nitya on 28th June 2026, Rajkot." },
      { property: "og:title", content: "Deven & Nitya — Engagement Invitation" },
      { property: "og:description", content: "Join us in celebrating the engagement of Deven & Nitya — 28th June 2026, Rajkot." },
      { property: "og:image", content: ASSETS.invitation },
      { name: "twitter:image", content: ASSETS.invitation },
    ],
  }),
  component: Index,
});

const CONFIG = {
  eventDate: "2026-07-12T09:00:00+05:30",
  eventDateLabel: "Sunday, 12th July 2026",
  venueName: "RIO CARNIVAL",
  venueSub: "Multi Cuisine Restaurant & Banquets",
  venueAddress: "Gota, SG Highway, Ahmedabad",
  mapsUrl: "https://share.google/Ab0b7UdsKy7qNklAS",
  mapEmbed:
    "https://www.google.com/maps?q=RIO+CARNIVAL+Gota+SG+Highway+Ahmedabad&output=embed",
  whatsappMessage:
    "🙏 You're invited to Deven & Nitya's Engagement!\n📅 Sunday, 12th July 2026 · 9:00 AM\n📍 RIO CARNIVAL, Gota, SG Highway, Ahmedabad\n\nView invite: ",
  contact: "+91 98765 43210",
  families: {
    groom: {
      name: "Deven",
      relationEn: "Groom's Family",
      mother: "Vakotar Meenaben Hiteshbhai",
      father: "Vakotar Hiteshbhai Jamnadas",
      family: "Vakotar Family",
      hometown: "Porbandar",
    },
    bride: {
      name: "Nitya",
      relationEn: "Bride's Family",
      mother: "Makwana Sheetalben Piyushbhai",
      father: "Makwana Piyushbhai Natvarlal",
      family: "Makwana Family",
      hometown: "Dhandhuka",
    }
  },
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
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { days: pad(days), hours: pad(hours), mins: pad(mins), secs: pad(secs) };
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
    <div className="pointer-events-none absolute inset-0 z-[500] overflow-hidden">
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const { days, hours, mins, secs } = useCountdown(CONFIG.eventDate);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (muted) {
        audioRef.current.play().catch(() => { });
      } else {
        audioRef.current.pause();
      }
    }
    setMuted(!muted);
  };

  // Preload images before showing door phase
  useEffect(() => {
    const doorImg = new Image();
    const sunriseImg = new Image();
    
    let doorLoaded = false;
    let sunriseLoaded = false;
    
    const checkBothLoaded = () => {
      if (doorLoaded && sunriseLoaded) {
        setTimeout(() => setPhase("door"), 500);
      }
    };
    
    doorImg.onload = () => {
      doorLoaded = true;
      checkBothLoaded();
    };
    
    sunriseImg.onload = () => {
      sunriseLoaded = true;
      checkBothLoaded();
    };
    
    doorImg.src = ASSETS.door;
    sunriseImg.src = ASSETS.sunrise;
    
    // Fallback timeout in case images fail to load
    const fallbackTimeout = setTimeout(() => {
      setPhase("door");
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, []);

  const openDoor = () => {
    if (phase !== "door") return;
    setDoorOpen(true);
    setShowPetals(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setMuted(false);
    setTimeout(() => setPhase("sunrise"), 1400);
    setTimeout(() => {
      setPhase("done");
      inviteRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 4500);
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
    { icon: "🪔", title: "Ganesh Pooja", time: "9:00 AM", note: "Seeking divine blessings" },
    { icon: "🍯", title: "Gol Dhana", time: "10:00 AM", note: "Traditional ceremony" },
    { icon: "💍", title: "Ring Ceremony", time: "11:00 AM", note: "Exchange of rings" },
    { icon: "🍽️", title: "Lunch", time: "12:00 PM", note: "Traditional feast" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a24] flex justify-center items-start overflow-x-hidden">
      <div className="w-full max-w-[480px] min-h-screen bg-[var(--color-pichwai)] font-body text-[var(--color-ink)] relative shadow-2xl overflow-hidden flex flex-col">
        {/* LOADING */}
        {phase === "loading" && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a5e] to-[#0a0a3a] text-[var(--color-gold-light)]">
            <div className="text-7xl mb-6" style={{ animation: "soft-pulse 1.2s ease-in-out infinite" }}>
              🪷
            </div>
            <h1 className="font-tangerine text-5xl text-center px-4 leading-tight" style={{ textShadow: "0 0 20px rgba(212,175,55,.4)" }}>
              Deven & Nitya
            </h1>
            <p className="mt-2 font-display tracking-[0.3em] text-sm uppercase">Engagement</p>
          </div>
        )}

        {showPetals && <Petals />}


        {/* HERO: door + sunrise */}
        <section className="relative h-[100svh] w-full overflow-hidden bg-gradient-to-b from-[#1a1a5e] to-[#0a0a3a]">
          {/* Sunrise background — revealed when doors open */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${ASSETS.sunrise})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {phase === "door" && (
            <div
              className={`absolute inset-0 z-40 transition-opacity duration-700 ${doorOpen ? "opacity-0 pointer-events-none" : "opacity-100"
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
                    backgroundImage: `url(${ASSETS.door})`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: "left center",
                  }}
                />
                <div
                  className="relative h-full w-full overflow-hidden"
                  style={{
                    transformOrigin: "right center",
                    transform: doorOpen ? "rotateY(105deg)" : "rotateY(0deg)",
                    transition: "transform 1.4s cubic-bezier(.6,.05,.3,1)",
                    backgroundImage: `url(${ASSETS.door})`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: "right center",
                  }}
                />
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
              </div>

            </div>
          )}
        </section>

        {/* SCROLLABLE CONTENT */}
        <div
          ref={inviteRef}
          className="relative"
          style={{
            backgroundImage: `url(${ASSETS.pichwaiBg})`,
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
                  backgroundImage: `url(${ASSETS.pichwaiFrame})`,
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
                    By the Grace of God
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

              {/* OUR FAMILIES */}
              <section className="relative overflow-hidden rounded-2xl border border-[var(--color-gold)]/40 bg-gradient-to-b from-[var(--color-pichwai)]/90 to-[#0f0f3a]/90 p-6 shadow-[0_0_40px_rgba(212,175,55,.18)] ring-1 ring-[var(--color-gold)]/30">
                {/* Corner flourishes */}
                <div className="pointer-events-none absolute -top-8 -left-8 text-[140px] opacity-[0.08] rotate-45">🪷</div>
                <div className="pointer-events-none absolute -bottom-10 -right-10 text-[140px] opacity-[0.08] -rotate-45">🪷</div>

                <div className="relative text-center">
                  <p className="font-cursive text-[2.2rem] leading-tight text-[var(--color-gold)]" style={{ textShadow: "0 0 18px rgba(212,175,55,.4)" }}>
                    Two families united by love.
                  </p>
                  <p className="font-body text-xs text-[var(--color-gold-light)]/85 tracking-wide mt-2 px-2 leading-relaxed">
                    We warmly invite you to join us and bless this beautiful beginning.
                  </p>
                  <div className="mx-auto my-3.5 flex items-center justify-center gap-2">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
                    <span className="text-[var(--color-gold)]">✦</span>
                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
                  </div>
                </div>

                {/* Side-by-side family cards */}
                <div className="grid grid-cols-2 gap-3 mt-6 relative z-10 text-[var(--color-gold-light)]">
                  {/* Groom's Family */}
                  <div className="rounded-xl border border-[var(--color-gold)]/30 bg-black/35 p-3 sm:p-3.5 text-center backdrop-blur-xs flex flex-col justify-between shadow-[inset_0_0_12px_rgba(212,175,55,0.1)]">
                    <div>
                      <span className="text-xl text-[var(--color-gold)]">🪷</span>
                      <p className="font-royal text-[9px] uppercase tracking-wider text-[var(--color-gold)] mt-1">
                        {CONFIG.families.groom.relationEn}
                      </p>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[var(--color-gold-light)]/60">Father</p>
                          <p className="font-display text-[11px] sm:text-[13px] font-bold text-[var(--color-gold-light)] leading-tight mt-0.5">
                            {CONFIG.families.groom.father}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[var(--color-gold-light)]/60">Mother</p>
                          <p className="font-display text-[11px] sm:text-[13px] font-bold text-[var(--color-gold-light)] leading-tight mt-0.5">
                            {CONFIG.families.groom.mother}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[var(--color-gold)]/20">
                      <p className="font-display text-[10px] sm:text-xs font-bold text-[var(--color-gold)]">
                        {CONFIG.families.groom.family}
                      </p>
                      <p className="text-[9px] italic text-[var(--color-gold-light)]/70 mt-0.5">
                        Gam: {CONFIG.families.groom.hometown}
                      </p>
                    </div>
                  </div>

                  {/* Bride's Family */}
                  <div className="rounded-xl border border-[var(--color-gold)]/30 bg-black/35 p-3 sm:p-3.5 text-center backdrop-blur-xs flex flex-col justify-between shadow-[inset_0_0_12px_rgba(212,175,55,0.1)]">
                    <div>
                      <span className="text-xl text-[var(--color-gold)]">🪷</span>
                      <p className="font-royal text-[9px] uppercase tracking-wider text-[var(--color-gold)] mt-1">
                        {CONFIG.families.bride.relationEn}
                      </p>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[var(--color-gold-light)]/60">Father</p>
                          <p className="font-display text-[11px] sm:text-[13px] font-bold text-[var(--color-gold-light)] leading-tight mt-0.5">
                            {CONFIG.families.bride.father}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[var(--color-gold-light)]/60">Mother</p>
                          <p className="font-display text-[11px] sm:text-[13px] font-bold text-[var(--color-gold-light)] leading-tight mt-0.5">
                            {CONFIG.families.bride.mother}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[var(--color-gold)]/20">
                      <p className="font-display text-[10px] sm:text-xs font-bold text-[var(--color-gold)]">
                        {CONFIG.families.bride.family}
                      </p>
                      <p className="text-[9px] italic text-[var(--color-gold-light)]/70 mt-0.5">
                        Gam: {CONFIG.families.bride.hometown}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

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
                  <p className="mt-3 font-royal text-[11px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]/90">
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
              <section className="relative overflow-hidden rounded-2xl border border-[var(--color-gold)]/40 bg-gradient-to-b from-[var(--color-pichwai)] to-[#0a0a3a] p-6 text-center text-[var(--color-gold-light)] shadow-[0_0_40px_rgba(212,175,55,.2)]">
                {/* Blooming Lotus Background */}
                <div className="absolute inset-0 grid place-items-center opacity-40">
                  <div className="relative h-64 w-64 animate-[lotus-spin_40s_linear_infinite]">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 origin-center"
                        style={{
                          transform: `rotate(${i * 30}deg)`,
                          animation: `lotus-bloom 4s cubic-bezier(0.25, 1, 0.5, 1) ${i * 0.15}s both`,
                        }}
                      >
                        <svg viewBox="0 0 100 150" className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-16 drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">
                          <defs>
                            <linearGradient id={`lotus-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ffb6c1" stopOpacity="0.95" />
                              <stop offset="100%" stopColor="#ff1493" stopOpacity="0.3" />
                            </linearGradient>
                          </defs>
                          <path d="M50 150 C50 150, 0 100, 0 50 C0 0, 50 20, 50 20 C50 20, 100 0, 100 50 C100 100, 50 150, 50 150 Z" fill={`url(#lotus-grad-${i})`} />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <p className="font-royal text-xs uppercase tracking-[0.25em] text-[var(--color-gold)] mb-4">
                    Counting the Moments
                  </p>
                  
                  {/* Rotating Gold Ring Dials */}
                  <div className="grid grid-cols-4 gap-2 justify-center w-full max-w-[360px] px-1">
                    {[
                      { label: "Days", val: days, speed: "16s" },
                      { label: "Hours", val: hours, speed: "12s" },
                      { label: "Mins", val: mins, speed: "8s" },
                      { label: "Secs", val: secs, speed: "2.5s", active: true },
                    ].map((item) => (
                      <div key={item.label} className="relative flex flex-col items-center">
                        <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                          {/* Inner rotating orbit ring */}
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: "conic-gradient(from 0deg, #D4AF37, #F5E6A3, #9c7a1e, #D4AF37)",
                              animation: `ring-rotate ${item.speed} linear infinite`,
                              filter: "blur(1px)",
                              opacity: 0.85,
                            }}
                          />
                          {/* Inside dial plate */}
                          <div className="relative w-[64px] h-[64px] rounded-full bg-gradient-to-b from-[#12123f]/95 to-[#070724]/95 border border-[var(--color-gold)]/40 flex flex-col items-center justify-center shadow-[inset_0_0_8px_rgba(212,175,55,0.2)]">
                            <span className={`font-display text-lg font-black text-[var(--color-gold-light)] leading-none ${item.active ? "animate-[soft-pulse_1s_ease-in-out_infinite]" : ""}`}>
                              {item.val}
                            </span>
                            <span className="text-[7px] uppercase tracking-widest text-[var(--color-gold)] mt-1.5 font-bold">
                              {item.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-[10px] italic text-[var(--color-gold-light)]/70">
                    Until we unite in love & blessings
                  </p>
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
                <p className="relative font-cursive text-3xl text-[var(--color-gold)]" style={{ textShadow: "0 0 14px rgba(212,175,55,.35)" }}>
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

              </section>


            </div>
          </div>
        </div>

        {/* BACKGROUND MUSIC */}
        <audio ref={audioRef} src="/bg-music.mp3" loop autoPlay />

        {/* CONFETTI */}
        {confetti.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-[900] overflow-hidden">
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
          <div className="fixed inset-0 z-[950] grid place-items-center bg-black/70 p-6 animate-fade-in backdrop-blur-xs">
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--color-gold)] bg-gradient-to-b from-[#12123f] to-[#070724] p-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.3)]">
              {/* Corner flourishes */}
              <div className="pointer-events-none absolute top-3 left-3 text-lg text-[var(--color-gold)]/50">❦</div>
              <div className="pointer-events-none absolute top-3 right-3 text-lg text-[var(--color-gold)]/50 scale-x-[-1]">❦</div>
              <div className="pointer-events-none absolute bottom-3 left-3 text-lg text-[var(--color-gold)]/50 scale-y-[-1]">❦</div>
              <div className="pointer-events-none absolute bottom-3 right-3 text-lg text-[var(--color-gold)]/50 scale-x-[-1] scale-y-[-1]">❦</div>

              <div className="text-5xl">🙏</div>
              <h4 className="mt-4 font-cursive text-4xl text-[var(--color-gold)]" style={{ textShadow: "0 0 15px rgba(212,175,55,0.4)" }}>
                Thank You!
              </h4>
              <p className="mt-4 font-royal text-sm uppercase tracking-wider text-[var(--color-gold-light)]/90 leading-relaxed px-2">
                Your presence will be our fortune!
              </p>
              <button
                onClick={() => setShowThanks(false)}
                className="mt-7 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[#9c7a1e] px-8 py-2.5 font-bold text-[var(--color-pichwai)] shadow-lg hover:brightness-110 active:scale-95 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* INVITATION ZOOM MODAL */}
      </div>
    </div>
  );
}
