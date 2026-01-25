# Neon & Drizzle ORM Documentation

## Overview

Neon is a serverless PostgreSQL provider. Drizzle ORM is a TypeScript ORM that provides type-safety and a SQL-like developer experience.

## Installation

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

## Connection Setup

For serverless environments (like Vercel or Cloudflare Workers), use the `@neondatabase/serverless` driver with HTTP or WebSockets.

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';

const sql = neon(env.DATABASE_URL!);
export const db = drizzle(sql);
```

## Schema Definition

Define your schema in `src/lib/server/db/schema.ts`.

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
```

## Migrations

Configure `drizzle.config.ts` in the root.

```typescript
import { defineConfig } from 'drizzle-kit';
import { env } from '$env/dynamic/private';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});
```

Commands:

- `pnpm drizzle-kit generate`: Generate migration files.
- `pnpm drizzle-kit migrate`: Apply migrations to the database.
- `pnpm drizzle-kit push`: Push changes directly (useful for rapid prototyping).
