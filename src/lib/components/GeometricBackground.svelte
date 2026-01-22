<script lang="ts">
</script>

<div class="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-[#FDFCF8] dark:bg-[#0C0C14]">
    <!-- Ethereal Light Gradient (Top Center) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[80vh] w-[100vw] bg-[radial-gradient(ellipse_at_top,rgba(255,220,180,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(100,120,180,0.15),transparent_70%)] pointer-events-none"></div>

    <!-- Animated Elements -->
    
    <!-- Element 1: The Warm Glow (Rising/Floating) -->
    <div class="absolute top-[20%] left-[20%] h-[500px] w-[500px] rounded-full bg-amber-200/20 dark:bg-blue-900/10 blur-[120px] animate-float-slow mix-blend-multiply dark:mix-blend-screen"></div>

    <!-- Element 2: The Peaceful Circle (Opposite side) -->
    <div class="absolute bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-blue-100/30 dark:bg-indigo-900/10 blur-[100px] animate-float-reverse mix-blend-multiply dark:mix-blend-screen"></div>

    <!-- Element 3: The Connection (Abstract Cross/Intersection) -->
    <!-- Vertical Line -->
    <div class="absolute top-0 left-[15%] h-full w-[1px] bg-gradient-to-b from-transparent via-neutral-400/10 to-transparent dark:via-white/5"></div>
    <!-- Horizontal Line -->
    <div class="absolute top-[35%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-400/10 to-transparent dark:via-white/5"></div>

    <!-- Element 4: Floating Particles (Dust/Light) -->
    <div class="absolute top-[40%] left-[60%] h-2 w-2 rounded-full bg-amber-400/20 dark:bg-blue-200/20 blur-[1px] animate-pulse-slow"></div>
    <div class="absolute top-[60%] left-[25%] h-3 w-3 rounded-full bg-blue-400/20 dark:bg-indigo-200/20 blur-[2px] animate-pulse-slow delay-1000"></div>
    <div class="absolute bottom-[30%] right-[30%] h-1.5 w-1.5 rounded-full bg-neutral-400/20 dark:bg-white/10 blur-[1px] animate-pulse-slow delay-2000"></div>

</div>

<style>
    @keyframes float-slow {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(20px, -30px); }
    }

    @keyframes float-reverse {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-20px, 30px); }
    }
    
    @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }

    .animate-float-slow {
        animation: float-slow 20s ease-in-out infinite;
    }

    .animate-float-reverse {
        animation: float-reverse 25s ease-in-out infinite;
    }

    .animate-pulse-slow {
        animation: pulse-slow 8s ease-in-out infinite;
    }
</style>
