import { useControl } from 'react-map-gl/maplibre';
import { MapboxOverlay } from '@deck.gl/mapbox';

/**
 * Deck.gl overlay for react-map-gl/maplibre. Renders deck layers (e.g. ScatterplotLayer)
 * in sync with the map view. Pass layers and optional interleaved.
 */
export function DeckGLOverlay(props) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}
