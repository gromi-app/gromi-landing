import { useState, useRef } from "react";
import { supabase } from "./supabase.js";

const GROMI_IMG = "/gromi-logo.jpg";

const Gromi = ({ size = 120 }) => (
  <div style={{ width: size, height: size, display: "inline-block", animation: "gromiFloat 3s ease-in-out infinite" }}>
    <style>{`@keyframes gromiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    <img src={GROMI_IMG} alt="Gromi" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "24%", display: "block" }} />
  </div>
);

const Blob = ({ size, color, top, left, right, bottom, opacity = 0.15 }) => (
  <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: color, opacity, top, left, right, bottom, filter: "blur(2px)", pointerEvents: "none" }} />
);


const Carousel = ({ screens }) => {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);
  const dragDelta = useRef(0);
  const [offset, setOffset] = useState(0);
  const dragging = useRef(false);
  const n = screens.length;

  const goTo = (i) => { setCurrent(Math.max(0, Math.min(n - 1, i))); setOffset(0); };
  const onStart = (x) => { startX.current = x; dragging.current = true; };
  const onMove = (x) => { if (!dragging.current) return; dragDelta.current = x - startX.current; setOffset(dragDelta.current); };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragDelta.current < -50) goTo(current + 1);
    else if (dragDelta.current > 50) goTo(current - 1);
    else setOffset(0);
  };

  return (
    <div style={{ maxWidth: 320, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        {/* Flèches */}
        {[["←", -1], ["→", 1]].map(([arrow, dir]) => {
          const disabled = dir === -1 ? current === 0 : current === n - 1;
          return (
            <button key={dir} onClick={() => goTo(current + dir)} disabled={disabled} style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              [dir === -1 ? "left" : "right"]: -18,
              width: 34, height: 34, borderRadius: "50%", border: "none",
              background: disabled ? "transparent" : "#fff",
              boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.12)",
              cursor: disabled ? "default" : "pointer",
              color: disabled ? "#D4C8C0" : "#463B33",
              fontSize: 15, fontWeight: 700, zIndex: 3,
            }}>{arrow}</button>
          );
        })}
        {/* Images */}
        <div style={{ overflow: "hidden", borderRadius: 32, userSelect: "none", touchAction: "pan-y", cursor: "grab" }}
          onMouseDown={(e) => onStart(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onEnd}
        >
          <div style={{ display: "flex", transform: `translateX(calc(${-current * 100}% + ${offset}px))`, transition: offset === 0 ? "transform 0.35s cubic-bezier(.4,0,.2,1)" : "none" }}>
            {screens.map((src, i) => (
              <div key={i} style={{ minWidth: "100%" }}>
                <img src={src} alt={`Écran ${i + 1}`} style={{ width: "100%", display: "block", pointerEvents: "none" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
        {screens.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 22 : 7, height: 7, borderRadius: 4, border: "none", padding: 0, cursor: "pointer",
            background: i === current ? "#D9612F" : "#E2D3BF", transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
};

const AGE_RANGES = ["0–1 an", "1–3 ans", "3–6 ans", "6–9 ans", "9–12 ans"];
const BOOK_AGE_RANGES = ["Tous les âges", "3-6 ans", "6-8 ans", "8-10 ans"];
const orange = "#FF8A5B";

const ACTIVITY_BOOKS = [
  { slug: "cirque", icon: "🎪", title: "Le cahier du cirque", subtitle: "Équilibre, jonglage et tracés", pitch: "Un cahier ludique pour bouger, viser, tracer et renforcer les bases du geste graphique.", ageRange: "3-6 ans", color: "#D96B7C", downloadUrl: "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-cirque.pdf" },
  { slug: "dinosaures", icon: "🦕", title: "Le cahier des dinosaures", subtitle: "Découpage, graphisme et repérage", pitch: "Des activités autour des dinosaures pour travailler la précision, les repères et la motricité fine.", ageRange: "3-6 ans", color: "#61B276", downloadUrl: "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-dinosaures.pdf" },
  { slug: "super-heros", icon: "⚡", title: "Le cahier des super-héros", subtitle: "Coordination, attention et confiance", pitch: "Des défis progressifs pour entraîner l'attention, la coordination et l'envie d'oser.", ageRange: "6-8 ans", color: "#E8A23F", downloadUrl: "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-super-heros.pdf" },
  { slug: "pirates", icon: "🏴‍☠️", title: "Le cahier des pirates", subtitle: "Orientation, logique et motricité fine", pitch: "Un univers d'aventure pour suivre des consignes, s'orienter et organiser ses gestes.", ageRange: "6-8 ans", color: "#5BA8B8", downloadUrl: "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-pirates.pdf" },
  { slug: "espace", icon: "🚀", title: "Le cahier de l'espace", subtitle: "Planification, rythme et précision", pitch: "Des missions pour préparer la main, le regard et l'organisation nécessaires aux apprentissages.", ageRange: "8-10 ans", color: "#8975C9", downloadUrl: "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-espace.pdf" },
  { slug: "fonds-marins", icon: "🌊", title: "Le cahier des fonds marins", subtitle: "Repérage, mémoire et graphisme", pitch: "Des activités calmes et précises pour travailler le repérage, la mémoire et le graphisme.", ageRange: "8-10 ans", color: "#4E9FC9", downloadUrl: "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-fonds-marins.pdf" },
];

const Section = ({ children, bg = "transparent", className, style: sx = {} }) => (
  <section className={className} style={{ padding: "56px 24px", background: bg, position: "relative", ...sx }}>{children}</section>
);

const Center = ({ children, max = 600 }) => <div style={{ maxWidth: max, margin: "0 auto" }}>{children}</div>;

const StepTitle = ({ number, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
    <div style={{ width: 42, height: 42, borderRadius: 13, background: "#214E78", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{number}</div>
    <h2 style={{ fontSize: "clamp(20px, 2.4vw, 27px)", lineHeight: 1.15, fontWeight: 800, color: "#463B33" }}>{children}</h2>
  </div>
);

const ActivityBooksPage = ({ initialBookSlug = null }) => {
  const initialBook = ACTIVITY_BOOKS.find((book) => book.slug === initialBookSlug) ?? null;
  const isBookLanding = Boolean(initialBook);
  const shouldShowCatalog = !initialBookSlug;
  const [selectedAge, setSelectedAge] = useState(initialBook?.ageRange ?? "Tous les âges");
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const visibleBooks = isBookLanding
    ? [initialBook]
    : ACTIVITY_BOOKS.filter((book) => selectedAge === "Tous les âges" || book.ageRange === selectedAge);
  const chosenBook = selectedBook && visibleBooks.some((book) => book.slug === selectedBook.slug) ? selectedBook : null;

  const submitBookRequest = async () => {
    if (!chosenBook) { setError("Choisissez le cahier que vous voulez recevoir."); return; }
    if (!email.includes("@")) { setError("Adresse email invalide."); return; }
    setLoading(true);
    setError("");
    const { error: sbError } = await supabase.from("activity_book_waitlist").insert({
      email: email.trim().toLowerCase(),
      child_age_range: selectedAge,
      book_slug: chosenBook.slug,
      book_title: chosenBook.title,
    });
    setLoading(false);
    if (sbError && sbError.code !== "23505") {
      setError("Une erreur est survenue, réessayez.");
      return;
    }
    if (chosenBook.downloadUrl) {
      fetch("/send-book-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          bookTitle: chosenBook.title,
          downloadUrl: chosenBook.downloadUrl,
        }),
      }).catch(() => {});
    }
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'Quicksand', system-ui, sans-serif", color: "#463B33", background: "#FFFAF6", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*{margin:0;padding:0;box-sizing:border-box}a{color:inherit;text-decoration:none}input:focus{outline:none;border-color:#FF8A5B!important}`}</style>

      <div style={{ background: "#FFFAF6", padding: "24px 24px 8px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#7E7064", fontSize: 13, fontWeight: 700 }}>
            ← Découvrir Gromi
          </a>
        </div>
      </div>

      <section style={{ padding: "30px 24px 54px", textAlign: "center", background: "#FFFAF6" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFE7DA", borderRadius: 999, padding: "10px 28px", marginBottom: 24 }}>
            <span style={{ fontSize: 19 }}>👩‍⚕️</span>
            <span style={{ fontWeight: 800, color: "#D9612F", fontSize: "clamp(14px, 2vw, 20px)" }}>Créés par une psychomotricienne D.E.</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.1, color: "#463B33", fontWeight: 800 }}>
            {isBookLanding ? <>Recevoir<br />{initialBook.title}</> : <>Des cahiers d'activités,<br />offerts.</>}
          </h1>
          <p style={{ fontSize: "clamp(17px, 2vw, 22px)", lineHeight: 1.6, color: "#7E7064", maxWidth: 820, margin: "26px auto 0" }}>
            {isBookLanding ? (
              <>{initialBook.pitch} Ce cahier est <strong style={{ color: "#463B33", fontWeight: 800 }}>gratuit</strong> : laissez votre email, je vous l'envoie.</>
            ) : (
              <>Le cirque, les dinosaures, les super-héros, les pirates, l'espace, les fonds marins... Ces cahiers étaient vendus en boutique. Aujourd'hui ils sont <strong style={{ color: "#463B33", fontWeight: 800 }}>gratuits</strong> : choisissez celui qui correspond à votre enfant, je vous l'envoie par email.</>
            )}
          </p>
        </div>
      </section>

      <main style={{ background: "#fff", padding: "44px 24px 58px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          {shouldShowCatalog && (
            <>
              <StepTitle number="1">L'âge de votre enfant</StepTitle>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 50 }}>
                {BOOK_AGE_RANGES.map((age) => {
                  const active = selectedAge === age;
                  return (
                    <button key={age} onClick={() => { setSelectedAge(age); setSelectedBook(null); }} style={{
                      border: active ? "2px solid #FF8A5B" : "3px solid #F1D7BE",
                      background: active ? "#FF8A5B" : "#fff",
                      color: active ? "#214E78" : "#7E7064",
                      borderRadius: 28,
                      padding: "15px 26px",
                      minHeight: 62,
                      fontFamily: "inherit",
                      fontSize: "clamp(15px, 1.5vw, 20px)",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: active ? "0 12px 28px rgba(255,138,91,0.22)" : "none",
                    }}>{age}</button>
                  );
                })}
              </div>
            </>
          )}

          <StepTitle number={isBookLanding ? "1" : "2"}>{isBookLanding ? "Le cahier offert" : "Le cahier que vous voulez recevoir"}</StepTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 50 }}>
            {visibleBooks.map((book) => {
              const active = chosenBook?.slug === book.slug;
              return (
                <button key={book.slug} onClick={() => setSelectedBook(book)} disabled={isBookLanding} style={{
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "left",
                  minHeight: 176,
                  border: active ? `3px solid ${book.color}` : "2px solid transparent",
                  background: "#FFFAF6",
                  borderRadius: 28,
                  padding: "24px 28px 22px 46px",
                  fontFamily: "inherit",
                  cursor: isBookLanding ? "default" : "pointer",
                  boxShadow: active ? "0 18px 34px rgba(120,90,60,0.16)" : "0 14px 34px rgba(120,90,60,0.08)",
                }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: book.color }} />
                  <div style={{ fontSize: 23, marginBottom: 14 }}>{book.icon}</div>
                  <h3 style={{ fontSize: "clamp(19px, 2vw, 24px)", lineHeight: 1.15, fontWeight: 800, color: "#463B33", marginBottom: 9 }}>{book.title}</h3>
                  <p style={{ color: "#7E7064", fontSize: "clamp(15px, 1.45vw, 18px)", lineHeight: 1.35, marginBottom: 16 }}>{book.subtitle}</p>
                  <strong style={{ color: book.color, fontSize: "clamp(15px, 1.45vw, 18px)", fontWeight: 800 }}>{book.ageRange}</strong>
                  {isBookLanding && <p style={{ color: "#7E7064", fontSize: 14, lineHeight: 1.5, marginTop: 14 }}>{book.pitch}</p>}
                  {active && <div style={{ position: "absolute", right: 22, top: 22, width: 34, height: 34, borderRadius: "50%", background: book.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</div>}
                </button>
              );
            })}
          </div>

          <StepTitle number={isBookLanding ? "2" : "3"}>Votre email</StepTitle>
          <div style={{ background: "#FFFAF6", borderRadius: 26, padding: "26px", boxShadow: "0 16px 40px rgba(120,90,60,0.08)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "18px" }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>✅</div>
                <h2 style={{ fontSize: 27, fontWeight: 800, marginBottom: 8 }}>C'est noté !</h2>
                <p style={{ fontSize: 17, lineHeight: 1.6, color: "#7E7064" }}>Votre demande est enregistrée. Je vous enverrai le cahier par email.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 16, color: "#7E7064", lineHeight: 1.6, marginBottom: 18 }}>
                  {isBookLanding ? `Ajoutez votre email pour recevoir ${chosenBook?.title ?? "ce cahier"}.` : "Choisissez un cahier, ajoutez votre email, et je saurai exactement lequel vous envoyer."}
                </p>
                <form action="/send-book-email" method="POST" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <input type="hidden" name="bookTitle" value={chosenBook?.title ?? ""} />
                  <input type="hidden" name="bookSlug" value={chosenBook?.slug ?? ""} />
                  <input type="hidden" name="childAgeRange" value={selectedAge} />
                  <input type="hidden" name="downloadUrl" value={chosenBook?.downloadUrl ?? ""} />
                  <input type="email" name="email" required placeholder="votre@email.com" defaultValue={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: "1 1 260px", border: "2px solid #F1D7BE", borderRadius: 16, padding: "15px 18px", fontSize: 16, fontFamily: "inherit", fontWeight: 700, color: "#463B33", background: "#fff" }} />
                  <button type="submit" style={{ border: "none", borderRadius: 16, background: "#FF8A5B", color: "#214E78", padding: "15px 24px", fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 24px rgba(255,138,91,0.28)", opacity: 1 }}>
                    Recevoir le cahier
                  </button>
                </form>
                {chosenBook && <p style={{ marginTop: 14, color: "#7E7064", fontSize: 14 }}>Cahier sélectionné : <strong style={{ color: "#463B33" }}>{chosenBook.title}</strong></p>}
                {error && <p style={{ marginTop: 12, color: "#C94F5D", fontSize: 14, fontWeight: 700 }}>{error}</p>}
              </>
            )}
          </div>
        </div>
      </main>

      <section style={{ padding: "54px 24px 74px", textAlign: "center", background: "#fff" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(31px, 4vw, 43px)", lineHeight: 1.18, color: "#463B33", fontWeight: 800, marginBottom: 24 }}>
            Le problème des cahiers,<br />c'est qu'ils s'arrêtent.
          </h2>
          <p style={{ fontSize: "clamp(17px, 2vw, 23px)", lineHeight: 1.6, color: "#7E7064", maxWidth: 860, margin: "0 auto 40px" }}>
            Votre enfant, lui, continue de grandir. <strong style={{ color: "#463B33", fontWeight: 800 }}>Gromi</strong> est l'app que je construis pour prendre le relais : un bilan psychomoteur, puis une activité adaptée chaque jour, de la naissance à 12 ans.
          </p>

          {[
            { color: "#5B95D6", title: "Un bilan des acquisitions de votre enfant", text: "Vous situez précisément votre enfant sur les 5 domaines du développement." },
            { color: "#61B276", title: "Une activité par jour, 10-15 min", text: "Avec le matériel de la maison, choisie pour SON âge et SES besoins." },
            { color: "#8067C8", title: "Des progrès que vous voyez", text: "On réévalue régulièrement : les acquis se débloquent sous vos yeux." },
          ].map((item) => (
            <div key={item.title} style={{ background: "#FFFAF6", borderRadius: 24, padding: "24px 28px", marginBottom: 16, display: "flex", gap: 22, textAlign: "left", alignItems: "center" }}>
              <div style={{ width: 14, height: 74, borderRadius: 999, background: item.color, flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.25, fontWeight: 800, color: "#463B33", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: "clamp(15px, 1.6vw, 19px)", lineHeight: 1.45, color: "#7E7064" }}>{item.text}</p>
              </div>
            </div>
          ))}

          <a href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 18, padding: "15px 24px", background: "#FF8A5B", color: "#214E78", fontSize: 16, fontWeight: 800, boxShadow: "0 10px 24px rgba(255,138,91,0.24)", marginTop: 30 }}>
            Découvrir Gromi, l'application
          </a>
          <p style={{ fontSize: "clamp(16px, 1.8vw, 20px)", lineHeight: 1.55, color: "#7E7064", fontStyle: "italic", marginTop: 22 }}>
            Votre psychomotricienne de poche, pour accompagner le développement de votre enfant jour après jour.
          </p>
        </div>
      </section>

      <footer style={{ background: "#214E78", color: "#DDEAFB", padding: "42px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#F5EDE2", marginBottom: 12 }}>Gromi</div>
          <div style={{ fontSize: 18 }}>L'app créée par Club Ludique</div>
        </div>
      </footer>
    </div>
  );
};

const EmailBox = ({ email, setEmail, ageRange, setAgeRange, submitted, loading, error, onSubmit }) => {
  if (submitted) return (
    <div style={{ background: "#D6EFDF", borderRadius: 20, padding: "18px 24px", maxWidth: 400, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 24 }}>✅</span>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontWeight: 800 }}>C'est noté !</div>
        <div style={{ fontSize: 13, color: "#2A7D52" }}>On vous envoie un email dès que Gromi est dispo.</div>
      </div>
    </div>
  );
  return (
    <div className="email-box" style={{ maxWidth: 420, margin: "0 auto", background: "#FFFAF6", borderRadius: 24, padding: 20, color: "#463B33" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#7E7064", marginBottom: 10, textAlign: "center" }}>
        Quel âge a votre enfant ?
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
        {AGE_RANGES.map(a => (
          <button key={a} onClick={() => setAgeRange(a)} style={{
            padding: "8px 14px", borderRadius: 20, border: `2px solid ${ageRange === a ? orange : "#E2D3BF"}`,
            background: ageRange === a ? "#FFF0E5" : "#fff",
            color: ageRange === a ? "#463B33" : "#7E7064",
            fontWeight: 700, fontSize: 13, fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
          }}>{a}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit()}
          style={{ flex: "1 1 200px", padding: "14px 18px", borderRadius: 14, border: "2px solid #E2D3BF", fontSize: 14, fontFamily: "inherit", fontWeight: 600, color: "#463B33", background: "#fff", minWidth: 180 }} />
        <button onClick={onSubmit} disabled={loading}
          style={{ padding: "14px 22px", borderRadius: 14, border: "none", background: orange, color: "#214E78", fontSize: 14, fontWeight: 800, fontFamily: "inherit", cursor: loading ? "wait" : "pointer", boxShadow: "0 4px 20px rgba(255,138,91,0.35)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
          {loading ? "…" : "Je veux être prévenu 🚀"}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: "#D4727B", marginTop: 8, textAlign: "center" }}>{error}</p>}
    </div>
  );
};

export default function LandingPage({ initialPath = "/" }) {
  const path = typeof window !== "undefined" ? window.location.pathname : initialPath;
  const [email, setEmail] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const P = { rose: "#FCDFE9", bleu: "#DDEAFB", vert: "#D4F1ED", jaune: "#F0DCA0", peche: "#FFE7DA", lilas: "#ECE1FA" };

  const handleSubmit = async () => {
    if (!email.includes("@")) { setError("Adresse email invalide."); return; }
    if (!ageRange) { setError("Sélectionnez l'âge de votre enfant."); return; }
    setError(""); setLoading(true);
    const { error: sbError } = await supabase.from("waitlist").insert({ email, child_age_range: ageRange });
    if (sbError && sbError.code !== "23505") { setLoading(false); setError("Une erreur est survenue, réessayez."); return; }
    // Envoi email de confirmation via Cloudflare Function
    await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSubmitted(true);
  };

  const boxProps = { email, setEmail, ageRange, setAgeRange, submitted, loading, error, onSubmit: handleSubmit };

  const bookPathMatch = path.match(/^\/cahiers\/([^/]+)\/?$/);
  if (bookPathMatch) {
    return <ActivityBooksPage initialBookSlug={bookPathMatch[1]} />;
  }
  if (path === "/cahiers" || path === "/cahiers/") {
    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
    return null;
  }

  return (
    <div style={{ fontFamily: "'Quicksand', system-ui, sans-serif", color: "#463B33", background: "#FFFFFF", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*{margin:0;padding:0;box-sizing:border-box}a{color:inherit;text-decoration:none}input:focus{outline:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp .8s ease forwards}.fu2{animation:fadeUp .8s ease .15s forwards;opacity:0}.fu3{animation:fadeUp .8s ease .3s forwards;opacity:0}.fu4{animation:fadeUp .8s ease .45s forwards;opacity:0}
      `}</style>

      {/* ============ HERO — Émotionnel, la peur du parent ============ */}
      <Section className="brand-dark" bg="#214E78" style={{ padding: "60px 24px 70px", textAlign: "center", overflow: "hidden", color: "#FFFFFF" }}>
        <Blob size={200} color={P.rose} top={-60} left={-80} />
        <Blob size={150} color={P.bleu} top={30} right={-60} />
        <Center max={560}>
          <div className="fu1" style={{ position: "relative" }}><Gromi size={120} /></div>
          <h1 className="fu2" style={{ fontSize: "clamp(28px, 7vw, 44px)", fontWeight: 800, lineHeight: 1.15, marginTop: 16, position: "relative" }}>
            « Est-ce que mon enfant<br />se développe <span style={{ color: "#D9612F" }}>bien</span> ? »
          </h1>
          <p className="fu3" style={{ fontSize: 17, color: "#7E7064", marginTop: 14, lineHeight: 1.6, position: "relative" }}>
            Vous vous posez cette question. Tous les parents se la posent. De la naissance jusqu'à 12 ans, <strong style={{ color: "#D9612F", fontWeight: 800 }}>Gromi</strong> vous donne la réponse — et les outils pour l'accompagner à chaque étape.
          </p>
          <div className="fu4" style={{ marginTop: 28, position: "relative" }}>
            <EmailBox {...boxProps} />
            <p style={{ fontSize: 12, color: "#C4BAB0", marginTop: 10 }}>Gratuit. Pas de spam. Juste un email le jour du lancement.</p>
            <a href="/cahiers" style={{ display: "inline-flex", marginTop: 18, alignItems: "center", justifyContent: "center", borderRadius: 16, padding: "13px 18px", background: "#FFF0E5", color: "#D9612F", fontSize: 14, fontWeight: 800, boxShadow: "0 4px 16px rgba(180,120,70,0.12)" }}>
              Recevoir un cahier d'activités gratuit
            </a>
          </div>
        </Center>
      </Section>

      {/* ============ VIDÉO ============ */}
      <Section style={{ padding: "56px 24px", textAlign: "center" }}>
        <Center max={480}>
          <h2 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 800, marginBottom: 8 }}>
            Louise vous explique tout en 1 minute
          </h2>
          <p style={{ fontSize: 15, color: "#7E7064", marginBottom: 28 }}>
            Psychomotricienne D.E. &amp; créatrice de Club Ludique
          </p>
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: 340,
            margin: "0 auto",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(180,140,100,0.18)",
            aspectRatio: "9/16",
          }}>
            <iframe
              src="https://www.youtube.com/embed/u2y3216bnSQ"
              title="Gromi — Louise explique le concept"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </Center>
      </Section>

      {/* ============ STAT CHOC ============ */}
      <div style={{ background: "#214E78", padding: "48px 24px", textAlign: "center" }}>
        <Center max={580}>
          <div style={{ fontSize: "clamp(52px, 12vw, 80px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1, letterSpacing: "-2px" }}>
            100%
          </div>
          <div style={{ width: 48, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2, margin: "16px auto" }} />
          <p style={{ fontSize: "clamp(15px, 3.5vw, 20px)", color: "#FFFFFF", fontWeight: 600, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            Pendant la petite enfance, <strong style={{ fontWeight: 800 }}>100 % des apprentissages fondamentaux</strong> (lecture, écriture, concentration) dépendent d'un bon socle psychomoteur.
          </p>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "rgba(255,255,255,0.75)", marginTop: 16, lineHeight: 1.7 }}>
            Pourtant, <strong style={{ color: "#FFFFFF" }}>les parents manquent d'outils pour les accompagner au quotidien.</strong>
          </p>
        </Center>
      </div>

      {/* ============ LES DOUTES ============ */}
      <Section bg="#FFF0E5">
        <Center>
          <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
            Vous reconnaissez-vous ?
          </h2>
          {[
            { q: "« Les enfants de mes amies marchent déjà, pas le mien… »", a: <span>Chaque enfant a son rythme. Mais <strong style={{color:"#D9612F"}}>savoir OÙ il en est et QUOI faire</strong> pour l'accompagner, ça change tout.</span>, e: "😟" },
            { q: "« Il ne tient pas en place, il n'arrive pas à se concentrer »", a: <span>Ce n'est peut-être pas un problème de comportement — c'est peut-être <strong style={{color:"#D9612F"}}>un besoin psychomoteur non comblé.</strong></span>, e: "🤯" },
            { q: "« En CE2 son écriture est illisible, il déteste écrire »", a: <span>L'écriture c'est motricité fine + tonus + coordination. <strong style={{color:"#D9612F"}}>Des exercices ciblés peuvent tout débloquer.</strong></span>, e: "✏️" },
            { q: "« Je ne sais pas si je stimule assez mon enfant »", a: <span>Pas besoin d'être experte. <strong style={{color:"#D9612F"}}>10 minutes par jour</strong> d'activité adaptée font une vraie différence, à tout âge.</span>, e: "😰" },
            { q: "« En CM1 il est maladroit, il se cogne partout, il casse tout »", a: <span>La maladresse n'est pas un trait de caractère — <strong style={{color:"#D9612F"}}>c'est un schéma corporel et une coordination qui se travaillent.</strong></span>, e: "💥" },
            { q: "« Le pédiatre dit que tout va bien mais j'ai un doute »", a: <span>Le pédiatre vérifie la santé. <strong style={{color:"#D9612F"}}>La psychomotricité, c'est le développement global.</strong> Ce n'est pas la même chose.</span>, e: "🤔" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 22px", marginBottom: 12, boxShadow: "0 2px 12px rgba(180,80,60,0.07)", border: "1px solid #F1D7BE" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{item.e}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#463B33", fontStyle: "italic", lineHeight: 1.4 }}>{item.q}</div>
                  <div style={{ fontSize: 13, color: "#7E7064", marginTop: 6, lineHeight: 1.7 }}>{item.a}</div>
                </div>
              </div>
            </div>
          ))}
        </Center>
      </Section>

      {/* ============ LA SOLUTION ============ */}
      <Section>
        <Center>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: P.peche, borderRadius: 20, padding: "8px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>👩‍⚕️</span>
              <span style={{ fontWeight: 700, fontSize: 12, color: "#D9612F" }}>Créée par une psychomotricienne D.E.</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
              Gromi sait exactement<br />ce dont votre enfant a besoin
            </h2>
            <p style={{ fontSize: 15, color: "#7E7064", marginTop: 10 }}>Pas de contenu générique. Chaque activité cible un jalon de développement précis.</p>
          </div>

          {[
            { icon: "📋", title: "Un vrai bilan psychomoteur", desc: "20 questions pour évaluer 8 domaines du développement. En 3 minutes. Vous savez exactement où en est votre enfant.", bg: P.bleu },
            { icon: "🤸", title: "1 activité par jour, 10-15 min", desc: "Gromi choisit l'activité parfaite pour VOTRE enfant, selon SES besoins. Pas ceux du voisin.", bg: P.vert },
            { icon: "📈", title: "Vous voyez les progrès", desc: "Chaque mois, réévaluez. Vous voyez les jalons passer de « en cours » à « acquis ». C'est concret.", bg: P.jaune },
          ].map((f, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 22, padding: 22, marginBottom: 12,
              display: "flex", gap: 16, alignItems: "flex-start",
              boxShadow: "0 3px 15px rgba(180,160,140,0.1)",
            }}>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "#463B33" }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#7E7064", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </Center>
      </Section>

      {/* ============ SCREENSHOTS CAROUSEL ============ */}
      <Section bg="#fff">
        <Center max={420}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF0E5", borderRadius: 20, padding: "6px 16px", marginBottom: 14 }}>
              <span style={{ fontSize: 14 }}>📱</span>
              <span style={{ fontWeight: 700, fontSize: 12, color: "#D9612F" }}>L'application en vrai</span>
            </div>
            <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#463B33", lineHeight: 1.3 }}>
              Activité · Progression · Bilan
            </h2>
            <p style={{ fontSize: 13, color: "#7E7064", marginTop: 6 }}>Glissez pour voir les écrans</p>
          </div>
          <Carousel screens={["/capture-accueil.png", "/capture-bilan.png", "/capture-resultats-bilan.png", "/capture-progres.png"]} />
        </Center>
      </Section>

      {/* ============ TÉMOIGNAGES (fictifs pour le prototype) ============ */}
      <Section bg="#D4F1ED">
        <Center>
          <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
            Ils ont testé. Ils recommandent.
          </h2>
          {[
            { name: "Marie, maman de Lucas (18 mois)", text: "Je me sentais perdue face à son retard de marche. Gromi m'a montré que tout était normal ET m'a donné les exercices pour l'accompagner. Il marche depuis 3 semaines.", stars: 5 },
            { name: "Sophie, maman de Léa (5 ans)", text: "L'école me disait qu'elle avait du mal à se concentrer. Avec Gromi, on fait 10 min d'activité chaque soir. Sa maîtresse a vu la différence en 1 mois.", stars: 5 },
            { name: "Thomas, papa de Noah (8 mois)", text: "Je ne savais pas quoi faire avec un bébé. Gromi me dit exactement quoi faire chaque jour. C'est devenu notre moment père-fils.", stars: 5 },
            { name: "Claire, maman d'Adam (9 ans)", text: "Son écriture était catastrophique, il détestait les devoirs. Avec les activités de motricité fine et de coordination, il a repris confiance. Maintenant il écrit sans se plaindre.", stars: 5 },
          ].map((t, i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 22px", marginBottom: 10, boxShadow: "0 2px 12px rgba(100,140,200,0.08)" }}>
              <div style={{ fontSize: 14, color: orange, marginBottom: 4 }}>{"★".repeat(t.stars)}</div>
              <div style={{ fontSize: 14, color: "#463B33", lineHeight: 1.7, fontStyle: "italic", marginBottom: 8, borderLeft: "3px solid #FFE7DA", paddingLeft: 12 }}>« {t.text} »</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7E7064" }}>— {t.name}</div>
            </div>
          ))}
        </Center>
      </Section>

      {/* ============ OBJECTIONS ============ */}
      <Section>
        <Center>
          <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
            Vos questions, nos réponses
          </h2>
          {[
            { q: "Mon enfant n'a aucun problème, c'est quand même utile ?", a: "Absolument. Gromi n'est pas pour les enfants « en difficulté ». C'est pour TOUS les enfants — comme le sport entretient un corps sain, la psychomotricité entretient un développement sain." },
            { q: "10 minutes par jour, ça suffit vraiment ?", a: "Oui. La régularité bat l'intensité. 10 min/jour d'activité ciblée, c'est un vrai complément au quotidien. Ça ne remplace pas un suivi professionnel si nécessaire, mais ça fait une vraie différence pour tous les enfants." },
            { q: "C'est différent de YouTube ou des blogs parentalité ?", a: "Totalement. Gromi s'adapte à VOTRE enfant, à SON âge exact, à SES jalons en cours. Ce n'est pas du contenu générique — c'est un programme personnalisé créé par une psychomotricienne." },
            { q: "Je ne suis pas professionnelle, je vais savoir faire ?", a: "Chaque activité est expliquée étape par étape, avec le matériel du quotidien. C'est fait pour les parents, pas pour les pros. Si vous savez jouer avec votre enfant, vous savez utiliser Gromi." },
            { q: "C'est adapté aussi aux enfants plus grands (6-12 ans) ?", a: "Oui ! Concentration, écriture, coordination, gestion des émotions, confiance en soi — ce sont des enjeux majeurs en primaire. Gromi couvre de la naissance jusqu'à 12 ans avec des activités adaptées à chaque âge." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "18px 20px", marginBottom: 8, boxShadow: "0 2px 10px rgba(180,160,140,0.08)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#463B33", marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: 13, color: "#7E7064", lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </Center>
      </Section>

      {/* ============ QUI SUIS-JE ============ */}
      <Section>
        <Center max={500}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: P.peche, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 14px" }}>👩‍⚕️</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Qui est derrière Gromi ?</h2>
            <p style={{ fontSize: 14, color: "#7E7064", lineHeight: 1.7 }}>
              Psychomotricienne diplômée d'État, j'accompagne les enfants et leurs parents depuis des années. Sur TikTok (<strong>Club Ludique</strong>, 90 000 abonnés), je partage déjà mes conseils au quotidien. Gromi, c'est tout ce que je sais — condensé dans une app qui s'adapte à votre enfant.
            </p>
            <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 800, marginTop: 16, background: "#214E78", borderRadius: 14, padding: "12px 18px", lineHeight: 1.5 }}>
              Chaque activité de Gromi, c'est ce que je ferais si votre enfant était dans mon cabinet.
            </p>
          </div>
        </Center>
      </Section>

      {/* ============ CTA FINAL — urgence émotionnelle ============ */}
      <Section className="brand-dark" bg="#214E78" style={{ padding: "60px 24px 70px", textAlign: "center" }}>

        <Center max={500}>
          <Gromi size={90} />
          <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 10, lineHeight: 1.2, color: "#FFFFFF" }}>
            Les premières années<br />ne se rattrapent pas.
          </h2>
          <p style={{ fontSize: 15, color: "#A09A92", marginTop: 10, marginBottom: 24, lineHeight: 1.6 }}>
            Le cerveau de votre enfant se développe à une vitesse incroyable.<br />
            <strong style={{ color: "#FFE7DA" }}>10 minutes par jour peuvent tout changer.</strong>
          </p>
          <EmailBox {...boxProps} />
          <p style={{ fontSize: 12, color: "#DDEAFB", marginTop: 10 }}>Lancement bientôt · Inscription gratuite · Pas de spam</p>
        </Center>
      </Section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: "#214E78", color: "#DDEAFB", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F5EDE2", marginBottom: 4 }}>Gromi</div>
          <div style={{ fontSize: 11, marginBottom: 12 }}>L'app créée par Club Ludique</div>
          <div style={{ fontSize: 10, display: "flex", gap: 14, justifyContent: "center", marginBottom: 12 }}>
            <span>Mentions légales</span><span>Confidentialité</span><span>Contact</span>
          </div>
          <div style={{ fontSize: 9, color: "#DDEAFB" }}>© 2026 Gromi · Fait avec ❤️ par une psychomotricienne D.E.</div>
        </div>
      </footer>
    </div>
  );
}
