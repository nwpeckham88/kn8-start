<script lang="ts">
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import GeometricBackgroundSubtle from '$lib/components/GeometricBackgroundSubtle.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let { data } = $props();

	let session = $state<typeof data.session | null>(null);
	let user = $state<typeof data.user | null>(null);

	$effect(() => {
		session = data.session;
		user = data.user;
	});

	async function handleLogout() {
        // MOCK LOGOUT
        document.cookie = "mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.location.href = '/auth';
        return;

        /*
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/auth';
				}
			}
		});
        */
	}
</script>

<div class="container mx-auto py-12">
	<GeometricBackgroundSubtle />
	<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
			<p class="text-muted-foreground">Your secure workspace overview.</p>
		</div>
        <div class="flex items-center gap-2">
            <ModeToggle />
		    <Button variant="outline" onclick={handleLogout}>Logout</Button>
        </div>
	</div>

	{#if !session}
		<div class="rounded-2xl border bg-card p-10 text-center text-card-foreground">
			<p class="text-muted-foreground">Please sign in to view this page.</p>
			<Button href="/auth" class="mt-4">Go to Login</Button>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2">
			<Card.Root class="rounded-2xl bg-card text-card-foreground">
				<Card.Header>
					<Card.Title>Account</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-3">
					<div class="text-sm text-muted-foreground">Signed in as</div>
					<div class="text-lg font-medium text-foreground">{user?.name || 'User'}</div>
					<div class="text-sm text-muted-foreground">{user?.email}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="rounded-2xl bg-card text-card-foreground">
				<Card.Header>
					<Card.Title>Session</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-3">
					<div class="flex items-center justify-between text-sm">
						<span class="text-muted-foreground">Session ID</span>
						<span class="font-medium text-foreground">{session?.id?.slice(0, 8)}...</span>
					</div>
					<div class="flex items-center justify-between text-sm">
						<span class="text-muted-foreground">Active org</span>
						<span class="font-medium text-foreground">{session?.activeOrganizationId || 'Not set'}</span>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="rounded-2xl bg-card text-card-foreground md:col-span-2">
				<Card.Header>
					<Card.Title>Quick actions</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3 sm:flex-row">
					<Button class="w-full sm:w-auto" href="/auth">Manage sign-in</Button>
					<Button class="w-full sm:w-auto" variant="outline" href="/auth/forgot">
						Reset password
					</Button>
					<Button class="w-full sm:w-auto" variant="outline" href="/auth/otp">
						Use OTP
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
