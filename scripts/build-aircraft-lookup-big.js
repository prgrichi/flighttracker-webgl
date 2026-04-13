import fs from 'fs';
import csv from 'csv-parser';

const inputFile = './server/data/aircraftDatabase.csv';
const outputFile = './server/data/aircraft-lookup.json';

const lookup = {};

function run() {
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', row => {
      const icao24 = row.icao24?.toLowerCase();
      const typecode = row.typecode?.trim();

      if (!icao24 || !typecode) return;

      lookup[icao24] = typecode;
    })
    .on('end', () => {
      fs.writeFileSync(outputFile, JSON.stringify(lookup));
      console.log('✅ Done:', Object.keys(lookup).length, 'entries');
    });
}

run();
