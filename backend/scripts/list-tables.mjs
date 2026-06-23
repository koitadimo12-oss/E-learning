/** Affiche les tables et les utilisateurs de la base elearning */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD ?? '',
  database: env.DB_DATABASE,
});

const [tables] = await conn.query('SHOW TABLES');
console.log('\n📋 Tables dans la base "' + env.DB_DATABASE + '" (port ' + env.DB_PORT + ') :\n');
for (const row of tables) {
  console.log('  -', Object.values(row)[0]);
}

try {
  const [users] = await conn.query(
    'SELECT id, nom, email, role, creeLe FROM utilisateurs ORDER BY creeLe DESC LIMIT 10',
  );
  console.log('\n👤 Derniers utilisateurs (table utilisateurs) :\n');
  if (users.length === 0) console.log('  (aucun)');
  else users.forEach((u) => console.log(`  - ${u.nom} <${u.email}> [${u.role}]`));
} catch (e) {
  console.log('\n⚠️  Table utilisateurs introuvable — démarrez le backend une fois pour créer les tables.');
}

await conn.end();
