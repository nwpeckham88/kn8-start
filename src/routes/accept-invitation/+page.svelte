<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { Button } from '$lib/components/ui/button';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let status = $state<'loading' | 'success' | 'error'>('loading');
    let error = $state<string | null>(null);
    let invitationId = $derived($page.url.searchParams.get('id'));

    async function handleAccept() {
        if (!invitationId) {
            status = 'error';
            error = 'Invalid invitation link';
            return;
        }

        const { error: apiError } = await authClient.organization.acceptInvitation({
            invitationId
        });

        if (apiError) {
            status = 'error';
            error = apiError.message;
        } else {
            status = 'success';
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        }
    }

    onMount(() => {
        if (!invitationId) {
            status = 'error';
            error = 'No invitation ID provided';
        }
    });
</script>

<div class="container mx-auto flex h-screen items-center justify-center">
    <div class="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-sm text-center">
        <h2 class="text-2xl font-bold">Organization Invitation</h2>
        
        {#if status === 'loading'}
            <p class="text-muted-foreground">You have been invited to join an organization.</p>
            <Button class="w-full" onclick={handleAccept}>Accept Invitation</Button>
        {:else if status === 'success'}
            <div class="text-green-600">
                <p class="font-medium">Successfully joined!</p>
                <p class="text-sm">Redirecting to dashboard...</p>
            </div>
        {:else if status === 'error'}
            <div class="text-destructive">
                <p class="font-medium">Failed to accept invitation</p>
                <p class="text-sm">{error}</p>
            </div>
            <Button variant="outline" href="/dashboard" class="mt-4">Go to Dashboard</Button>
        {/if}
    </div>
</div>
