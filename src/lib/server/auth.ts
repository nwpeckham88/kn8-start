import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink, organization, twoFactor } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import { db } from './db';

if (!env.BETTER_AUTH_SECRET) throw new Error('BETTER_AUTH_SECRET is not set');
if (!env.BETTER_AUTH_URL) throw new Error('BETTER_AUTH_URL is not set');

const secureCookies = env.BETTER_AUTH_URL.startsWith('https://');

const redisUrl = env.REDIS_URL?.trim();
const redis = redisUrl
	? new Redis(redisUrl, {
			lazyConnect: true,
			enableOfflineQueue: false,
			maxRetriesPerRequest: 1
		})
	: null;
let redisAvailable = Boolean(redis);

const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

function memoryGet(key: string) {
	const entry = memoryStore.get(key);
	if (!entry) return null;
	if (entry.expiresAt && entry.expiresAt <= Date.now()) {
		memoryStore.delete(key);
		return null;
	}
	return entry.value;
}

function memorySet(key: string, value: string, ttl?: number) {
	const expiresAt = ttl ? Date.now() + ttl * 1000 : undefined;
	memoryStore.set(key, { value, expiresAt });
}

function memoryDelete(key: string) {
	memoryStore.delete(key);
}

if (redis) {
	redis.on('connect', () => {
		redisAvailable = true;
	});
	redis.on('end', () => {
		redisAvailable = false;
	});
	redis.on('error', (error) => {
		redisAvailable = false;
		console.warn('Redis unavailable', error);
	});
}

const accessControl = createAccessControl({
	organization: ['read', 'update', 'delete'],
	member: ['create', 'update', 'delete'],
	invitation: ['create', 'cancel']
});

const smtpHost = env.SMTP_HOST;
const smtpPort = env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined;
const smtpUser = env.SMTP_USER;
const smtpPass = env.SMTP_PASS ?? env.SMTP_PASSWORD;
const smtpSecure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : smtpPort === 465;
const smtpFrom = env.EMAIL_FROM ?? env.SMTP_FROM;

let mailTransporter: nodemailer.Transporter | null = null;

function getMailer() {
	if (mailTransporter) return mailTransporter;
	if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) return null;
	mailTransporter = nodemailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: smtpSecure,
		auth: {
			user: smtpUser,
			pass: smtpPass
		}
	});
	return mailTransporter;
}

async function sendEmail({
	to,
	subject,
	text,
	html
}: {
	to: string;
	subject: string;
	text: string;
	html?: string;
}) {
	const mailer = getMailer();
	if (!mailer || !smtpFrom) return;
	await mailer.sendMail({
		from: smtpFrom,
		to,
		subject,
		text,
		html
	});
}

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	advanced: {
		useSecureCookies: secureCookies
	},
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 12,
		maxPasswordLength: 128,
		sendResetPassword: async ({ user, url }, _request) => {
			void sendEmail({
				to: user.email,
				subject: 'Reset your password',
				text: `Click the link to reset your password: ${url}`,
				html: `<p>Click the link to reset your password:</p><p><a href="${url}">${url}</a></p>`
			});
		}
	},
	secondaryStorage: {
		get: async (key) => {
			if (redis && redisAvailable) {
				try {
					return await redis.get(key);
				} catch (error) {
					redisAvailable = false;
					console.warn('Redis get failed', error);
				}
			}
			return memoryGet(key);
		},
		set: async (key, value, ttl) => {
			if (redis && redisAvailable) {
				try {
					if (ttl) await redis.set(key, value, 'EX', ttl);
					else await redis.set(key, value);
					return;
				} catch (error) {
					redisAvailable = false;
					console.warn('Redis set failed', error);
				}
			}
			memorySet(key, value, ttl);
		},
		delete: async (key) => {
			if (redis && redisAvailable) {
				try {
					await redis.del(key);
					return;
				} catch (error) {
					redisAvailable = false;
					console.warn('Redis delete failed', error);
				}
			}
			memoryDelete(key);
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
					void sendEmail({
						to: user.email,
						subject: 'Your verification code',
						text: `Your verification code is ${otp}.`,
						html: `<p>Your verification code is <strong>${otp}</strong>.</p>`
					});
				}
			},
			issuer: 'Kn8 Starter'
		}),
		magicLink({
			sendMagicLink: async ({ email, token: _token, url }, _request) => {
				void sendEmail({
					to: email,
					subject: 'Sign in to Kn8 Starter',
					text: `Use this link to sign in: ${url}`,
					html: `<p>Use this link to sign in:</p><p><a href="${url}">${url}</a></p>`
				});
			},
			storeToken: 'hashed'
		}),
		passkey(),
		sveltekitCookies(getRequestEvent)
	]
});
