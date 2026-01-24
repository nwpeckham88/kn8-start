import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink, organization, twoFactor } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import Redis from 'ioredis';
import { db } from './db';

const redis = new Redis(env.REDIS_URL || 'redis://localhost:6379');

const accessControl = createAccessControl({
	organization: ['read', 'update', 'delete'],
	member: ['create', 'update', 'delete'],
	invitation: ['create', 'cancel']
});

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 12,
		maxPasswordLength: 128
	},
	secondaryStorage: {
		get: async (key) => await redis.get(key),
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, 'EX', ttl);
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		}
	},
	rateLimit: {
		storage: 'secondary-storage',
		window: 60, // 1 minute
		max: 100 // 100 requests per minute
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID!,
			clientSecret: env.GITHUB_CLIENT_SECRET!
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID!,
			clientSecret: env.GOOGLE_CLIENT_SECRET!
		}
	},
	plugins: [
		organization({
			ac: accessControl,
			roles: {
				admin: accessControl.newRole({
					organization: ['read', 'update'],
					member: ['create', 'update', 'delete'],
					invitation: ['create', 'cancel']
				}),
				member: accessControl.newRole({
					organization: ['read']
				}),
				owner: accessControl.newRole({
					organization: ['read', 'update', 'delete'],
					member: ['create', 'update', 'delete'],
					invitation: ['create', 'cancel']
				})
			}
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }, _request) {
					// In production, use an email service (Resend, SendGrid, etc.)
					console.log(`[2FA] Sending OTP to ${user.email}: ${otp}`);
				}
			},
			issuer: 'Kn8 Starter'
		}),
		magicLink({
			sendMagicLink: async ({ email, token: _token, url }, _request) => {
				// In production, use an email service
				console.log(`[Magic Link] Sending link to ${email}: ${url}`);
			}
		}),
		passkey(),
		sveltekitCookies(getRequestEvent)
	]
});
