import { describe, it, expect } from 'vitest';
import { LoginSchema } from '../src/lib/validation';
import * as v from 'valibot';

describe('Validation Logic', () => {
	it('should validate correct email', () => {
		const input = { email: 'test@example.com', password: 'Password123!' };
		const result = v.safeParse(LoginSchema, input);
		expect(result.success).toBe(true);
	});

	it('should fail invalid email', () => {
		const input = { email: 'invalid', password: 'Password123!' };
		const result = v.safeParse(LoginSchema, input);
		expect(result.success).toBe(false);
	});
});
