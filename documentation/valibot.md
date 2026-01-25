# Valibot Documentation

## Overview

Valibot is a schema library for data validation. It is designed to be small, tree-shakeable, and developer-friendly.

## Installation

```bash
pnpm add valibot
```

## Schema Definition

```typescript
import * as v from 'valibot';

const LoginSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8))
});

type LoginInput = v.InferInput<typeof LoginSchema>;
```

## SvelteKit Integration (Superforms)

To use Valibot with SvelteKit forms, use `sveltekit-superforms` with the Valibot adapter.

```bash
pnpm add sveltekit-superforms
```

```typescript
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(valibot(LoginSchema));
	return { form };
};
```

## API Validation

```typescript
import * as v from 'valibot';
import { error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const data = await request.json();
	const result = v.safeParse(LoginSchema, data);

	if (!result.success) {
		throw error(400, 'Invalid input');
	}

	// result.output is typed
};
```
