import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Utiliza la URL de la base de datos de las variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
