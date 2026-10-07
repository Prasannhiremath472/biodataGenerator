#!/usr/bin/env node
/**
 * Plain-Node migration/seed runner — no Docker, no ORM.
 * Usage:
 *   node database/run.js migrate
 *   node database/run.js seed
 *   node database/run.js reset   (drops & recreates schema via schema.sql, then seeds)
 */
const fs = require('fs');
const path = require('path');
const backendNodeModules = path.join(__dirname, '..', 'backend', 'node_modules');
const backendRequire = (mod) => require(path.join(backendNodeModules, mod));

backendRequire('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mysql = backendRequire('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'biodata_generator',
  multipleStatements: true,
};

async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await connection.query(sql);
  console.log(`  ✓ ${path.basename(filePath)}`);
}

async function runDir(connection, dirName) {
  const dir = path.join(__dirname, dirName);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    await runSqlFile(connection, path.join(dir, file));
  }
}

async function main() {
  const command = process.argv[2];
  if (!['migrate', 'seed', 'reset'].includes(command)) {
    console.error('Usage: node database/run.js <migrate|seed|reset>');
    process.exit(1);
  }

  const connection = await mysql.createConnection(config);

  try {
    if (command === 'migrate') {
      console.log('Running migrations...');
      await runDir(connection, 'migrations');
    } else if (command === 'seed') {
      console.log('Running seeds...');
      await runDir(connection, 'seeds');
    } else if (command === 'reset') {
      console.log('Applying full schema.sql...');
      await runSqlFile(connection, path.join(__dirname, 'schema.sql'));
      console.log('Running seeds...');
      await runDir(connection, 'seeds');
    }
    console.log('Done.');
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
