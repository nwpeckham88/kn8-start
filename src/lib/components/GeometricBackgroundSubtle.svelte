<script lang="ts">
</script>

<div class="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-[#FDFCF8] dark:bg-[#080810]">
    <!-- Ethereal Light Gradient (Subtle) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[50vh] w-[100vw] bg-[radial-gradient(circle_at_top,rgba(255,215,100,0.1),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(100,150,255,0.08),transparent_60%)] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

    <!-- Static Background Elements (Minimal) -->
    
    <!-- Element 1: Grounded Warmth (Bottom Right) -->
    <div class="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-amber-100/30 dark:bg-blue-900/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>

    <!-- Element 2: Soft Foundation (Bottom Left) -->
    <div class="absolute bottom-[-20%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-50/30 dark:bg-indigo-900/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-30"></div>

    <!-- Element 3: The Cross (Subtle, Upright - Bottom Right) -->
    <div class="absolute bottom-[5%] right-[5%] h-[300px] w-[200px] group">
        <!-- Vertical Beam -->
        <div class="absolute bottom-0 right-[33%] h-full w-[1px] bg-gradient-to-t from-transparent via-amber-900/10 to-transparent dark:via-white/10 opacity-30 transition-all duration-700 group-hover:opacity-80 group-hover:via-amber-500/50 group-hover:dark:via-blue-300/50 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
        <!-- Horizontal Beam -->
        <div class="absolute bottom-[33%] right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-amber-900/10 to-transparent dark:via-white/10 opacity-30 transition-all duration-700 group-hover:opacity-80 group-hover:via-amber-500/50 group-hover:dark:via-blue-300/50 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
    </div>

    <!-- Noise Texture Overlay (Reduced) -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

</div>

<style>
    /* Minimal static background for dashboard */
</style>
