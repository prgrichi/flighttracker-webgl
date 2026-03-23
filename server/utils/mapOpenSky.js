import { getAircraftInfo } from '@/server/utils/aircraftData';

export function mapOpenSkyState(s) {
  if (!s || s.length < 17) return null;

  const lon = Number(s[5]);
  const lat = Number(s[6]);

  const icao24 = s[0]?.toLowerCase() ?? null;
  const aircraft = getAircraftInfo(icao24);

  console.log(aircraft);

  // harte Validierung (wichtig für Leaflet)
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return null;
  }

  const geoAlt = Number(s[13]);
  const baroAlt = Number(s[7]);

  const altitudeM = Number.isFinite(geoAlt) ? geoAlt : Number.isFinite(baroAlt) ? baroAlt : null;

  const speedMs = Number.isFinite(s[9]) ? s[9] : null;

  const headingRaw = Number(s[10]);
  const heading = Number.isFinite(headingRaw)
    ? ((headingRaw % 360) + 360) % 360 // normalize 0–360
    : 0;

  const verticalRate = Number.isFinite(s[11]) ? s[11] : null;

  return {
    icao24: s[0],

    callsign: s[1]?.trim() || null,
    country: s[2] || null,

    rawAircraftType: aircraft?.rawAircraftType ?? null,
    normalizedAircraftType: aircraft?.normalizedAircraftType ?? null,
    aircraftType: aircraft?.aircraftType ?? null,

    aircraftLabel: aircraft?.aircraftLabel ?? null,
    aircraftManufacturer: aircraft?.aircraftManufacturer ?? null,
    aircraftModel: aircraft?.aircraftModel ?? null,

    lat,
    lon,

    altitudeM,
    altitudeFt: altitudeM !== null ? altitudeM * 3.28084 : null,

    speedMs,
    speedKmh: speedMs !== null ? speedMs * 3.6 : null,

    heading,
    verticalRate,

    climbing: verticalRate !== null && verticalRate > 1,
    descending: verticalRate !== null && verticalRate < -1,

    onGround: Boolean(s[8]),
    squawk: s[14] || null,

    lastContact: s[4] ?? null,
  };
}
