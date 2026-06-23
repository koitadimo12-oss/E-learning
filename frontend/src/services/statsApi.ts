/** Statistiques plateforme — GET /stats */
import { apiGet } from "./apiClient";

export type StatsPlateforme = {
  coursDisponibles: number;
  livresDisponibles: number;
  etudiantsActifs: number;
};

export async function getStatsPlateforme(): Promise<StatsPlateforme> {
  return apiGet<StatsPlateforme>("/stats");
}
