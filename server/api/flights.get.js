import { mapOpenSkyState } from '../utils/mapOpenSky.js';
import { BBOX } from '../utils/bbox';
import mockData from '../data/mockFlights.json';
import { fetchOpenSkyToken } from '@/server/utils/openSky.js';
import { scanCallsigns } from '@/server/utils/logger/scanCallsigns.js';
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
      const hits = scanCallsigns(raw.states);
      if (hits.length) {
        console.log('🚁 interesting callsigns found:', hits);

        await logToFile(hits);
      }
    }
  } catch (err) {
    console.error('Flight API error:', err);
    // raw = mockData;
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
