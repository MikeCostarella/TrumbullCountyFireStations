import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Jurisdiction } from '../geo';

// Hydrants-style marker: a persistent "You are here" label tag sits above the
// locator pin. Clicking opens the details popup below.
const youIcon = L.divIcon({
  className: 'you-marker',
  html: `
    <span class="you-label">You are here</span>
    <span class="you-pin">
      <span class="you-pulse"></span>
      <span class="you-dot"></span>
    </span>`,
  iconSize: [120, 54],
  iconAnchor: [60, 48],     // bottom-center of the pin
  popupAnchor: [0, -50],
});

function gmapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

interface Props {
  position: { lat: number; lon: number } | null;
  jurisdiction: Jurisdiction | null;
  flyTick: number;
}

export default function YouAreHere({ position, jurisdiction, flyTick }: Props) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lon], Math.max(map.getZoom(), 13), { duration: 0.6 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTick]);

  if (!position) return null;

  const jurisName = jurisdiction
    ? jurisdiction.type && jurisdiction.type !== 'County'
      ? `${jurisdiction.name} (${jurisdiction.type})`
      : jurisdiction.name
    : 'Trumbull County';

  return (
    <Marker position={[position.lat, position.lon]} icon={youIcon} zIndexOffset={1000}>
      <Popup className="station-popup" maxWidth={290} minWidth={290} autoPanPadding={[40, 80]}>
        <div className="popup">
          <div className="popup-banner you-banner">
            <div className="popup-tag">Your location</div>
            <div className="popup-station">You are here</div>
          </div>
          <div className="popup-body">
            <div className="popup-row">
              <span className="popup-label">Jurisdiction</span>
              <span className="popup-value">{jurisName}</span>
            </div>
            <div className="popup-row">
              <span className="popup-label">Coords</span>
              <span className="popup-value coords">
                {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </span>
            </div>
            <a
              className="popup-btn"
              href={gmapsUrl(position.lat, position.lon)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
