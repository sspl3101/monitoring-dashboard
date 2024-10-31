import mysql from 'mysql2/promise';
import { config } from './src/server/config.js';

export const createPool = async () => {
  try {
    const pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      port: config.db.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    return pool;
  } catch (error) {
    console.error('Error creating database pool:', error);
    throw error;
  }
};

export const testConnection = async (pool) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    return rows.length > 0;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

export default {
  createPool,
  testConnection
};