/**
 * Redirections temporaires de gromi.fr — seul fichier à modifier.
 * Après modification, publier ce fichier via le dépôt gromi-landing.
 *
 * PT : identifiant fournisseur Apple, ex. "123456" (laisser vide en attendant).
 * PLAY_STORE : URL complète Google Play (laisser vide pour revenir à l'accueil).
 * /app n'ajoute pas de ct ; les autres chemins ajoutent leur nom.
 * Les paramètres entrants ne sont pas recopiés dans les destinations.
 *
 * Limite HTTP : un iPad utilisant le même User-Agent qu'un Mac est
 * indiscernable côté serveur et suit donc la destination ordinateur.
 * Les autres pages et les formulaires continuent leur traitement habituel.
 */
const PT = "1294677542";
const PLAY_STORE = "";

const APP_STORE = "https://apps.apple.com/app/id6815285991";
const HOME = "https://gromi.fr/";
const PATHS = new Set([
  "app", "tiktok", "insta", "youtube", "facebook",
  "mail", "livre", "cahier", "partage", "qr",
]);

export function onRequest(context) {
  const { request } = context;
  const path = new URL(request.url).pathname;
  const match = /^\/([^/]+)\/?$/.exec(path);
  if (!match || !PATHS.has(match[1])) return context.next();

  const ua = request.headers.get("User-Agent") || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
    || (/Macintosh/i.test(ua) && /Mobile\//i.test(ua));
  const isAndroidPhone = /Android/i.test(ua) && /Mobile/i.test(ua);
  let destination = HOME;

  if (isIOS) {
    const apple = new URL(APP_STORE);
    if (match[1] !== "app") apple.searchParams.set("ct", match[1]);
    if (PT.trim()) apple.searchParams.set("pt", PT.trim());
    destination = apple.href;
  } else if (isAndroidPhone && PLAY_STORE.trim()) {
    destination = PLAY_STORE.trim();
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      "Cache-Control": "no-store",
      Vary: "User-Agent",
    },
  });
}
