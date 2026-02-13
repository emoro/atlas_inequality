import Papa from 'papaparse';

/**
 * Point-in-polygon (ray-casting). Polygon is array of [lng, lat] (closed ring).
 */
export function pointInPolygon([lng, lat], polygon) {
  const n = polygon.length;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Get all exterior rings from GeoJSON geometry (one per polygon in Polygon or MultiPolygon).
 */
function getPolygonRings(geometry) {
  if (!geometry || !geometry.coordinates) return [];
  const coords = geometry.coordinates;
  if (geometry.type === 'Polygon') return coords[0] ? [coords[0]] : [];
  if (geometry.type === 'MultiPolygon') return (coords || []).map((p) => p[0]).filter(Boolean);
  return [];
}

/**
 * Bbox center from a ring [[lng, lat], ...].
 */
function ringCenter(ring) {
  if (!ring?.length) return [0, 0];
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

const DEFAULT_ZOOM = 10;

/**
 * Parse GeoJSON FeatureCollection into app city format.
 * Each feature: Polygon or MultiPolygon. Preserves all polygons (e.g. LA mainland + islands).
 * Uses properties.GEOID as id when present (e.g. CBSA data).
 */
export function parseGeoJSONCities(geojson) {
  const features = geojson?.features ?? [];
  return features.map((f, i) => {
    const rings = getPolygonRings(f.geometry);
    const polygons = rings.map((ring) => ring.map(([lng, lat]) => [lng, lat]));
    const firstRing = rings[0] ?? null;
    const props = f.properties ?? {};
    const cityCenterLon = parseFloat(props.city_center_lon);
    const cityCenterLat = parseFloat(props.city_center_lat);
    const center =
      Number.isFinite(cityCenterLon) && Number.isFinite(cityCenterLat)
        ? [cityCenterLon, cityCenterLat]
        : ringCenter(firstRing);
    const id = f.id ?? props.GEOID ?? props.id ?? props.name ?? `city-${i}`;
    const name = props.NAME ?? props.name ?? String(id);
    const zoom = typeof props.zoom === 'number' ? props.zoom : DEFAULT_ZOOM;
    return {
      id: String(id),
      name: String(name),
      center,
      zoom,
      polygon: polygons[0] ?? [],
      polygons,
    };
  }).filter((c) => c.polygons.length > 0 && c.polygons.some((p) => p.length > 0));
}

/**
 * Parse CSV with your exact schema (no auto-discovery).
 * Columns: lon, lat, nusers, nstays, p1a, p2a, p3a, p4a, name, pcat, cat, segregation, cbsa.
 * Returns points: { position, score, category, city, id, name, p1a?, p2a?, p3a?, p4a? }.
 */
export function parseCBSAPoints(csvText) {
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const rows = parsed.data ?? [];
  const points = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lon = parseFloat(row.lon);
    const lat = parseFloat(row.lat);
    const segregation = parseFloat(row.segregation);
    if (Number.isNaN(lon) || Number.isNaN(lat) || Number.isNaN(segregation)) continue;
    const score = Math.max(0, Math.min(1, segregation));
    const category = String(row.pcat ?? '').trim() || 'Other';
    const subcategory = String(row.cat ?? '').trim() || undefined;
    const city = String(row.cbsa ?? '').trim() || undefined;
    const name = String(row.name ?? '').trim() || undefined;
    const p1a = parseFloat(row.p1a);
    const p2a = parseFloat(row.p2a);
    const p3a = parseFloat(row.p3a);
    const p4a = parseFloat(row.p4a);
    const point = {
      position: [lon, lat],
      score,
      category,
      city,
      id: `point-${i}`,
      ...(name && { name }),
      ...(subcategory && { subcategory }),
    };
    if (!Number.isNaN(p1a)) point.p1a = Math.max(0, Math.min(1, p1a));
    if (!Number.isNaN(p2a)) point.p2a = Math.max(0, Math.min(1, p2a));
    if (!Number.isNaN(p3a)) point.p3a = Math.max(0, Math.min(1, p3a));
    if (!Number.isNaN(p4a)) point.p4a = Math.max(0, Math.min(1, p4a));
    points.push(point);
  }
  return points;
}

/** Supported CSV column names (first match wins). */
const LNG_KEYS = ['lon', 'longitude', 'lng'];
const LAT_KEYS = ['latitude', 'lat'];
const SCORE_KEYS = ['score', 'inequality_score', 'inequality'];
const CATEGORY_KEYS = ['category', 'place_category', 'type'];
const ID_KEYS = ['id', 'point_id'];
const CITY_KEYS = ['cbsa', 'city', 'city_id', 'city_name'];

/**
 * Parse CSV text into points: { position: [lng, lat], score, category, id?, city? }.
 * score must be in [0, 1]; category should match PLACE_CATEGORIES.
 * city (optional) should match the city id or name from your GeoJSON for filtering.
 */
export function parseCSVPoints(csvText, options = {}) {
  const { skipInvalid = true } = options;
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const rows = parsed.data ?? [];
  const headers = parsed.meta?.fields ?? (rows[0] ? Object.keys(rows[0]) : []);

  const norm = (h) => String(h ?? '').trim().toLowerCase();
  const lngKey = headers.find((h) => LNG_KEYS.includes(norm(h)));
  const latKey = headers.find((h) => LAT_KEYS.includes(norm(h)));
  const scoreKey = headers.find((h) => SCORE_KEYS.includes(norm(h)));
  const categoryKey = headers.find((h) => CATEGORY_KEYS.includes(norm(h)));
  const idKey = headers.find((h) => ID_KEYS.includes(norm(h)));
  const cityKey = headers.find((h) => CITY_KEYS.includes(norm(h)));
  const p1aKey = headers.find((h) => norm(h) === 'p1a');
  const p2aKey = headers.find((h) => norm(h) === 'p2a');
  const p3aKey = headers.find((h) => norm(h) === 'p3a');
  const p4aKey = headers.find((h) => norm(h) === 'p4a');

  if (!lngKey || !latKey || !scoreKey) {
    throw new Error(
      'CSV must have longitude/lng, latitude/lat, and score columns. ' +
      `Found headers: ${headers.join(', ')}`
    );
  }

  const points = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lng = parseFloat(row[lngKey]);
    const lat = parseFloat(row[latKey]);
    const score = parseFloat(row[scoreKey]);
    const category = categoryKey ? String(row[categoryKey] ?? '').trim() : 'Other';
    const id = idKey ? row[idKey] : `point-${i}`;
    const city = cityKey ? String(row[cityKey] ?? '').trim() : undefined;

    if (Number.isNaN(lng) || Number.isNaN(lat) || Number.isNaN(score)) {
      if (skipInvalid) continue;
      throw new Error(`Invalid row ${i + 2}: lng=${row[lngKey]}, lat=${row[latKey]}, score=${row[scoreKey]}`);
    }

    const clampedScore = Math.max(0, Math.min(1, score));
    const point = {
      position: [lng, lat],
      score: clampedScore,
      category: category || 'Other',
      id: String(id),
    };
    if (city) point.city = city;
    if (p1aKey != null) {
      const v = parseFloat(row[p1aKey]);
      if (!Number.isNaN(v)) point.p1a = Math.max(0, Math.min(1, v));
    }
    if (p2aKey != null) {
      const v = parseFloat(row[p2aKey]);
      if (!Number.isNaN(v)) point.p2a = Math.max(0, Math.min(1, v));
    }
    if (p3aKey != null) {
      const v = parseFloat(row[p3aKey]);
      if (!Number.isNaN(v)) point.p3a = Math.max(0, Math.min(1, v));
    }
    if (p4aKey != null) {
      const v = parseFloat(row[p4aKey]);
      if (!Number.isNaN(v)) point.p4a = Math.max(0, Math.min(1, v));
    }
    points.push(point);
  }
  return points;
}

const DATA_BASE = '/data';

/**
 * Load points from public/data/points.csv.
 */
export async function loadPointsCSV() {
  const res = await fetch(`${DATA_BASE}/points.csv`);
  if (!res.ok) throw new Error(`Failed to load points: ${res.status}`);
  const text = await res.text();
  return parseCSVPoints(text);
}

/**
 * Load cities from public/data/cities.geojson.
 */
export async function loadCitiesGeoJSON() {
  const res = await fetch(`${DATA_BASE}/cities.geojson`);
  if (!res.ok) throw new Error(`Failed to load cities: ${res.status}`);
  const geojson = await res.json();
  return parseGeoJSONCities(geojson);
}

/**
 * Load both. Returns { points, cities }. Throws on fetch/parse error.
 */
export async function loadAllData() {
  const [points, cities] = await Promise.all([
    loadPointsCSV(),
    loadCitiesGeoJSON(),
  ]);
  return { points, cities };
}
