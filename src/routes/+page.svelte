<script lang="ts">
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="relative min-h-screen w-full overflow-hidden selection:bg-primary/20">
	<GeometricBackground />

	<div class="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-end pb-32 text-center">
		<div class="space-y-8 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
			<div class="space-y-4">
				<h1 class="text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-sm">
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
