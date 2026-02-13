import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DeckGLOverlay } from './DeckGLOverlay.jsx';
import { ScatterplotLayer } from '@deck.gl/layers';
import { scoreToColor } from '../utils/scoreColor.js';
import { getCitiesGeoJSON } from '../data/citiesGeoJSON.js';
import { US_VIEW } from '../data/cities.js';
import { PointTooltip } from './PointTooltip.jsx';

const CARTO_DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Radius groups (in meters) used for three zoom bands:
// - Far (zoom < ZOOM_MID_START): smallest radius
// - Medium (ZOOM_MID_START ≤ zoom < ZOOM_NEAR_START): medium radius
// - Near (zoom ≥ ZOOM_NEAR_START): largest radius
const RADIUS_METERS_FAR = 1;
const RADIUS_METERS_MID = 14;
const RADIUS_METERS_NEAR = 22;

const ZOOM_MID_START = 8;   // e.g. regional view
const ZOOM_NEAR_START = 11; // city / neighborhood view

function radiusMetersForZoom(zoom) {
  if (zoom >= ZOOM_NEAR_START) return RADIUS_METERS_NEAR;
  if (zoom >= ZOOM_MID_START) return RADIUS_METERS_MID;
  return RADIUS_METERS_FAR;
}

function serializeBounds(bounds) {
  if (!bounds) return null;
  return {
    west: bounds.getWest(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    north: bounds.getNorth(),
  };
}

export function MapView({
  selectedCity,
  onSelectCity,
  dataPoints,
  onViewportChange,
  cities = [],
}) {
  const geojson = useMemo(() => getCitiesGeoJSON(cities), [cities]);
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(US_VIEW.zoom ?? 3);

  // When a city is selected: fly to it and hide city polygons. When cleared: fly to US and show polygons.
  // When a city is selected: fly to it and hide city polygons. When cleared: fly to US and show polygons.
  const prevSelectedRef = useRef(selectedCity);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('cities-fill')) return;

    if (selectedCity) {
      map.setLayoutProperty('cities-fill', 'visibility', 'none');
      map.flyTo({
        center: selectedCity.center,
        zoom: selectedCity.zoom,
        duration: 2000,
        essential: true,
      });
    } else {
      map.setLayoutProperty('cities-fill', 'visibility', 'visible');
      // Only fly back when user cleared selection (had a city before)
      if (prevSelectedRef.current) {
        map.flyTo({
          center: [US_VIEW.longitude, US_VIEW.latitude],
          zoom: US_VIEW.zoom,
          duration: 1500,
          essential: true,
        });
      }
    }
    prevSelectedRef.current = selectedCity;
  }, [selectedCity]);

  const onLoad = useCallback(
    (evt) => {
      mapRef.current = evt.target;
      const map = evt.target;
      if (!map.getSource('cities')) {
        map.addSource('cities', {
          type: 'geojson',
          data: geojson,
          promoteId: 'id',
        });
        map.addLayer({
          id: 'cities-fill',
          type: 'fill',
          source: 'cities',
          paint: {
            'fill-color': 'rgba(255, 255, 255, 0.1)',
            'fill-outline-color': 'rgba(180, 220, 255, 0.9)',
          },
        });
        map.on('click', 'cities-fill', (e) => {
          e.originalEvent?.preventDefault();
          const feature = e.features?.[0];
          if (feature) {
            const id = feature.id ?? feature.properties?.id;
            const city = cities.find((c) => c.id === String(id));
            if (city) onSelectCity(city);
          }
        });
      }
      map.getCanvas().style.cursor = 'default';
      map.on('mouseenter', 'cities-fill', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const f = e.features?.[0];
        if (f) {
          const name = f.properties?.name ?? f.properties?.NAME ?? 'City';
          setHoveredCity({ x: e.point.x, y: e.point.y, name });
        }
      });
      map.on('mousemove', 'cities-fill', (e) => {
        if (e.features?.length && e.point) {
          setHoveredCity((prev) => (prev ? { ...prev, x: e.point.x, y: e.point.y } : null));
        }
      });
      map.on('mouseleave', 'cities-fill', () => {
        map.getCanvas().style.cursor = 'default';
        setHoveredCity(null);
      });
      if (onViewportChange) {
        onViewportChange(serializeBounds(map.getBounds()));
        map.on('moveend', () => {
          if (onViewportChange) onViewportChange(serializeBounds(map.getBounds()));
        });
      }
      setZoom(map.getZoom());
    },
    [geojson, onSelectCity, onViewportChange]
  );

  const layers = useMemo(() => {
    if (!dataPoints || dataPoints.length === 0) return [];
    const radiusMeters = radiusMetersForZoom(zoom);
    return [
      new ScatterplotLayer({
        id: 'inequality-points',
        data: dataPoints,
        getPosition: (d) => d.position,
        getFillColor: (d) => [...scoreToColor(d.score), 200],
        getRadius: radiusMeters,
        radiusUnits: 'meters',
        radiusMinPixels: 1,
        radiusMaxPixels: 16,
        pickable: true,
      }),
    ];
  }, [dataPoints, zoom]);

  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);

  const handleHover = useCallback((info) => {
    setHoveredInfo(
      info.object
        ? { x: info.x, y: info.y, object: info.object }
        : null
    );
  }, []);

  const showPoints = dataPoints && dataPoints.length > 0;

  return (
    <div
      className={`relative w-full h-full ${showPoints ? 'map-showing-points' : ''}`}
    >
        <Map
        mapStyle={CARTO_DARK_STYLE}
        initialViewState={US_VIEW}
        onLoad={onLoad}
        onMove={(evt) => setZoom(evt.viewState.zoom)}
        style={{ width: '100%', height: '100%' }}
        reuseMaps
      >
        <DeckGLOverlay
          layers={layers}
          interleaved={false}
          onHover={handleHover}
          getCursor={() => (hoveredInfo ? 'pointer' : 'default')}
        />
        <NavigationControl position="bottom-right" showCompass showZoom />
      </Map>
      {hoveredInfo && (
        <PointTooltip
          x={hoveredInfo.x}
          y={hoveredInfo.y}
          point={hoveredInfo.object}
        />
      )}
      {!selectedCity && hoveredCity && (
        <div
          className="pointer-events-none absolute z-20 px-2.5 py-1.5 rounded bg-slate-900/95 text-white text-sm font-medium whitespace-nowrap border border-slate-600 shadow-lg"
          style={{
            left: hoveredCity.x,
            top: hoveredCity.y,
            transform: 'translate(12px, -50%)',
          }}
        >
          {hoveredCity.name}
        </div>
      )}
    </div>
  );
}
