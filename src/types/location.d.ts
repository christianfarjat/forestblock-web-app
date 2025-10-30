export interface Location {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}