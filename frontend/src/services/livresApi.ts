import { apiDelete, apiGet, apiPatch, apiPost } from "./apiClient";

export type Livre = {
  id: number;
  title: string;
  author: string;
  description: string;
  pdfUrl: string;
  category?: string;
  coverUrl?: string;
};

type ApiBook = {
  id: number;
  title: string;
  author: string;
  description: string;
  pdfUrl: string;
  category?: string;
  coverUrl?: string;
};

function mapLivre(row: ApiBook): Livre {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    pdfUrl: row.pdfUrl,
    category: row.category ?? "Développement",
    coverUrl: row.coverUrl,
  };
}

/** Liste publique — pas besoin d'être connecté */
export async function listerLivres(): Promise<Livre[]> {
  const rows = await apiGet<ApiBook[]>("/books");
  return rows.map(mapLivre);
}

/** Admin — ajoute un livre en BDD */
export async function creerLivre(payload: Omit<ApiBook, "id">): Promise<Livre> {
  const row = await apiPost<ApiBook>("/books", payload);
  return mapLivre(row);
}

export async function modifierLivre(id: number, patch: Partial<ApiBook>): Promise<void> {
  await apiPatch(`/books/${id}`, patch);
}

export async function supprimerLivre(id: number): Promise<void> {
  await apiDelete(`/books/${id}`);
}
