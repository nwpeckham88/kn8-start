<script lang="ts">
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="relative min-h-screen w-full overflow-hidden selection:bg-primary/20">
	<GeometricBackground />

	<div class="absolute right-4 top-4 z-50 md:right-8 md:top-8">
		<ModeToggle />
	</div>

	<div class="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-end pb-32 text-center">
		<div class="space-y-8 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
			<div class="space-y-2">
				<h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl drop-shadow-sm">
					Candlewood Church
				</h1>
				<p class="mx-auto max-w-[700px] text-lg font-light tracking-wide text-muted-foreground md:text-xl">
					WELCOME TO OUR COMMUNITY
				</p>
			</div>
			
			<div class="pt-4">
				<Button size="lg" class="h-14 rounded-full px-10 text-lg font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl bg-primary/90 hover:bg-primary" href="/auth">
					Sign In
				</Button>
			</div>
		</div>
	</div>
</div>
