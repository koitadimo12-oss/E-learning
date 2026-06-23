/**
 * ═══════════════════════════════════════════════════════════════
 *  COUCHE HTTP — communication Frontend ↔ Backend (axios)
 * ═══════════════════════════════════════════════════════════════
 *
 * Tous les services (authApi, coursApi, livresApi…) passent par ici.
 * Le backend NestJS écoute sur VITE_API_URL (défaut : http://localhost:3001).
 *
 * Flux d'une requête :
 *   Page React → service (ex: coursApi) → apiGet/apiPost → axios → NestJS
 */

import axios, { type AxiosError } from "axios";

/** URL de base lue depuis frontend/.env → VITE_API_URL=http://localhost:3001 */
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3001";

export type ApiError = { status: number; message: string };

/** Clé sessionStorage — seul le token JWT est stocké côté navigateur */
const TOKEN_KEY = "knd_auth_token";

/** Instance axios partagée — baseURL pointe vers le backend NestJS */
export const http = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Intercepteur : ajoute automatiquement le token JWT à chaque requête.
 * Correspond au JwtAuthGuard côté backend qui lit "Authorization: Bearer …"
 */
http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Enregistre le token après login/register, ou le supprime à la déconnexion */
export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) sessionStorage.removeItem(TOKEN_KEY);
  else sessionStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

/** Transforme une erreur axios (404, 401…) en message lisible pour l'UI */
function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ message?: string | string[] }>;
    const raw = ax.response?.data?.message;
    const message = Array.isArray(raw) ? raw.join(", ") : raw ?? ax.message ?? "Erreur API";
    return { status: ax.response?.status ?? 500, message };
  }
  return { status: 500, message: "Erreur inconnue" };
}

/** GET  → ex: apiGet("/courses") appelle GET http://localhost:3001/courses */
export async function apiGet<T>(path: string): Promise<T> {
  try {
    const { data } = await http.get<T>(path);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
}

/** POST → ex: apiPost("/auth/login", { email, motDePasse }) */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  try {
    const { data } = await http.post<T>(path, body);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
}

/** PATCH → ex: apiPatch("/users/me", { xp: 50 }) */
export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  try {
    const { data } = await http.patch<T>(path, body);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
}

/** DELETE → ex: apiDelete("/courses/3") */
export async function apiDelete(path: string): Promise<void> {
  try {
    await http.delete(path);
  } catch (e) {
    throw toApiError(e);
  }
}
