# Data files (for conversion)

## Cities

**File:** `cbsa_2017.GeoJSON`  
GeoJSON FeatureCollection. City id is **`properties.GEOID`**; display name is **`properties.NAME`** (or GEOID).

## Points

**Files:** any `*.csv.gz` in this folder.

Each CSV (after decompression) must have **exactly these columns** (names as given; order does not matter):

| Column     | Meaning |
|-----------|---------|
| lon       | Longitude of the place |
| lat       | Latitude of the place |
| nusers    | Number of users visiting the place |
| nstays    | Number of visits to that place |
| p1a       | Proportion of first quantile of income |
| p2a       | Proportion of second quantile of income |
| p3a       | Proportion of third quantile of income |
| p4a       | Proportion of fourth quantile of income |
| name      | Name of the place |
| pcat      | Category of the place (used for sidebar filter) |
| cat       | Subcategory of the place |
| segregation | Inequality index (0–1), used for color and legend |
| cbsa      | City id (must match GEOID in the GeoJSON) |

The converter uses **lon**, **lat**, **segregation**, **pcat**, **cbsa**, and **name**; other columns are read but not stored in the app’s JSON.

## Run the converter

```bash
npm run convert-data
```

Writes:

- **`public/data/cities.json`** – list of cities (id, name, center, zoom, polygon). Loaded once when the app starts.
- **`public/data/points/<cityId>.json`** – one file per city with that city’s points. Loaded only when the user selects that city (on-demand).

The app no longer loads all points at once; it fetches a city’s points when you click a city, so initial load is fast. Place categories and the map use **pcat** and **cbsa** as before.
