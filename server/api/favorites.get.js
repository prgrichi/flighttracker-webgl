import { mapOpenSkyState } from '../utils/mapOpenSky.js';
import { fetchOpenSkyToken } from '@/server/utils/openSky.js';

let favoritesCache = {};

let openskyFavoriteCalls = 0;

async function loadFavoriteStates(icao24List, useMock) {
  console.log('🟣 FETCHING FAVORITES FROM OPENSKY', ++openskyFavoriteCalls);

  let raw;

  try {
    if (useMock) {
      raw = { states: [] };
    } else {
      const token = await fetchOpenSkyToken();

      const params = new URLSearchParams();

      for (const icao24 of icao24List) {
        params.append('icao24', icao24);
      }

      const url = `https://opensky-network.org/api/states/all?${params.toString()}`;

      raw = await $fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    const statusCode = err?.response?.status || err?.statusCode || err?.status;
    const statusMessage = err?.response?.statusText || err?.statusMessage;
    const responseData = err?.response?._data;

    console.error('Favorite states API error:', {
      statusCode,
      statusMessage,
      message: err?.message,
      data: responseData,
    });

    if (statusCode === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'OpenSky rate limit reached',
        data: {
          code: 'OPENSKY_RATE_LIMIT',
          message: 'OpenSky rate limit reached. Try again later.',
        },
      });
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'OpenSky request failed',
      data: {
        message: err?.message || 'Unknown OpenSky error',
      },
    });
  }

  const mappedFlights = (raw.states || []).map(mapOpenSkyState).filter(f => f !== null);

  const byIcao24 = new Map(mappedFlights.map(f => [f.icao24, f]));

  return icao24List.map(icao24 => {
    const flight = byIcao24.get(icao24);

    if (!flight) {
      return {
        icao24,
        found: false,
        status: 'unknown',
        onGround: null,
        lat: null,
        lon: null,
        heading: null,
        altitudeM: null,
        altitudeFt: null,
        speedMs: null,
        speedKmh: null,
        verticalRate: null,
        lastContact: null,
        callsign: null,
      };
    }

    return {
      icao24: flight.icao24,
      found: true,
      status: flight.onGround ? 'ground' : 'air',
      onGround: flight.onGround,
      lat: flight.lat,
      lon: flight.lon,
      heading: flight.heading,
      altitudeM: flight.altitudeM,
      altitudeFt: flight.altitudeFt,
      speedMs: flight.speedMs,
      speedKmh: flight.speedKmh,
      verticalRate: flight.verticalRate,
      lastContact: flight.lastContact,
      callsign: flight.callsign,
    };
  });
}

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const useMock = process.env.NUXT_USE_MOCK === 'true';

  let icao24 = query.icao24 || [];

  if (!Array.isArray(icao24)) {
    icao24 = String(icao24)
      .split(',')
      .map(v => v.trim().toLowerCase())
      .filter(Boolean);
  } else {
    icao24 = icao24.map(v => String(v).trim().toLowerCase()).filter(Boolean);
  }

  icao24 = [...new Set(icao24)];

  if (!icao24.length) {
    return [];
  }

  const cacheKey = [...icao24].sort().join(',');

  const now = Date.now();
  const cachedEntry = favoritesCache[cacheKey];

  console.log('➡️ Incoming favorites request');

  if (!useMock && cachedEntry && now < cachedEntry.expiresAt) {
    console.log('🟢 FAVORITES SERVED FROM CACHE');
    return cachedEntry.data;
  }

  const response = await loadFavoriteStates(icao24, useMock);

  if (!useMock) {
    favoritesCache[cacheKey] = {
      data: response,
      expiresAt: Date.now() + 15_000,
    };
  }
  console.log(response);
  return response;
});
