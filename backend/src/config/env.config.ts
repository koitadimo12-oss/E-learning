import { ConfigService } from '@nestjs/config';

/** Lit une variable obligatoire depuis le fichier .env (aucune valeur par défaut dans le code). */
export function envRequired(config: ConfigService, key: string): string {
  const value = config.get<string>(key);
  if (value === undefined || value === '') {
    throw new Error(`Variable manquante dans .env : ${key}`);
  }
  return value;
}

/** Lit un entier obligatoire depuis le fichier .env. */
export function envRequiredNumber(config: ConfigService, key: string): number {
  const raw = envRequired(config, key);
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`Variable .env invalide (nombre attendu) : ${key}`);
  }
  return n;
}
