# Boundary data files

## trumbull-boundary.json  (county outline — used for the inside/outside gate)
A single GeoJSON **Feature** with Polygon or MultiPolygon geometry, coordinates
in [lon, lat] order. Currently the coarse US Census polygon; replace with your
precise Trumbull boundary from THAM/Hydrants/AddressPoints for accurate edges.

## trumbull-jurisdictions.json  (municipalities + townships — names the jurisdiction)
A GeoJSON **FeatureCollection**. Each feature is a municipality or township
polygon, with a name in one of these property keys (first match wins):
    NAME, name, NAMELSAD, Name, JURISDICTION, Jurisdiction
Optionally a type (City / Village / Township) in one of:
    LSAD, TYPE, type, JurisdictionType, CLASSFP
Coordinates in [lon, lat] order. Polygon or MultiPolygon per feature.

This file currently ships EMPTY (no features). With it empty, the "You are
here" details show jurisdiction = "Trumbull County". Drop in your real
municipality/township FeatureCollection (reuse the ones from your other
Trumbull apps) and the popup will name the specific city/township.

If your file uses different property keys, either rename them or tell me and
I'll adjust NAME_KEYS / TYPE_KEYS in src/geo.ts.

If your townships and municipalities are TWO separate files, merge their
features into one FeatureCollection here, or tell me and I'll have geo.ts read
both.
