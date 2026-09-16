import { useState, useRef } from "react";
import { supabase } from "./supabase.js";

const GROMI_IMG = "/gromi-logo-2026.png";

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
  const onStart = (x) => { startX.current = x; dragDelta.current = 0; dragging.current = true; };
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
            <button aria-label={dir === -1 ? "Écran précédent" : "Écran suivant"} key={dir} onClick={() => goTo(current + dir)} disabled={disabled} style={{
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
          <button aria-label={`Afficher l’écran ${i + 1}`} key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 22 : 7, height: 7, borderRadius: 4, border: "none", padding: 0, cursor: "pointer",
            background: i === current ? "#D9612F" : "#E2D3BF", transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
};

const AGE_RANGES = ["3–11 mois", "1–2 ans", "3–5 ans", "6–8 ans", "9–10 ans et 11 mois"];
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

const SiteFooter = () => <footer style={{ background: "#214E78", color: "#DDEAFB", padding: "30px 24px", textAlign: "center" }}>
  <strong style={{ fontSize: 22 }}>Gromi</strong><p style={{ margin: "8px 0 18px" }}>Apprendre et évoluer ensemble</p>
  <nav aria-label="Informations et assistance" style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", fontSize: 14 }}>
    <a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="/conditions-utilisation/">Conditions</a><a href="/assistance/">Assistance</a><a href="/suppression-compte/">Suppression du compte</a><a href="mailto:gromi.contact@gmail.com">Contact</a>
  </nav><p style={{ fontSize: 12, marginTop: 18 }}>© 2026 Gromi · Louise Calon Godet</p>
</footer>;

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
              <>Le cirque, les dinosaures, les super-héros, les pirates, l'espace, les fonds marins... Ces cahiers sont <strong style={{ color: "#463B33", fontWeight: 800 }}>gratuits</strong> : choisissez celui qui correspond à votre enfant, je vous l'envoie par email.</>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 18, marginBottom: 50 }}>
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
                <p style={{ fontSize: 13, marginBottom: 14 }}>Votre email et le cahier choisi servent à traiter votre demande. <a href="/confidentialite/" style={{ textDecoration: "underline" }}>Utilisation de vos données et contact</a>.</p>
                <form action="/send-book-email" method="POST" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <input type="hidden" name="bookTitle" value={chosenBook?.title ?? ""} />
                  <input type="hidden" name="bookSlug" value={chosenBook?.slug ?? ""} />
                  <input type="hidden" name="childAgeRange" value={selectedAge} />
                  <input type="hidden" name="downloadUrl" value={chosenBook?.downloadUrl ?? ""} />
                  <input type="email" name="email" required aria-label="Votre adresse email" placeholder="votre@email.com" defaultValue={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: "1 1 260px", border: "2px solid #F1D7BE", borderRadius: 16, padding: "15px 18px", fontSize: 16, fontFamily: "inherit", fontWeight: 700, color: "#463B33", background: "#fff" }} />
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
            Votre enfant, lui, continue de grandir. <strong style={{ color: "#463B33", fontWeight: 800 }}>Gromi</strong> est l'app que je construis pour prendre le relais : un questionnaire à partir de vos observations, puis des activités sans écran pour votre enfant, de 3 mois à 10 ans et 11 mois. Deux activités gratuites par semaine ; une activité quotidienne avec Premium au lancement.
          </p>

          {[
            { color: "#5B95D6", title: "Un bilan des acquisitions de votre enfant", text: "Vous faites le point sur vos observations dans cinq domaines adaptés à son âge. Ce questionnaire ne constitue pas un diagnostic." },
            { color: "#61B276", title: "Des activités avec le matériel de la maison", text: "Papier, feutres, ballon, oreillers… Vous lisez les consignes, votre enfant réalise l’activité sans écran." },
            { color: "#8067C8", title: "Un suivi au fil des mois", text: "Retrouvez vos observations et refaites le bilan mensuel pour adapter les activités." },
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
            Des idées pour apprendre et évoluer ensemble. Gromi ne remplace pas un bilan psychomoteur réalisé par un professionnel.
          </p>
        </div>
      </section>

      <SiteFooter />
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
        <input type="email" aria-label="Votre adresse email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit()}
          style={{ flex: "1 1 200px", padding: "14px 18px", borderRadius: 14, border: "2px solid #E2D3BF", fontSize: 14, fontFamily: "inherit", fontWeight: 600, color: "#463B33", background: "#fff", minWidth: 180 }} />
        <button onClick={onSubmit} disabled={loading}
          style={{ padding: "14px 22px", borderRadius: 14, border: "none", background: orange, color: "#214E78", fontSize: 14, fontWeight: 800, fontFamily: "inherit", cursor: loading ? "wait" : "pointer", boxShadow: "0 4px 20px rgba(255,138,91,0.35)", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}>
          {loading ? "…" : "Je veux être prévenu 🚀"}
        </button>
      </div>
      <p style={{ fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>Votre email et la tranche d’âge servent à l’alerte demandée. <a href="/confidentialite/" style={{ textDecoration: "underline" }}>Utilisation de vos données et contact</a>.</p>
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
    return <ActivityBooksPage />;
  }

  return (
    <div style={{ fontFamily: "'Quicksand', system-ui, sans-serif", color: "#463B33", background: "#FFFFFF", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*{margin:0;padding:0;box-sizing:border-box}a{color:inherit;text-decoration:none}input:focus{outline:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp .8s ease forwards}.fu2{animation:fadeUp .8s ease .15s forwards;opacity:0}.fu3{animation:fadeUp .8s ease .3s forwards;opacity:0}.fu4{animation:fadeUp .8s ease .45s forwards;opacity:0}
      `}</style>

      <Section className="brand-dark" bg="#214E78" style={{ padding: "60px 24px", textAlign: "center", overflow: "hidden", color: "#FFFFFF" }}>
        <Blob size={200} color={P.rose} top={-60} left={-80} />
        <Center max={660}>
          <Gromi size={110} />
          <h1 style={{ fontSize: "clamp(29px, 6vw, 46px)", lineHeight: 1.18, marginTop: 20 }}>Apprendre ensemble,<br /><span>sans écran pour votre enfant.</span></h1>
          <p style={{ fontSize: 18, margin: "22px auto", lineHeight: 1.7 }}>Vous lisez les consignes sur votre téléphone, puis partagez l’activité avec votre enfant. Papier, feutres, stylos, ballon, oreillers… Du matériel courant de la maison, pour apprendre et évoluer ensemble.</p>
          <p style={{ marginBottom: 28, fontWeight: 700 }}>Pour les parents d’enfants de 3 mois à 10 ans et 11 mois.</p>
          <EmailBox {...boxProps} />
          <p style={{ fontSize: 13, marginTop: 12 }}>Application en préparation · Inscription gratuite à l’alerte de lancement</p>
          <a href="/cahiers/" style={{ display: "inline-block", marginTop: 20, padding: "14px 20px", borderRadius: 16, background: "#FFF0E5", color: "#214E78", fontWeight: 800 }}>Découvrir les cahiers gratuits</a>
        </Center>
      </Section>

      <Section bg="#FFF0E5">
        <Center max={720}>
          <h2 style={{ fontSize: 28, textAlign: "center", marginBottom: 28 }}>Comment fonctionne Gromi ?</h2>
          {[
            { icon: "📋", title: "Vous faites le point", text: "Un questionnaire s’appuie sur vos observations dans cinq domaines adaptés à l’âge de votre enfant. Il aide à choisir les activités ; il ne constitue pas un diagnostic et ne remplace pas un bilan psychomoteur réalisé par un professionnel." },
            { icon: "🤸", title: "Vous préparez l’activité", text: "Le matériel nécessaire et les consignes sont indiqués avant de commencer. Vous accompagnez votre enfant dans l’activité, sans qu’il ait besoin d’utiliser l’écran." },
            { icon: "📈", title: "Vous retrouvez votre suivi", text: "Activités réalisées, favoris, notes et bilans sont réunis dans l’application. Un nouveau bilan mensuel permet d’actualiser vos observations et d’adapter les propositions." },
          ].map(item => <article key={item.title} style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 21, marginBottom: 10 }}>{item.icon} {item.title}</h3><p style={{ lineHeight: 1.7, color: "#655c53" }}>{item.text}</p>
          </article>)}
        </Center>
      </Section>

      <Section>
        <Center max={760}>
          <h2 style={{ fontSize: 28, textAlign: "center", marginBottom: 24 }}>Deux rythmes, selon votre famille</h2>
          <p style={{ textAlign: "center", marginBottom: 26, color: "#655c53" }}>Offres prévues au lancement. Aucun abonnement n’est vendu sur ce site.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: 20 }}>
            <article style={{ background: P.bleu, borderRadius: 24, padding: 26 }}><h3 style={{ fontSize: 23 }}>Gratuit</h3><p style={{ fontWeight: 800, margin: "12px 0" }}>Une activité le mercredi et le samedi</p><p style={{ lineHeight: 1.7 }}>Chaque activité reste disponible jusqu’à la suivante. Gromi cible les domaines principaux à accompagner selon le bilan, en commençant par les scores les plus faibles.</p></article>
            <article style={{ background: P.peche, borderRadius: 24, padding: 26 }}><h3 style={{ fontSize: 23 }}>Premium mensuel</h3><p style={{ fontWeight: 800, margin: "12px 0" }}>Une activité chaque jour</p><p style={{ lineHeight: 1.7 }}>La personnalisation tient aussi compte des sous-domaines et de vos retours. Un seul abonnement bénéficie aux deux coparents liés et à leurs profils enfants.</p><p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 14 }}>Tarifs prévus : 9,99 € / mois en France et Belgique ; 8,99 CHF / mois en Suisse. Abonnement à renouvellement automatique. Pas de formule annuelle ni d’essai gratuit prévus. Le prix sera confirmé dans la boutique avant l’achat.</p></article>
          </div>
          <p style={{ lineHeight: 1.7, marginTop: 24 }}>Une famille relie deux comptes maximum avec un code commun. Les profils créés par l’un ou l’autre et leur suivi enregistré sont partagés.</p>
          <p style={{ marginTop: 15 }}><a href="/assistance/" style={{ textDecoration: "underline" }}>Consulter les explications sur les activités et le partage familial</a></p>
        </Center>
      </Section>

      <Section bg="#F3F7FB">
        <Center max={440}>
          <h2 style={{ fontSize: 27, textAlign: "center", marginBottom: 14 }}>Un aperçu de Gromi</h2>
          <p style={{ lineHeight: 1.6, textAlign: "center", marginBottom: 24 }}>Questionnaire, activité et suivi : découvrez les écrans de présentation. Glissez ou utilisez les flèches.</p>
          <Carousel screens={["/visuels/01-questionnaire.png", "/visuels/02-activite.png", "/visuels/03-progres.png"]} />
        </Center>
      </Section>

      <Section>
        <Center max={700}>
          <h2 style={{ fontSize: 28, textAlign: "center", marginBottom: 24 }}>Vos questions, nos réponses</h2>
          {[
            { q: "Mon enfant doit-il utiliser un écran ?", a: "Non. L’application sert au parent pour lire les consignes et noter ses observations. L’activité se réalise ensemble, sans écran pour l’enfant, avec du matériel courant de la maison." },
            { q: "À quels âges s’adresse Gromi ?", a: "Gromi accompagne les parents d’enfants de 3 mois à 10 ans et 11 mois. Les activités sont proposées selon l’âge et les réponses au dernier bilan." },
            { q: "Comment les activités gratuites sont-elles choisies ?", a: "Les domaines principaux dont le score est inférieur ou égal à 75 % sont proposés en commençant par les scores les plus faibles, puis en alternant. Si tous dépassent 75 %, les domaines varient. Une nouvelle activité arrive le mercredi et le samedi." },
            { q: "Comment fonctionne la personnalisation Premium ?", a: "Après chaque nouveau bilan, les 14 premières activités réellement terminées explorent les sous-domaines. Ensuite, les propositions alternent les difficultés repérées et l’exploration dans le domaine prévu. Les jours sans activité terminée ne comptent pas. Un nouveau bilan relance le cycle sans effacer l’historique." },
            { q: "Et si nous ne faisons pas l’activité le jour même ?", a: "En gratuit, elle reste disponible jusqu’au mercredi ou samedi suivant. Avec Premium, l’activité change à minuit dans le fuseau du profil ; une séance déjà commencée peut rester accessible jusqu’à 24 heures après la fin de son créneau. Les jours manqués ne s’accumulent pas." },
            { q: "Le bilan remplace-t-il une consultation ?", a: "Non. Il repose sur vos observations et aide à proposer des activités familiales. Il ne constitue pas un diagnostic et ne remplace pas un bilan psychomoteur réalisé par un professionnel. Si une difficulté vous préoccupe, demandez conseil à un professionnel." },
          ].map(item => <details key={item.q} style={{ padding: 20, border: "1px solid #E2D3BF", borderRadius: 16, marginBottom: 12 }}><summary style={{ cursor: "pointer", fontWeight: 800 }}>{item.q}</summary><p style={{ marginTop: 14, lineHeight: 1.7, color: "#655c53" }}>{item.a}</p></details>)}
        </Center>
      </Section>

      <Section bg="#FFF0E5">
        <Center max={600}>
          <h2 style={{ fontSize: 27, marginBottom: 18 }}>Qui est derrière Gromi ?</h2>
          <p style={{ lineHeight: 1.8 }}>Je suis Louise Calon Godet, psychomotricienne diplômée d’État et créatrice de Club Ludique. Avec Gromi, je souhaite aider les parents à partager des activités adaptées à leur enfant, avec des consignes simples et du matériel du quotidien.</p>
          <p style={{ lineHeight: 1.8, marginTop: 15 }}>Gromi est conçu pour un usage familial. Chaque enfant évolue à son rythme ; aucun résultat individuel n’est garanti.</p>
        </Center>
      </Section>

      <Section className="brand-dark" bg="#214E78" style={{ textAlign: "center", color: "#fff" }}>
        <Center max={600}>
          <h2 style={{ fontSize: 29, marginBottom: 16 }}>Envie d’apprendre et d’évoluer ensemble ?</h2>
          <p style={{ lineHeight: 1.7, marginBottom: 24 }}>Laissez votre email pour être informé du lancement en France, Belgique et Suisse. L’application sera proposée en français.</p>
          <EmailBox {...boxProps} />
          <p style={{ fontSize: 13, marginTop: 12 }}>Une alerte de lancement, pas une inscription à une newsletter générale.</p>
        </Center>
      </Section>
      <SiteFooter />
    </div>
  );
}
