import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapView } from './components/MapView.jsx';
import { AppHeader } from './components/AppHeader.jsx';
import { InequalityLegend } from './components/InequalityLegend.jsx';
import { PlaceCategoriesSidebar } from './components/PlaceCategoriesSidebar.jsx';

const DATA_BASE = `${import.meta.env.BASE_URL}data`.replace(/\/+/g, '/');

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewportBounds, setViewportBounds] = useState(null);

  const [cities, setCities] = useState(null);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState(null);

  const [pointsData, setPointsData] = useState([]);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setCitiesLoading(true);
    setCitiesError(null);
    fetch(`${DATA_BASE}/cities.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Cities: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch((err) => {
        if (!cancelled) setCitiesError(err.message);
      })
      .finally(() => {
        if (!cancelled) setCitiesLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedCity) {
      setPointsData([]);
      setPointsError(null);
      return;
    }
    let cancelled = false;
    setPointsLoading(true);
    setPointsError(null);
    fetch(`${DATA_BASE}/points/${selectedCity.id}.json`)
      .then((r) => {
        if (r.status === 404) return [];
        if (!r.ok) throw new Error(`Points: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setPointsData(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          setPointsError(err.message);
          setPointsData([]);
        }
      })
      .finally(() => {
        if (!cancelled) setPointsLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedCity]);

  const onSelectCity = useCallback((city) => {
    setSelectedCity(city);
  }, []);

  const onSelectAnotherCity = useCallback(() => {
    setSelectedCity(null);
  }, []);

  const onSelectCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const allDataPoints = pointsData;

  const dataPoints = useMemo(() => {
    if (!selectedCategory) return allDataPoints;
    return allDataPoints.filter((p) => p.category === selectedCategory);
  }, [allDataPoints, selectedCategory]);

  const onViewportChange = useCallback((bounds) => {
    setViewportBounds(bounds);
  }, []);

  const visiblePoints = useMemo(() => {
    if (!viewportBounds || !dataPoints.length) return [];
    const { west, south, east, north } = viewportBounds;
    return dataPoints.filter(
      (p) =>
        p.position[0] >= west &&
        p.position[0] <= east &&
        p.position[1] >= south &&
        p.position[1] <= north
    );
  }, [dataPoints, viewportBounds]);

  const placeCategories = useMemo(
    () => [...new Set(pointsData.map((p) => p.category).filter(Boolean))].sort(),
    [pointsData]
  );

  if (citiesLoading) {
    return (
      <div className="flex flex-col w-full h-full overflow-hidden bg-slate-900 items-center justify-center gap-2">
        <div className="animate-pulse text-slate-400">Loading map…</div>
      </div>
    );
  }
  if (citiesError) {
    return (
      <div className="flex flex-col w-full h-full overflow-hidden bg-slate-900 items-center justify-center gap-2 p-4">
        <div className="text-red-400">Failed to load cities: {citiesError}</div>
        <div className="text-slate-500 text-sm">Check that public/data/cities.json exists (run npm run convert-data).</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <AppHeader
        selectedCity={selectedCity}
        onSelectAnotherCity={onSelectAnotherCity}
      />
      <div className="flex flex-1 min-h-0 border-0">
        <div className="flex-1 relative min-w-0 border-0">
          <MapView
            selectedCity={selectedCity}
            onSelectCity={onSelectCity}
            dataPoints={dataPoints}
            onViewportChange={onViewportChange}
            cities={cities ?? []}
          />
          <InequalityLegend />
          {pointsLoading && selectedCity && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-slate-800/95 px-4 py-2 text-sm text-slate-300">
              Loading points…
            </div>
          )}
          {pointsError && selectedCity && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-lg bg-red-900/80 px-4 py-2 text-sm text-red-200">
              {pointsError}
            </div>
          )}
          {selectedCity && !pointsLoading && !pointsError && (
            <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-2 text-sm text-white/90">
              Viewing: <strong>{selectedCity.name}</strong>
            </div>
          )}
        </div>
        <PlaceCategoriesSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          visiblePoints={visiblePoints}
          categories={placeCategories}
        />
      </div>
    </div>
  );
}

export default App;
