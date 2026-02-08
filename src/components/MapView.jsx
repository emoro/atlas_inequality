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
            'fill-color': 'rgba(99, 102, 241, 0.25)',
            'fill-outline-color': 'rgba(129, 140, 248, 0.6)',
          },
        });
        map.on('click', 'cities-fill', (e) => {
          e.originalEvent?.preventDefault();
          const feature = e.features?.[0];
          if (feature) {
            const id = feature.id ?? feature.properties?.id;
            const city = cities.find((c) => c.id === id);
            if (city) onSelectCity(city);
          }
        });
      }
      map.getCanvas().style.cursor = 'default';
      map.on('mouseenter', 'cities-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'cities-fill', () => {
        map.getCanvas().style.cursor = 'default';
      });
      if (onViewportChange) {
        onViewportChange(serializeBounds(map.getBounds()));
        map.on('moveend', () => {
          if (onViewportChange) onViewportChange(serializeBounds(map.getBounds()));
        });
      }
    },
    [geojson, onSelectCity, onViewportChange]
  );

  const layers = useMemo(() => {
    if (!dataPoints || dataPoints.length === 0) return [];
    return [
      new ScatterplotLayer({
        id: 'inequality-points',
        data: dataPoints,
        getPosition: (d) => d.position,
        getFillColor: (d) => [...scoreToColor(d.score), 200],
        getRadius: 15,
        radiusUnits: 'meters',
        radiusMinPixels: 1,
        radiusMaxPixels: 12,
        pickable: true,
      }),
    ];
  }, [dataPoints]);

  const [hoveredInfo, setHoveredInfo] = useState(null);

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
    </div>
  );
}
