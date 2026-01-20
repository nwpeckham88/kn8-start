# Multi-tenant Architecture Documentation (BetterAuth)

## Overview
We leverage **BetterAuth's Organization Plugin** for multi-tenant support. This provides built-in tables and logic for managing organizations, members, roles, and invitations.

## Database Schema (Managed by BetterAuth)
BetterAuth automatically manages the following tables (names may vary based on configuration):
- `organization`: Stores organization details (name, slug, logo, etc.).
- `member`: Links users to organizations with roles.
- `invitation`: Handles invites to organizations.

When defining your own tables that belong to an organization (e.g., `projects`, `tasks`), you must manually add an `organizationId` column.

```typescript
// src/lib/server/db/schema.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { organization } from './auth-schema'; // if you need to reference it directly

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  organizationId: text('organization_id').notNull(), // References organization.id
});
```

## Middleware & Access Control
BetterAuth provides hooks to check for active organizations.

```typescript
// Client-side
const authClient = createAuthClient({
    plugins: [organizationClient()]
});

// Check active org
const activeOrg = authClient.useActiveOrganization();
```

## Role-Based Access Control (RBAC)
The plugin supports defining roles and permissions.
- `owner`: Full access.
- `admin`: Administrative access.
- `member`: Standard access.

You can customize these roles in the BetterAuth configuration.
