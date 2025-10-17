<script lang="ts">
	import CreatorOnboarding from '$lib/components/CreatorOnboarding.svelte';
</script>

<svelte:head>
	<title>Creator Onboarding - Enclave</title>
	<meta
		name="description"
		content="Join Enclave as a creator and start building your privacy-first audience with zero-knowledge credentials."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-700"
		></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<div
				class="inline-block bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200/50 shadow-sm mb-6"
			>
				<span class="text-sm font-semibold text-purple-900">🚀 Creator Onboarding</span>
			</div>
			<h1
				class="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight"
			>
				Join Enclave as a Creator
			</h1>
			<p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
				Create your privacy-first creator profile with blockchain credentials and start building
				your audience with zero-knowledge verification
			</p>
		</div>

		<!-- Creator Onboarding Component -->
		<CreatorOnboarding />
	</div>
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.4;
		}
	}

	.animate-pulse {
		animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.delay-700 {
		animation-delay: 700ms;
	}
</style>
