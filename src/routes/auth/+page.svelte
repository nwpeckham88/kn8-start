<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		LoginSchema,
		RegisterSchema,
		type LoginInput,
		type RegisterInput
	} from '$lib/validation';
	import * as v from 'valibot';

	let isRegister = $state(false);
	let error = $state<string | null>(null);
	let loading = $state(false);

	let email = $state('');
	let password = $state('');
	let name = $state('');

	async function handleEmailAuth() {
		error = null;
		loading = true;

		try {
			if (isRegister) {
				const input: RegisterInput = { email, password, name };
				const result = v.safeParse(RegisterSchema, input);
				if (!result.success) {
					error = result.issues[0].message;
					loading = false;
					return;
				}

				await authClient.signUp.email({
					email,
					password,
					name,
					callbackURL: '/dashboard'
				});
			} else {
				const input: LoginInput = { email, password };
				const result = v.safeParse(LoginSchema, input);
				if (!result.success) {
					error = result.issues[0].message;
					loading = false;
					return;
				}

				await authClient.signIn.email({
					email,
					password,
					callbackURL: '/dashboard'
				});
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			loading = false;
		}
	}

	async function handleSocial(provider: 'github' | 'google') {
		await authClient.signIn.social({
			provider,
			callbackURL: '/dashboard'
		});
	}

	async function handlePasskey() {
		try {
			await authClient.signIn.passkey({
				fetchOptions: {
					onSuccess: () => {
						window.location.href = '/dashboard';
					}
				}
			});
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		}
	}
</script>

<div class="selection:bg-primary/20 relative min-h-screen w-full overflow-hidden">
	<GeometricBackground />

	<div class="relative z-10 container mx-auto flex min-h-screen items-center justify-center py-12">
		<div class="absolute top-4 right-4 z-50 md:top-8 md:right-8">
			<ModeToggle />
		</div>
		<!-- 
            Adjusted grid to be equal width columns (grid-cols-2) and increased max-width/gap to reveal the center cross.
            Using mx-auto on the grid ensures the gap is perfectly centered on the page.
        -->
		<div class="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-32">
			<div
				class="bg-card/70 text-card-foreground flex h-full flex-col justify-between rounded-3xl border p-10 shadow-xl backdrop-blur"
			>
				<div class="space-y-6">
					<div>
						<h1 class="text-3xl font-bold tracking-tight">
							{isRegister ? 'Create an account' : 'Welcome back'}
						</h1>
						<p class="text-muted-foreground">
							{isRegister
								? 'Enter your email below to create your account'
								: 'Enter your email below to login to your account'}
						</p>
					</div>

					<div class="grid gap-4">
						<div class="grid gap-2">
							{#if isRegister}
								<div class="grid gap-1">
									<Label for="name" class="sr-only">Name</Label>
									<Input
										id="name"
										placeholder="Name"
										type="text"
										autocapitalize="none"
										autocomplete="name"
										autocorrect="off"
										disabled={loading}
										bind:value={name}
									/>
								</div>
							{/if}
							<div class="grid gap-1">
								<Label for="email" class="sr-only">Email</Label>
								<Input
									id="email"
									placeholder="name@example.com"
									type="email"
									autocapitalize="none"
									autocomplete="email"
									autocorrect="off"
									disabled={loading}
									bind:value={email}
								/>
							</div>
							<div class="grid gap-1">
								<Label for="password" class="sr-only">Password</Label>
								<Input
									id="password"
									placeholder="Password"
									type="password"
									autocapitalize="none"
									autocomplete="current-password"
									disabled={loading}
									bind:value={password}
								/>
							</div>
							{#if error}
								<p class="text-destructive text-sm">{error}</p>
							{/if}
							<Button disabled={loading} onclick={handleEmailAuth}>
								{loading ? 'Loading...' : isRegister ? 'Sign In with Email' : 'Sign In with Email'}
							</Button>
						</div>

						<div class="relative">
							<div class="absolute inset-0 flex items-center">
								<span class="w-full border-t"></span>
							</div>
							<div class="relative flex justify-center text-xs uppercase">
								<span class="bg-card text-muted-foreground px-2"> Or continue with </span>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<Button variant="outline" onclick={() => handleSocial('github')} disabled={loading}>
								Github
							</Button>
							<Button variant="outline" onclick={() => handleSocial('google')} disabled={loading}>
								Google
							</Button>
						</div>
						<Button variant="outline" class="w-full" onclick={handlePasskey} disabled={loading}>
							Passkey
						</Button>
					</div>
				</div>

				<div class="text-muted-foreground mt-6 text-center text-sm">
					{isRegister ? 'Already have an account?' : "Don't have an account?"}
					<button
						class="hover:text-primary underline underline-offset-4"
						onclick={() => (isRegister = !isRegister)}
					>
						{isRegister ? 'Login' : 'Sign Up'}
					</button>
				</div>
			</div>
			<!-- Right side empty column to maintain grid structure for the cross -->
			<div class="hidden lg:block"></div>
		</div>
	</div>
</div>
