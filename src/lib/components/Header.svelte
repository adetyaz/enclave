<script lang="ts">
	import { Shield, User, LogOut, Sparkles, Crown } from '@lucide/svelte';
	import { mocaAuth } from '$lib/services/useAirKit';
	import { onMount } from 'svelte';

	let isLoading = $state(false);
	let isLoggedIn = $state(false);
	let userAddress = $state<string | null>(null);

	onMount(() => {
		// Check if already logged in
		isLoggedIn = mocaAuth.isLoggedIn;
		userAddress = mocaAuth.userAddress;
	});

	async function handleMocaLogin() {
		if (isLoggedIn) {
			// Logout
			mocaAuth.logout();
			isLoggedIn = false;
			userAddress = null;
			return;
		}

		try {
			isLoading = true;
			const user = await mocaAuth.login();
			isLoggedIn = true;
			userAddress = user.walletAddress;
			console.log('✅ Moca login successful:', user);
		} catch (error) {
			console.error('❌ Moca login failed:', error);
			alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			isLoading = false;
		}
	}

	function formatAddress(address: string): string {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}
</script>

<header
	class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-lg"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-20">
			<!-- Logo with gradient -->
			<a href="/" class="flex items-center gap-3 group">
				<div
					class="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/40 transition-all group-hover:scale-105"
				>
					<Shield class="h-7 w-7 text-white" />
				</div>
				<span
					class="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
				>
					Enclave
				</span>
			</a>

			<!-- Navigation -->
			<nav class="flex items-center gap-4">
				<a
					href="/"
					class="px-4 py-2 text-gray-700 hover:text-purple-600 font-semibold transition-colors rounded-xl hover:bg-purple-50"
				>
					Home
				</a>

				<!-- Login/Logout Button -->
				<button
					onclick={handleMocaLogin}
					class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
					disabled={isLoading}
				>
					{#if isLoading}
						<div
							class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
						></div>
						<span>Connecting...</span>
					{:else if isLoggedIn}
						<User class="h-5 w-5" />
						<span>{userAddress ? formatAddress(userAddress) : 'Connected'}</span>
						<LogOut class="h-4 w-4 opacity-70" />
					{:else}
						<Sparkles class="h-5 w-5" />
						<span>Login with Moca</span>
					{/if}
				</button>

				<a
					href="/creator/onboarding"
					class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-0.5"
				>
					<Crown class="h-5 w-5" />
					<span>Become a Creator</span>
				</a>
			</nav>
		</div>
	</div>
</header>
