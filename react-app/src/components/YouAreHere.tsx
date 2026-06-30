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

// Trumbull County extent (WGS84), used to decide how to frame the locate fly:
// inside the county we zoom in close; outside it we only zoom far enough to show
// the whole county alongside the user's position.
const COUNTY_BOUNDS = { south: 41.10, west: -81.01, north: 41.36, east: -80.51 };
// Closest zoom used when framing an out-of-county user with the whole county in
// view (keeps the county from filling the screen for a user just over the line).
const OUT_OF_COUNTY_MAX_ZOOM = 11;

interface Props {
  position: { lat: number; lon: number } | null;
  jurisdiction: Jurisdiction | null;
  flyTick: number;
}

export default function YouAreHere({ position, jurisdiction, flyTick }: Props) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      const { lat, lon } = position;
      const inCounty =
        lat >= COUNTY_BOUNDS.south &&
        lat <= COUNTY_BOUNDS.north &&
        lon >= COUNTY_BOUNDS.west &&
        lon <= COUNTY_BOUNDS.east;
      if (inCounty) {
        // User is in Trumbull County — zoom in close to their location.
        map.flyTo([lat, lon], Math.max(map.getZoom(), 13), { duration: 0.6 });
      } else {
        // User is outside the county — frame the whole county together with the
        // user's position so Trumbull County stays visible.
        const bounds = L.latLngBounds(
          [COUNTY_BOUNDS.south, COUNTY_BOUNDS.west],
          [COUNTY_BOUNDS.north, COUNTY_BOUNDS.east],
        ).extend([lat, lon]);
        map.flyToBounds(bounds, {
          padding: [40, 40],
          maxZoom: OUT_OF_COUNTY_MAX_ZOOM,
          duration: 0.6,
        });
      }
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
