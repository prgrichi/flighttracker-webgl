import { mapOpenSkyState } from '../utils/mapOpenSky';
import { BBOX } from '../utils/bbox';
import mockData from '../data/mockFlights.json';

export default defineEventHandler(async event => {
  const query = getQuery(event);

  const region = query.region || 'germany';
  const useMock = process.env.USE_MOCK === 'true';
  const bbox = BBOX[region] || BBOX.germany;

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

  return raw.states.map(mapOpenSkyState).filter(f => f !== null);
});
