<script lang="ts">
</script>

<div class="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-background">
    <!-- Base Grid - Removed mask to cover full screen, added subtle fade at bottom -->
    <div class="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"></div>

    <!-- Gradient Blobs for color - adjusted positioning to be more centered/spread -->
    <div class="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[80px] animate-blob"></div>
    <div class="absolute -right-[10%] -bottom-[10%] h-[500px] w-[500px] rounded-full bg-secondary/20 opacity-40 blur-[80px] animate-blob animation-delay-2000"></div>
    <div class="absolute left-[20%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-accent/20 opacity-40 blur-[80px] animate-blob animation-delay-4000"></div>

    <!-- Geometric Shapes -->
    <!-- Rotating Square -->
    <div class="absolute top-[15%] left-[5%] h-24 w-24 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-[2px] animate-float-rotate opacity-70"></div>
    
    <!-- Floating Circle -->
    <div class="absolute top-[25%] right-[10%] h-32 w-32 rounded-full border border-secondary/20 bg-gradient-to-tr from-secondary/10 to-transparent backdrop-blur-[2px] animate-float-reverse opacity-70"></div>
    
    <!-- Hexagon-ish (Rotated Square) -->
    <div class="absolute bottom-[15%] left-[10%] h-40 w-40 rotate-45 rounded-3xl border border-muted-foreground/20 bg-gradient-to-bl from-muted/10 to-transparent backdrop-blur-[2px] animate-float opacity-60"></div>
    
    <!-- Small decoration dots -->
    <div class="absolute top-[40%] left-[20%] h-2 w-2 rounded-full bg-primary/40 animate-pulse"></div>
    <div class="absolute top-[60%] right-[25%] h-3 w-3 rounded-full bg-secondary/40 animate-pulse delay-700"></div>
    <div class="absolute bottom-[30%] left-[40%] h-2 w-2 rounded-full bg-accent/40 animate-pulse delay-1000"></div>

</div>

<style>
    @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
    }
    
    @keyframes float-rotate {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(10deg); }
        100% { transform: translateY(0) rotate(0deg); }
    }
    
    @keyframes float-reverse {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(20px) rotate(-10deg); }
        100% { transform: translateY(0) rotate(0deg); }
    }
    
    @keyframes float {
        0% { transform: translateY(0) rotate(45deg); }
        50% { transform: translateY(-30px) rotate(50deg); }
        100% { transform: translateY(0) rotate(45deg); }
    }
    
    .animate-blob {
        animation: blob 20s infinite;
    }
    
    .animate-float-rotate {
        animation: float-rotate 15s ease-in-out infinite;
    }
    
    .animate-float-reverse {
        animation: float-reverse 18s ease-in-out infinite;
    }
    
    .animate-float {
        animation: float 20s ease-in-out infinite;
    }
    
    .animation-delay-2000 {
        animation-delay: 2s;
    }
    
    .animation-delay-4000 {
        animation-delay: 4s;
    }
</style>
