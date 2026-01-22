<script lang="ts">
</script>

<div class="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-[#FDFCF8] dark:bg-[#080810]">
    <!-- Divine Light (Top Center Ray) - Stronger -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[100vh] w-[120vw] bg-[radial-gradient(circle_at_top,rgba(255,215,100,0.25),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(100,150,255,0.2),transparent_60%)] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

    <!-- The Trinity of Light (Bolder Orbs) -->
    
    <!-- 1. The Source (Top Center - White/Gold) -->
    <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-amber-100/40 dark:bg-indigo-500/20 blur-[100px] animate-pulse-slow"></div>

    <!-- 2. Grace (Bottom Left - Warm) -->
    <div class="absolute bottom-[-10%] left-[-5%] h-[700px] w-[700px] rounded-full bg-orange-100/40 dark:bg-blue-900/20 blur-[120px] animate-float-slow mix-blend-multiply dark:mix-blend-screen"></div>

    <!-- 3. Truth (Bottom Right - Cool/Deep) -->
    <div class="absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-100/40 dark:bg-indigo-900/20 blur-[120px] animate-float-reverse mix-blend-multiply dark:mix-blend-screen"></div>

    <!-- The Cross (Symbol of Purpose - Central & Distinct) -->
    <!-- Vertical Beam (Stronger) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-transparent via-amber-900/40 to-transparent dark:via-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
    <!-- Horizontal Beam -->
    <div class="absolute top-[35%] left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-amber-900/40 to-transparent dark:via-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>

    <!-- Ascending Particles (Spirit) -->
    <div class="absolute top-[60%] left-[45%] h-1.5 w-1.5 rounded-full bg-amber-500/40 dark:bg-blue-300/40 blur-[1px] animate-rise delay-0"></div>
    <div class="absolute top-[70%] left-[52%] h-2 w-2 rounded-full bg-amber-400/30 dark:bg-blue-200/30 blur-[2px] animate-rise delay-1000"></div>
    <div class="absolute top-[80%] left-[48%] h-1 w-1 rounded-full bg-blue-400/30 dark:bg-indigo-300/30 blur-[1px] animate-rise delay-2000"></div>
    <div class="absolute top-[50%] left-[55%] h-1.5 w-1.5 rounded-full bg-orange-400/30 dark:bg-indigo-200/30 blur-[1px] animate-rise delay-3000"></div>

    <!-- Noise Texture Overlay (Reduced) -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

</div>

<style>
    @keyframes float-slow {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(30px, -40px); }
    }

    @keyframes float-reverse {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-30px, 40px); }
    }
    
    @keyframes pulse-slow {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.1); }
    }

    @keyframes rise {
        0% { transform: translateY(0); opacity: 0; }
        20% { opacity: 0.5; }
        80% { opacity: 0.5; }
        100% { transform: translateY(-100px); opacity: 0; }
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

    .animate-rise {
        animation: rise 10s ease-in-out infinite;
    }
</style>
