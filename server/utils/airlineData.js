import fs from 'fs';
import path from 'path';

let airlinesCache = null;
let airlineLogosCache = null;

export function getAirlines() {
  if (airlinesCache) return airlinesCache;

  const raw = fs.readFileSync('./server/data/airlines.json', 'utf-8');
  airlinesCache = JSON.parse(raw);

  return airlinesCache;
}

export function getAirlineLogos() {
  if (airlineLogosCache) return airlineLogosCache;

  const logosDir = path.resolve('./public/airlines');

  const files = fs.readdirSync(logosDir);

  airlineLogosCache = new Set(
    files
      .filter(file => file.toLowerCase().endsWith('.png'))
      .map(file => file.replace(/\.png$/i, '').toUpperCase())
  );

  return airlineLogosCache;
}

export function getAirlineInfo(callsign) {
  if (!callsign) {
    return {
      airlineCode: null,
      airlineName: null,
      airlineLogo: null,
    };
  }

  const cleanCallsign = callsign.trim().toUpperCase();

  if (cleanCallsign.length < 3) {
    return {
      airlineCode: null,
      airlineName: null,
      airlineLogo: null,
    };
  }

  const airlineCode = cleanCallsign.slice(0, 3);

  if (!/^[A-Z]{3}$/.test(airlineCode)) {
    return {
      airlineCode: null,
      airlineName: null,
      airlineLogo: null,
    };
  }

  const airlines = getAirlines();
  const airlineLogos = getAirlineLogos();

  const airlineLogo = airlineLogos.has(airlineCode) ? `/airlines/${airlineCode}.png` : null;

  return {
    airlineCode,
    airlineName: airlines[airlineCode] ?? null,
    airlineLogo,
  };
}
