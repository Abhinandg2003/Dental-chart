export type ToothType = "molar" | "premolar" | "canine" | "incisor";

export type Procedure = "none" | "root-canal" | "remove";

export interface ToothRecord {
  procedure: Procedure;
  notes: string;
}

export interface ToothMeta {
  number: number; // universal numbering 1-32
  type: ToothType;
  arch: "upper" | "lower";
  label: string; // human readable name
}

export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  phone: string;
  notes: string;
}
