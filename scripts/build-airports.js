import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

const INPUT_FILE = path.resolve('data/airports.csv');
const OUTPUT_DIR = path.resolve('public/data/airports');

const ALLOWED_TYPES = new Set(['large_airport', 'medium_airport', 'small_airport', 'heliport']);

function clean(value) {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  return str === '' ? null : str;
}

function toNumber(value, decimals = 5) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Number(num.toFixed(decimals));
}

function getId(row) {
  return (
    clean(row.icao_code) ||
    clean(row.gps_code) ||
    clean(row.ident) ||
    clean(row.local_code) ||
    String(row.id)
  );
}

function toFeature(row) {
  const lon = toNumber(row.longitude_deg);
  const lat = toNumber(row.latitude_deg);

  if (lon === null || lat === null) return null;

  return {
    type: 'Feature',
    properties: {
      id: getId(row),
      name: clean(row.name),
      iata: clean(row.iata_code),
      icao: clean(row.icao_code),
      airportType: clean(row.type),
    },
    geometry: {
      type: 'Point',
      coordinates: [lon, lat],
    },
  };
}

function filterRows(rows) {
  return rows.filter(row => {
    const type = clean(row.type);
    if (!ALLOWED_TYPES.has(type)) return false;
    if (!Number.isFinite(Number(row.latitude_deg))) return false;
    if (!Number.isFinite(Number(row.longitude_deg))) return false;
    return true;
  });
}

function sortFeatures(features) {
  const typeOrder = {
    large_airport: 0,
    medium_airport: 1,
    small_airport: 2,
    heliport: 3,
  };

  return features.sort((a, b) => {
    const typeA = a.properties.airportType;
    const typeB = b.properties.airportType;

    if (typeA !== typeB) {
      return (typeOrder[typeA] ?? 99) - (typeOrder[typeB] ?? 99);
    }

    return (a.properties.name || '').localeCompare(b.properties.name || '');
  });
}

function toFeatureCollection(features) {
  return {
    type: 'FeatureCollection',
    features: sortFeatures(features),
  };
}

async function writeGeoJSON(filename, rows) {
  const features = rows.map(toFeature).filter(Boolean);
  const filePath = path.join(OUTPUT_DIR, filename);

  await fs.writeFile(filePath, JSON.stringify(toFeatureCollection(features)), 'utf8');

  return features.length;
}

async function main() {
  const csvRaw = await fs.readFile(INPUT_FILE, 'utf8');

  const rows = parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
  });

  const airports = filterRows(rows);

  const bavariaRows = airports.filter(row => row.iso_region === 'DE-BY');
  const germanyRows = airports.filter(row => row.iso_country === 'DE');
  const europeRows = airports.filter(row => row.continent === 'EU');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const bavariaCount = await writeGeoJSON('airports-bavaria.geojson', bavariaRows);
  const germanyCount = await writeGeoJSON('airports-germany.geojson', germanyRows);
  const europeCount = await writeGeoJSON('airports-europe.geojson', europeRows);

  console.log('Done.');
  console.log(`Bavaria: ${bavariaCount}`);
  console.log(`Germany: ${germanyCount}`);
  console.log(`Europe: ${europeCount}`);
}

main().catch(err => {
  console.error('Failed to build airport files:', err);
  process.exit(1);
});
