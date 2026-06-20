# Trumbull County Fire Stations

An interactive directory of fire and emergency response stations serving
Trumbull County, Ohio. Built with React + TypeScript + Vite + Leaflet,
deployed to GitHub Pages.

Live site: https://mikecostarella.github.io/TrumbullCountyFireStations/

## Repository layout

| Path | What it is |
| --- | --- |
| `react-app/` | The live site — a React + TypeScript + Vite app. **This is the project that gets built and deployed.** |
| `PrototypeHTML/` | The original single-file HTML prototype the React app was ported from. |
| `SourceData/` | Source data for the station list. |
| `DBScripts/` | Database scripts used to produce the station data. |

## The data

The map is driven by `react-app/src/data/stations.json` — 45 stations across
35 departments, each with department, station name, address, city,
jurisdiction type (City / Village / Township / Joint District /
Federal-Military), ZIP, and coordinates. The TypeScript shape lives in
`react-app/src/types/station.ts`.

## Run, build, deploy

```
cd react-app
npm install      # first time
npm run dev      # local dev server
npm run build    # typecheck + production build into react-app/dist
```

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds `react-app/`
and publishes it to GitHub Pages on every push to `main`. The footer
"Last updated" stamp is injected at build time (Eastern time).

If the repo is ever renamed, update `base` in `react-app/vite.config.ts` and
the `scope`/`start_url` in the PWA manifest to match.
