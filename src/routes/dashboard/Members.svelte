<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
    import * as Select from '$lib/components/ui/select';
    import { InviteMemberSchema } from '$lib/validation';
    import * as v from 'valibot';

    let { activeOrgId }: { activeOrgId: string } = $props();

    let members = $state<any[]>([]);
    let invitations = $state<any[]>([]);
    let inviteEmail = $state('');
    let inviteRole = $state<string>('member');
    let error = $state<string | null>(null);
    let success = $state<string | null>(null);
    let loading = $state(false);

    $effect(() => {
        if (activeOrgId) {
            fetchMembers();
            fetchInvitations();
        }
    });

    async function fetchMembers() {
        const { data } = await authClient.organization.listMembers({
            query: {
                organizationId: activeOrgId
            }
        });
        if (data) members = data;
    }

    async function fetchInvitations() {
        const { data } = await authClient.organization.listInvitations({
            query: {
                organizationId: activeOrgId
            }
        });
        if (data) invitations = data;
    }

    async function handleInvite() {
        error = null;
        success = null;
        loading = true;

        const input = { email: inviteEmail, role: inviteRole };
        const result = v.safeParse(InviteMemberSchema, input);
        
        if (!result.success) {
            error = result.issues[0].message;
            loading = false;
            return;
        }

        const { data, error: apiError } = await authClient.organization.inviteMember({
            email: inviteEmail,
            role: inviteRole as 'admin' | 'member' | 'owner',
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message;
            loading = false;
            return;
        }

        success = 'Invitation sent successfully';
        inviteEmail = '';
        loading = false;
        fetchInvitations();
    }

    async function handleRemoveMember(memberId: string) {
        if (!confirm('Are you sure you want to remove this member?')) return;
        
        const { error: apiError } = await authClient.organization.removeMember({
            memberIdOrEmail: memberId,
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message || 'An error occurred';
            return;
        }
        
        fetchMembers();
    }

    async function handleUpdateRole(memberId: string, newRole: string) {
        const { error: apiError } = await authClient.organization.updateMemberRole({
            memberId,
            role: newRole as 'admin' | 'member' | 'owner',
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message || 'An error occurred';
            return;
        }

        fetchMembers();
    }

    async function handleRevokeInvitation(invitationId: string) {
        const { error: apiError } = await authClient.organization.cancelInvitation({
            invitationId,
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message;
            return;
        }

        fetchInvitations();
    }
</script>

<div class="space-y-6">
    <Card.Root>
        <Card.Header>
            <Card.Title>Invite Member</Card.Title>
        </Card.Header>
        <Card.Content>
            {#if error}
                <div class="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
                    {error}
                </div>
            {/if}
            {#if success}
                <div class="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">
                    {success}
                </div>
            {/if}
            <div class="flex gap-4">
                <Input 
                    placeholder="Email address" 
                    bind:value={inviteEmail}
                />
                <Select.Root type="single" bind:value={inviteRole}>
                    <Select.Trigger class="w-[120px]">
                        <Select.Value placeholder="Select role" />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="member">Member</Select.Item>
                        <Select.Item value="admin">Admin</Select.Item>
                        <Select.Item value="owner">Owner</Select.Item>
                    </Select.Content>
                </Select.Root>
                <Button onclick={handleInvite} disabled={loading}>
                    {loading ? 'Inviting...' : 'Invite'}
                </Button>
            </div>
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Members</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="space-y-2">
                {#each members as member}
                    <div class="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                        <div class="flex flex-col">
                            <span class="font-medium">{member.user.name}</span>
                            <span class="text-xs text-muted-foreground">{member.user.email}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Select.Root type="single" value={member.role} onValueChange={(v) => handleUpdateRole(member.id, v)}>
                                <Select.Trigger class="h-8 w-[100px]">
                                    <Select.Value placeholder={member.role} />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="member">Member</Select.Item>
                                    <Select.Item value="admin">Admin</Select.Item>
                                    <Select.Item value="owner">Owner</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            <Button variant="destructive" size="sm" onclick={() => handleRemoveMember(member.id)}>Remove</Button>
                        </div>
                    </div>
                {/each}
                {#if members.length === 0}
                    <p class="text-sm text-muted-foreground">No members found.</p>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>

    {#if invitations.length > 0}
        <Card.Root>
            <Card.Header>
                <Card.Title>Pending Invitations</Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="space-y-2">
                    {#each invitations as invite}
                        <div class="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                            <div class="flex flex-col">
                                <span class="font-medium">{invite.email}</span>
                                <span class="text-xs text-muted-foreground">Role: {invite.role}</span>
                            </div>
                            <Button variant="destructive" size="sm" onclick={() => handleRevokeInvitation(invite.id)}>Revoke</Button>
                        </div>
                    {/each}
                </div>
            </Card.Content>
        </Card.Root>
    {/if}
</div>
