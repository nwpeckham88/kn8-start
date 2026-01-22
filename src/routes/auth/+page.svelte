<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let isRegister = $state(false);
	let error = $state<string | null>(null);
    let loading = $state(false);

    let email = $state('');
    let password = $state('');
    let name = $state('');

	async function handleEmailAuth() {
        error = null;
        loading = true;
        
        // MOCK AUTH for testing
        document.cookie = "mock_session=true; path=/";
        window.location.href = '/dashboard';
        return;

		/* 
        // Real auth disabled for now
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
        */
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

<div class="relative min-h-screen w-full overflow-hidden selection:bg-primary/20">
    <GeometricBackground />

    <div class="container relative z-10 mx-auto flex min-h-screen items-center justify-center py-12">
        <div class="absolute right-4 top-4 z-50 md:right-8 md:top-8">
            <ModeToggle />
        </div>
        <!-- 
            Adjusted grid to be equal width columns (grid-cols-2) and increased max-width/gap to reveal the center cross.
            Using mx-auto on the grid ensures the gap is perfectly centered on the page.
        -->
        <div class="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-32">
            <div class="flex flex-col justify-between rounded-3xl border bg-card/70 p-10 shadow-xl backdrop-blur text-card-foreground h-full">
                <div class="space-y-6">
                    <div class="inline-flex w-fit items-center rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:bg-background/90 hover:scale-105">
                        Secure access
                    </div>
                    <div class="space-y-3">
                        <p class="text-sm font-medium text-primary">Kn8 Starter</p>
                        <h1 class="text-4xl font-semibold tracking-tight text-foreground">
                            {isRegister ? 'Create your account' : 'Welcome back'}
                        </h1>
                        <p class="text-base text-muted-foreground">
                            {isRegister
                                ? 'Join your team workspace with a polished, secure onboarding flow.'
                                : 'Sign in to continue to your organization dashboard and secure workspace.'}
                        </p>
                    </div>
                </div>

                <div class="mt-10 space-y-4">
                    <div class="flex items-start gap-3 rounded-2xl border bg-background/60 p-4 transition-all hover:bg-background/80 hover:-translate-y-1 hover:shadow-md">
                        <div class="mt-1 h-2.5 w-2.5 rounded-full bg-primary"></div>
                        <div>
                            <p class="text-sm font-medium text-foreground">Standards-compliant</p>
                            <p class="text-sm text-muted-foreground">Accessible labels, focus states, and readable contrast.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 rounded-2xl border bg-background/60 p-4 transition-all hover:bg-background/80 hover:-translate-y-1 hover:shadow-md">
                        <div class="mt-1 h-2.5 w-2.5 rounded-full bg-primary"></div>
                        <div>
                            <p class="text-sm font-medium text-foreground">Multiple sign-in options</p>
                            <p class="text-sm text-muted-foreground">Email, social providers, and passkey support.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3 rounded-2xl border bg-background/60 p-4 transition-all hover:bg-background/80 hover:-translate-y-1 hover:shadow-md">
                        <div class="mt-1 h-2.5 w-2.5 rounded-full bg-primary"></div>
                        <div>
                            <p class="text-sm font-medium text-foreground">Private by default</p>
                            <p class="text-sm text-muted-foreground">Session-aware routing keeps everything locked down.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Card.Root class="w-full h-full flex flex-col justify-center rounded-3xl border bg-card/90 shadow-xl backdrop-blur text-card-foreground">
                <Card.Header class="space-y-2">
                    <Card.Title class="text-3xl font-semibold tracking-tight text-foreground">
                        {isRegister ? 'Create an account' : 'Sign in'}
                    </Card.Title>
                    <Card.Description class="text-base text-muted-foreground">
                        {isRegister ? 'Enter your details to register' : 'Enter your credentials to access your account'}
                    </Card.Description>
                </Card.Header>
                <Card.Content class="space-y-6">
                    {#if error}
                        <div class="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
                            {error}
                        </div>
                    {/if}

                    <div class="space-y-5">
                        {#if isRegister}
                            <div class="space-y-2">
                                <Label for="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autocomplete="name"
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
                                autocomplete="email"
                                bind:value={email}
                                placeholder="name@example.com"
                            />
                        </div>

                        <div class="space-y-2">
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autocomplete={isRegister ? 'new-password' : 'current-password'}
                                bind:value={password}
                            />
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <a class="font-medium text-muted-foreground transition hover:text-foreground" href="/auth/forgot">
                                Forgot password?
                            </a>
                            <a class="font-medium text-muted-foreground transition hover:text-foreground" href="/auth/otp">
                                Use a one-time code
                            </a>
                        </div>

                        <Button class="h-11 w-full rounded-xl text-base" onclick={handleEmailAuth} disabled={loading}>
                            {loading ? 'Loading...' : (isRegister ? 'Create account' : 'Sign in')}
                        </Button>

                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <span class="w-full border-t"></span>
                            </div>
                            <div class="relative flex justify-center text-xs uppercase tracking-[0.18em]">
                                <span class="bg-card px-3 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button variant="outline" class="h-11 w-full rounded-xl" onclick={() => handleSocial('github')}>GitHub</Button>
                            <Button variant="outline" class="h-11 w-full rounded-xl" onclick={() => handleSocial('google')}>Google</Button>
                        </div>

                        <Button variant="outline" class="h-11 w-full rounded-xl" onclick={handlePasskey}>
                            Sign in with Passkey
                        </Button>
                    </div>

                    <div class="text-center text-sm text-muted-foreground">
                        <button class="font-medium text-foreground transition hover:text-primary underline-offset-4 hover:underline" onclick={() => (isRegister = !isRegister)}>
                            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>

                    <p class="text-center text-xs text-muted-foreground">
                        By continuing, you agree to secure session handling and privacy-first defaults.
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
