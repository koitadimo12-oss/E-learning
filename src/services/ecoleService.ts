
export interface Ecole {
  id: string;
  label: string;
  domain?: string;
}

export const ECOLES: Ecole[] = [
  { id: "unipro", label: "Unipro", domain: "unipro.sn" },
  { id: "ugb", label: "UGB", domain: "ugb.sn" },
  { id: "ucad", label: "UCAD", domain: "ucad.sn" },
  { id: "esp", label: "ESP", domain: "esp.sn" },
  { id: "isep", label: "ISEP", domain: "isep.sn" },
];

export function listeEcoles(): Ecole[] {
  return ECOLES;
}

export function getLabelEcoleCanonique(id: string): string {
  const e = ECOLES.find((x) => x.id === id);
  return e ? e.label : "Autre";
}

export function resoudreEcoleId(hostname: string): string {
  const host = hostname.toLowerCase();
  const found = ECOLES.find((e) => e.domain && host.includes(e.domain));
  return found ? found.id : "unipro";
}
