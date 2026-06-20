import { useMemo, useState } from 'react';
import type { Station } from '../types/station';

type SortKey = 'Department' | 'Station' | 'City' | 'JurisdictionType' | 'Address';
type SortDir = 'asc' | 'desc';

interface Props {
  stations: Station[];
  onSelect: (id: string) => void;
}

export default function StationList({ stations, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [fJur, setFJur] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('Department');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const jurisdictions = useMemo(
    () => Array.from(new Set(stations.map((s) => s.JurisdictionType))).sort((a, b) => a.localeCompare(b)),
    [stations]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = stations.filter((s) => {
      if (fJur && s.JurisdictionType !== fJur) return false;
      if (q) {
        const hay = [s.Department, s.Station, s.City, s.JurisdictionType, s.Address, String(s.ZipCode)]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])) * dir);
  }, [stations, query, fJur, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function indicator(key: SortKey) {
    if (key !== sortKey) return <span className="lst-arrow" aria-hidden="true">↕</span>;
    return (
      <span className="lst-arrow is-active" aria-hidden="true">
        {sortDir === 'asc' ? '↑' : '↓'}
      </span>
    );
  }

  const th = (key: SortKey, label: string) => (
    <th scope="col">
      <button type="button" className="lst-sort" onClick={() => toggleSort(key)} aria-label={`Sort by ${label}`}>
        {label}
        {indicator(key)}
      </button>
    </th>
  );

  const hasFilters = query || fJur;

  return (
    <div className="list-view">
      <div className="list-bar">
        <label className="list-field list-search">
          <span className="list-label">Filter stations</span>
          <input
            type="search"
            className="list-input"
            placeholder="Search department, station, city, address…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="list-field">
          <span className="list-label">Jurisdiction</span>
          <select className="list-select" value={fJur} onChange={(e) => setFJur(e.target.value)}>
            <option value="">All</option>
            {jurisdictions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </label>
        <div className="list-meta">
          <span className="list-count">
            {rows.length} of {stations.length} stations
          </span>
          {hasFilters && (
            <button
              type="button"
              className="list-clear"
              onClick={() => {
                setQuery('');
                setFJur('');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="list-table-wrap">
        <table className="list-table">
          <thead>
            <tr>
              {th('Department', 'Department')}
              {th('Station', 'Station')}
              {th('City', 'City')}
              {th('JurisdictionType', 'Jurisdiction')}
              {th('Address', 'Address')}
              <th scope="col" className="lst-col-go">Map</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="list-empty">
                  No stations match your filters.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.Id}>
                  <td className="lst-dept">{s.Department}</td>
                  <td className="lst-station">{s.Station}</td>
                  <td>{s.City}</td>
                  <td>
                    <span className="jur-tag">{s.JurisdictionType}</span>
                  </td>
                  <td className="lst-addr">{s.Address}</td>
                  <td className="lst-go">
                    <button
                      type="button"
                      className="lst-go-btn"
                      title="Show on map"
                      aria-label={`Show ${s.Station} on map`}
                      onClick={() => onSelect(s.Id)}
                    >
                      ↗
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
