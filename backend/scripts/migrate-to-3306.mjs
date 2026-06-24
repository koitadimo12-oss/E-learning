/**
 * Copie la base de données du port 3307 → 3306
 * pour que phpMyAdmin (port 3306) affiche les mêmes données que l'app.
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Charge automatiquement les variables dans process.env
config({ path: envPath });

// Récupération stricte des variables depuis le .env
const database = process.env.DB_DATABASE;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD; // Peut être vide, mais doit exister dans le .env
const dbHost = process.env.DB_HOST;

const FROM_PORT = 3307;
const TO_PORT = 3306;

// Ordre important : tables parentes d'abord (clés étrangères)
const TABLE_ORDER = ['utilisateurs', 'course', 'book', 'progressions', 'certificats'];

// Vérification de sécurité
if (!database || !dbUser || dbPassword === undefined || !dbHost) {
  console.error('❌ Variables manquantes dans le fichier .env (DB_HOST, DB_DATABASE, DB_USERNAME ou DB_PASSWORD)');
  process.exit(1);
}

let src, dst;

try {
  // Connexion à la source et à la destination en utilisant les variables sécurisées
  src = await mysql.createConnection({
    host: dbHost,
    port: FROM_PORT,
    user: dbUser,
    password: dbPassword,
  });
  
  dst = await mysql.createConnection({
    host: dbHost,
    port: TO_PORT,
    user: dbUser,
    password: dbPassword,
  });

  // Réinitialisation de la base de données de destination
  await dst.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await dst.query(`DROP DATABASE IF EXISTS \`${database}\``);
  await dst.query(
    `CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  
  await dst.query(`USE \`${database}\``);
  await src.query(`USE \`${database}\``);

  await dst.query('SET FOREIGN_KEY_CHECKS = 0');

  const [allTables] = await src.query('SHOW TABLES');
  const tableKey = `Tables_in_${database}`;
  const existing = allTables.map((r) => r[tableKey]);
  
  const tables = [
    ...TABLE_ORDER.filter((t) => existing.includes(t)),
    ...existing.filter((t) => !TABLE_ORDER.includes(t)),
  ];

  for (const table of tables) {
    console.log(`Copie de la table "${table}"...`);

    const [createRows] = await src.query(`SHOW CREATE TABLE \`${table}\``);
    const createSql = createRows[0]['Create Table'];

    await dst.query(`DROP TABLE IF EXISTS \`${table}\``);
    await dst.query(createSql);

    const [rows] = await src.query(`SELECT * FROM \`${table}\``);
    if (rows.length === 0) {
      console.log('  → 0 ligne');
      continue;
    }

    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${table}\` (\`${cols.join('`, `')}\`) VALUES (${placeholders})`;

    for (const r of rows) {
      await dst.query(sql, cols.map((c) => r[c]));
    }
    console.log(`  → ${rows.length} ligne(s)`);
  }

  await dst.query('SET FOREIGN_KEY_CHECKS = 1');

  // Affichage du résultat
  const [users] = await dst.query('SELECT nom, email FROM utilisateurs');
  console.log(`\n✅ Migration de la base "${database}" terminée sur le port ${TO_PORT} (phpMyAdmin).`);
  console.log('Utilisateurs :', users.map((u) => u.email).join(', ') || '(aucun)');

} catch (error) {
  console.error('❌ Une erreur est survenue pendant la copie :', error.message);
} finally {
  // On s'assure de toujours fermer les connexions proprement
  if (src) await src.end();
  if (dst) await dst.end();
}