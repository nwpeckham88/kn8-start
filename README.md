# SvelteKit v5 + BetterAuth + Neon/Drizzle Starter

This project is a modern web application starter kit featuring:

- **Framework**: SvelteKit v5 (Runes)
- **Authentication**: BetterAuth with Organization (Multi-tenant) and Passkey support
- **Database**: Neon (Serverless Postgres) with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Validation**: Valibot
- **Language**: TypeScript

## Features

- **Multi-Tenancy**: Create and manage organizations.
- **RBAC**: Role-Based Access Control (Owner, Admin, Member).
- **Member Management**: Invite users, update roles, remove members.
- **Secure Sessions**: Server-side session enforcement with `sveltekitCookies`.
- **Environment Variables**: Type-safe environment variables via `$env`.

## Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Create a `.env` file with the following:

   ```env
   DATABASE_URL=postgres://...
   BETTER_AUTH_SECRET=...
   BETTER_AUTH_URL=http://localhost:5173
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

3. **Database Migration**:

   ```bash
   pnpm drizzle-kit push
   ```

4. **Run Development Server**:
   ```bash
   pnpm run dev
   ```

## Architecture

- `src/lib/server/auth.ts`: BetterAuth configuration.
- `src/lib/server/db`: Drizzle schema and connection.
- `src/routes/dashboard`: Protected dashboard with organization context.
