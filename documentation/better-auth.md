# BetterAuth Documentation

## Overview

BetterAuth is a flexible authentication library. We are using the **Organization Plugin** for multi-tenancy.

## Installation

```bash
pnpm add better-auth
```

## Server Setup

Configure `src/lib/server/auth.ts`.

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { organization, passkey } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}
	},
	plugins: [
		organization(), // Built-in multi-tenant support
		passkey()
	]
});
```

## Schema Generation

BetterAuth can generate the necessary Drizzle schema for you.
Run:

```bash
pnpm dlx @better-auth/cli generate
```

This will inspect your config and plugins (like `organization`) and generate the required tables in your database or schema file.

## Hooks Integration

Add the handler to `src/hooks.server.ts`.

```typescript
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/server/auth';

export async function handle({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth });
}
```

## Client Usage

Use the generated client in your components.

```typescript
import { createAuthClient } from 'better-auth/svelte';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	plugins: [organizationClient()]
});
```
