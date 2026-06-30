import { useEffect } from 'react';
import type { LayerState } from './MapLayersControl';

export type ViewId = 'map' | 'list';

interface NavItem {
  id: ViewId;
  label: string;
  hint: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'map', label: 'Map', hint: 'Interactive station map' },
  { id: 'list', label: 'List', hint: 'Sortable station table' },
];

const REPO_URL = 'https://github.com/MikeCostarella/TrumbullCountyFireStations';
const MY_WEBSITE_URL = 'https://mikecostarella.github.io/MyWebSite/';

interface Props {
  active: ViewId;
  onSelect: (id: ViewId) => void;
  open: boolean;
  onToggle: (open: boolean) => void;
  layers: LayerState;
  onLayersChange: (next: LayerState) => void;
}

export default function TopBar({ active, onSelect, open, onToggle, layers, onLayersChange }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggle(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onToggle]);

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <button
          type="button"
          className="topbar-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => onToggle(!open)}
        >
          <span className="burger-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="topbar-menulabel">Menu</span>
        </button>
        <span className="topbar-title">Trumbull County · Fire Stations</span>
      </div>

      <div
        className={'drawer-backdrop' + (open ? ' is-open' : '')}
        onClick={() => onToggle(false)}
        aria-hidden="true"
      />

      <nav className={'drawer' + (open ? ' is-open' : '')} aria-label="Main menu" aria-hidden={!open}>
        <div className="drawer-head">
          <span className="drawer-title">Menu</span>
          <button type="button" className="drawer-close" aria-label="Close menu" onClick={() => onToggle(false)}>
            ✕
          </button>
        </div>

        <div className="drawer-group">
          <div className="drawer-group-title">Views</div>
          <ul className="drawer-list">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={'drawer-item' + (isActive ? ' is-active' : '')}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      onSelect(item.id);
                      onToggle(false);
                    }}
                  >
                    <span className="drawer-item-label">{item.label}</span>
                    <span className="drawer-item-hint">{item.hint}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="drawer-group">
          <div className="drawer-group-title">Boundaries</div>
          <label className="drawer-check">
            <input
              type="checkbox"
              checked={layers.municipalities}
              onChange={() => onLayersChange({ ...layers, municipalities: !layers.municipalities })}
            />
            <span className="drawer-swatch drawer-swatch-muni" aria-hidden="true" />
            <span className="drawer-check-label">Municipalities</span>
          </label>
          <label className="drawer-check">
            <input
              type="checkbox"
              checked={layers.townships}
              onChange={() => onLayersChange({ ...layers, townships: !layers.townships })}
            />
            <span className="drawer-swatch drawer-swatch-town" aria-hidden="true" />
            <span className="drawer-check-label">Townships</span>
          </label>
        </div>

        <div className="drawer-group">
          <div className="drawer-group-title">Links</div>
          <a href={MY_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="drawer-item drawer-repo">
            <span className="drawer-item-label">
              MyWebSite <span className="drawer-ext" aria-hidden="true">↗</span>
            </span>
            <span className="drawer-item-hint">Mike Costarella&rsquo;s website</span>
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="drawer-item drawer-repo">
            <span className="drawer-item-label">
              GitHub repository <span className="drawer-ext" aria-hidden="true">↗</span>
            </span>
            <span className="drawer-item-hint">View the source on GitHub</span>
          </a>
          <a href={`${REPO_URL}/actions`} target="_blank" rel="noopener noreferrer" className="drawer-item drawer-repo">
            <span className="drawer-item-label">
              GitHub Actions <span className="drawer-ext" aria-hidden="true">↗</span>
            </span>
            <span className="drawer-item-hint">View the source on GitHub</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
