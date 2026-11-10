import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  host: connectionString ? undefined : (process.env.DB_HOST || 'localhost'),
  port: connectionString ? undefined : (Number(process.env.DB_PORT) || 5432),
  user: connectionString ? undefined : (process.env.DB_USER || 'postgres'),
  password: connectionString ? undefined : (process.env.DB_PASSWORD || ''),
  database: connectionString ? undefined : (process.env.DB_NAME || 'todo_app'),
  ssl: connectionString && !connectionString.includes('localhost')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
});

let schemaPromise;

export function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        due_date TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `).catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  return schemaPromise;
}

export async function checkDatabaseConnection() {
  await pool.query('SELECT 1');
}
