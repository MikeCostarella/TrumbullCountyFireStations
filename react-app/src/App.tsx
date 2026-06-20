import { useCallback, useRef, useState } from 'react';
import type L from 'leaflet';
import stationsData from './data/stations.json';
import type { Station } from './types/station';
import { departmentCount } from './lib';
import TitleBar from './components/TitleBar';
import StationSearch from './components/StationSearch';
import StationMap from './components/StationMap';

const STATIONS = stationsData as Station[];

export default function App() {
  const [collapsed, setCollapsed] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  );
  const [invalidateTick, setInvalidateTick] = useState(0);

  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>({});

  const registerMap = useCallback((m: L.Map) => {
    mapRef.current = m;
  }, []);

  function toggleHeader() {
    setCollapsed((c) => !c);
    setInvalidateTick((t) => t + 1);
  }

  function flyToStation(id: string) {
    const map = mapRef.current;
    const marker = markerRefs.current[id];
    if (!map || !marker) return;
    const ll = marker.getLatLng();
    map.flyTo(ll, Math.max(map.getZoom(), 14), { duration: 0.6 });
    setTimeout(() => marker.openPopup(), 650);
  }

  return (
    <div className="app-shell">
      <TitleBar
        stationCount={STATIONS.length}
        departmentCount={departmentCount(STATIONS)}
        collapsed={collapsed}
        onToggle={toggleHeader}
      />
      <StationSearch stations={STATIONS} onSelect={flyToStation} />
      <div id="map" style={{ position: 'absolute', inset: 0 }}>
        <StationMap
          stations={STATIONS}
          markerRefs={markerRefs}
          registerMap={registerMap}
          onHeaderInvalidate={invalidateTick}
        />
      </div>
    </div>
  );
}
