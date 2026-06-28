import { apiDelete, apiGet, apiPatch, apiPost } from "./apiClient";
import type { Chapitre, Cours, Quiz } from "./coursService";

export type ApiCourse = {
  id: number;
  titre: string;
  description: string;
  image: string;
  instructeur: string;
  categorie: string;
  niveau: string;
  duree: string;
  badge?: string;
  nouveau?: boolean;
  chapitres?: Chapitre[];
  quiz?: Quiz[];
};

/** Convertit le format API (backend) vers le format utilisé par les pages React */
function mapCourse(row: ApiCourse): Cours {
  return {
    id: row.id,
    titre: row.titre,
    description: row.description,
    image: row.image,
    instructeur: row.instructeur,
    categorie: row.categorie as Cours["categorie"],
    niveau: row.niveau as Cours["niveau"],
    duree: row.duree,
    badge: row.badge,
    nouveau: row.nouveau,
    chapitres: Array.isArray(row.chapitres) ? row.chapitres : [],
    quiz: Array.isArray(row.quiz) ? row.quiz : [],
  };
}

let cache: Cours[] = [];
let loadPromise: Promise<Cours[]> | null = null;

export function getCoursCache(): Cours[] {
  return cache;
}

/** Charge tous les cours depuis la BDD (avec cache pour éviter des appels répétés) */
export async function chargerCours(force = false): Promise<Cours[]> {
  if (!force && cache.length > 0) return cache;
  if (!force && loadPromise) return loadPromise;

  loadPromise = apiGet<ApiCourse[]>("/courses")
    .then((rows) => {
      cache = rows.map(mapCourse);
      return cache;
    })
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
}

export async function getCoursParId(id: number): Promise<Cours | null> {
  await chargerCours();
  const fromCache = cache.find((c) => c.id === id);
  if (fromCache) return fromCache;
  try {
    const row = await apiGet<ApiCourse>(`/courses/${id}`);
    const mapped = mapCourse(row);
    cache = [...cache.filter((c) => c.id !== id), mapped];
    return mapped;
  } catch {
    return null;
  }
}

/** Admin — crée un cours (le token admin est envoyé automatiquement par apiClient) */
export async function creerCours(payload: Omit<ApiCourse, "id">): Promise<Cours> {
  const row = await apiPost<ApiCourse>("/courses", payload);
  const mapped = mapCourse(row);
  cache = [...cache, mapped];
  return mapped;
}

export async function supprimerCours(id: number): Promise<void> {
  await apiDelete(`/courses/${id}`);
  cache = cache.filter((c) => c.id !== id);
}

export async function modifierCours(id: number, patch: Partial<ApiCourse>): Promise<Cours> {
  const row = await apiPatch<ApiCourse>(`/courses/${id}`, patch);
  const mapped = mapCourse(row);
  cache = cache.map((c) => (c.id === id ? mapped : c));
  return mapped;
}
