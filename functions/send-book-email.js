const ALLOWED_DOWNLOADS = new Set([
  "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-cirque.pdf",
  "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-dinosaures.pdf",
  "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-super-heros.pdf",
  "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-pirates.pdf",
  "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-fonds-marins.pdf",
  "https://mfucdlmvhncetfozgqbp.supabase.co/storage/v1/object/public/activity-books/cahier-espace.pdf",
]);

const SUPABASE_URL = "https://mfucdlmvhncetfozgqbp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Im1mdWNkbG12aG5jZXRmb3pncWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTIxNTEsImV4cCI6MjA5MDQ2ODE1MX0.lkslG9vMQ17Wh5231UdZh_7iHSuWDk6KQTzKEzKlw6U";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequestPost(context) {
  try {
    const contentType = context.request.headers.get("content-type") ?? "";
    const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
    const payload = isForm
      ? Object.fromEntries(await context.request.formData())
      : await context.request.json();
    const { email, bookTitle, downloadUrl, bookSlug, childAgeRange } = payload;

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), { status: 400 });
    }

    if (!bookTitle || !downloadUrl) {
      return new Response(JSON.stringify({ error: "Cahier invalide" }), { status: 400 });
    }

    const productionUrl = new URL(downloadUrl).toString();

    if (!ALLOWED_DOWNLOADS.has(productionUrl)) {
      return new Response(JSON.stringify({ error: "Lien non autorise" }), { status: 400 });
    }

    await fetch(`${SUPABASE_URL}/rest/v1/activity_book_waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        child_age_range: childAgeRange || "Non precise",
        book_slug: bookSlug || "unknown",
        book_title: bookTitle,
      }),
    }).catch(() => {});

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Louise - Gromi <bonjour@gromi.fr>",
        to: [email],
        subject: `Votre cahier offert : ${bookTitle}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #FDF8F2; border-radius: 22px; overflow: hidden;">
            <div style="background: #E8944A; padding: 34px 32px; text-align: center;">
              <h1 style="color: white; font-size: 27px; line-height: 34px; margin: 0; font-weight: 800;">Votre cahier est prêt</h1>
            </div>
            <div style="padding: 34px 32px;">
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7;">Bonjour,</p>
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7;">
                Merci pour votre demande. Voici votre cahier offert :
                <strong>${bookTitle}</strong>.
              </p>
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7;">
                Vous pouvez le télécharger avec le bouton ci-dessous, puis l'imprimer ou le garder sur votre ordinateur.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${productionUrl}" style="display: inline-block; background: #E8944A; color: #ffffff; text-decoration: none; border-radius: 16px; padding: 15px 24px; font-size: 16px; font-weight: 800;">
                  Télécharger le cahier
                </a>
              </div>
              <p style="font-size: 15px; color: #7F746C; line-height: 1.7;">
                Et si vous voulez aller plus loin, je construis aussi Gromi : une application pour accompagner le développement psychomoteur de votre enfant avec un bilan puis des activités adaptées.
              </p>
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7; margin-top: 24px;">
                À très bientôt,<br/>
                <strong>Louise</strong><br/>
                <span style="color: #8A7F76; font-size: 14px;">Psychomotricienne D.E. &amp; créatrice de Gromi</span>
              </p>
            </div>
            <div style="background: #FFF5F5; padding: 20px 32px; text-align: center;">
              <p style="font-size: 13px; color: #C4BAB0; margin: 0;">Vous recevez cet email car vous avez demandé un cahier gratuit sur <a href="https://gromi.fr" style="color: #D4845A;">gromi.fr</a></p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    if (isForm) {
      return new Response(`
        <!doctype html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Cahier envoyé - Gromi</title>
            <style>
              body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#FDF8F2;color:#3D3530;display:grid;min-height:100vh;place-items:center;padding:24px}
              main{max-width:520px;background:#fff;border-radius:26px;padding:34px;text-align:center;box-shadow:0 16px 40px rgba(120,90,60,.12)}
              h1{font-size:30px;line-height:1.15;margin:0 0 12px}
              p{font-size:16px;line-height:1.6;color:#7F746C;margin:0 0 22px}
              a{display:inline-flex;background:#E8944A;color:#fff;text-decoration:none;border-radius:16px;padding:14px 20px;font-weight:800}
            </style>
          </head>
          <body>
            <main>
              <h1>C'est envoyé !</h1>
              <p>Votre cahier vient d'être envoyé par email. Pensez à vérifier vos spams si vous ne le voyez pas arriver.</p>
              <a href="/">Découvrir Gromi</a>
            </main>
          </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
