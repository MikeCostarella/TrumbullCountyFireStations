import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { FeatureCollection, Geometry } from 'geojson';
import muniData from '../data/municipalities-layer.json';
import townData from '../data/townships-layer.json';

const municipalities = muniData as FeatureCollection;
const townships = townData as FeatureCollection;

interface LabelProps {
  name: string;
  labelLat: number;
  labelLon: number;
}

// Always-on text label centered on a jurisdiction.
function labelIcon(name: string, variant: 'muni' | 'town') {
  return L.divIcon({
    className: 'boundary-label boundary-label-' + variant,
    html: `<span>${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function Labels({ data, variant }: { data: FeatureCollection; variant: 'muni' | 'town' }) {
  return (
    <>
      {data.features.map((f, i) => {
        const p = f.properties as unknown as LabelProps;
        if (typeof p.labelLat !== 'number' || typeof p.labelLon !== 'number') return null;
        return (
          <Marker
            key={i}
            position={[p.labelLat, p.labelLon]}
            icon={labelIcon(p.name, variant)}
            interactive={false}
            keyboard={false}
          />
        );
      })}
    </>
  );
}

interface Props {
  showMunicipalities: boolean;
  showTownships: boolean;
}

export default function BoundaryLayers({ showMunicipalities, showTownships }: Props) {
  return (
    <>
      {showTownships && (
        <>
          <GeoJSON
            key="town-geo"
            data={townships as FeatureCollection<Geometry>}
            style={{ color: '#7c6f64', weight: 1.5, fill: false, dashArray: '4 3', opacity: 0.85 }}
          />
          <Labels data={townships} variant="town" />
        </>
      )}
      {showMunicipalities && (
        <>
          <GeoJSON
            key="muni-geo"
            data={municipalities as FeatureCollection<Geometry>}
            style={{ color: '#a32a10', weight: 2, fill: false, opacity: 0.9 }}
          />
          <Labels data={municipalities} variant="muni" />
        </>
      )}
    </>
  );
}
