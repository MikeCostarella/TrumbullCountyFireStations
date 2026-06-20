import type { LocateStatus } from '../useGeolocation';

interface Props {
  status: LocateStatus;
  onLocate: () => void;
}

// Short status note shown beside the button for non-success states.
function note(status: LocateStatus): string | null {
  switch (status) {
    case 'locating':
      return 'Finding your location…';
    case 'outside':
      return "You're outside Trumbull County";
    case 'denied':
      return 'Location permission denied';
    case 'error':
      return 'Location unavailable';
    default:
      return null;
  }
}

export default function LocateControl({ status, onLocate }: Props) {
  const msg = note(status);
  const busy = status === 'locating';
  return (
    <div className="locate-control">
      <button
        type="button"
        className={'locate-btn' + (status === 'inside' ? ' is-active' : '')}
        onClick={onLocate}
        disabled={busy}
        aria-label="Find my location"
        title="Find my location"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={busy ? 'spin' : ''}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
        <span>You are here</span>
      </button>
      {msg && <div className={'locate-note locate-note-' + status}>{msg}</div>}
    </div>
  );
}
