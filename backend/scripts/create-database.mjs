/**
 * Crée la base MySQL indiquée dans backend/.env si elle n'existe pas encore.
 * Usage : npm run db:create
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Charge automatiquement les variables dans process.env
config({ path: envPath });

// Récupération stricte des variables d'environnement
const database = process.env.DB_DATABASE;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD; // Peut être vide, mais doit exister dans le .env
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// Vérification que toutes les variables nécessaires sont présentes
if (!database || !dbUser || dbPassword === undefined || !dbHost || !dbPort) {
  console.error('❌ Variables de base de données manquantes dans le fichier .env (DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME ou DB_PASSWORD)');
  process.exit(1);
}

// Connexion à MySQL sans aucune valeur codée en dur
const conn = await mysql.createConnection({
  host: dbHost,
  port: Number(dbPort),
  user: dbUser,
  password: dbPassword,
});

try {
  // Création de la base de données
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`✅ Base de données "${database}" prête.`);
} catch (error) {
  console.error('❌ Erreur lors de la création de la base de données :', error.message);
} finally {
  // Fermeture de la connexion dans tous les cas
  await conn.end();
}