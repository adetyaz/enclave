<script lang="ts">
	import CredentialTest from '$lib/components/CredentialTest.svelte';
	import { Shield, AlertCircle, ArrowRight } from '@lucide/svelte';
	// Mock data removed
</script>

<svelte:head>
	<title>Credential Testing - Enclave</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 relative overflow-hidden"
>
	<!-- Animated background blobs -->
	<div
		class="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
	></div>
	<div
		class="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
	></div>
	<div
		class="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
	></div>

	<div class="relative container mx-auto px-4">
		{#if true}
			<!-- TODO: Replace with real auth check -->
			<div class="max-w-5xl mx-auto mb-12">
				<div class="text-center">
					<div
						class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full mb-6 border border-white/50 shadow-xl"
					>
						<Shield class="h-5 w-5 text-purple-600" />
						<span
							class="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
						>
							Development Tool
						</span>
					</div>

					<h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">Credential Testing</h1>
					<p class="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
						Test and validate zero-knowledge credential functionality in a development environment.
					</p>
				</div>
			</div>

			<CredentialTest />
		{:else}
			<div class="max-w-lg mx-auto text-center py-20">
				<div class="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/50">
					<div
						class="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
					>
						<AlertCircle class="h-10 w-10 text-orange-600" />
					</div>

					<h2 class="text-3xl font-black text-gray-900 mb-4">Authentication Required</h2>
					<p class="text-gray-600 mb-8 leading-relaxed font-medium">
						Please connect your wallet to test credential functionality.
					</p>
					<a
						href="/"
						class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 font-bold transition-all hover:-translate-y-1 shadow-xl"
					>
						<Shield class="h-5 w-5" />
						Go to Home Page
						<ArrowRight class="h-5 w-5" />
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
