export async function onRequestPost(context) {
  try {
    const { email } = await context.request.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Email invalide" }), { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Louise - Gromi <bonjour@gromi.fr>",
        to: [email],
        subject: "🎉 Tu es sur la liste d'attente Gromi !",
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #FDF8F2; border-radius: 20px; overflow: hidden;">
            <div style="background: #D4845A; padding: 36px 32px; text-align: center;">
              <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 800;">Bienvenue sur Gromi ! 🎉</h1>
            </div>
            <div style="padding: 36px 32px;">
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7;">Bonjour,</p>
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7;">
                Tu es bien inscrit(e) sur la liste d'attente de <strong>Gromi</strong>, l'application de suivi du développement psychomoteur de l'enfant (0–12 ans).
              </p>
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7;">
                Je t'enverrai un email dès que l'application sera disponible — tu seras parmi les premiers à y avoir accès.
              </p>
              <p style="font-size: 16px; color: #3D3530; line-height: 1.7; margin-top: 24px;">
                À très bientôt,<br/>
                <strong>Louise</strong><br/>
                <span style="color: #8A7F76; font-size: 14px;">Psychomotricienne D.E. &amp; créatrice de Gromi</span>
              </p>
            </div>
            <div style="background: #FFF5F5; padding: 20px 32px; text-align: center;">
              <p style="font-size: 13px; color: #C4BAB0; margin: 0;">Tu reçois cet email car tu t'es inscrit(e) sur <a href="https://gromi.fr" style="color: #D4845A;">gromi.fr</a></p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
