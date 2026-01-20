<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { LoginSchema, RegisterSchema, type LoginInput, type RegisterInput } from '$lib/validation';
	import * as v from 'valibot';

	let isRegister = $state(false);
    let error = $state<string | null>(null);

    let email = $state('');
    let password = $state('');
    let name = $state('');

	async function handleEmailAuth() {
        error = null;
		try {
			if (isRegister) {
                const input: RegisterInput = { email, password, name };
                const result = v.safeParse(RegisterSchema, input);
                if (!result.success) {
                    error = result.issues[0].message;
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
                    return;
                }

				await authClient.signIn.email({
					email,
					password,
                    callbackURL: '/dashboard'
				});
			}
		} catch (e: any) {
			error = e.message;
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
        } catch (e: any) {
            error = e.message;
        }
    }
</script>

<div class="container mx-auto flex h-screen items-center justify-center">
	<div class="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-sm">
		<div class="text-center">
			<h2 class="text-3xl font-bold">{isRegister ? 'Create an account' : 'Sign in'}</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				{isRegister ? 'Enter your details to register' : 'Enter your credentials to access your account'}
			</p>
		</div>

        {#if error}
            <div class="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
            </div>
        {/if}

		<div class="space-y-4">
            {#if isRegister}
                <div class="space-y-2">
                    <label for="name" class="text-sm font-medium">Name</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={name}
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="John Doe"
                    />
                </div>
            {/if}

			<div class="space-y-2">
				<label for="email" class="text-sm font-medium">Email</label>
				<input
					id="email"
					type="email"
                    bind:value={email}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					placeholder="name@example.com"
				/>
			</div>

			<div class="space-y-2">
				<label for="password" class="text-sm font-medium">Password</label>
				<input
					id="password"
					type="password"
                    bind:value={password}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</div>

			<Button class="w-full" onclick={handleEmailAuth}>
				{isRegister ? 'Sign Up' : 'Sign In'}
			</Button>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <Button variant="outline" onclick={() => handleSocial('github')}>GitHub</Button>
                <Button variant="outline" onclick={() => handleSocial('google')}>Google</Button>
            </div>
            
            <Button variant="outline" class="w-full" onclick={handlePasskey}>
                Sign in with Passkey
            </Button>
		</div>

		<div class="text-center text-sm">
			<button class="underline hover:text-primary" onclick={() => (isRegister = !isRegister)}>
				{isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
			</button>
		</div>
	</div>
</div>
