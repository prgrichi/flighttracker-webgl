import fs from 'fs';
import csv from 'csv-parser';

const aircraftTypes = JSON.parse(fs.readFileSync('./server/data/aircraft-types.json', 'utf-8'));

const inputFile = './server/data/aircraftDatabase.csv';
const outputFile = './server/data/aircraft-lookup.json';

const allowedTypes = new Set(Object.keys(aircraftTypes));
const lookup = {};

function run() {
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', row => {
      const icao24 = row.icao24?.toLowerCase();
      const typecode = row.typecode;

      // nur unsere gewünschten Typen
      if (!icao24 || !typecode) return;
      if (!allowedTypes.has(typecode)) return;

      lookup[icao24] = typecode;
    })
    .on('end', () => {
      fs.writeFileSync(outputFile, JSON.stringify(lookup));
      console.log('✅ Done:', Object.keys(lookup).length, 'entries');
    });
}

run();
