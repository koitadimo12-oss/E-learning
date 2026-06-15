export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3001";

export type ApiError = { status: number; message: string };

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? (JSON.parse(text) as unknown) : null;
  } catch {
    return text || null;
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await parseJsonSafe(res);
    const message = (data as any)?.message ?? "Erreur API";
    throw { status: res.status, message } satisfies ApiError;
  }
  return (await res.json()) as T;
}

