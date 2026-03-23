let cachedToken = null;
let tokenExpiresAt = 0;

export async function fetchOpenSkyToken() {
  const config = useRuntimeConfig();
  const now = Date.now();

  console.log('openskyClientId length', config.openskyClientId?.length);
  console.log('openskyClientSecret length', config.openskyClientSecret?.length);
  console.log('openskyClientId prefix', config.openskyClientId?.slice(0, 6));
  console.log('openskyClientSecret prefix', config.openskyClientSecret?.slice(0, 6));

  console.log('env client id length', process.env.OPENSKY_CLIENT_ID?.length);
  console.log('env client secret length', process.env.OPENSKY_CLIENT_SECRET?.length);
  console.log('env client id prefix', process.env.OPENSKY_CLIENT_ID?.slice(0, 6));
  console.log('env client secret prefix', process.env.OPENSKY_CLIENT_SECRET?.slice(0, 6));

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
