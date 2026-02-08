/**
 * US city regions as GeoJSON-like polygons (simplified bounds for click-to-zoom).
 * Each city has id, name, center [lng, lat], bounds for the viewport, and polygon for hit-testing.
 */
export const CITIES = [
  {
    id: 'new-york',
    name: 'New York',
    center: [-73.98, 40.75],
    zoom: 11,
    polygon: [
      [-74.25, 40.52],
      [-73.72, 40.52],
      [-73.72, 40.98],
      [-74.25, 40.98],
      [-74.25, 40.52],
    ],
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    center: [-118.24, 34.05],
    zoom: 10,
    polygon: [
      [-118.67, 33.70],
      [-117.81, 33.70],
      [-117.81, 34.40],
      [-118.67, 34.40],
      [-118.67, 33.70],
    ],
  },
  {
    id: 'chicago',
    name: 'Chicago',
    center: [-87.65, 41.85],
    zoom: 10,
    polygon: [
      [-87.95, 41.64],
      [-87.52, 41.64],
      [-87.52, 42.06],
      [-87.95, 42.06],
      [-87.95, 41.64],
    ],
  },
  {
    id: 'boston',
    name: 'Boston',
    center: [-71.06, 42.36],
    zoom: 11,
    polygon: [
      [-71.19, 42.22],
      [-70.93, 42.22],
      [-70.93, 42.50],
      [-71.19, 42.50],
      [-71.19, 42.22],
    ],
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    center: [-122.42, 37.77],
    zoom: 11,
    polygon: [
      [-122.52, 37.70],
      [-122.35, 37.70],
      [-122.35, 37.84],
      [-122.52, 37.84],
      [-122.52, 37.70],
    ],
  },
  {
    id: 'seattle',
    name: 'Seattle',
    center: [-122.33, 47.61],
    zoom: 10,
    polygon: [
      [-122.45, 47.49],
      [-122.22, 47.49],
      [-122.22, 47.73],
      [-122.45, 47.73],
      [-122.45, 47.49],
    ],
  },
  {
    id: 'denver',
    name: 'Denver',
    center: [-104.99, 39.74],
    zoom: 10,
    polygon: [
      [-105.11, 39.61],
      [-104.87, 39.61],
      [-104.87, 39.87],
      [-105.11, 39.87],
      [-105.11, 39.61],
    ],
  },
  {
    id: 'miami',
    name: 'Miami',
    center: [-80.19, 25.77],
    zoom: 10,
    polygon: [
      [-80.32, 25.71],
      [-80.06, 25.71],
      [-80.06, 25.83],
      [-80.32, 25.83],
      [-80.32, 25.71],
    ],
  },
];

/** Default US view */
export const US_VIEW = {
  longitude: -95.71,
  latitude: 37.09,
  zoom: 3.5,
};
