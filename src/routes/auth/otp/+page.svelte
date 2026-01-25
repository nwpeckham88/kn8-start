<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { OtpSchema, type OtpInput } from '$lib/validation';
	import { APIError } from 'better-auth/api';
	import * as v from 'valibot';

	let method = $state<'totp' | 'otp' | 'backup'>('totp');
	let code = $state('');
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let loading = $state(false);
	let sending = $state(false);

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

	async function handleVerify() {
		error = null;
		success = null;
		loading = true;
		const input: OtpInput = { code };
		const result = v.safeParse(OtpSchema, input);
		if (!result.success) {
			error = result.issues[0].message;
			loading = false;
			return;
		}
		try {
			if (method === 'backup') {
				await authClient.twoFactor.verifyBackupCode({
					code
				});
			} else if (method === 'otp') {
				await authClient.twoFactor.verifyOtp({
					code,
					trustDevice: true
				});
			} else {
				await authClient.twoFactor.verifyTotp({
					code,
					trustDevice: true
				});
			}
			success = 'Verification successful.';
			window.location.href = '/dashboard';
		} catch (e: unknown) {
			handleAuthError(e);
		} finally {
			loading = false;
		}
	}

	async function handleSendOtp() {
		error = null;
		success = null;
		sending = true;
		try {
			await authClient.twoFactor.sendOtp();
			success = 'Code sent.';
		} catch (e: unknown) {
			handleAuthError(e);
		} finally {
			sending = false;
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
				<Card.Title class="text-3xl font-semibold tracking-tight"
					>Enter your one-time code</Card.Title
				>
				<Card.Description class="text-base">
					Check your email or authenticator app for the verification code.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="space-y-2">
					<Label for="otp-method">Verification method</Label>
					<Select.Root type="single" bind:value={method}>
						<Select.Trigger id="otp-method">
							{method === 'totp'
								? 'Authenticator app'
								: method === 'otp'
									? 'Email code'
									: 'Backup code'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="totp">Authenticator app</Select.Item>
							<Select.Item value="otp">Email code</Select.Item>
							<Select.Item value="backup">Backup code</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="otp">Verification code</Label>
					<Input
						id="otp"
						type="text"
						inputmode="numeric"
						autocomplete="one-time-code"
						placeholder="123456"
						bind:value={code}
					/>
				</div>
				{#if error}
					<p class="text-destructive text-sm">{error}</p>
				{/if}
				{#if success}
					<p class="text-muted-foreground text-sm">{success}</p>
				{/if}

				<Button class="h-11 w-full rounded-xl text-base" onclick={handleVerify}>
					{loading ? 'Verifying...' : 'Verify code'}
				</Button>
				{#if method === 'otp'}
					<Button
						variant="outline"
						class="h-11 w-full rounded-xl text-base"
						onclick={handleSendOtp}
						disabled={sending}
					>
						{sending ? 'Sending...' : 'Send code'}
					</Button>
				{/if}

				<div
					class="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm"
				>
					<a class="text-foreground hover:text-primary font-medium transition" href="/auth/verify">
						Back to magic link
					</a>
					<a class="text-foreground hover:text-primary font-medium transition" href="/auth">
						Back to sign in
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
