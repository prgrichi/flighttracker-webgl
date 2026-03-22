let cachedToken = null;
let tokenExpiresAt = 0;

export async function fetchOpenSkyToken() {
  const config = useRuntimeConfig();
  const now = Date.now();

  // Wenn Token noch gültig ist, direkt zurückgeben
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await $fetch(
    'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
    {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.openskyClientId,
        client_secret: config.openskyClientSecret,
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  cachedToken = response.access_token;

  // Token läuft nach expires_in Sekunden ab
  // Wir ziehen 30 Sekunden ab, damit wir nicht "auf den letzten Drücker" arbeiten
  tokenExpiresAt = now + (response.expires_in - 30) * 1000;

  return cachedToken;
}
