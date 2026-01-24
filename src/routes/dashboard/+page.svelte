<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import GeometricBackgroundSubtle from '$lib/components/GeometricBackgroundSubtle.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Calendar, Clock, History, LogOut, Play, Square } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	let { data } = $props();

	let session = $state<typeof data.session | null>(null);
	let user = $state<typeof data.user | null>(null);

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
	{/if}
</div>
