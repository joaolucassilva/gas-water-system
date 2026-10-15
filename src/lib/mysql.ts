import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getMySQLPool(): mysql.Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/gas_water_pro';
    pool = mysql.createPool(databaseUrl);
  }
  return pool;
}

export async function testMySQLConnection(): Promise<boolean> {
  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT 1 as connected');
    return true;
  } catch (err) {
    return false;
  }
}
