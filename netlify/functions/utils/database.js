import pg from 'pg';

const { Pool } = pg;

let pool;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
};

export const query = async (text, params) => {
  const pool = getPool();
  return pool.query(text, params);
};
