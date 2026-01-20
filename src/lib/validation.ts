import * as v from 'valibot';

export const LoginSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8))
});

export const RegisterSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2)),
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8))
});

export const OrganizationSchema = v.object({
	name: v.pipe(v.string(), v.minLength(2)),
	slug: v.pipe(v.string(), v.minLength(2))
});

export const InviteMemberSchema = v.object({
    email: v.pipe(v.string(), v.email()),
    role: v.picklist(['admin', 'member', 'owner'])
});

export type LoginInput = v.InferInput<typeof LoginSchema>;
export type RegisterInput = v.InferInput<typeof RegisterSchema>;
export type OrganizationInput = v.InferInput<typeof OrganizationSchema>;
export type InviteMemberInput = v.InferInput<typeof InviteMemberSchema>;
