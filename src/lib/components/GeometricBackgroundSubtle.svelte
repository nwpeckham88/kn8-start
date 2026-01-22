<script lang="ts">
</script>

<div class="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-[#faf9f6] dark:bg-background">
    <!-- Subtle Gradient for Depth (Light Mode Only) -->
    <div class="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-200/50 dark:hidden"></div>

    <!-- Noise Texture Overlay for analog feel -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Technical Grid (Subtle) -->
    <div class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black_30%,transparent_100%)] opacity-50"></div>

    <!-- Kinetic Geometric Elements (Minimal) -->
    
    <!-- Element 1: Top Right Semi-Circle (Static Anchor) -->
    <div class="absolute top-[0%] right-[0%] h-[300px] w-[150px] opacity-[0.03]">
        <div class="h-full w-full bg-foreground rounded-l-full"></div>
    </div>

    <!-- Element 2: Bottom Left Crosshair -->
    <div class="absolute bottom-[5%] left-[2%] opacity-15">
        <div class="relative h-6 w-6">
            <div class="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-foreground"></div>
            <div class="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-foreground"></div>
        </div>
    </div>

</div>

<style>
    /* Static background for minimal distraction in dashboard */
</style>
