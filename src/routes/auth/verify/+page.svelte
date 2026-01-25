<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { MagicLinkSchema, type MagicLinkInput } from '$lib/validation';
	import { APIError } from 'better-auth/api';
	import * as v from 'valibot';

	let email = $state('');
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let loading = $state(false);

	$effect(() => {
		const value = $page.url.searchParams.get('email');
		if (value && !email) {
			email = value;
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

	async function handleResend() {
		error = null;
		success = null;
		const input: MagicLinkInput = { email };
		const result = v.safeParse(MagicLinkSchema, input);
		if (!result.success) {
			error = result.issues[0].message;
			return;
		}
		loading = true;
		try {
			await authClient.signIn.magicLink({
				email
			});
			success = 'Magic link sent.';
		} catch (e: unknown) {
			handleAuthError(e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="selection:bg-primary/20 relative min-h-screen">
	<GeometricBackground />

	<div class="relative z-10 container mx-auto flex min-h-screen items-center py-12">
		<Card.Root
			class="bg-card/90 mx-auto w-full max-w-lg rounded-3xl border shadow-xl backdrop-blur"
		>
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl font-semibold tracking-tight">Check your inbox</Card.Title>
				<Card.Description class="text-base">
					We sent a secure link and one-time code to complete verification.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="bg-background/60 text-muted-foreground rounded-2xl border p-4 text-sm">
					Open the email, then follow the link or enter the code to continue.
				</div>
				<div class="space-y-2">
					<Label for="magic-email">Email</Label>
					<Input
						id="magic-email"
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

				<Button class="h-11 w-full rounded-xl text-base" href="/auth/otp">Enter a code</Button>
				<Button
					variant="outline"
					class="h-11 w-full rounded-xl text-base"
					onclick={handleResend}
					disabled={loading}
				>
					{loading ? 'Sending...' : 'Resend magic link'}
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
