<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { Button } from '$lib/components/ui/button';
    import { InviteMemberSchema } from '$lib/validation';
    import * as v from 'valibot';

    let { activeOrgId } = $props();

    let members = $state<any[]>([]);
    let invitations = $state<any[]>([]);
    let inviteEmail = $state('');
    let inviteRole = $state<'admin' | 'member' | 'owner'>('member');
    let error = $state<string | null>(null);
    let success = $state<string | null>(null);

    $effect(() => {
        if (activeOrgId) {
            fetchMembers();
            fetchInvitations();
        }
    });

    async function fetchMembers() {
        const { data } = await authClient.organization.listMembers({
            organizationId: activeOrgId
        });
        if (data) members = data;
    }

    async function fetchInvitations() {
        const { data } = await authClient.organization.listInvitations({
            organizationId: activeOrgId
        });
        if (data) invitations = data;
    }

    async function handleInvite() {
        error = null;
        success = null;

        const input = { email: inviteEmail, role: inviteRole };
        const result = v.safeParse(InviteMemberSchema, input);
        
        if (!result.success) {
            error = result.issues[0].message;
            return;
        }

        const { data, error: apiError } = await authClient.organization.inviteMember({
            email: inviteEmail,
            role: inviteRole,
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message;
            return;
        }

        success = 'Invitation sent successfully';
        inviteEmail = '';
        fetchInvitations();
    }

    async function handleRemoveMember(memberId: string) {
        if (!confirm('Are you sure you want to remove this member?')) return;
        
        const { error: apiError } = await authClient.organization.removeMember({
            memberIdOrEmail: memberId,
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message;
            return;
        }
        
        fetchMembers();
    }

    async function handleUpdateRole(memberId: string, newRole: 'admin' | 'member' | 'owner') {
        const { error: apiError } = await authClient.organization.updateMemberRole({
            memberId,
            role: newRole,
            organizationId: activeOrgId
        });

        if (apiError) {
            error = apiError.message;
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
    <div class="rounded-lg border p-4">
        <h3 class="font-semibold mb-4">Invite Member</h3>
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
            <input 
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                placeholder="Email address" 
                bind:value={inviteEmail}
            />
            <select 
                class="flex h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                bind:value={inviteRole}
            >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
            </select>
            <Button onclick={handleInvite}>Invite</Button>
        </div>
    </div>

    <div class="rounded-lg border p-4">
        <h3 class="font-semibold mb-4">Members</h3>
        <div class="space-y-2">
            {#each members as member}
                <div class="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                    <div class="flex flex-col">
                        <span class="font-medium">{member.user.name}</span>
                        <span class="text-xs text-muted-foreground">{member.user.email}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <select 
                            class="h-8 rounded-md border border-input bg-background px-2 text-xs"
                            value={member.role}
                            onchange={(e) => handleUpdateRole(member.id, e.currentTarget.value as any)}
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                        </select>
                        <Button variant="destructive" size="sm" onclick={() => handleRemoveMember(member.id)}>Remove</Button>
                    </div>
                </div>
            {/each}
            {#if members.length === 0}
                <p class="text-sm text-muted-foreground">No members found.</p>
            {/if}
        </div>
    </div>

    {#if invitations.length > 0}
        <div class="rounded-lg border p-4">
            <h3 class="font-semibold mb-4">Pending Invitations</h3>
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
        </div>
    {/if}
</div>
