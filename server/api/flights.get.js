import { mapOpenSkyState } from '../utils/mapOpenSky';
import { BBOX } from '../utils/bbox';
import mockData from '../data/mockFlights.json';
import { fetchOpenSkyToken } from '~/server/utils/opensky';

let regionCache = {};

export default defineEventHandler(async event => {
  const query = getQuery(event);

  const region = query.region || 'bavaria';
  const useMock = process.env.NUXT__USE_MOCK === 'true';
  const bbox = BBOX[region] || BBOX.bavaria;

  const now = Date.now();
  const cachedEntry = regionCache[region];

  if (!useMock && cachedEntry && now < cachedEntry.expiresAt) {
    return cachedEntry.data;
  }

  let raw;

  try {
    if (useMock) {
      raw = mockData;
    } else {
      const token = await fetchOpenSkyToken();

      const url = `https://opensky-network.org/api/states/all?lamin=${bbox.lamin}&lamax=${bbox.lamax}&lomin=${bbox.lomin}&lomax=${bbox.lomax}`;

      raw = await $fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error('Flight API error:', err);
    raw = mockData;
  }

  const flights = (raw.states || []).map(mapOpenSkyState).filter(f => f !== null);

  const response = {
    type: 'FeatureCollection',
    features: flights.map(f => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [f.lon, f.lat],
      },
      properties: {
        icao24: f.icao24,
        callsign: f.callsign,
        heading: f.heading,
        altitudeM: f.altitudeM,
        speedKmh: f.speedKmh,
        climbing: f.climbing,
        descending: f.descending,
        onGround: f.onGround,
      },
    })),
  };

  if (!useMock) {
    regionCache[region] = {
      data: response,
      expiresAt: now + 10_000,
    };
  }

  return response;
});
