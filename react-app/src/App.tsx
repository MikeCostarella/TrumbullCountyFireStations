import { useCallback, useRef, useState } from 'react';
import type L from 'leaflet';
import stationsData from './data/stations.json';
import type { Station } from './types/station';
import { departmentCount } from './lib';
import TopBar from './components/TopBar';
import type { ViewId } from './components/TopBar';
import TitleBar from './components/TitleBar';
import StationSearch from './components/StationSearch';
import StationMap from './components/StationMap';
import StationList from './components/StationList';

const STATIONS = stationsData as Station[];

export default function App() {
  const [view, setView] = useState<ViewId>('map');
  const [menuOpen, setMenuOpen] = useState(false);
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

  function showOnMap(id: string) {
    setView('map');
    setInvalidateTick((t) => t + 1);
    setTimeout(() => flyToStation(id), 120);
  }

  return (
    <div className="app-shell">
      <TopBar active={view} onSelect={setView} open={menuOpen} onToggle={setMenuOpen} />

      {/* Map pane stays mounted (hidden in list view) so pan/zoom + fly-to are
          preserved. The title bar and search float within this pane. */}
      <div className="view-pane" style={{ display: view === 'map' ? 'block' : 'none' }}>
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

      {view === 'list' && (
        <div className="view-pane list-pane">
          <StationList stations={STATIONS} onSelect={showOnMap} />
        </div>
      )}
    </div>
  );
}
