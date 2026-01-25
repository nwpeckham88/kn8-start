<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { PasswordResetRequestSchema, type PasswordResetRequestInput } from '$lib/validation';
	import { APIError } from 'better-auth/api';
	import * as v from 'valibot';

	let email = $state('');
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let loading = $state(false);

	function handleAuthError(err: unknown) {
		if (err instanceof APIError) {
			error = err.message;
			return;
		}
		if (err instanceof Error) {
			error = err.message;
			return;
		}
		error = 'An unknown error occurred';
	}

	async function handleRequestReset() {
		error = null;
		success = null;
		const input: PasswordResetRequestInput = { email };
		const result = v.safeParse(PasswordResetRequestSchema, input);
		if (!result.success) {
			error = result.issues[0].message;
			return;
		}
		loading = true;
		try {
			const redirectTo = new URL('/auth/reset', window.location.origin).toString();
			await authClient.requestPasswordReset({
				email,
				redirectTo
			});
			success = 'If an account exists, a reset link has been sent.';
		} catch (err: unknown) {
			handleAuthError(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="selection:bg-primary/20 relative min-h-screen w-full overflow-hidden">
	<GeometricBackground />

	<div class="relative z-10 container mx-auto flex min-h-screen items-center py-12">
		<Card.Root
			class="bg-card/90 mx-auto w-full max-w-lg rounded-3xl border shadow-xl backdrop-blur"
		>
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl font-semibold tracking-tight">Reset your password</Card.Title>
				<Card.Description class="text-base">
					Enter your email and we will send a secure reset link.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						autocomplete="email"
						placeholder="name@example.com"
						bind:value={email}
					/>
				</div>
				{#if error}
					<p class="text-destructive text-sm">{error}</p>
				{/if}
				{#if success}
					<p class="text-muted-foreground text-sm">{success}</p>
				{/if}

				<Button
					class="h-11 w-full rounded-xl text-base"
					onclick={handleRequestReset}
					disabled={loading}
				>
					{loading ? 'Sending...' : 'Send reset link'}
				</Button>

				<div class="text-muted-foreground text-center text-sm">
					<a class="text-foreground hover:text-primary font-medium transition" href="/auth">
						Back to sign in
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
