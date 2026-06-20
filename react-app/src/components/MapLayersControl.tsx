import { useState } from 'react';

export interface LayerState {
  municipalities: boolean;
  townships: boolean;
}

interface Props {
  layers: LayerState;
  onChange: (next: LayerState) => void;
}

export default function MapLayersControl({ layers, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function toggle(key: keyof LayerState) {
    onChange({ ...layers, [key]: !layers[key] });
  }

  return (
    <div className={'layers-control' + (open ? ' is-open' : '')}>
      <button
        type="button"
        className="layers-toggle"
        aria-expanded={open}
        aria-label="Map layers"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 12 15 2 8.5 12 2" />
          <polyline points="2 15.5 12 22 22 15.5" />
        </svg>
        <span>Layers</span>
      </button>

      {open && (
        <div className="layers-panel">
          <div className="layers-title">Boundaries</div>
          <label className="layer-row">
            <input
              type="checkbox"
              checked={layers.municipalities}
              onChange={() => toggle('municipalities')}
            />
            <span className="layer-swatch swatch-muni" aria-hidden="true" />
            <span className="layer-name">Municipalities</span>
          </label>
          <label className="layer-row">
            <input
              type="checkbox"
              checked={layers.townships}
              onChange={() => toggle('townships')}
            />
            <span className="layer-swatch swatch-town" aria-hidden="true" />
            <span className="layer-name">Townships</span>
          </label>
        </div>
      )}
    </div>
  );
}
