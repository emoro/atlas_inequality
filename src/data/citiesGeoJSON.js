/**
 * Build GeoJSON FeatureCollection from cities array for the base map layer.
 * @param {Array<{ id: string, name: string, polygon: number[][] }>} cities
 */
export function getCitiesGeoJSON(cities) {
  return {
    type: 'FeatureCollection',
    features: cities.map((city) => ({
      type: 'Feature',
      id: city.id,
      properties: { name: city.name, id: city.id },
      geometry: {
        type: 'Polygon',
        coordinates: [city.polygon.map(([lng, lat]) => [lng, lat])],
      },
    })),
  };
}
