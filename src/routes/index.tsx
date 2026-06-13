import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import doorAsset from "@/assets/door-bg.jpg.asset.json";
import sunriseAsset from "@/assets/sunrise-bg.jpg.asset.json";
import invitationAsset from "@/assets/invitation-bg.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rahul & Priya — Engagement Invitation" },
      { name: "description", content: "With blessings, the Patel & Shah families invite you to the engagement of Rahul & Priya on 28th June 2026, Rajkot." },
      { property: "og:title", content: "Rahul & Priya — Engagement Invitation" },
      { property: "og:description", content: "Join us in celebrating the engagement of Rahul & Priya — 28th June 2026, Rajkot." },
      { property: "og:image", content: invitationAsset.url },
      { name: "twitter:image", content: invitationAsset.url },
    ],
  }),
  component: Index,
});

const CONFIG = {
  eventDate: "2026-06-28T11:00:00+05:30",
  mapsUrl: "https://maps.google.com/?q=22.3039,70.8022",
  mapEmbed:
    "https://www.google.com/maps?q=22.3039,70.8022&z=14&output=embed",
  whatsappMessage:
    "🙏 You're invited to Rahul & Priya's Engagement!\n📅 Sunday, 28th June 2026\n📍 The Grand Celebration Hall, Rajkot\n\nView invite: ",
  contact: "+91 98765 43210",
  calendar: {
    title: "Rahul & Priya Engagement",
    description: "Engagement ceremony of Rahul & Priya",
    location: "The Grand Celebration Hall, Rajkot",
    start: "20260628T053000Z", // 11:00 IST
    end: "20260628T093000Z",   // 15:00 IST
  },
};

function useCountdown(target: string) {
  const t = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, t - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { days: pad(days), hours: pad(hours), mins: pad(mins) };
}

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 14 + Math.random() * 12,
        size: 10 + Math.random() * 10,
        color: ["#e74c3c", "#ff6b8a", "#ff9ff3", "#ffb3c1"][i % 4],
        rot: Math.random() * 360,
      })),
    [],
  );
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
            height: p.size * 1.4,
            background: p.color,
            borderRadius: "150% 0 150% 0",
            transform: `rotate(${p.rot}deg)`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0.85,
            boxShadow: "0 0 6px rgba(0,0,0,.15)",
          }}
        />
      ))}
    </div>
  );
}

function Index() {
  const [phase, setPhase] = useState<
    "loading" | "door" | "sunrise" | "shlok" | "done"
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
    setTimeout(() => setPhase("shlok"), 1500 + 3000);
    setTimeout(() => {
      setPhase("done");
      inviteRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1500 + 3000 + 4500);
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

  const downloadIcs = () => {
    const c = CONFIG.calendar;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Engagement//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@invite`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${c.start}`,
      `DTEND:${c.end}`,
      `SUMMARY:${c.title}`,
      `DESCRIPTION:${c.description}`,
      `LOCATION:${c.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engagement.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const msg = encodeURIComponent(CONFIG.whatsappMessage + url);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const timeline = [
    { icon: "🪔", title: "Ganesh Pooja", time: "10:30 AM", note: "Seeking divine blessings" },
    { icon: "🌾", title: "Gol Dhana", time: "11:00 AM", note: "Traditional ceremony" },
    { icon: "💍", title: "Ring Ceremony", time: "11:30 AM", note: "Exchange of rings" },
    { icon: "📸", title: "Photo Session", time: "12:00 PM", note: "Capturing memories" },
    { icon: "🍽️", title: "Lunch", time: "1:00 PM", note: "Traditional feast" },
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
        {/* Sunrise background (revealed once doors open) */}
        <div
          className="absolute inset-0 transition-[filter] duration-700"
          style={{
            backgroundImage: `url(${sunriseAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: phase === "shlok" ? "blur(8px) brightness(0.7)" : "none",
          }}
        />
        {/* Sunrise overlay text */}
        {(phase === "sunrise" || phase === "shlok" || phase === "done") && (
          <div className="absolute inset-x-0 top-[18%] z-10 flex flex-col items-center text-center">
            <div
              className="h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-amber-400"
              style={{ animation: "sun-pulse 3s ease-in-out infinite" }}
            />
            <h1
              className="mt-6 font-guj text-3xl font-bold text-[var(--color-gold-light)] drop-shadow-[0_2px_8px_rgba(0,0,0,.6)] animate-fade-in"
            >
              શુભ પ્રભાત 🙏
            </h1>
          </div>
        )}

        {/* Shlok popup */}
        {phase === "shlok" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6 animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-[var(--color-cream)] p-6 text-center shadow-2xl ring-4 ring-[var(--color-gold)]">
              <div className="absolute inset-2 rounded-xl border border-[var(--color-gold)]/60 pointer-events-none" />
              <div className="text-4xl">🙏</div>
              <p className="mt-3 font-guj text-lg leading-relaxed text-[var(--color-maroon)]">
                वक्रतुण्ड महाकाय<br />
                सूर्यकोटि समप्रभ।<br />
                निर्विघ्नं कुरु मे देव<br />
                सर्वकार्येषु सर्वदा॥
              </p>
              <p className="mt-3 text-xs italic text-[var(--color-ink)]/70">
                O Lord of curved trunk, large body, with the brilliance of a million suns,
                please make all my endeavours free from obstacles, always.
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

            {/* Top blessing */}
            <div className="pointer-events-none absolute inset-x-0 top-6 z-10 text-center">
              <p className="font-guj text-xl font-bold text-[var(--color-gold-light)] drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]">
                ॐ श्री गणेशाय नमः
              </p>
            </div>

            {/* Bottom tap-to-open */}
            <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 text-center">
              <p
                className="font-display text-lg tracking-[0.3em] text-[var(--color-gold-light)] drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]"
                style={{ animation: "soft-pulse 1.6s ease-in-out infinite" }}
              >
                ✨ Tap to Open ✨
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
          backgroundImage: `url(${invitationAsset.url})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[var(--color-pichwai)]/40 backdrop-blur-[1px]">
          <div className="mx-auto max-w-md px-5 py-12 space-y-10">
            {/* INVITATION CARD */}
            <article className="relative rounded-2xl bg-[var(--color-cream)] p-6 shadow-2xl ring-4 ring-[var(--color-gold)]">
              <div className="absolute inset-2 rounded-xl border border-[var(--color-gold)]/60 pointer-events-none" />
              <div className="text-center">
                <p className="font-guj text-xl font-bold text-[var(--color-maroon)]">
                  ॐ श्री गणेशाय नमः
                </p>
                <div className="mx-auto my-4 h-px w-2/3 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
                <p className="text-xs uppercase tracking-widest text-[var(--color-ink)]/70">
                  With the blessings of Lord Ganesha & our dear elders
                </p>
                <div className="my-4 rounded-lg border-2 border-[var(--color-gold)] py-3">
                  <p className="font-display text-base font-bold text-[var(--color-maroon)]">
                    PATEL FAMILY <span className="text-[var(--color-gold)]">&</span> SHAH FAMILY
                  </p>
                </div>
                <p className="text-sm">Cordially invite you to celebrate the</p>
                <div className="my-4 rounded-lg bg-[var(--color-maroon)] py-4 text-[var(--color-gold-light)]">
                  <div className="text-2xl">💍</div>
                  <p className="font-guj text-2xl font-bold">સગાઈ</p>
                  <p className="font-display text-sm tracking-[0.4em]">ENGAGEMENT</p>
                </div>
                <p className="text-xs italic text-[var(--color-ink)]/70">~ of ~</p>
                <h2 className="my-3 font-display text-3xl font-black text-[var(--color-maroon)]">
                  <span className="text-[var(--color-gold)]">✦</span> RAHUL{" "}
                  <span className="text-[var(--color-gold)]">&</span> PRIYA{" "}
                  <span className="text-[var(--color-gold)]">✦</span>
                </h2>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  { i: "📅", t: "Sunday, 28th June 2026", s: "અષાઢ સુદ ત્રીજ" },
                  { i: "🕐", t: "11:00 AM Onwards", s: "Muhurat: 11:30 AM" },
                  { i: "📍", t: "The Grand Celebration Hall", s: "Rajkot, Gujarat" },
                  { i: "👔", t: "Dress Code", s: "Traditional / Ethnic" },
                ].map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-l-4 border-[var(--color-gold)] bg-white/60 px-3 py-2 rounded-r-md"
                  >
                    <span className="text-xl">{d.i}</span>
                    <div>
                      <p className="font-semibold text-[var(--color-maroon)]">{d.t}</p>
                      <p className="text-xs text-[var(--color-ink)]/70">{d.s}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            {/* TIMELINE */}
            <section className="rounded-2xl bg-[var(--color-cream)]/95 p-6 ring-2 ring-[var(--color-gold)]/60">
              <h3 className="text-center font-guj text-2xl font-bold text-[var(--color-maroon)]">
                શુભ કાર્યક્રમ
              </h3>
              <p className="text-center text-xs uppercase tracking-widest text-[var(--color-ink)]/60">
                Auspicious Events
              </p>
              <ol className="relative mt-6 ml-4 space-y-4 border-l-2 border-[var(--color-gold)] pl-6">
                {timeline.map((e, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[34px] top-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--color-gold)] text-xs ring-2 ring-[var(--color-cream)]">
                      {e.icon}
                    </span>
                    <div className="rounded-lg border border-[var(--color-gold)]/60 bg-white/70 p-3">
                      <div className="flex items-baseline justify-between">
                        <p className="font-display font-bold text-[var(--color-maroon)]">
                          {e.title}
                        </p>
                        <p className="text-xs font-semibold text-[var(--color-peacock)]">
                          {e.time}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-ink)]/70">{e.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* COUNTDOWN */}
            <section className="rounded-2xl bg-[var(--color-maroon)] p-6 text-center text-[var(--color-gold-light)] ring-2 ring-[var(--color-gold)]">
              <p className="font-display tracking-[0.3em]">⏳ COUNTING DOWN ⏳</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { l: "DAYS", v: days },
                  { l: "HOURS", v: hours },
                  { l: "MINS", v: mins },
                ].map((c) => (
                  <div key={c.l} className="rounded-xl bg-black/30 py-4 ring-1 ring-[var(--color-gold)]/60">
                    <div className="font-display text-4xl font-black text-[var(--color-gold)]">
                      {c.v}
                    </div>
                    <div className="mt-1 text-[10px] tracking-[0.3em]">{c.l}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* MAP */}
            <section className="rounded-2xl bg-[var(--color-cream)] p-4 ring-2 ring-[var(--color-gold)]/60">
              <p className="mb-3 text-center font-display font-bold text-[var(--color-maroon)]">
                📍 Venue Location
              </p>
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
                className="mt-3 block rounded-lg bg-[var(--color-peacock)] py-3 text-center font-semibold text-white active:scale-[0.98]"
              >
                🗺️ Get Directions
              </a>
            </section>

            {/* RSVP */}
            <section className="rounded-2xl bg-[var(--color-cream)] p-6 text-center ring-2 ring-[var(--color-gold)]/60">
              <p className="font-guj text-lg font-bold text-[var(--color-maroon)]">
                આશીર્વાદ આપવા પધારો
              </p>
              <p className="text-xs italic text-[var(--color-ink)]/70">
                Grace us with your blessings
              </p>
              <div className="mt-4 space-y-3">
                <button
                  onClick={triggerRsvp}
                  disabled={rsvpDone}
                  className="w-full rounded-xl bg-gradient-to-r from-[var(--color-maroon)] to-[#a8002b] py-3 font-semibold text-[var(--color-gold-light)] shadow-lg active:scale-[0.98] disabled:opacity-80"
                >
                  {rsvpDone ? "Thank You! ✓" : "💚 Yes, We'll Attend!"}
                </button>
                <button
                  onClick={downloadIcs}
                  className="w-full rounded-xl border-2 border-[var(--color-gold)] bg-white py-3 font-semibold text-[var(--color-maroon)] active:scale-[0.98]"
                >
                  📅 Add to Calendar
                </button>
                <button
                  onClick={shareWhatsApp}
                  className="w-full rounded-xl bg-[#25D366] py-3 font-semibold text-white active:scale-[0.98]"
                >
                  📤 Share on WhatsApp
                </button>
              </div>
              <div className="mt-5">
                <a
                  href={`tel:${CONFIG.contact.replace(/\s/g, "")}`}
                  className="font-display text-[var(--color-peacock)]"
                >
                  📞 {CONFIG.contact}
                </a>
              </div>
            </section>

            <footer className="pt-2 text-center text-[var(--color-gold-light)]">
              <p className="text-lg">🪔 ════════ 🪔</p>
              <p className="mt-2 text-sm">
                Made with <span className="text-[#ff6b8a]">❤️</span> for Rahul & Priya
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
    </div>
  );
}
