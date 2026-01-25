<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { PasswordResetSchema, type PasswordResetInput } from '$lib/validation';
	import { APIError } from 'better-auth/api';
	import * as v from 'valibot';

	let password = $state('');
	let confirmPassword = $state('');
	let token = $state<string | null>(null);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let loading = $state(false);

	$effect(() => {
		const tokenParam = $page.url.searchParams.get('token');
		const errorParam = $page.url.searchParams.get('error');
		if (tokenParam) {
			token = tokenParam;
		}
		if (errorParam === 'INVALID_TOKEN') {
			error = 'Reset link is invalid or expired.';
		}
	});

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

	async function handleResetPassword() {
		error = null;
		success = null;
		if (!token) {
			error = 'Reset link is invalid or expired.';
			return;
		}
		const input: PasswordResetInput = { password, confirmPassword };
		const result = v.safeParse(PasswordResetSchema, input);
		if (!result.success) {
			error = result.issues[0].message;
			return;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}
		loading = true;
		try {
			const { error: apiError } = await authClient.resetPassword({
				newPassword: password,
				token
			});
			if (apiError) {
				error = apiError.message ?? 'An error occurred';
				return;
			}
			success = 'Password updated. You can sign in now.';
			password = '';
			confirmPassword = '';
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
				<Card.Title class="text-3xl font-semibold tracking-tight">Set a new password</Card.Title>
				<Card.Description class="text-base">
					Create a strong password to secure your account.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="space-y-2">
					<Label for="password">New password</Label>
					<Input id="password" type="password" autocomplete="new-password" bind:value={password} />
				</div>
				<div class="space-y-2">
					<Label for="confirm">Confirm password</Label>
					<Input
						id="confirm"
						type="password"
						autocomplete="new-password"
						bind:value={confirmPassword}
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
					onclick={handleResetPassword}
					disabled={loading || !token}
				>
					{loading ? 'Updating...' : 'Update password'}
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
