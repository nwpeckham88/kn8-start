<script lang="ts">
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="selection:bg-primary/20 relative min-h-screen w-full overflow-hidden">
	<GeometricBackground />

	<div
		class="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-end pb-32 text-center"
	>
		<div class="animate-in fade-in zoom-in slide-in-from-bottom-10 space-y-8 duration-1000">
			<div class="space-y-4">
				<h1
					class="text-foreground text-6xl font-extrabold tracking-tight drop-shadow-sm sm:text-7xl md:text-8xl lg:text-9xl"
				>
					Candlewood Church
				</h1>
				<h2 class="text-foreground/80 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
					Time Tracker
				</h2>
			</div>

			<div class="pt-4">
				<Button
					size="lg"
					class="bg-primary/90 hover:bg-primary h-14 rounded-full px-10 text-lg font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl"
					href="/auth"
				>
					Sign In
				</Button>
			</div>
		</div>
	</div>
</div>
