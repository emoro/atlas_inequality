# Atlas of Inequality – Map Dashboard

A high-performance React map dashboard inspired by the MIT Atlas of Inequality. Built with Vite, React, Tailwind CSS, MapLibre GL, and deck.gl.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- **US base map** – Start with a dark-themed US map (CartoDB Dark Matter).
- **City selection** – Click a city polygon to zoom in; the map flies to the city and loads ~1,000 mock data points.
- **Inequality Index layer** – deck.gl `ScatterplotLayer` with colors from green (0) to red (1).
- **Place Categories** – Translucent sidebar on the right.
- **Inequality Index legend** – Small gradient legend in the top-left.
- **Smooth interaction** – Pan, zoom (including scroll and navigation controls), and flyTo on city click.

## Stack

- **Vite** + **React** + **Tailwind CSS**
- **react-map-gl** (maplibre) – base map and controls
- **maplibre-gl** – MapLibre GL JS
- **deck.gl** (`@deck.gl/mapbox`, `@deck.gl/layers`) – overlay and scatter layer

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run convert-data` – Build `public/data/cities.json` and `public/data/points/<cityId>.json` from CSVs (see `public/data/README.md`)

---

## Deploy to GitHub Pages (public URL)

Host the app at **https://emoro.github.io/atlas_inequality/**.

### 1. Push the full project to GitHub

From the project root (so the repo has **src/**, **index.html**, **package.json**, **vite.config.js**, **.github/**, **README.md**, etc., not only `public/data` and `.gitignore`):

```bash
git add .
git status   # optional: check what will be committed
git commit -m "Add full app source and GitHub Pages workflow"
git remote add origin https://github.com/emoro/atlas_inequality.git   # only if not already added
git push -u origin main
```

If the remote already exists and you’ve only pushed part of the project before, the same `git add .` and `git commit` will add the rest; then `git push`.

### 2. Include data in the repo

The site needs `public/data/` at build time. Generate it and commit:

```bash
npm run convert-data
git add public/data
git commit -m "Add generated cities and points data"
git push
```

### 3. Turn on GitHub Pages from Actions

1. On GitHub: **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Save.

### 4. Deploy

Every push to `main` will build and deploy. The first run might take a minute. When it’s done, open:

**https://emoro.github.io/atlas_inequality/**

To redeploy after changes: push to `main`. To deploy without pushing (e.g. after changing data), run the workflow manually: **Actions** → **Deploy to GitHub Pages** → **Run workflow**.
