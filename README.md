# KN8 Starter Project

This is a comprehensive base project using SvelteKit v5, Neon, Drizzle ORM, Valibot, Tailwind CSS v4, and BetterAuth with Multi-tenant support.

## Tech Stack

- **Framework**: SvelteKit v5 (Runes mode)
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: BetterAuth (with Organization & Passkey plugins)
- **Validation**: Valibot
- **UI**: Tailwind CSS v4, Bits UI
- **Testing**: Vitest

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in your credentials.
    ```bash
    cp .env.example .env
    ```
    Required variables:
    - `DATABASE_URL`: Your Neon connection string.
    - `BETTER_AUTH_SECRET`: Generate one using `openssl rand -base64 32`.
    - `BETTER_AUTH_URL`: Your app URL (default `http://localhost:5173`).
    - `GITHUB_CLIENT_ID` / `SECRET`: For GitHub Login.
    - `GOOGLE_CLIENT_ID` / `SECRET`: For Google Login.

3.  **Database Migration**:
    Push the schema to your Neon database.
    ```bash
    npx drizzle-kit push
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Run Tests**:
    ```bash
    npm run test
    ```

## Features

- **Multi-tenancy**: Built-in Organization support via BetterAuth. Users can create and switch between organizations.
- **Authentication**: Email/Password, Social Login (GitHub, Google), and Passkeys.
- **Type-safe Validation**: Valibot schemas for all inputs.
- **Modern UI**: Tailwind v4 with CSS variables and Bits UI primitives.
- **Logging**: Structured logging with Pino.

## Documentation

Check the `documentation/` folder for detailed guides on each technology.
