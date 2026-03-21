import { mapOpenSkyState } from '../utils/mapOpenSky';
import { BBOX } from '../utils/bbox';
import mockData from '../data/mockFlights.json';

export default defineEventHandler(async event => {
  const query = getQuery(event);

  const region = query.region || 'bavaria';
  const useMock = process.env.NUXT__USE_MOCK === 'true';
  const bbox = BBOX[region] || BBOX.bavaria;

  let raw;

  try {
    if (useMock) {
      raw = mockData;
    } else {
      const url = `https://opensky-network.org/api/states/all?lamin=${bbox.lamin}&lamax=${bbox.lamax}&lomin=${bbox.lomin}&lomax=${bbox.lomax}`;

      raw = await $fetch(url);
    }
  } catch (err) {
    console.error('Flight API error:', err);
    raw = mockData;
  }

  // return raw.states.map(mapOpenSkyState).filter(f => f !== null);

  const flights = raw.states.map(mapOpenSkyState).filter(f => f !== null);

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
        heading: f.heading,
        altitudeM: f.altitudeM,
        speedKmh: f.speedKmh,
        climbing: f.climbing,
        descending: f.descending,
        onGround: f.onGround,
      },
    })),
  };
});
