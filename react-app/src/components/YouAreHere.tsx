import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const youIcon = L.divIcon({
  className: 'you-marker',
  html: `<span class="you-dot"></span><span class="you-pulse"></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
});

interface Props {
  position: { lat: number; lon: number } | null;
  // bump to re-center on the user when a fresh fix arrives
  flyTick: number;
}

export default function YouAreHere({ position, flyTick }: Props) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lon], Math.max(map.getZoom(), 13), { duration: 0.6 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTick]);

  if (!position) return null;
  return (
    <Marker position={[position.lat, position.lon]} icon={youIcon} zIndexOffset={1000}>
      <Popup className="station-popup">
        <div className="popup">
          <div className="popup-banner you-banner">
            <div className="popup-tag">Your location</div>
            <div className="popup-station">You are here</div>
          </div>
          <div className="popup-body">
            <div className="popup-row">
              <span className="popup-label">Coords</span>
              <span className="popup-value coords">
                {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
