import { passkeyClient } from '@better-auth/passkey/client';
import { magicLinkClient, organizationClient, twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
	plugins: [
		organizationClient(),
		passkeyClient(),
		magicLinkClient(),
		twoFactorClient({
			onTwoFactorRedirect: () => {
				if (typeof window !== 'undefined') {
					window.location.href = '/auth/otp';
				}
			}
		})
	]
});
