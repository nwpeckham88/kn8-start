<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import GeometricBackgroundSubtle from '$lib/components/GeometricBackgroundSubtle.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { OrganizationSchema, OtpSchema, TwoFactorPasswordSchema } from '$lib/validation';
	import { APIError } from 'better-auth/api';
	import { Calendar, Clock, History, LogOut, Play, Square } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import * as v from 'valibot';
	import Members from './Members.svelte';

	let { data } = $props();

	let session = $state<typeof data.session | null>(null);
	let user = $state<typeof data.user | null>(null);

	const organizations = authClient.useListOrganizations();
	const activeOrganization = authClient.useActiveOrganization();

	let orgName = $state('');
	let orgSlug = $state('');
	let orgSelection = $state<string | null>(null);
	let orgError = $state<string | null>(null);
	let orgSuccess = $state<string | null>(null);
	let orgLoading = $state(false);
	let autoSetDone = $state(false);
	let activeOrgId = $derived($activeOrganization.data?.id ?? null);
	let securityError = $state<string | null>(null);
	let securitySuccess = $state<string | null>(null);
	let passkeyError = $state<string | null>(null);
	let passkeySuccess = $state<string | null>(null);
	let passkeyLoading = $state(false);
	let passkeyName = $state('');
	let passkeyAttachment = $state<'platform' | 'cross-platform'>('platform');
	let passkeys = $state<{ id: string; name?: string | null; createdAt?: string | Date | null }[]>(
		[]
	);
	let passkeyLoaded = $state(false);
	let twoFactorPassword = $state('');
	let twoFactorDisablePassword = $state('');
	let twoFactorCode = $state('');
	let twoFactorUri = $state<string | null>(null);
	let twoFactorBackupCodes = $state<string[]>([]);
	let twoFactorLoading = $state(false);
	let twoFactorVerifyLoading = $state(false);
	let twoFactorDisableLoading = $state(false);

	// Mock State
	let isClockedIn = $state(false);
	let startTime = $state<Date | null>(null);
	let elapsedTime = $state('00:00:00');
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Mock History Data
	let recentActivity = $state([
		{ id: 1, date: 'Today', in: '09:00 AM', out: 'Pending', duration: '...' },
		{ id: 2, date: 'Yesterday', in: '08:55 AM', out: '05:05 PM', duration: '8h 10m' },
		{ id: 3, date: 'Oct 24', in: '09:10 AM', out: '05:00 PM', duration: '7h 50m' },
		{ id: 4, date: 'Oct 23', in: '09:00 AM', out: '05:00 PM', duration: '8h 00m' }
	]);

	$effect(() => {
		session = data.session;
		user = data.user;
	});

	$effect(() => {
		if (!session || passkeyLoaded) return;
		passkeyLoaded = true;
		void fetchPasskeys();
	});

	$effect(() => {
		if ($activeOrganization.data?.id) {
			orgSelection = $activeOrganization.data.id;
		}
	});

	$effect(() => {
		if (autoSetDone) return;
		if ($activeOrganization.isPending || $organizations.isPending) return;
		const list = $organizations.data ?? [];
		if (!$activeOrganization.data && list.length === 1) {
			autoSetDone = true;
			void handleSetActive(list[0].id);
		}
	});

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});

	function toggleClock() {
		if (isClockedIn) {
			// Clock Out
			isClockedIn = false;
			startTime = null;
			elapsedTime = '00:00:00';
			if (timerInterval) clearInterval(timerInterval);

			// Update mock history
			recentActivity[0].out = new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			});
			recentActivity[0].duration = '4h 30m'; // Mock duration
		} else {
			// Clock In
			isClockedIn = true;
			startTime = new Date();

			// Add new mock entry
			recentActivity = [
				{
					id: Date.now(),
					date: 'Today',
					in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
					out: 'Pending',
					duration: '...'
				},
				...recentActivity
			];

			timerInterval = setInterval(() => {
				if (startTime) {
					const now = new Date();
					const diff = now.getTime() - startTime.getTime();
					const hours = Math.floor(diff / 3600000);
					const minutes = Math.floor((diff % 3600000) / 60000);
					const seconds = Math.floor((diff % 60000) / 1000);
					elapsedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
				}
			}, 1000);
		}
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

	async function handleSetActive(organizationId: string) {
		if (!organizationId || organizationId === orgSelection) return;
		orgError = null;
		orgSuccess = null;
		const { error: apiError } = await authClient.organization.setActive({
			organizationId
		});
		if (apiError) {
			orgError = apiError.message ?? 'An error occurred';
			return;
		}
		orgSuccess = 'Active organization updated';
	}

	async function handleCreateOrganization() {
		orgError = null;
		orgSuccess = null;
		orgLoading = true;

		const input = { name: orgName, slug: orgSlug };
		const result = v.safeParse(OrganizationSchema, input);
		if (!result.success) {
			orgError = result.issues[0].message;
			orgLoading = false;
			return;
		}

		const { data: org, error: apiError } = await authClient.organization.create({
			name: orgName,
			slug: orgSlug
		});

		if (apiError) {
			orgError = apiError.message ?? 'An error occurred';
			orgLoading = false;
			return;
		}

		orgName = '';
		orgSlug = '';
		orgLoading = false;
		orgSuccess = 'Organization created';
		if (org?.id) {
			await handleSetActive(org.id);
		}
	}

	function handleAuthError(err: unknown, target: 'security' | 'passkey') {
		const message =
			err instanceof APIError
				? err.message
				: err instanceof Error
					? err.message
					: 'An error occurred';
		if (target === 'passkey') {
			passkeyError = message;
			return;
		}
		securityError = message;
	}

	async function fetchPasskeys() {
		passkeyError = null;
		const { data, error: apiError } = await authClient.passkey.listUserPasskeys();
		if (apiError) {
			passkeyError = apiError.message ?? 'An error occurred';
			return;
		}
		if (data && Array.isArray(data)) {
			passkeys = data as unknown as typeof passkeys;
			return;
		}
		if (data && typeof data === 'object' && 'passkeys' in data) {
			passkeys = ((data as { passkeys?: unknown }).passkeys ?? []) as typeof passkeys;
		}
	}

	async function handleAddPasskey() {
		passkeyError = null;
		passkeySuccess = null;
		passkeyLoading = true;
		try {
			const { error: apiError } = await authClient.passkey.addPasskey({
				name: passkeyName || undefined,
				authenticatorAttachment: passkeyAttachment
			});
			if (apiError) {
				passkeyError = apiError.message ?? 'An error occurred';
				return;
			}
			passkeySuccess = 'Passkey added.';
			passkeyName = '';
			await fetchPasskeys();
		} catch (e: unknown) {
			handleAuthError(e, 'passkey');
		} finally {
			passkeyLoading = false;
		}
	}

	async function handleDeletePasskey(passkeyId: string) {
		passkeyError = null;
		passkeySuccess = null;
		try {
			const { error: apiError } = await authClient.passkey.deletePasskey({ id: passkeyId });
			if (apiError) {
				passkeyError = apiError.message ?? 'An error occurred';
				return;
			}
			passkeySuccess = 'Passkey removed.';
			await fetchPasskeys();
		} catch (e: unknown) {
			handleAuthError(e, 'passkey');
		}
	}

	async function handleEnableTwoFactor() {
		securityError = null;
		securitySuccess = null;
		const result = v.safeParse(TwoFactorPasswordSchema, { password: twoFactorPassword });
		if (!result.success) {
			securityError = result.issues[0].message;
			return;
		}
		twoFactorLoading = true;
		try {
			const { data: twoFactorData, error: apiError } = await authClient.twoFactor.enable({
				password: twoFactorPassword
			});
			if (apiError) {
				securityError = apiError.message ?? 'An error occurred';
				return;
			}
			twoFactorUri = twoFactorData?.totpURI ?? null;
			twoFactorBackupCodes = (twoFactorData?.backupCodes ?? []) as string[];
			securitySuccess = '2FA enabled. Verify your code to finish setup.';
		} catch (e: unknown) {
			handleAuthError(e, 'security');
		} finally {
			twoFactorLoading = false;
		}
	}

	async function handleVerifyTwoFactor() {
		securityError = null;
		securitySuccess = null;
		const result = v.safeParse(OtpSchema, { code: twoFactorCode });
		if (!result.success) {
			securityError = result.issues[0].message;
			return;
		}
		twoFactorVerifyLoading = true;
		try {
			const { error: apiError } = await authClient.twoFactor.verifyTotp({
				code: twoFactorCode,
				trustDevice: true
			});
			if (apiError) {
				securityError = apiError.message ?? 'An error occurred';
				return;
			}
			securitySuccess = 'Two-factor verification complete.';
			twoFactorCode = '';
		} catch (e: unknown) {
			handleAuthError(e, 'security');
		} finally {
			twoFactorVerifyLoading = false;
		}
	}

	async function handleDisableTwoFactor() {
		securityError = null;
		securitySuccess = null;
		const result = v.safeParse(TwoFactorPasswordSchema, { password: twoFactorDisablePassword });
		if (!result.success) {
			securityError = result.issues[0].message;
			return;
		}
		twoFactorDisableLoading = true;
		try {
			const { error: apiError } = await authClient.twoFactor.disable({
				password: twoFactorDisablePassword
			});
			if (apiError) {
				securityError = apiError.message ?? 'An error occurred';
				return;
			}
			securitySuccess = 'Two-factor authentication disabled.';
			twoFactorPassword = '';
			twoFactorDisablePassword = '';
			twoFactorUri = null;
			twoFactorBackupCodes = [];
		} catch (e: unknown) {
			handleAuthError(e, 'security');
		} finally {
			twoFactorDisableLoading = false;
		}
	}

	function formatPasskeyDate(value?: string | Date | null) {
		if (!value) return '—';
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return '—';
		return date.toLocaleDateString();
	}
</script>

<GeometricBackgroundSubtle />

<div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="text-foreground text-3xl font-bold tracking-tight">Time Tracker</h1>
			<p class="text-muted-foreground">Manage your hours and track your productivity.</p>
		</div>
		<div class="flex items-center gap-3">
			<div class="mr-2 hidden text-right text-sm md:block">
				<p class="font-medium">{user?.name || 'User'}</p>
				<p class="text-muted-foreground text-xs">{user?.email}</p>
			</div>
			<ModeToggle />
			<Button variant="ghost" size="icon" onclick={handleLogout} title="Logout">
				<LogOut class="h-5 w-5" />
			</Button>
		</div>
	</div>

	{#if !session}
		<div class="bg-card text-card-foreground rounded-2xl border p-10 text-center shadow-sm">
			<p class="text-muted-foreground">Please sign in to view this page.</p>
			<Button href="/auth" class="mt-4">Go to Login</Button>
		</div>
	{:else}
		<Card.Root class="mb-8">
			<Card.Header>
				<Card.Title>Organization</Card.Title>
				<Card.Description>Select or create an organization.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6 lg:grid-cols-2">
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="active-org">Active organization</Label>
							<Select.Root
								type="single"
								value={orgSelection ?? ''}
								onValueChange={(value) => handleSetActive(value)}
							>
								<Select.Trigger id="active-org">
									{#if $activeOrganization.isPending}
										Loading organizations...
									{:else if $activeOrganization.data}
										{$activeOrganization.data.name}
									{:else}
										Select an organization
									{/if}
								</Select.Trigger>
								<Select.Content>
									{#each $organizations.data ?? [] as organization (organization.id)}
										<Select.Item value={organization.id}>
											{organization.name}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						{#if orgError}
							<div class="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
								{orgError}
							</div>
						{/if}

						{#if orgSuccess}
							<div class="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
								{orgSuccess}
							</div>
						{/if}
					</div>

					<div class="space-y-4">
						<div class="grid gap-4 sm:grid-cols-2">
							<div class="space-y-2">
								<Label for="org-name">Organization name</Label>
								<Input id="org-name" bind:value={orgName} placeholder="Acme Inc" />
							</div>
							<div class="space-y-2">
								<Label for="org-slug">Slug</Label>
								<Input id="org-slug" bind:value={orgSlug} placeholder="acme" />
							</div>
						</div>
						<Button class="h-11 w-full" onclick={handleCreateOrganization} disabled={orgLoading}>
							{orgLoading ? 'Creating...' : 'Create organization'}
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Main Clock In/Out Section -->
			<div class="space-y-8 lg:col-span-2">
				<Card.Root
					class="bg-card/50 relative overflow-hidden rounded-3xl border-none shadow-xl backdrop-blur-sm"
				>
					<!-- Progress Bar (Mock) -->
					<div class="bg-muted absolute top-0 left-0 h-1 w-full">
						<div
							class="bg-primary h-full transition-all duration-1000"
							style="width: {isClockedIn ? '60%' : '0%'}"
						></div>
					</div>

					<Card.Content
						class="flex flex-col items-center justify-center space-y-8 p-8 text-center sm:p-12"
					>
						<div class="space-y-2">
							<h2 class="text-muted-foreground text-lg font-medium tracking-widest uppercase">
								{isClockedIn ? 'Currently Working' : 'Ready to Work'}
							</h2>
							<div
								class="text-foreground text-6xl font-black tracking-tight tabular-nums sm:text-8xl"
							>
								{elapsedTime}
							</div>
							{#if isClockedIn}
								<p class="text-muted-foreground animate-pulse text-sm">
									Started at {startTime?.toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</p>
							{/if}
						</div>

						<Button
							size="lg"
							class="h-24 w-24 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 {isClockedIn
								? 'bg-destructive hover:bg-destructive/90'
								: 'bg-primary hover:bg-primary/90'}"
							onclick={toggleClock}
						>
							{#if isClockedIn}
								<Square class="h-10 w-10 fill-current" />
							{:else}
								<Play class="ml-1 h-10 w-10 fill-current" />
							{/if}
						</Button>

						<p class="text-muted-foreground max-w-xs text-sm">
							{isClockedIn
								? 'Click to stop the timer and log your hours for the day.'
								: "Click to start the timer. Don't forget to clock out!"}
						</p>
					</Card.Content>
				</Card.Root>

				<!-- Weekly Stats (Mock) -->
				<div class="grid gap-4 sm:grid-cols-2">
					<Card.Root class="bg-card/50 border-none shadow-md backdrop-blur-sm">
						<Card.Content class="flex items-center gap-4 p-6">
							<div class="rounded-full bg-blue-100/10 p-3 text-blue-500">
								<Clock class="h-6 w-6" />
							</div>
							<div>
								<p class="text-muted-foreground text-sm">Hours Today</p>
								<p class="text-2xl font-bold">4h 30m</p>
							</div>
						</Card.Content>
					</Card.Root>
					<Card.Root class="bg-card/50 border-none shadow-md backdrop-blur-sm">
						<Card.Content class="flex items-center gap-4 p-6">
							<div class="rounded-full bg-green-100/10 p-3 text-green-500">
								<Calendar class="h-6 w-6" />
							</div>
							<div>
								<p class="text-muted-foreground text-sm">Hours This Week</p>
								<p class="text-2xl font-bold">32h 15m</p>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>

			<!-- Recent Activity Sidebar -->
			<div class="space-y-6">
				<Card.Root class="bg-card/80 h-full border-none shadow-lg backdrop-blur-md">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<History class="text-muted-foreground h-5 w-5" />
							Recent Activity
						</Card.Title>
					</Card.Header>
					<Card.Content class="p-0">
						<div class="divide-border/50 divide-y">
							{#each recentActivity as entry (entry.id)}
								<div class="hover:bg-muted/30 p-4 transition-colors">
									<div class="mb-1 flex items-center justify-between">
										<span class="font-medium">{entry.date}</span>
										<span
											class="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium"
										>
											{entry.duration}
										</span>
									</div>
									<div class="text-muted-foreground flex items-center justify-between text-sm">
										<div class="flex items-center gap-2">
											<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
											{entry.in}
										</div>
										<span class="text-xs">to</span>
										<div class="flex items-center gap-2">
											<div
												class="h-1.5 w-1.5 rounded-full {entry.out === 'Pending'
													? 'animate-pulse bg-amber-500'
													: 'bg-red-500'}"
											></div>
											{entry.out}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
					<Card.Footer class="border-border/50 border-t p-4">
						<Button variant="outline" class="h-8 w-full text-xs">View Full History</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>

		<div class="mt-10">
			{#if activeOrgId}
				<Members {activeOrgId} />
			{:else}
				<Card.Root>
					<Card.Header>
						<Card.Title>Members</Card.Title>
						<Card.Description>Select or create an organization to manage members.</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-muted-foreground text-sm">No active organization selected.</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>

		<div class="mt-10 grid gap-8 lg:grid-cols-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Two-factor authentication</Card.Title>
					<Card.Description>Secure your account with an authenticator app.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-6">
					<div class="space-y-3">
						<Label for="twofactor-password">Password</Label>
						<Input
							id="twofactor-password"
							type="password"
							autocomplete="current-password"
							bind:value={twoFactorPassword}
						/>
						<Button onclick={handleEnableTwoFactor} disabled={twoFactorLoading}>
							{twoFactorLoading ? 'Enabling...' : 'Enable 2FA'}
						</Button>
					</div>

					{#if twoFactorUri}
						<div class="space-y-3">
							<div class="bg-muted/40 rounded-xl border p-3 text-sm break-words">
								{twoFactorUri}
							</div>
							<div class="space-y-2">
								<Label for="twofactor-code">Verification code</Label>
								<Input
									id="twofactor-code"
									type="text"
									inputmode="numeric"
									autocomplete="one-time-code"
									bind:value={twoFactorCode}
								/>
								<Button onclick={handleVerifyTwoFactor} disabled={twoFactorVerifyLoading}>
									{twoFactorVerifyLoading ? 'Verifying...' : 'Verify code'}
								</Button>
							</div>
							{#if twoFactorBackupCodes.length > 0}
								<div class="space-y-2">
									<p class="text-muted-foreground text-sm">Backup codes</p>
									<div class="grid gap-2 sm:grid-cols-2">
										{#each twoFactorBackupCodes as codeItem (codeItem)}
											<div class="bg-muted/40 rounded-md px-3 py-2 text-sm">
												{codeItem}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<div class="space-y-3">
						<Label for="twofactor-disable-password">Disable with password</Label>
						<Input
							id="twofactor-disable-password"
							type="password"
							autocomplete="current-password"
							bind:value={twoFactorDisablePassword}
						/>
						<Button
							variant="outline"
							onclick={handleDisableTwoFactor}
							disabled={twoFactorDisableLoading}
						>
							{twoFactorDisableLoading ? 'Disabling...' : 'Disable 2FA'}
						</Button>
					</div>

					{#if securityError}
						<div class="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
							{securityError}
						</div>
					{/if}
					{#if securitySuccess}
						<div class="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
							{securitySuccess}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Passkeys</Card.Title>
					<Card.Description>Register and manage passkeys for passwordless login.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-6">
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="passkey-name">Name</Label>
							<Input id="passkey-name" bind:value={passkeyName} placeholder="My laptop" />
						</div>
						<div class="space-y-2">
							<Label for="passkey-attachment">Attachment</Label>
							<Select.Root type="single" bind:value={passkeyAttachment}>
								<Select.Trigger id="passkey-attachment">
									{passkeyAttachment === 'platform' ? 'Platform' : 'Cross-platform'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="platform">Platform</Select.Item>
									<Select.Item value="cross-platform">Cross-platform</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</div>
					<Button onclick={handleAddPasskey} disabled={passkeyLoading}>
						{passkeyLoading ? 'Adding...' : 'Add passkey'}
					</Button>

					{#if passkeyError}
						<div class="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
							{passkeyError}
						</div>
					{/if}
					{#if passkeySuccess}
						<div class="rounded-md bg-green-500/15 p-3 text-sm text-green-600">
							{passkeySuccess}
						</div>
					{/if}

					<div class="space-y-2">
						{#each passkeys as passkey (passkey.id)}
							<div class="bg-secondary/20 flex items-center justify-between rounded-md p-3">
								<div class="flex flex-col">
									<span class="font-medium">{passkey.name || 'Passkey'}</span>
									<span class="text-muted-foreground text-xs">
										Added {formatPasskeyDate(passkey.createdAt)}
									</span>
								</div>
								<Button
									variant="destructive"
									size="sm"
									onclick={() => handleDeletePasskey(passkey.id)}
								>
									Remove
								</Button>
							</div>
						{/each}
						{#if passkeys.length === 0}
							<p class="text-muted-foreground text-sm">No passkeys registered.</p>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
