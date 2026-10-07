import { useEffect, useRef } from "react";

export default function DownloadPopup() {
  const dialogRef = useRef(null);
  const restoreRef = useRef(() => {});

  useEffect(() => {
    const dialog = dialogRef.current;
    let previousFocus;
    let previousOverflow;
    const restore = () => {
      if (previousOverflow !== undefined) document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
    restoreRef.current = restore;
    dialog.addEventListener("close", restore);
    const timer = window.setTimeout(() => {
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }, 2000);
    return () => {
      window.clearTimeout(timer);
      dialog.removeEventListener("close", restore);
      if (dialog.open) dialog.close();
      restore();
    };
  }, []);

  const close = () => { dialogRef.current.close(); restoreRef.current(); };
  return <>
    <style>{`
      .download-popup { margin: auto; width: calc(100% - 32px); max-width: 420px; max-height: calc(100dvh - 32px); overflow: auto; border: 0; border-radius: 26px; padding: 40px 24px 24px; background: #FFFAF6; color: #214E78; text-align: center; font-family: inherit; box-shadow: 0 20px 80px #102d4c40; }
      .download-popup::backdrop { background: #132b45a6; }
      .download-popup button { font-family: inherit; cursor: pointer; }
      .download-popup a:focus-visible, .download-popup button:focus-visible { outline: 3px solid #214E78; outline-offset: 4px; }
      .download-popup-close { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; border: 0; border-radius: 50%; background: transparent; color: #214E78; font-size: 30px; }
      .download-popup-link { display: block; margin-top: 24px; padding: 14px; color: #214E78; font-size: 17px; font-weight: 800; line-height: 1.4; text-decoration: none; }
    `}</style>
    <dialog onCancel={event => { event.preventDefault(); close(); }} ref={dialogRef} className="download-popup" aria-labelledby="download-popup-title" aria-describedby="download-popup-description" onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <button className="download-popup-close" aria-label="Fermer la fenêtre" onClick={close}>×</button>
      <img src="/gromi-logo-2026.png" alt="" width="88" height="88" style={{ borderRadius: 20, objectFit: "contain" }} />
      <h2 id="download-popup-title" style={{ fontSize: 27, lineHeight: 1.2, marginTop: 16 }}>Gromi est disponible !</h2>
      <p id="download-popup-description" style={{ marginTop: 14, lineHeight: 1.6, color: "#655c53" }}>Des activités à partager avec votre enfant, sans écran pour lui.</p>
      <a className="download-popup-link" href="https://apps.apple.com/app/apple-store/id6815285991?pt=1294677542&ct=site&mt=8"><img src="/app-store-fr.svg" alt="Télécharger dans l’App Store" style={{ display: "block", height: 56, width: "auto", maxWidth: "100%", margin: "0 auto" }} /></a>
      <p style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5, color: "#655c53" }}>Sur iPhone · Téléchargement gratuit<br />Abonnement Premium facultatif</p>
      <button onClick={close} style={{ marginTop: 20, minHeight: 44, border: 0, background: "transparent", color: "#214E78", textDecoration: "underline", fontSize: 14 }}>Continuer sur le site</button>
    </dialog>
  </>;
}
