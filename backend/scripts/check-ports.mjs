/**
 * Compare les bases de données sur les ports 3306 et 3307.
 * Les paramètres de connexion sont lus depuis le fichier .env.
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const DB_NAME = process.env.DB_DATABASE;

async function check(port) {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD ?? '',
    });

    const [dbs] = await conn.query(
      'SHOW DATABASES LIKE ?',
      [DB_NAME],
    );

    if (dbs.length === 0) {
      console.log(`Port ${port} : pas de base "${DB_NAME}"`);
      await conn.end();
      return;
    }

    await conn.query(`USE \`${DB_NAME}\``);

    const [tables] = await conn.query('SHOW TABLES');

    console.log(
      `\n✅ Port ${port} — base "${DB_NAME}" : ${tables.length} table(s)`,
    );

    for (const row of tables) {
      console.log('   -', Object.values(row)[0]);
    }

    if (tables.length > 0) {
      try {
        const [users] = await conn.query(
          'SELECT COUNT(*) AS n FROM utilisateurs',
        );

        console.log(
          `   → ${users[0].n} utilisateur(s) dans "utilisateurs"`,
        );
      } catch {
          // La table "utilisateurs" n'existe peut-être pas.
      }
    }

    await conn.end();
  } catch (e) {
    console.log(
      `Port ${port} : MySQL inaccessible (${e.code || e.message})`,
    );
  }
}

console.log('=== Où sont vos données ? ===');

await check(3306);
await check(3307);