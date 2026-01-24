<script>
	import { page } from '$app/stores';
</script>

<div class="flex h-screen w-full flex-col items-center justify-center space-y-4">
	<h1 class="text-4xl font-bold">{$page.status}</h1>
	<p class="text-muted-foreground text-lg">{$page.error?.message || 'Something went wrong'}</p>
	<a href="/" class="hover:text-primary underline">Go back home</a>
</div>
