import { env } from '$env/dynamic/private';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const databaseUrl = env.DATABASE_URL;
const databaseHost = new URL(databaseUrl).hostname;
const databasePort = new URL(databaseUrl).port || '5432';

if ((databaseHost === 'localhost' || databaseHost === '127.0.0.1' || databaseHost === 'db') && databasePort === '5432') {
	neonConfig.fetchEndpoint = `http://${databaseHost}:5432/sql`;
	neonConfig.poolQueryViaFetch = true;
}

const client = neon(databaseUrl);

export const db = drizzle(client, { schema });
