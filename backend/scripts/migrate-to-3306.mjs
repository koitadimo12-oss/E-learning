/**
 * Copie la base elearning du port 3307 → 3306
 * pour que phpMyAdmin (port 3306) affiche les mêmes données que l'app.
 */
import mysql from 'mysql2/promise';

const FROM_PORT = 3307;
const TO_PORT = 3306;
const DB = 'elearning';

// Ordre important : tables parentes d'abord (clés étrangères)
const TABLE_ORDER = ['utilisateurs', 'course', 'book', 'progressions', 'certificats'];

const src = await mysql.createConnection({
  host: 'localhost',
  port: FROM_PORT,
  user: 'root',
  password: '',
});
const dst = await mysql.createConnection({
  host: 'localhost',
  port: TO_PORT,
  user: 'root',
  password: '',
});

await dst.query(
  `CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await dst.query(`DROP DATABASE IF EXISTS \`${DB}\``);
await dst.query(
  `CREATE DATABASE \`${DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await dst.query(`USE \`${DB}\``);
await src.query(`USE \`${DB}\``);

await dst.query('SET FOREIGN_KEY_CHECKS = 0');

const [allTables] = await src.query('SHOW TABLES');
const tableKey = `Tables_in_${DB}`;
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

const [users] = await dst.query('SELECT nom, email FROM utilisateurs');
console.log('\n✅ Migration terminée sur le port 3306 (phpMyAdmin).');
console.log('Utilisateurs :', users.map((u) => u.email).join(', ') || '(aucun)');

await src.end();
await dst.end();
