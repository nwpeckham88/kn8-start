import { building } from "$app/environment";
import { auth } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Mock session for testing
    if (event.cookies.get('mock_session') === 'true') {
        event.locals.session = {
            id: 'mock-session-id',
            userId: 'mock-user-id',
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
            token: 'mock-token',
            createdAt: new Date(),
            updatedAt: new Date(),
            ipAddress: '127.0.0.1',
            userAgent: 'MockAgent',
            activeOrganizationId: 'mock-org-id'
        };
        event.locals.user = {
            id: 'mock-user-id',
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            image: null
        };
    } else {
        // Populate session data in locals for server-side access
        const session = await auth.api.getSession({
            headers: event.request.headers,
        });

        if (session) {
            event.locals.session = session.session;
            event.locals.user = session.user;
        }
    }

    return svelteKitHandler({ event, resolve, auth, building });
};
