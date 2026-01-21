<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import * as Card from '$lib/components/ui/card';
	import { LoginSchema, RegisterSchema, type LoginInput, type RegisterInput } from '$lib/validation';
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
		} catch (e: any) {
			error = e.message;
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
        } catch (e: any) {
            error = e.message;
        }
    }
</script>

<div class="container mx-auto flex h-screen items-center justify-center">
    <Card.Root class="w-full max-w-md">
        <Card.Header class="text-center">
            <Card.Title class="text-3xl font-bold">
                {isRegister ? 'Create an account' : 'Sign in'}
            </Card.Title>
            <Card.Description>
                {isRegister ? 'Enter your details to register' : 'Enter your credentials to access your account'}
            </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-6">
            {#if error}
                <div class="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                    {error}
                </div>
            {/if}

            <div class="space-y-4">
                {#if isRegister}
                    <div class="space-y-2">
                        <Label for="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            bind:value={name}
                            placeholder="John Doe"
                        />
                    </div>
                {/if}

                <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder="name@example.com"
                    />
                </div>

                <div class="space-y-2">
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        bind:value={password}
                    />
                </div>

                <Button class="w-full" onclick={handleEmailAuth} disabled={loading}>
                    {loading ? 'Loading...' : (isRegister ? 'Sign Up' : 'Sign In')}
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
        </Card.Content>
    </Card.Root>
</div>
