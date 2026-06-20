import { useEffect, useRef, useState } from 'react';
import type { Station } from '../types/station';
import { matchesQuery } from '../lib';
import Highlight from './Highlight';

interface Props {
  stations: Station[];
  onSelect: (id: string) => void;
}

export default function StationSearch({ stations, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim();
  const matches = q
    ? stations.filter((s) => matchesQuery(s, q.toLowerCase())).slice(0, 30)
    : [];
  const showResults = open && q.length > 0;

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!query.trim()) setFocusWithin(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [query]);

  function select(id: string) {
    setOpen(false);
    onSelect(id);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
      setFocusWithin(false);
    } else if (e.key === 'Enter' && matches.length) {
      select(matches[0].Id);
    } else if (e.key === 'ArrowDown' && matches.length) {
      e.preventDefault();
      const first = wrapRef.current?.querySelector<HTMLButtonElement>('.result-item');
      first?.focus();
    }
  }

  function onResultsKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      wrapRef.current?.querySelectorAll<HTMLButtonElement>('.result-item') ?? []
    );
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown' && idx < items.length - 1) {
      e.preventDefault();
      items[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx <= 0) inputRef.current?.focus();
      else items[idx - 1].focus();
    } else if (e.key === 'Escape') {
      inputRef.current?.focus();
      setOpen(false);
    }
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div
        className={
          'search' +
          (open || focusWithin ? ' open' : '') +
          (q.length > 0 ? ' has-value' : '')
        }
        role="search"
      >
        <button
          className="search-icon"
          aria-label="Search stations"
          type="button"
          onClick={() => {
            setOpen(true);
            setFocusWithin(true);
            inputRef.current?.focus();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <input
          ref={inputRef}
          className="search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search stations, cities, addresses…"
          aria-label="Search stations"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setFocusWithin(true);
          }}
          onKeyDown={onKeyDown}
        />
        <button
          className="search-clear"
          aria-label="Clear search"
          type="button"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div
        className={'search-results' + (showResults ? ' open' : '')}
        role="listbox"
        aria-label="Search results"
        onKeyDown={onResultsKeyDown}
      >
        {showResults &&
          (matches.length === 0 ? (
            <div className="result-empty">No stations match "{q}"</div>
          ) : (
            <>
              <div className="result-meta">
                {matches.length} match{matches.length === 1 ? '' : 'es'}
              </div>
              {matches.map((s) => (
                <button
                  key={s.Id}
                  className="result-item"
                  role="option"
                  onClick={() => select(s.Id)}
                >
                  <div className="result-station">
                    <Highlight text={s.Station} query={q} />
                  </div>
                  <div className="result-dept">
                    <Highlight text={s.Department} query={q} />
                  </div>
                  <div className="result-addr">
                    <Highlight text={`${s.Address}, ${s.City}`} query={q} />
                  </div>
                </button>
              ))}
            </>
          ))}
      </div>
    </div>
  );
}
