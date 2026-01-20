import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, locals, url }) => {
    // If not authenticated, redirect to login
    if (!locals.session) {
        throw redirect(302, '/auth');
    }

    // Example of enforcing organization context:
    // If we had routes like /dashboard/[orgId], we would check membership here.
    // Since we use a single dashboard with dynamic content based on 'activeOrganizationId',
    // BetterAuth handles the active organization state.
    
    // However, if we wanted to be strict about ensuring an active org exists for certain actions:
    // const activeOrgId = locals.session.activeOrganizationId;
    // if (!activeOrgId && url.pathname !== '/dashboard') {
    //     // redirect or prompt to select org
    // }

    return {
        user: locals.user,
        session: locals.session
    };
};
