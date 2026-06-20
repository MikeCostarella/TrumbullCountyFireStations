import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Station } from '../types/station';
import { gmapsUrl } from '../lib';
import YouAreHere from './YouAreHere';
import type { Jurisdiction } from '../geo';
import { jurisdictionAt } from '../geo';
import BoundaryLayers from './BoundaryLayers';
import type { LayerState } from './MapLayersControl';

// ---- Custom marker icon (SVG shield + flame), ported from the prototype ----
const markerSvg = `
<svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff6a3d"/>
      <stop offset="100%" stop-color="#a32a10"/>
    </linearGradient>
  </defs>
  <path d="M18 0 C8 0 1 7 1 16 C1 27 18 44 18 44 C18 44 35 27 35 16 C35 7 28 0 18 0 Z"
        fill="url(#g)" stroke="#ffffff" stroke-width="1.5"/>
  <circle cx="18" cy="16" r="10" fill="#1a1614" opacity="0.25"/>
  <path d="M18 8 C18 8 14.5 11 14.5 14.5 C14.5 17 16 18.5 18 18.5 C20 18.5 21.5 17 21.5 14.5 C21.5 13 20.5 12 19.5 11 C18.7 10.2 18.5 9.5 18.5 8.5 C18.5 8.5 17.7 9.2 17.7 10 C17.7 10.7 18 11.4 18 11.4 C18 11.4 17 10.8 16.5 10 C16.3 10.7 16.5 11.5 17 12 C17.3 12.3 17.5 12.6 17.5 13 C17.5 13.5 17 14 17 14 C17 14 18 13.7 18.5 13 C19 12.3 19 11.5 19 11.5 C19 11.5 19.5 12.2 19.5 13 C19.5 13.7 19 14.3 18 14.5 C18.5 14.7 19 15 19 15.4"
        fill="#fff"/>
</svg>`;

const stationIcon = L.divIcon({
  className: 'station-marker',
  html: markerSvg,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  tooltipAnchor: [0, -38],
  popupAnchor: [0, -42],
});

const popupBtnSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Fit the map to all stations once on mount.
function FitBounds({ stations }: { stations: Station[] }) {
  const map = useMap();
  useEffect(() => {
    if (!stations.length) return;
    const bounds = L.latLngBounds(stations.map((s) => [s.Latitude, s.Longitude]));
    map.fitBounds(bounds, { padding: [60, 40] });
  }, [map, stations]);
  return null;
}

// Expose the map instance and a marker registry to the parent for fly-to.
function MapBridge({
  registerMap,
}: {
  registerMap: (map: L.Map) => void;
}) {
  const map = useMap();
  useEffect(() => {
    registerMap(map);
  }, [map, registerMap]);
  return null;
}

interface Props {
  stations: Station[];
  markerRefs: React.MutableRefObject<Record<string, L.Marker>>;
  registerMap: (map: L.Map) => void;
  onHeaderInvalidate?: number;
  youPosition: { lat: number; lon: number } | null;
  youJurisdiction: Jurisdiction | null;
  youFlyTick: number;
  layers: LayerState;
}

export default function StationMap({
  stations,
  markerRefs,
  registerMap,
  onHeaderInvalidate,
  youPosition,
  youJurisdiction,
  youFlyTick,
  layers,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);

  // Recompute size when the header collapses/expands (mirrors invalidateSize).
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 460);
    return () => clearTimeout(t);
  }, [onHeaderInvalidate]);

  return (
    <MapContainer
      className="station-map"
      zoomControl
      attributionControl
      style={{ height: '100%', width: '100%' }}
      center={[41.3, -80.76]}
      zoom={10}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      <FitBounds stations={stations} />
      <BoundaryLayers
        showMunicipalities={layers.municipalities}
        showTownships={layers.townships}
      />
      <MapBridge
        registerMap={(m) => {
          mapRef.current = m;
          registerMap(m);
        }}
      />
      <YouAreHere position={youPosition} jurisdiction={youJurisdiction} flyTick={youFlyTick} />
      {stations.map((s) => (
        <Marker
          key={s.Id}
          position={[s.Latitude, s.Longitude]}
          icon={stationIcon}
          riseOnHover
          ref={(m) => {
            if (m) markerRefs.current[s.Id] = m;
          }}
        >
          <Tooltip className="station-tooltip" direction="top" offset={[0, -4]} opacity={1}>
            <div className="tooltip-dept">{s.Department}</div>
            <div className="tooltip-station">
              {s.Station} · {s.City}
            </div>
          </Tooltip>
          <Popup className="station-popup" maxWidth={290} minWidth={290} autoPanPadding={[40, 80]}>
            <div className="popup">
              <div className="popup-banner">
                <div className="popup-tag">{s.JurisdictionType} Jurisdiction</div>
                <div className="popup-station">{s.Station}</div>
              </div>
              <div className="popup-body">
                <div className="popup-dept">{s.Department}</div>
                <div className="popup-row">
                  <span className="popup-label">Jurisdiction</span>
                  <span className="popup-value">
                    {(() => {
                      const j = jurisdictionAt(s.Latitude, s.Longitude);
                      return j.type && j.type !== 'County' ? `${j.name} (${j.type})` : j.name;
                    })()}
                  </span>
                </div>
                <div className="popup-row">
                  <span className="popup-label">Address</span>
                  <span className="popup-value">
                    {s.Address}
                    <br />
                    {s.City}, {s.State} {s.ZipCode}
                  </span>
                </div>
                <div className="popup-row">
                  <span className="popup-label">Coords</span>
                  <span className="popup-value coords">
                    {s.Latitude.toFixed(5)}, {s.Longitude.toFixed(5)}
                  </span>
                </div>
                <a className="popup-btn" href={gmapsUrl(s)} target="_blank" rel="noopener noreferrer">
                  {popupBtnSvg}
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
