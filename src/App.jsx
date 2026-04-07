import { useState, useRef } from "react";

const GROMI_IMG = "data:image/png;base64,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";

const Gromi = ({ size = 120 }) => (
  <div style={{ width: size, height: size, display: "inline-block", animation: "gromiFloat 3s ease-in-out infinite" }}>
    <style>{`@keyframes gromiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    <img src={GROMI_IMG} alt="Gromi" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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

  const goTo = (i) => setCurrent(Math.max(0, Math.min(screens.length - 1, i)));

  const onStart = (x) => { startX.current = x; dragging.current = true; dragDelta.current = 0; };
  const onMove = (x) => {
    if (!dragging.current) return;
    const d = x - startX.current;
    dragDelta.current = d;
    setOffset(d);
  };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragDelta.current < -50) goTo(current + 1);
    else if (dragDelta.current > 50) goTo(current - 1);
    setOffset(0);
  };

  const ArrowBtn = ({ dir }) => {
    const isLeft = dir === "left";
    const disabled = isLeft ? current === 0 : current === screens.length - 1;
    return (
      <button onClick={() => goTo(current + (isLeft ? -1 : 1))} disabled={disabled} style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        [isLeft ? "left" : "right"]: -20,
        width: 36, height: 36, borderRadius: "50%", border: "none",
        background: disabled ? "#EDE6DE" : "#fff",
        boxShadow: disabled ? "none" : "0 2px 10px rgba(0,0,0,0.12)",
        cursor: disabled ? "default" : "pointer",
        fontSize: 16, color: disabled ? "#C4BAB0" : "#3D3530",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2, transition: "all 0.2s",
      }}>
        {isLeft ? "←" : "→"}
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 260, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        <ArrowBtn dir="left" />
        <ArrowBtn dir="right" />
        <div
          style={{ overflow: "hidden", borderRadius: 24, cursor: "grab", userSelect: "none", touchAction: "pan-y" }}
          onMouseDown={(e) => onStart(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={(e) => onStart(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onEnd}
        >
          <div style={{
            display: "flex",
            transform: `translateX(calc(${-current * 100}% + ${offset}px))`,
            transition: offset === 0 ? "transform 0.35s cubic-bezier(.4,0,.2,1)" : "none",
          }}>
            {screens.map((src, i) => (
              <div key={i} style={{ minWidth: "100%", background: "#1A1614" }}>
                <img src={src} alt={`Écran Gromi ${i + 1}`} style={{ width: "100%", display: "block", pointerEvents: "none" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
        {screens.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 24 : 8, height: 8,
            borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
            background: i === current ? "#D4845A" : "#EDE6DE",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const orange = "#E8944A";
  const P = { rose: "#F2C4C4", bleu: "#B8D4E8", vert: "#B8D8B8", jaune: "#F0DCA0", peche: "#F5D8C4", lilas: "#D0C8E8" };

  const EmailBox = () => !submitted ? (
    <div style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
      <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
        style={{ flex: "1 1 220px", padding: "16px 20px", borderRadius: 16, border: "2px solid #EDE6DE", fontSize: 15, fontFamily: "inherit", fontWeight: 600, color: "#3D3530", background: "#fff", minWidth: 180 }} />
      <button onClick={() => { if(email.includes("@")) setSubmitted(true); }}
        style={{ padding: "16px 24px", borderRadius: 16, border: "none", background: orange, color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 20px rgba(232,148,74,0.35)", whiteSpace: "nowrap" }}>
        Je veux être prévenu 🚀
      </button>
    </div>
  ) : (
    <div style={{ background: "#E5F2E5", borderRadius: 20, padding: "18px 24px", maxWidth: 400, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 24 }}>✅</span>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontWeight: 800 }}>C'est noté !</div>
        <div style={{ fontSize: 13, color: "#6BA87B" }}>On vous envoie un email dès que Gromi est dispo.</div>
      </div>
    </div>
  );

  const Section = ({ children, bg = "transparent", style: sx = {} }) => (
    <section style={{ padding: "56px 24px", background: bg, position: "relative", ...sx }}>{children}</section>
  );

  const Center = ({ children, max = 600 }) => <div style={{ maxWidth: max, margin: "0 auto" }}>{children}</div>;

  return (
    <div style={{ fontFamily: "'Quicksand', system-ui, sans-serif", color: "#3D3530", background: "#FDF8F2", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*{margin:0;padding:0;box-sizing:border-box}a{color:inherit;text-decoration:none}input:focus{outline:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp .8s ease forwards}.fu2{animation:fadeUp .8s ease .15s forwards;opacity:0}.fu3{animation:fadeUp .8s ease .3s forwards;opacity:0}.fu4{animation:fadeUp .8s ease .45s forwards;opacity:0}
      `}</style>

      {/* ============ HERO — Émotionnel, la peur du parent ============ */}
      <Section style={{ padding: "60px 24px 70px", textAlign: "center", overflow: "hidden" }}>
        <Blob size={200} color={P.rose} top={-60} left={-80} />
        <Blob size={150} color={P.bleu} top={30} right={-60} />
        <Center max={560}>
          <div className="fu1" style={{ position: "relative" }}><Gromi size={120} /></div>
          <h1 className="fu2" style={{ fontSize: "clamp(28px, 7vw, 44px)", fontWeight: 800, lineHeight: 1.15, marginTop: 16, position: "relative" }}>
            « Est-ce que mon enfant<br />se développe <span style={{ color: "#D4845A" }}>bien</span> ? »
          </h1>
          <p className="fu3" style={{ fontSize: 17, color: "#8A7F76", marginTop: 14, lineHeight: 1.6, position: "relative" }}>
            Vous vous posez cette question. Tous les parents se la posent. De la naissance jusqu'à 12 ans, <strong style={{ color: "#D4845A", fontWeight: 800 }}>Gromi</strong> vous donne la réponse — et les outils pour l'accompagner à chaque étape.
          </p>
          <div className="fu4" style={{ marginTop: 28, position: "relative" }}>
            <EmailBox />
            <p style={{ fontSize: 12, color: "#C4BAB0", marginTop: 10 }}>Gratuit. Pas de spam. Juste un email le jour du lancement.</p>
          </div>
        </Center>
      </Section>

      {/* ============ STAT CHOC ============ */}
      <div style={{ background: "#FFF8F2", borderTop: "1px solid #EDE6DE", borderBottom: "1px solid #EDE6DE", padding: "40px 24px" }}>
        <Center max={540}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: "clamp(64px, 16vw, 100px)", fontWeight: 800, color: "#D4845A", lineHeight: 1, letterSpacing: "-2px" }}>1/5</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C4BAB0", letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>enfants</div>
            </div>
            <div style={{ width: 2, height: 80, background: "#EDE6DE", flexShrink: 0, display: "none" }} />
            <div style={{ textAlign: "left", maxWidth: 320 }}>
              <div style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 800, color: "#3D3530", lineHeight: 1.35 }}>
                a des difficultés de développement.
              </div>
              <div style={{ fontSize: 14, color: "#8A7F76", marginTop: 10, lineHeight: 1.7 }}>
                La plupart ne sont détectées qu'à l'école —{" "}
                <strong style={{ color: "#D4845A", fontWeight: 800 }}>souvent trop tard.</strong>
              </div>
            </div>
          </div>
        </Center>
      </div>

      {/* ============ LES DOUTES ============ */}
      <Section bg="#fff">
        <Center>
          <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
            Vous reconnaissez-vous ?
          </h2>
          {[
            { q: "« Les enfants de mes amies marchent déjà, pas le mien… »", a: <span>Chaque enfant a son rythme. Mais <strong style={{color:"#D4845A"}}>savoir OÙ il en est et QUOI faire</strong> pour l'accompagner, ça change tout.</span>, e: "😟" },
            { q: "« Il ne tient pas en place, il n'arrive pas à se concentrer »", a: <span>Ce n'est peut-être pas un problème de comportement — c'est peut-être <strong style={{color:"#D4845A"}}>un besoin psychomoteur non comblé.</strong></span>, e: "🤯" },
            { q: "« En CE2 son écriture est illisible, il déteste écrire »", a: <span>L'écriture c'est motricité fine + tonus + coordination. <strong style={{color:"#D4845A"}}>Des exercices ciblés peuvent tout débloquer.</strong></span>, e: "✏️" },
            { q: "« Je ne sais pas si je stimule assez mon enfant »", a: <span>Pas besoin d'être experte. <strong style={{color:"#D4845A"}}>10 minutes par jour</strong> d'activité adaptée font une vraie différence, à tout âge.</span>, e: "😰" },
            { q: "« En CM1 il est maladroit, il se cogne partout, il casse tout »", a: <span>La maladresse n'est pas un trait de caractère — <strong style={{color:"#D4845A"}}>c'est un schéma corporel et une coordination qui se travaillent.</strong></span>, e: "💥" },
            { q: "« Le pédiatre dit que tout va bien mais j'ai un doute »", a: <span>Le pédiatre vérifie la santé. <strong style={{color:"#D4845A"}}>La psychomotricité, c'est le développement global.</strong> Ce n'est pas la même chose.</span>, e: "🤔" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#FDF8F2", borderRadius: 20, padding: "20px 22px", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{item.e}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#3D3530", fontStyle: "italic", lineHeight: 1.4 }}>{item.q}</div>
                  <div style={{ fontSize: 13, color: "#5C544F", marginTop: 6, lineHeight: 1.7 }}>{item.a}</div>
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
              <span style={{ fontWeight: 700, fontSize: 12, color: "#D4845A" }}>Créée par une psychomotricienne D.E.</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
              Gromi sait exactement<br />ce dont votre enfant a besoin
            </h2>
            <p style={{ fontSize: 15, color: "#8A7F76", marginTop: 10 }}>Pas de contenu générique. Chaque activité cible un jalon de développement précis.</p>
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
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "#3D3530" }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#5C544F", lineHeight: 1.7 }}>{f.desc}</div>
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
              <span style={{ fontWeight: 700, fontSize: 12, color: "#D4845A" }}>L'application en vrai</span>
            </div>
            <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#3D3530", lineHeight: 1.3 }}>
              Activité · Progression · Bilan
            </h2>
            <p style={{ fontSize: 13, color: "#8A7F76", marginTop: 6 }}>Glissez pour voir les écrans</p>
          </div>
          <Carousel screens={["/phone_1.png", "/phone_2.png", "/phone_3.png", "/phone_4.png"]} />
        </Center>
      </Section>

      {/* ============ TÉMOIGNAGES (fictifs pour le prototype) ============ */}
      <Section bg="#fff">
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
            <div key={i} style={{ background: "#FDF8F2", borderRadius: 20, padding: "20px 22px", marginBottom: 10 }}>
              <div style={{ fontSize: 14, color: orange, marginBottom: 4 }}>{"★".repeat(t.stars)}</div>
              <div style={{ fontSize: 14, color: "#3D3530", lineHeight: 1.7, fontStyle: "italic", marginBottom: 8, borderLeft: "3px solid #F5D8C4", paddingLeft: 12 }}>« {t.text} »</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8A7F76" }}>— {t.name}</div>
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
              <div style={{ fontSize: 14, fontWeight: 800, color: "#3D3530", marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: 13, color: "#5C544F", lineHeight: 1.7 }}>{item.a}</div>
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
            <p style={{ fontSize: 14, color: "#8A7F76", lineHeight: 1.7 }}>
              Psychomotricienne diplômée d'État, j'accompagne les enfants et leurs parents depuis des années. Sur TikTok (<strong>Club Ludique</strong>, 90 000 abonnés), je partage déjà mes conseils au quotidien. Gromi, c'est tout ce que je sais — condensé dans une app qui s'adapte à votre enfant.
            </p>
            <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 800, marginTop: 16, background: "#D4845A", borderRadius: 14, padding: "12px 18px", lineHeight: 1.5 }}>
              Chaque activité de Gromi, c'est ce que je ferais si votre enfant était dans mon cabinet.
            </p>
          </div>
        </Center>
      </Section>

      {/* ============ CTA FINAL — urgence émotionnelle ============ */}
      <Section bg="#fff" style={{ padding: "60px 24px 70px", textAlign: "center" }}>
        <Blob size={140} color={P.rose} top={-30} left={-40} opacity={0.1} />
        <Center max={500}>
          <Gromi size={90} />
          <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 10, lineHeight: 1.2 }}>
            Les premières années<br />ne se rattrapent pas.
          </h2>
          <p style={{ fontSize: 15, color: "#8A7F76", marginTop: 10, marginBottom: 24, lineHeight: 1.6 }}>
            Le cerveau de votre enfant se développe à une vitesse incroyable.<br />
            <strong style={{ color: "#3D3530" }}>10 minutes par jour peuvent tout changer.</strong>
          </p>
          <EmailBox />
          <p style={{ fontSize: 12, color: "#C4BAB0", marginTop: 10 }}>Lancement bientôt · Inscription gratuite · Pas de spam</p>
        </Center>
      </Section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: "#3D3530", color: "#A09A92", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F5EDE2", marginBottom: 4 }}>Gromi</div>
          <div style={{ fontSize: 11, marginBottom: 12 }}>L'app créée par Club Ludique</div>
          <div style={{ fontSize: 10, display: "flex", gap: 14, justifyContent: "center", marginBottom: 12 }}>
            <span>Mentions légales</span><span>Confidentialité</span><span>Contact</span>
          </div>
          <div style={{ fontSize: 9, color: "#6B6560" }}>© 2026 Gromi · Fait avec ❤️ par une psychomotricienne D.E.</div>
        </div>
      </footer>
    </div>
  );
}
