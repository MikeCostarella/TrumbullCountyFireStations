import type { Station } from './types/station';

// Google Maps search URL for a station's address.
export function gmapsUrl(s: Station): string {
  const q = `${s.Address}, ${s.City}, ${s.State} ${s.ZipCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

// Case-insensitive match of a station against a query across its fields.
export function matchesQuery(s: Station, ql: string): boolean {
  return (
    s.Department.toLowerCase().includes(ql) ||
    s.Station.toLowerCase().includes(ql) ||
    s.Address.toLowerCase().includes(ql) ||
    s.City.toLowerCase().includes(ql) ||
    String(s.ZipCode).includes(ql) ||
    s.JurisdictionType.toLowerCase().includes(ql)
  );
}

// Distinct department count for the stats readout.
export function departmentCount(stations: Station[]): number {
  return new Set(stations.map((s) => s.Department)).size;
}
