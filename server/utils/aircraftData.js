import fs from 'fs';
import { normalizeAircraftType } from '@/server/utils/normalizeAircraftType';

let aircraftLookupCache = null;
let aircraftTypesCache = null;
let helicopterLookupCache = null;

export function getAircraftLookup() {
  if (aircraftLookupCache) return aircraftLookupCache;

  const rawLookup = fs.readFileSync('./server/data/aircraft-lookup.json', 'utf-8');
  const rawOverrides = fs.readFileSync('./server/data/aircraft-lookup-overrides.json', 'utf-8');
  const rawOverridesIcao = fs.readFileSync(
    './server/data/aircraft-lookup-overrides-new-icao.json',
    'utf-8'
  );

  const lookup = JSON.parse(rawLookup);
  const overrides = JSON.parse(rawOverrides);
  const newOverrides = JSON.parse(rawOverridesIcao);

  aircraftLookupCache = {
    ...lookup,
    ...overrides,
    ...newOverrides,
  };

  return aircraftLookupCache;
}

export function getAircraftTypes() {
  if (aircraftTypesCache) return aircraftTypesCache;

  const raw = fs.readFileSync('./server/data/aircraft-types.json', 'utf-8');
  aircraftTypesCache = JSON.parse(raw);

  return aircraftTypesCache;
}

function getHelicopterLookup() {
  if (helicopterLookupCache) return helicopterLookupCache;

  const raw = fs.readFileSync('./server/data/helicopter/heli-callsigns.json', 'utf-8');
  const helicopterCallsigns = JSON.parse(raw);

  helicopterLookupCache = {};

  for (const [key, value] of Object.entries(helicopterCallsigns)) {
    if (!value || typeof value !== 'object') continue;

    const normalizedIcao24 = (value.icao24 ?? key ?? '').toString().trim().toLowerCase();

    if (normalizedIcao24) helicopterLookupCache[normalizedIcao24] = value;
  }

  return helicopterLookupCache;
}

export function getHelicopterInfo(icao24) {
  const normalizedIcao24 = (icao24 ?? '').toString().trim().toLowerCase();
  if (!normalizedIcao24) return null;

  const helicopterLookup = getHelicopterLookup();
  const entry = helicopterLookup[normalizedIcao24];

  if (!entry) return null;

  return {
    organization: entry.organization ?? entry.organisation ?? null,
    name: entry.name ?? null,
    location: entry.location ?? null,
    callsign: entry.callsign ?? entry.raw_callsign ?? null,
    icao24: entry.icao24 ?? normalizedIcao24 ?? null,
  };
}

export function getAircraftInfo(icao24) {
  if (!icao24) {
    return {
      rawAircraftType: null,
      normalizedAircraftType: null,
      aircraftType: null,
      aircraftLabel: null,
      aircraftManufacturer: null,
      aircraftModel: null,
      aircraftCategory: null,
      helicopter: null,
    };
  }

  const normalizedIcao24 = icao24.toLowerCase();
  const aircraftLookup = getAircraftLookup();
  const aircraftTypes = getAircraftTypes();

  const rawTypecode = aircraftLookup[normalizedIcao24] ?? null;
  const normalizedTypecode = normalizeAircraftType(rawTypecode);

  const exactTypeInfo = rawTypecode ? (aircraftTypes[rawTypecode] ?? null) : null;
  const normalizedTypeInfo = normalizedTypecode
    ? (aircraftTypes[normalizedTypecode] ?? null)
    : null;

  const typeInfo = exactTypeInfo ?? normalizedTypeInfo;
  const helicopter = getHelicopterInfo(normalizedIcao24);

  return {
    rawAircraftType: rawTypecode,
    normalizedAircraftType: normalizedTypecode,

    aircraftType: rawTypecode ?? normalizedTypecode ?? null,
    aircraftLabel: typeInfo?.label ?? rawTypecode ?? null,
    aircraftManufacturer: typeInfo?.manufacturer ?? null,
    aircraftModel: typeInfo?.model ?? null,
    aircraftCategory: typeInfo?.category ?? null,
    helicopter,
  };
}
