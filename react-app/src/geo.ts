import boundaryData from './data/trumbull-boundary.json';

// A GeoJSON Feature with Polygon or MultiPolygon geometry.
type Ring = number[][];
interface BoundaryFeature {
  geometry:
    | { type: 'Polygon'; coordinates: Ring[] }
    | { type: 'MultiPolygon'; coordinates: Ring[][] };
}

const boundary = boundaryData as BoundaryFeature;

// Outer rings to test against (one for Polygon, several for MultiPolygon).
const polygons: Ring[] =
  boundary.geometry.type === 'Polygon'
    ? [boundary.geometry.coordinates[0]]
    : boundary.geometry.coordinates.map((poly) => poly[0]);

// Ray-casting point-in-polygon. lon/lat order matches GeoJSON coordinates.
function inRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// True if the coordinate falls within the county boundary.
export function isInTrumbullCounty(lat: number, lon: number): boolean {
  return polygons.some((ring) => inRing(lon, lat, ring));
}
