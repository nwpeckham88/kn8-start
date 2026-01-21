import { getRequestEvent } from "$app/server";
import { env } from '$env/dynamic/private';
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { db } from "./db";

const accessControl = createAccessControl({
    organization: ["read", "update", "delete"],
    member: ["create", "update", "delete"],
    invitation: ["create", "cancel"]
});

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
            ac: accessControl,
            roles: {
                admin: accessControl.newRole({
                    organization: ["read", "update"],
                    member: ["create", "update", "delete"],
                    invitation: ["create", "cancel"]
                }),
                member: accessControl.newRole({
                    organization: ["read"]
                }),
                owner: accessControl.newRole({
                    organization: ["read", "update", "delete"],
                    member: ["create", "update", "delete"],
                    invitation: ["create", "cancel"]
                })
            }
        }),
        passkey(),
        sveltekitCookies(getRequestEvent)
    ]
});
