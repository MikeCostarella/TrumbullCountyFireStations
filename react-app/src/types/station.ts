// One fire/emergency response station. Mirrors the SourceData schema.
export interface Station {
  Id: string;
  Department: string;
  Station: string;
  Address: string;
  City: string;
  JurisdictionType: JurisdictionType;
  State: string;
  ZipCode: number;
  Latitude: number;
  Longitude: number;
}

export type JurisdictionType =
  | 'City'
  | 'Village'
  | 'Township'
  | 'Joint District'
  | 'Federal/Military';
