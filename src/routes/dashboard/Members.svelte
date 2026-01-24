<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { InviteMemberSchema } from '$lib/validation';
	import * as v from 'valibot';

	interface Member {
		id: string;
		userId: string;
		role: string;
		user: {
			name: string;
			email: string;
			image?: string | null;
		};
	}

	interface Invitation {
		id: string;
		email: string;
		role: string;
		status: string;
		expiresAt: Date;
	}

	let { activeOrgId }: { activeOrgId: string } = $props();

	let members = $state<Member[]>([]);
	let invitations = $state<Invitation[]>([]);
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
		if (data) {
			if (Array.isArray(data)) {
				members = data as unknown as Member[];
			} else if ('members' in data) {
				members = (data.members ?? []) as unknown as Member[];
			}
		}
	}

	async function fetchInvitations() {
		const { data } = await authClient.organization.listInvitations({
			query: {
				organizationId: activeOrgId
			}
		});
		if (data) {
			invitations = (data as unknown as Invitation[]) ?? [];
		}
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

		const { error: apiError } = await authClient.organization.inviteMember({
			email: inviteEmail,
			role: inviteRole as 'admin' | 'member' | 'owner',
			organizationId: activeOrgId
		});

		if (apiError) {
			error = apiError.message ?? 'An error occurred';
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

	async function handleUpdateRole(memberId: string, role: string) {
		const { error: apiError } = await authClient.organization.updateMemberRole({
			memberId,
			role: role as 'admin' | 'member' | 'owner',
			organizationId: activeOrgId
		});

		if (apiError) {
			error = apiError.message || 'An error occurred';
			return;
		}

		fetchMembers();
	}

	async function handleRevokeInvitation(invitationId: string) {
		if (!confirm('Are you sure you want to revoke this invitation?')) return;

		const { error: apiError } = await authClient.organization.cancelInvitation({
			invitationId
		});

		if (apiError) {
			error = apiError.message || 'An error occurred';
			return;
		}

		fetchInvitations();
	}
</script>

<div class="space-y-6">
	{#if error}
		<div class="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
			{success}
		</div>
	{/if}

	<Card.Root>
		<Card.Header>
			<Card.Title>Invite Member</Card.Title>
			<Card.Description>Invite a new member to your organization.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col gap-4 sm:flex-row">
				<div class="flex-1">
					<Input type="email" placeholder="Email address" bind:value={inviteEmail} />
				</div>
				<div class="w-full sm:w-[140px]">
					<Select.Root type="single" bind:value={inviteRole}>
						<Select.Trigger>{inviteRole}</Select.Trigger>
						<Select.Content>
							<Select.Item value="member">Member</Select.Item>
							<Select.Item value="admin">Admin</Select.Item>
							<Select.Item value="owner">Owner</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
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
				{#each members as member (member.id)}
					<div class="bg-secondary/20 flex items-center justify-between rounded-md p-2">
						<div class="flex flex-col">
							<span class="font-medium">{member.user.name}</span>
							<span class="text-muted-foreground text-xs">{member.user.email}</span>
						</div>
						<div class="flex items-center gap-2">
							<Select.Root
								type="single"
								value={member.role}
								onValueChange={(v) => handleUpdateRole(member.id, v)}
							>
								<Select.Trigger class="h-8 w-[100px]">
									{member.role}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="member">Member</Select.Item>
									<Select.Item value="admin">Admin</Select.Item>
									<Select.Item value="owner">Owner</Select.Item>
								</Select.Content>
							</Select.Root>
							<Button variant="destructive" size="sm" onclick={() => handleRemoveMember(member.id)}
								>Remove</Button
							>
						</div>
					</div>
				{/each}
				{#if members.length === 0}
					<p class="text-muted-foreground text-sm">No members found.</p>
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
					{#each invitations as invite (invite.id)}
						<div class="bg-secondary/20 flex items-center justify-between rounded-md p-2">
							<div class="flex flex-col">
								<span class="font-medium">{invite.email}</span>
								<span class="text-muted-foreground text-xs">Role: {invite.role}</span>
							</div>
							<Button
								variant="destructive"
								size="sm"
								onclick={() => handleRevokeInvitation(invite.id)}>Revoke</Button
							>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
