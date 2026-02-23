import { createClient } from '@libsql/client';
import { WARDS_CONFIG } from './constants';
import { AreaData, AreaId } from './types';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:missionary_plan.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

// Initialize database
export const initDB = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS wards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      data TEXT
    );
  `);

  // Seed database if empty
  const result = await client.execute('SELECT count(*) as count FROM wards');
  const count = result.rows[0].count as number;

  if (count === 0) {
    // Initial empty data structure
    const getInitialData = (): Record<AreaId, AreaData> => {
      return {} as Record<AreaId, AreaData>; 
    };

    const initialData = JSON.stringify(getInitialData());

    for (const ward of WARDS_CONFIG) {
      const password = ward.password || ward.id;
      await client.execute({
        sql: 'INSERT INTO wards (id, name, password, data) VALUES (?, ?, ?, ?)',
        args: [ward.id, ward.name, password, initialData]
      });
    }
    console.log('Database seeded with initial wards.');
  }
};

export const getWard = async (id: string) => {
  const result = await client.execute({
    sql: 'SELECT * FROM wards WHERE id = ?',
    args: [id]
  });
  return result.rows[0];
};

export const verifyPassword = async (password: string) => {
  const result = await client.execute({
    sql: 'SELECT id, name, data FROM wards WHERE password = ?',
    args: [password]
  });
  return result.rows[0];
};

export const updateWardData = async (id: string, data: string) => {
  await client.execute({
    sql: 'UPDATE wards SET data = ? WHERE id = ?',
    args: [data, id]
  });
};

export default client;
