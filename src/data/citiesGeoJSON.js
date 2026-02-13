/**
 * Build GeoJSON FeatureCollection from cities array for the base map layer.
 * Supports single polygon or multiple (e.g. LA mainland + islands).
 * @param {Array<{ id: string, name: string, polygon: number[][], polygons?: number[][][] }>} cities
 */
export function getCitiesGeoJSON(cities) {
  return {
    type: 'FeatureCollection',
    features: cities.map((city) => {
      const rings = city.polygons ?? (city.polygon?.length ? [city.polygon] : []);
      const coordinates = rings.map((ring) => [ring.map(([lng, lat]) => [lng, lat])]);
      const isMulti = coordinates.length > 1;
      return {
        type: 'Feature',
        id: String(city.id),
        properties: { name: city.name, id: String(city.id) },
        geometry: isMulti
          ? { type: 'MultiPolygon', coordinates }
          : { type: 'Polygon', coordinates: coordinates[0] ?? [] },
      };
    }),
  };
}
