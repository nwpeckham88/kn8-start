<script lang="ts">
</script>

<div
	class="pointer-events-auto fixed inset-0 -z-50 h-full w-full overflow-hidden bg-[#FDFCF8] dark:bg-[#080810]"
>
	<!-- Ethereal Light Gradient (Subtle) -->
	<div
		class="pointer-events-none absolute top-0 left-1/2 h-[50vh] w-[100vw] -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(255,215,100,0.1),transparent_60%)] mix-blend-multiply dark:bg-[radial-gradient(circle_at_top,rgba(100,150,255,0.08),transparent_60%)] dark:mix-blend-screen"
	></div>

	<!-- Static Background Elements (Minimal) -->

	<!-- Element 1: Grounded Warmth (Bottom Right) -->
	<div
		class="absolute right-[-5%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-amber-100/30 opacity-50 mix-blend-multiply blur-[120px] dark:bg-blue-900/10 dark:mix-blend-screen"
	></div>

	<!-- Element 2: Soft Foundation (Bottom Left) -->
	<div
		class="absolute bottom-[-20%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-50/30 opacity-30 mix-blend-multiply blur-[120px] dark:bg-indigo-900/5 dark:mix-blend-screen"
	></div>

	<!-- Element 3: The Cross (Subtle, Upright - Bottom Right) -->
	<div class="pointer-events-none absolute right-[5%] bottom-0 z-0 h-[300px] w-[200px]">
		<!-- Cross Structure with Gentle Pulse -->
		<div class="animate-pulse-slow relative h-full w-full opacity-40">
			<!-- Vertical Beam -->
			<div
				class="absolute bottom-0 left-1/2 h-full w-[1px] -translate-x-1/2 bg-gradient-to-t from-transparent via-amber-900/30 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:via-white/30"
			></div>

			<!-- Horizontal Beam -->
			<div
				class="absolute bottom-[66%] left-1/2 h-[1px] w-[66%] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-900/30 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:via-white/30"
			></div>
		</div>
	</div>

	<!-- Noise Texture Overlay (Reduced) -->
	<div
		class="pointer-events-none absolute inset-0 z-[1] opacity-[0.02]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"
	></div>
</div>

<style>
	/* Minimal static background for dashboard */
	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.02);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 8s ease-in-out infinite;
	}
</style>
