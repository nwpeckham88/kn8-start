<script lang="ts">
</script>

<div class="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-[#faf9f6] dark:bg-background">
    <!-- Subtle Gradient for Depth (Light Mode Only) -->
    <div class="absolute inset-0 bg-gradient-to-br from-transparent to-neutral-200/50 dark:hidden"></div>

    <!-- Noise Texture Overlay for analog feel -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Technical Grid (Stronger) -->
    <div class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black_60%,transparent_100%)]"></div>

    <!-- Kinetic Geometric Elements -->
    
    <!-- Element 1: The Orbiting Ring (Dashed, Thicker) -->
    <div class="absolute top-[-15%] left-[-10%] h-[70vh] w-[70vh] animate-spin-slow opacity-[0.1]">
        <div class="absolute inset-0 rounded-full border-[3px] border-dashed border-primary"></div>
    </div>

    <!-- Element 2: The Swiss Semi-Circle (Vertical, Right Side) -->
    <div class="absolute top-[10%] right-[0%] h-[500px] w-[250px] animate-float-slow opacity-[0.08]">
        <div class="h-full w-full bg-foreground rounded-l-full"></div>
    </div>

    <!-- Element 3: The Angled Beam (Architectural) -->
    <div class="absolute bottom-[15%] left-[-10%] h-40 w-[120%] -rotate-6 bg-accent/10 animate-slide"></div>

    <!-- Element 4: Floating Crosshairs (Technical Detail) -->
    <div class="absolute top-[30%] left-[20%] opacity-30 animate-pulse-slow">
        <div class="relative h-8 w-8">
            <div class="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-foreground"></div>
            <div class="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-foreground"></div>
        </div>
    </div>
    <div class="absolute bottom-[30%] right-[25%] opacity-30 animate-pulse-slow delay-1000">
        <div class="relative h-8 w-8">
            <div class="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-foreground"></div>
            <div class="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-foreground"></div>
        </div>
    </div>

    <!-- Element 5: The Rotating Square (Outlined, Off-center) -->
    <div class="absolute bottom-[-5%] left-[15%] h-64 w-64 border-[3px] border-primary/10 animate-reverse-spin opacity-40"></div>

    <!-- Element 6: Primary Circle Accent -->
    <div class="absolute top-[25%] left-[55%] h-12 w-12 rounded-full bg-primary/20 animate-float"></div>

</div>

<style>
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes reverse-spin {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes float-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
    }

    @keyframes slide {
        0%, 100% { transform: translateX(0) rotate(-6deg); }
        50% { transform: translateX(40px) rotate(-6deg); }
    }
    
    @keyframes pulse-slow {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.5; }
    }

    .animate-spin-slow {
        animation: spin-slow 80s linear infinite;
    }

    .animate-reverse-spin {
        animation: reverse-spin 60s linear infinite;
    }

    .animate-float {
        animation: float 15s ease-in-out infinite;
    }
    
    .animate-float-slow {
        animation: float-slow 30s ease-in-out infinite;
    }

    .animate-slide {
        animation: slide 40s ease-in-out infinite;
    }

    .animate-pulse-slow {
        animation: pulse-slow 6s ease-in-out infinite;
    }
</style>
