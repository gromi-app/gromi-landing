(() => {
  'use strict';
  const config = window.GROMI_PUBLIC_CONFIG;
  const $ = (id) => document.getElementById(id);
  // Les jetons restent uniquement en mémoire, jamais dans le stockage du navigateur.
  let accessToken = null;
  let refreshToken = null;

  async function api(path, body, token, method = 'POST') {
    const response = await fetch(`${config.url}/auth/v1/${path}`, {
      method,
      headers: { apikey: config.anonKey, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error('auth-request-failed');
      error.status = response.status;
      error.code = data.error_code || data.code;
      throw error;
    }
    return data;
  }
  function invalidLink() {
    accessToken = refreshToken = null;
    $('status').textContent = 'Ce lien est incomplet, a expiré ou a déjà été utilisé. Demande un nouveau lien ci-dessous.';
    $('password-form').hidden = true;
    $('request-section').hidden = false;
  }
  async function initialize() {
    const params = new URLSearchParams(location.hash.slice(1));
    accessToken = params.get('access_token');
    refreshToken = params.get('refresh_token');
    const recovery = params.get('type') === 'recovery';
    const linkError = params.get('error') || params.get('error_code');
    history.replaceState(null, '', location.pathname);
    $('success').hidden = true;
    $('request-section').hidden = true;
    $('password-form').hidden = true;
    $('form-error').hidden = true;
    if (!config?.url || !config?.anonKey) {
      $('status').textContent = 'Le service est momentanément indisponible. Réessaie dans quelques instants.';
      return;
    }
    if (linkError || !recovery || !accessToken || !refreshToken) return invalidLink();
    // La vérification finale des droits est effectuée par Supabase lors de l’enregistrement.
    $('status').textContent = 'Choisis ton nouveau mot de passe pour retrouver ton compte.';
    $('password-form').hidden = false;
  }
  $('password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if ($('save').disabled) return;
    const password = $('password').value;
    if (password.length < 6 || password !== $('confirmation').value) {
      $('form-error').hidden = false;
      $('form-error').textContent = password.length < 6 ? 'Choisis au moins 6 caractères.' : 'Les deux mots de passe doivent être identiques.';
      return;
    }
    $('save').disabled = true;
    $('form-error').hidden = true;
    try {
      try {
        await api('user', { password }, accessToken, 'PUT');
      } catch (error) {
        if (error.status !== 401 || !refreshToken) throw error;
        const session = await api('token?grant_type=refresh_token', { refresh_token: refreshToken });
        accessToken = session.access_token;
        refreshToken = session.refresh_token;
        await api('user', { password }, accessToken, 'PUT');
      }
      // Ne pas conserver de session connectée dans un navigateur éventuellement partagé.
      void api('logout?scope=local', null, accessToken).catch(() => {});
      accessToken = refreshToken = null;
      $('password-form').reset();
      $('password-form').hidden = true;
      $('status').textContent = 'Ton mot de passe a bien été modifié.';
      $('success').hidden = false;
    } catch (error) {
      if (error.status === 401 || error.status === 403 || ['refresh_token_not_found', 'refresh_token_already_used'].includes(error.code)) {
        invalidLink();
      } else {
        $('form-error').hidden = false;
        $('form-error').textContent = error.code === 'same_password' ? 'Choisis un mot de passe différent de l’ancien.' : error.code === 'weak_password' ? 'Ce mot de passe est trop facile à deviner. Choisis-en un plus long et plus varié.' : 'Impossible d’enregistrer pour le moment. Vérifie ta connexion et réessaie.';
      }
    } finally { $('save').disabled = false; }
  });
  $('request-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if ($('request').disabled) return;
    $('request').disabled = true;
    try {
      await api(`recover?redirect_to=${encodeURIComponent('https://gromi.fr/reset-password/')}`, { email: $('email').value.trim().toLowerCase() });
      $('request-status').textContent = 'Si un compte correspond à cette adresse, un email a été envoyé. Consulte aussi tes courriers indésirables.';
    } catch (error) {
      $('request-status').textContent = error.status === 429 ? 'Patiente quelques instants avant de demander un autre lien.' : 'Envoi impossible. Vérifie ta connexion et réessaie.';
    } finally { $('request').disabled = false; }
  });
  window.addEventListener('hashchange', () => { void initialize(); });
  void initialize();
})();
