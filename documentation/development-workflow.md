## 5. Authentication Configuration (Local)

To fully test authentication locally (including OAuth and Passkeys), configure your providers with the following URLs.

### Base URL

Ensure your `.env` has:

```env
BETTER_AUTH_URL=http://localhost:5173
VITE_BETTER_AUTH_URL=http://localhost:5173
```

### OAuth Providers (GitHub, Google)

| Setting                                    | Value                                            |
| :----------------------------------------- | :----------------------------------------------- |
| **Homepage URL**                           | `http://localhost:5173`                          |
| **Authorization Callback URL** (GitHub)    | `http://localhost:5173/api/auth/callback/github` |
| **Authorized JavaScript Origins** (Google) | `http://localhost:5173`                          |
| **Authorized Redirect URIs** (Google)      | `http://localhost:5173/api/auth/callback/google` |

### Passkeys

Passkeys require a valid domain. `localhost` is supported by most browsers for testing, but ensure you access the site via `http://localhost:5173`, not `127.0.0.1`.

## 6. Testing the Flow

1.  Start the app: `pnpm run dev:vercel`
2.  Go to `http://localhost:5173/auth`
3.  Sign Up with Email/Password -> Check DB (`pnpm run db:studio`)
4.  Sign Out
5.  Sign In with GitHub -> Redirects to GitHub -> Back to Dashboard
