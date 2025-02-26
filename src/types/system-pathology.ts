export interface PathologySystem {
  id: number;
  name: string;
}
export interface Pathology {
  id: number;
  name: string;
  pathology_system_id: number;
}
