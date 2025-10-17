<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Toast from '$lib/components/Toast.svelte';
	import Header from '$lib/components/Header.svelte';
	import AuthInitializer from '$lib/components/AuthInitializer.svelte';
	import { Shield, Sparkles } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let mounted = $state(false);

	const isHomePage = $derived($page.url.pathname === '/');

	onMount(() => {
		mounted = true;
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Initialize Moca AIR Kit and restore wallet connections -->
	<AuthInitializer />

	<Header />

	<main class="w-full">
		{#if mounted}
			{@render children?.()}
		{:else}
			<div class="flex flex-col justify-center items-center h-screen gap-6">
				<!-- Modern loading spinner with gradient -->
				<div class="relative">
					<div
						class="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse"
					>
						<Shield class="h-10 w-10 text-white" />
					</div>
					<div
						class="absolute inset-0 w-20 h-20 border-4 border-purple-600/30 border-t-purple-600 rounded-2xl animate-spin"
					></div>
				</div>

				<!-- Loading text with gradient -->
				<div class="flex items-center gap-2">
					<Sparkles class="h-5 w-5 text-purple-600 animate-pulse" />
					<span
						class="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
					>
						Loading Enclave...
					</span>
					<Sparkles class="h-5 w-5 text-pink-600 animate-pulse" />
				</div>
			</div>
		{/if}
	</main>
</div>

<Toast />

<style>
	:global(body) {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
