import { getRequestEvent } from "$app/server";
import { env } from '$env/dynamic/private';
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { db } from "./db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID!,
            clientSecret: env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
        }
    },
    plugins: [
        organization({
            ac: true,
            roles: {
                admin: {
                    permissions: [
                        "org:update",
                        "member:create",
                        "member:update",
                        "member:delete",
                        "invitation:create",
                        "invitation:cancel"
                    ]
                },
                member: {
                    permissions: [
                        "org:read"
                    ]
                },
                owner: {
                    permissions: ["*"]
                }
            }
        }),
        passkey(),
        sveltekitCookies(getRequestEvent)
    ]
});
