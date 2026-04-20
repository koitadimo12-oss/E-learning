/** Données de démo — compétition inter-écoles (frontend). */

export type EcoleScore = { ecoleId: string; label: string; score: number; membres: number };
export type ChallengeStatus = "upcoming" | "active" | "finished";

export type Challenge = {
  id: string;
  titre: string;
  description: string;
  ecolesIds: string[];
  dateDebut: string;
  dateFin: string;
  chefParEcole: Record<string, string>;
};

const WEEK_MS = 7 * 24 * 3600 * 1000;
const LAUNCH_HOUR_UTC = 8; // lancement hebdomadaire fixe le lundi a 08:00 UTC

function startOfWeekMondayUtc(date: Date): Date {
  const day = date.getUTCDay(); // 0 = dimanche, 1 = lundi
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - diffToMonday,
      0,
      0,
      0,
      0,
    ),
  );
  return monday;
}

export function prochainLundiUtc(nowMs: number = Date.now()): Date {
  const now = new Date(nowMs);
  const monday = startOfWeekMondayUtc(now);
  if (now.getUTCDay() === 1 && now.getUTCHours() < LAUNCH_HOUR_UTC) {
    return new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate(), LAUNCH_HOUR_UTC, 0, 0, 0));
  }
  monday.setUTCDate(monday.getUTCDate() + 7);
  monday.setUTCHours(LAUNCH_HOUR_UTC, 0, 0, 0);
  return monday;
}

export function getChallengeStatus(nowMs: number, startDate: string, endDate: string): ChallengeStatus {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (nowMs < start) return "upcoming";
  if (nowMs <= end) return "active";
  return "finished";
}

export function getTimerColorClass(msLeft: number): string {
  if (msLeft <= 6 * 3600 * 1000) return "text-red-600 dark:text-red-400";
  if (msLeft <= 24 * 3600 * 1000) return "text-orange-600 dark:text-orange-400";
  return "text-emerald-600 dark:text-emerald-400";
}

export const CHALLENGE_ACTIF: Challenge = {
  id: "ch-2026-s1",
  titre: "Challenge innovation — UNIPRO vs ENSUP",
  description:
    "Réalisez une mini-application (Python ou JS), une vidéo YouTube de démo et un dépôt GitHub. Le jury et les votes étudiants comptent dans le score final.",
  ecolesIds: ["unipro", "ensup"],
  dateDebut: "2026-04-01T08:00:00.000Z",
  dateFin: "2026-05-30T20:00:00.000Z",
  chefParEcole: {
    unipro: "Aminata K.",
    ensup: "Ibrahima D.",
  },
};

export function challengeHebdo(ecolesIds: string[], nowMs: number = Date.now()): Challenge {
  const base = [...new Set(ecolesIds)];
  const pool = base.length >= 2 ? base : ["unipro", "ensup", "ucad"];
  const nextMonday = prochainLundiUtc(nowMs);
  const currentMonday = new Date(nextMonday.getTime() - WEEK_MS);
  const firstCycleStart = new Date("2026-01-05T08:00:00.000Z").getTime();
  const slot = Math.floor((currentMonday.getTime() - firstCycleStart) / WEEK_MS);
  const index = Math.max(0, slot);
  const a = pool[index % pool.length];
  const b = pool[(index + 1) % pool.length];
  const debut = currentMonday;
  const fin = new Date(currentMonday.getTime() + WEEK_MS);

  return {
    id: `ch-week-${index}`,
    titre: `Challenge hebdo — ${a.toUpperCase()} vs ${b.toUpperCase()}`,
    description: "Chaque semaine, 2 écoles s'affrontent. Quand le chrono arrive à zéro, le challenge suivant démarre automatiquement.",
    ecolesIds: [a, b],
    dateDebut: debut.toISOString(),
    dateFin: fin.toISOString(),
    chefParEcole: {
      [a]: "Chef équipe A",
      [b]: "Chef équipe B",
    },
  };
}

export function scoresEcolesDemo(): EcoleScore[] {
  return [
    { ecoleId: "unipro", label: "UNIPRO", score: 842, membres: 48 },
    { ecoleId: "ensup", label: "ENSUP", score: 815, membres: 44 },
    { ecoleId: "ucad", label: "UCAD", score: 620, membres: 120 },
  ];
}

export function msRestantesAvantFin(): number {
  const fin = new Date(CHALLENGE_ACTIF.dateFin).getTime();
  return Math.max(0, fin - Date.now());
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}j ${h}h ${m}mn ${sec}s`;
}
