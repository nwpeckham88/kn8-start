<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { onMount } from 'svelte';

	let isDark = $state(false);

	function toggleTheme() {
		isDark = !isDark;
		if (browser) {
			const root = document.documentElement;
			if (isDark) {
				root.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				root.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
		}
	}

	onMount(() => {
		if (browser) {
			const theme = localStorage.getItem('theme');
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			
			if (theme === 'dark' || (!theme && prefersDark)) {
				isDark = true;
				document.documentElement.classList.add('dark');
			} else {
				isDark = false;
				document.documentElement.classList.remove('dark');
			}
		}
	});
</script>

<Button variant="ghost" size="icon" onclick={toggleTheme} class="rounded-full transition-transform hover:scale-110 active:scale-95">
	{#if isDark}
		<Sun class="size-5 transition-all hover:text-yellow-400" />
		<span class="sr-only">Switch to light mode</span>
	{:else}
		<Moon class="size-5 transition-all hover:text-indigo-400" />
		<span class="sr-only">Switch to dark mode</span>
	{/if}
</Button>
