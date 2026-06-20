import { useCallback, useRef, useState } from 'react';
import { isInTrumbullCounty } from './geo';

export type LocateStatus =
  | 'idle'
  | 'locating'
  | 'inside'   // located, within Trumbull County
  | 'outside'  // located, but outside the county
  | 'denied'   // permission denied
  | 'error';   // unavailable / timed out

export interface LocateState {
  status: LocateStatus;
  position: { lat: number; lon: number } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<LocateState>({ status: 'idle', position: null });
  // Guard so an auto-attempt only fires once.
  const attempted = useRef(false);

  const locate = useCallback((opts?: { auto?: boolean }) => {
    if (opts?.auto) {
      if (attempted.current) return;
      attempted.current = true;
    }
    if (!('geolocation' in navigator)) {
      setState({ status: 'error', position: null });
      return;
    }
    setState((s) => ({ ...s, status: 'locating' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const inside = isInTrumbullCounty(lat, lon);
        setState({ status: inside ? 'inside' : 'outside', position: { lat, lon } });
      },
      (err) => {
        setState({
          status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error',
          position: null,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, locate };
}
