import fs from 'fs';
import { normalizeAircraftType } from '@/server/utils/normalizeAircraftType';

let aircraftLookupCache = null;
let aircraftTypesCache = null;

export function getAircraftLookup() {
  if (aircraftLookupCache) return aircraftLookupCache;

  const raw = fs.readFileSync('./server/data/aircraft-lookup-big.json', 'utf-8');
  aircraftLookupCache = JSON.parse(raw);

  return aircraftLookupCache;
}

export function getAircraftTypes() {
  if (aircraftTypesCache) return aircraftTypesCache;

  const raw = fs.readFileSync('./server/data/aircraft-types.json', 'utf-8');
  aircraftTypesCache = JSON.parse(raw);

  return aircraftTypesCache;
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

  return {
    rawAircraftType: rawTypecode,
    normalizedAircraftType: normalizedTypecode,

    aircraftType: rawTypecode ?? normalizedTypecode ?? null,
    aircraftLabel: typeInfo?.label ?? rawTypecode ?? null,
    aircraftManufacturer: typeInfo?.manufacturer ?? null,
    aircraftModel: typeInfo?.model ?? null,
    aircraftCategory: typeInfo?.category ?? null,
  };
}
