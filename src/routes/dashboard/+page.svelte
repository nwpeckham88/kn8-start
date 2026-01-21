<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
    import { OrganizationSchema } from '$lib/validation';
    import * as v from 'valibot';
    import Members from './Members.svelte';

    let { data } = $props();
    
    // Using $state for local reactive state (Svelte 5)
    let session = $derived(data.session);
    let activeOrg = $state(data.session?.session?.activeOrganizationId);
    
    let newOrgName = $state('');
    let newOrgSlug = $state('');
    let orgError = $state<string | null>(null);

    // Fetch organizations using the client
    let organizations = $state<any[]>([]);
    
    $effect(() => {
        if (session) {
            authClient.organization.list().then((res) => {
                if (res.data) organizations = res.data;
            });
        }
    });

    async function handleCreateOrg() {
        const input = { name: newOrgName, slug: newOrgSlug };
        const result = v.safeParse(OrganizationSchema, input);
        if (!result.success) {
            orgError = result.issues[0].message;
            return;
        }

        const { data: org, error } = await authClient.organization.create({
            name: newOrgName,
            slug: newOrgSlug
        });

        if (error) {
            orgError = error.message || 'An error occurred';
            return;
        }

        if (org) {
            organizations = [...organizations, org];
            newOrgName = '';
            newOrgSlug = '';
            activeOrg = org.id;
        }
    }

    async function setActiveOrg(orgId: string) {
        await authClient.organization.setActive({
            organizationId: orgId
        });
        activeOrg = orgId;
        window.location.reload(); // Reload to refresh server-side session context if needed
    }

    async function handleLogout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = '/auth';
                }
            }
        });
    }
</script>

<div class="container mx-auto py-10">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <div class="flex items-center gap-4">
            <span>{session?.user?.email}</span>
            <Button variant="outline" onclick={handleLogout}>Logout</Button>
        </div>
    </div>

    {#if !session}
        <div class="p-10 text-center">
            <p>Please sign in to view this page.</p>
            <Button href="/auth" class="mt-4">Go to Login</Button>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 space-y-6">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Organizations</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div class="space-y-2">
                            {#each organizations as org}
                                <div class="flex items-center justify-between p-2 rounded-md {activeOrg === org.id ? 'bg-secondary' : ''}">
                                    <span>{org.name}</span>
                                    {#if activeOrg !== org.id}
                                        <Button size="sm" variant="ghost" onclick={() => setActiveOrg(org.id)}>Switch</Button>
                                    {:else}
                                        <span class="text-xs text-muted-foreground">Active</span>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Create Organization</Card.Title>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        {#if orgError}
                            <p class="text-destructive text-sm">{orgError}</p>
                        {/if}
                        <Input 
                            placeholder="Name" 
                            bind:value={newOrgName}
                        />
                        <Input 
                            placeholder="Slug" 
                            bind:value={newOrgSlug}
                        />
                        <Button class="w-full" onclick={handleCreateOrg}>Create</Button>
                    </Card.Content>
                </Card.Root>
            </div>

            <div class="md:col-span-2">
                <Card.Root>
                    <Card.Content class="p-8">
                        {#if activeOrg}
                            <div class="mb-8 text-center">
                                <h2 class="text-2xl font-bold mb-2">
                                    {organizations.find(o => o.id === activeOrg)?.name}
                                </h2>
                                <p class="text-muted-foreground">Organization Dashboard</p>
                            </div>
                            
                            <Members activeOrgId={activeOrg} />
                        {:else}
                            <div class="text-center">
                                <h2 class="text-2xl font-bold mb-4">Welcome to your dashboard</h2>
                                <p class="text-muted-foreground">Select or create an organization to get started.</p>
                            </div>
                        {/if}
                    </Card.Content>
                </Card.Root>
            </div>
        </div>
    {/if}
</div>
