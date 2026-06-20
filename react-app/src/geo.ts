import countyData from './data/trumbull-boundary.json';
// Optional jurisdiction layers (municipalities + townships). These files are
// added by you (from THAM/Hydrants/AddressPoints). If absent, jurisdiction
// resolution falls back to the county name. See data/README-boundaries.md.
import jurisdictionsData from './data/trumbull-jurisdictions.json';

type Ring = number[][];
type PolyGeom =
  | { type: 'Polygon'; coordinates: Ring[] }
  | { type: 'MultiPolygon'; coordinates: Ring[][] };

interface Feature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: PolyGeom;
}
interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

// ---- County boundary (single Feature) ----
const county = countyData as Feature;
const countyRings: Ring[] =
  county.geometry.type === 'Polygon'
    ? [county.geometry.coordinates[0]]
    : county.geometry.coordinates.map((p) => p[0]);

// ---- Jurisdiction layer (FeatureCollection; may be an empty placeholder) ----
const jurisdictions = jurisdictionsData as FeatureCollection;

// Property names to try, in order, when reading a jurisdiction's display name.
// Adjust if your files use a different key (e.g. "NAMELSAD", "NAME", "name").
const NAME_KEYS = ['NAME', 'name', 'NAMELSAD', 'Name', 'JURISDICTION', 'Jurisdiction'];
// Property names to try for the type (City / Village / Township), if present.
const TYPE_KEYS = ['LSAD', 'TYPE', 'type', 'JurisdictionType', 'CLASSFP'];

function readName(props: Record<string, unknown>): string | null {
  for (const k of NAME_KEYS) {
    const v = props[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}
function readType(props: Record<string, unknown>): string | null {
  for (const k of TYPE_KEYS) {
    const v = props[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

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

function inFeature(lon: number, lat: number, geom: PolyGeom): boolean {
  if (geom.type === 'Polygon') {
    return inRing(lon, lat, geom.coordinates[0]);
  }
  return geom.coordinates.some((poly) => inRing(lon, lat, poly[0]));
}

// True if the coordinate falls within the county boundary.
export function isInTrumbullCounty(lat: number, lon: number): boolean {
  return countyRings.some((ring) => inRing(lon, lat, ring));
}

export interface Jurisdiction {
  name: string;
  type: string | null;
}

// Resolve the specific municipality/township at a coordinate. Falls back to
// the county when no jurisdiction layer feature matches (or the layer is empty).
export function jurisdictionAt(lat: number, lon: number): Jurisdiction {
  for (const f of jurisdictions.features ?? []) {
    if (f.geometry && inFeature(lon, lat, f.geometry)) {
      const name = readName(f.properties);
      if (name) return { name, type: readType(f.properties) };
    }
  }
  return { name: 'Trumbull County', type: 'County' };
}
