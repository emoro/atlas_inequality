#!/usr/bin/env node
/**
 * One-time conversion:
 * - Cities: public/data/cbsa_2017.GeoJSON (feature id = properties.GEOID)
 * - Points: all public/data/*.csv.gz files (each has a "cbsa" column = GEOID)
 *
 * Writes public/data/cities.json and public/data/points/<cityId>.json for on-demand loading.
 *
 * Usage: node scripts/convertDataToJson.mjs
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { parseCBSAPoints, parseGeoJSONCities } from '../src/data/loadData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'public/data');

const pointsDir = path.join(dataDir, 'points');
const PATHS = {
  geojson: path.join(dataDir, 'cbsas_2017.geojson'),
  citiesOut: path.join(dataDir, 'cities.json'),
};

function main() {
  if (!fs.existsSync(PATHS.geojson)) {
    console.error('Missing public/data/cbsas_2017.geojson');
    process.exit(1);
  }

  const csvGzFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith('.csv.gz'));
  if (csvGzFiles.length === 0) {
    console.error('No .csv.gz files found in public/data/');
    process.exit(1);
  }

  const allPoints = [];
  for (const file of csvGzFiles.sort()) {
    const filePath = path.join(dataDir, file);
    const gz = fs.readFileSync(filePath);
    const csvText = zlib.gunzipSync(gz).toString('utf-8');
    const points = parseCBSAPoints(csvText);
    for (let i = 0; i < points.length; i++) allPoints.push(points[i]);
    console.log(`  ${file}: ${points.length} points`);
  }

  const geojson = JSON.parse(fs.readFileSync(PATHS.geojson, 'utf-8'));
  const cities = parseGeoJSONCities(geojson);

  fs.writeFileSync(PATHS.citiesOut, JSON.stringify(cities), 'utf-8');
  console.log(`\nWrote ${cities.length} cities to public/data/cities.json`);

  if (!fs.existsSync(pointsDir)) fs.mkdirSync(pointsDir, { recursive: true });
  const byCity = new Map();
  for (const p of allPoints) {
    const id = p.city != null && p.city !== '' ? String(p.city) : '__no_city__';
    if (!byCity.has(id)) byCity.set(id, []);
    byCity.get(id).push(p);
  }
  const cityIds = [...byCity.keys()].filter((id) => id !== '__no_city__').sort();
  for (const cityId of cityIds) {
    const points = byCity.get(cityId);
    const outPath = path.join(pointsDir, `${cityId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(points), 'utf-8');
    console.log(`  points/${cityId}.json: ${points.length} points`);
  }
  fs.writeFileSync(path.join(pointsDir, 'manifest.json'), JSON.stringify({ cityIds }), 'utf-8');
  console.log(`\nWrote ${cityIds.length} city point files + manifest to public/data/points/`);
}

main();
