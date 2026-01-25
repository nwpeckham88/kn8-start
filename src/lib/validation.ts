import * as v from 'valibot';

export const LoginSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(12), v.maxLength(128))
});

export const RegisterSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2)),
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(
		v.string(),
		v.minLength(12),
		v.maxLength(128),
		v.regex(/[A-Z]/, 'Must contain an uppercase letter'),
		v.regex(/[a-z]/, 'Must contain a lowercase letter'),
		v.regex(/[0-9]/, 'Must contain a number'),
		v.regex(/[^A-Za-z0-9]/, 'Must contain a special character')
	)
});

export const PasswordSchema = v.pipe(
	v.string(),
	v.minLength(12),
	v.maxLength(128),
	v.regex(/[A-Z]/, 'Must contain an uppercase letter'),
	v.regex(/[a-z]/, 'Must contain a lowercase letter'),
	v.regex(/[0-9]/, 'Must contain a number'),
	v.regex(/[^A-Za-z0-9]/, 'Must contain a special character')
);

export const OrganizationSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2)),
	slug: v.pipe(v.string(), v.minLength(2))
});

export const InviteMemberSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	role: v.picklist(['admin', 'member', 'owner'])
});

export const MagicLinkSchema = v.object({
	email: v.pipe(v.string(), v.email())
});

export const PasswordResetRequestSchema = v.object({
	email: v.pipe(v.string(), v.email())
});

export const OtpSchema = v.object({
	code: v.pipe(v.string(), v.minLength(6), v.maxLength(10))
});

export const TwoFactorPasswordSchema = v.object({
	password: v.pipe(v.string(), v.minLength(12), v.maxLength(128))
});

export const PasswordResetSchema = v.object({
	password: PasswordSchema,
	confirmPassword: PasswordSchema
});

export type LoginInput = v.InferInput<typeof LoginSchema>;
export type RegisterInput = v.InferInput<typeof RegisterSchema>;
export type PasswordInput = v.InferInput<typeof PasswordSchema>;
export type OrganizationInput = v.InferInput<typeof OrganizationSchema>;
export type InviteMemberInput = v.InferInput<typeof InviteMemberSchema>;
export type MagicLinkInput = v.InferInput<typeof MagicLinkSchema>;
export type PasswordResetRequestInput = v.InferInput<typeof PasswordResetRequestSchema>;
export type OtpInput = v.InferInput<typeof OtpSchema>;
export type TwoFactorPasswordInput = v.InferInput<typeof TwoFactorPasswordSchema>;
export type PasswordResetInput = v.InferInput<typeof PasswordResetSchema>;
