import { passkeyClient } from "@better-auth/passkey/client";
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    plugins: [
        organizationClient(),
        passkeyClient()
    ]
});
