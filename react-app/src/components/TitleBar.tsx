interface Props {
  stationCount: number;
  departmentCount: number;
  collapsed: boolean;
  onToggle: () => void;
}

export default function TitleBar({ stationCount, departmentCount, collapsed, onToggle }: Props) {
  return (
    <header className={'titlebar' + (collapsed ? ' collapsed' : '')}>
      <div className="titlebar-row">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C12 2 6 8 6 13.5C6 17.6 8.7 21 12 21C15.3 21 18 17.6 18 13.5C18 11 16.5 9.5 15 8C13.5 6.5 13 5 13 3.5C13 3.5 11 5 11 7C11 8.5 12 10 12 10C12 10 10 9 9 7.5C8.5 9 9 11 10 12C10.5 12.5 11 13 11 14C11 15 10 16 10 16C10 16 12 15.5 13 14C14 12.5 14 11 14 11C14 11 15 12 15 13.5C15 15 14 16.5 12 17C13 17.5 14 18 14 19C14 19.5 13.5 20 13 20" />
          </svg>
        </div>
        <div className="title-block">
          <span className="eyebrow">Trumbull County · Ohio</span>
          <h1 className="title">Fire Station Directory</h1>
        </div>
        <button
          className="toggle-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand header' : 'Collapse header'}
          aria-expanded={!collapsed}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 8 11 13 6" />
          </svg>
        </button>
      </div>
      <div className="titlebar-body">
        <p className="subtitle">
          An interactive directory of <strong>fire and emergency response stations</strong> serving
          Trumbull County. Hover any marker for a quick reference. Click for full station details and
          turn-by-turn directions.
        </p>
        <div className="stats">
          <div className="stat">
            <span className="stat-num">{stationCount}</span>
            <span className="stat-label">Stations</span>
          </div>
          <div className="stat">
            <span className="stat-num">{departmentCount}</span>
            <span className="stat-label">Departments</span>
          </div>
        </div>
      </div>
      <div className="titlebar-meta">
        <span className="meta-author">
          Created by <strong>Mike Costarella</strong>
        </span>
        <span className="meta-time">Last updated {__BUILD_DATE__}</span>
      </div>
    </header>
  );
}
