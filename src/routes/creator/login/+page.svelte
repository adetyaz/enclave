<script lang="ts">
	import { goto } from '$app/navigation';
	import { mocaAuth } from '$lib/services/useAirKit';
	import { toast } from '$lib/stores/toastStore';
	import { Shield, Sparkles, Lock, ArrowRight, Loader2 } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let isLoading = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		// Check if already logged in
		checkAuth();
	});

	async function checkAuth() {
		try {
			const isAuth = await mocaAuth.isAuthenticated();
			if (isAuth) {
				goto('/creator/dashboard');
			}
		} catch (error) {
			console.error('Auth check failed:', error);
		}
	}

	async function handleLogin() {
		isLoading = true;
		try {
			await mocaAuth.login();
			toast.success('Welcome back!', 'Successfully logged in with Moca');
			goto('/creator/dashboard');
		} catch (error) {
			console.error('Login failed:', error);
			toast.error('Login failed', 'Please try again');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute top-20 left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute bottom-20 right-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-700"
		></div>
		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"
		></div>
	</div>

	<!-- Main content -->
	<div class="relative z-10 flex items-center justify-center min-h-screen p-4">
		<div class="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
			<!-- Left side - Branding -->
			<div class="space-y-8 text-center lg:text-left">
				<div
					class="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 shadow-sm"
				>
					<Shield class="h-5 w-5 text-purple-600" />
					<span class="text-sm font-medium text-purple-900">Powered by Moca Network</span>
				</div>

				<div class="space-y-4">
					<h1
						class="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight"
					>
						Join Enclave
					</h1>
					<p class="text-xl text-gray-700 max-w-lg">
						Share exclusive content securely with privacy-preserving technology and blockchain
						ownership
					</p>
				</div>

				<!-- Feature cards in bento style -->
				<div class="grid grid-cols-2 gap-4 max-w-lg">
					<div
						class="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow"
					>
						<div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
							<Lock class="h-6 w-6 text-purple-600" />
						</div>
						<h3 class="font-semibold text-gray-900 mb-1">Privacy First</h3>
						<p class="text-sm text-gray-600">Zero-knowledge proof verification</p>
					</div>

					<div
						class="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow"
					>
						<div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
							<Sparkles class="h-6 w-6 text-pink-600" />
						</div>
						<h3 class="font-semibold text-gray-900 mb-1">NFT Content</h3>
						<p class="text-sm text-gray-600">Mint and own your creations</p>
					</div>
				</div>
			</div>

			<!-- Right side - Login card -->
			<div class="w-full max-w-md mx-auto">
				<div
					class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10 space-y-8"
				>
					<!-- Icon -->
					<div
						class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30"
					>
						<Shield class="h-10 w-10 text-white" />
					</div>

					<!-- Title -->
					<div class="text-center space-y-2">
						<h2 class="text-3xl font-bold text-gray-900">Creator Login</h2>
						<p class="text-gray-600">
							Connect your wallet to start creating and sharing exclusive content
						</p>
					</div>

					<!-- Login button -->
					<button
						onclick={handleLogin}
						disabled={isLoading}
						class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
					>
						{#if isLoading}
							<Loader2 class="h-5 w-5 animate-spin" />
							<span>Connecting...</span>
						{:else}
							<Shield class="h-5 w-5" />
							<span>Log in with Moca</span>
							<ArrowRight
								class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
							/>
						{/if}
					</button>

					<!-- Info text -->
					<div class="text-center space-y-3">
						<p class="text-xs text-gray-500">
							By continuing, you agree to Enclave's Terms of Service and Privacy Policy
						</p>
						<div class="pt-4 border-t border-gray-200">
							<p class="text-sm text-gray-600">
								New to Enclave?
								<a
									href="/creator/onboarding"
									class="text-purple-600 hover:text-purple-700 font-medium"
								>
									Get started →
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.delay-700 {
		animation-delay: 700ms;
	}

	.delay-1000 {
		animation-delay: 1000ms;
	}
</style>
