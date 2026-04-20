/** Liste contrôlée d'écoles — sélection uniquement, pas de saisie libre. */

export type EcoleEntry = {
  id: string;
  /** Libellé affiché dans le dropdown */
  label: string;
  /** Alias normalisés (minuscules, sans accents) pour matching / future API */
  alias: string[];
};

const RAW: EcoleEntry[] = [
  {
    id: "unipro",
    label: "UNIPRO",
    alias: ["unipro", "univers professionnel", "universite pro", "université pro", "uni pro"],
  },
  {
    id: "ensup",
    label: "ENSUP",
    alias: ["ensup", "ecole nationale superieure", "école nationale supérieure"],
  },
  {
    id: "ucad",
    label: "Université Cheikh Anta Diop (UCAD)",
    alias: ["ucad", "cheikh anta diop", "universite cheikh anta diop"],
  },
  {
    id: "uadb",
    label: "Université Alioune Diop de Bambey (UADB)",
    alias: ["uadb", "bambey", "alioune diop"],
  },
  {
    id: "ism",
    label: "ISM / Groupe ISM",
    alias: ["ism", "groupe ism", "institut superieur de management"],
  },
  {
    id: "autre_liste",
    label: "Autre (liste officielle)",
    alias: ["autre ecole liste", "autre école"],
  },
];

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "");
}

/** Normalise une chaîne pour comparaison avec les alias. */
export function normaliserChaineEcole(input: string): string {
  return stripAccents(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Retourne l'id canonique à partir d'un id déjà valide ou d'un alias. */
export function resoudreEcoleId(input: string): string | null {
  const n = normaliserChaineEcole(input);
  if (!n) return null;
  for (const e of RAW) {
    if (e.id === input) return e.id;
    if (normaliserChaineEcole(e.id) === n) return e.id;
    for (const a of e.alias) {
      if (normaliserChaineEcole(a) === n) return e.id;
    }
  }
  return null;
}

export function getEcoleParId(id: string): EcoleEntry | undefined {
  return RAW.find((e) => e.id === id);
}

/** Libellé d'affichage canonique (toujours depuis la liste). */
export function getLabelEcoleCanonique(id: string): string {
  return getEcoleParId(id)?.label ?? id;
}

export function listeEcoles(): EcoleEntry[] {
  return RAW;
}

/** Filtre pour autocomplete : recherche sur label + alias. */
export function rechercherEcoles(query: string): EcoleEntry[] {
  const q = normaliserChaineEcole(query);
  if (!q) return RAW;
  return RAW.filter((e) => {
    const hay = `${e.label} ${e.alias.join(" ")}`;
    return normaliserChaineEcole(hay).includes(q);
  });
}
