const pool = require('./db');

async function initDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL CHECK (age >= 0),
      position TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

    console.log('Table "candidates" is ready.');
    await pool.end();
}

initDb().catch((error) => {
    console.error('Database initialisation failed:', error);
    process.exit(1);
});