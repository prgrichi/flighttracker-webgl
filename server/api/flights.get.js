import { mapOpenSkyState } from '../utils/mapOpenSky.js';
import { BBOX } from '../utils/bbox';
import mockData from '../data/mockFlights.json';
import { fetchOpenSkyToken } from '@/server/utils/openSky.js';
import { scanCallSigns } from '@/server/utils/logger/scanCallSigns.js';
import { logToFile } from '@/server/utils/logger/logToFile.js';

let regionCache = {};
let openskyCalls = 0;

async function loadFlights(bbox, useMock) {
  console.log('🔴 FETCHING FROM OPENSKY', ++openskyCalls);

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

      // logger/scanner for unknown callsigns
      const hits = scanCallSigns(raw.states);
      if (hits.length) {
        console.log('🚁 interesting callsigns found:', hits);

        await logToFile(hits);
      }
    }
  } catch (err) {
    const statusCode = err?.response?.status || err?.statusCode || err?.status;
    const statusMessage = err?.response?.statusText || err?.statusMessage;
    const responseData = err?.response?._data;

    console.error('Flight API error:', {
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

  const flights = (raw.states || []).map(mapOpenSkyState).filter(f => f !== null);

  return {
    type: 'FeatureCollection',
    features: flights.map(f => ({
      type: 'Feature',
      id: f.icao24,
      geometry: {
        type: 'Point',
        coordinates: [f.lon, f.lat],
      },
      properties: {
        icao24: f.icao24,
        callsign: f.callsign,
        country: f.country,
        airlineCode: f.airlineCode,
        airlineName: f.airlineName,
        airlineLogo: f.airlineLogo,
        rawAircraftType: f.rawAircraftType,
        normalizedAircraftType: f.normalizedAircraftType,
        aircraftType: f.aircraftType,
        aircraftLabel: f.aircraftLabel,
        aircraftManufacturer: f.aircraftManufacturer,
        aircraftModel: f.aircraftModel,
        aircraftCategory: f.aircraftCategory,
        heading: f.heading,
        altitudeM: f.altitudeM,
        altitudeFt: f.altitudeFt,
        speedMs: f.speedMs,
        speedKmh: f.speedKmh,
        verticalRate: f.verticalRate,
        climbing: f.climbing,
        descending: f.descending,
        onGround: f.onGround,
        squawk: f.squawk,
        lastContact: f.lastContact,
        lat: f.lat,
        lon: f.lon,
      },
    })),
  };
}

export default defineEventHandler(async event => {
  const query = getQuery(event);

  if (query.fail === 'true') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Test error',
      data: {
        message: 'Simulierter Fehler für Toast-Test',
      },
    });
  }

  const region = query.region || 'bavaria';
  const useMock = process.env.NUXT_USE_MOCK === 'true';
  const bbox = BBOX[region] || BBOX.bavaria;

  const now = Date.now();
  const cachedEntry = regionCache[region];

  console.log('➡️ Incoming request');

  if (!useMock && cachedEntry && now < cachedEntry.expiresAt) {
    console.log('🟢 SERVED FROM CACHE');
    return cachedEntry.data;
  }

  const response = await loadFlights(bbox, useMock);

  if (!useMock) {
    regionCache[region] = {
      data: response,
      expiresAt: Date.now() + 15_000,
    };
  }

  return response;
});
