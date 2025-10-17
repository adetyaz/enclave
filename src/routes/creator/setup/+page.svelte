<script lang="ts">
	// Mock data removed
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Shield, Zap, Users, ArrowRight, Sparkles, Settings, Crown } from '@lucide/svelte';

	onMount(async () => {
		if (false) {
			// TODO: Replace with real auth check
			toast.error('Please log in as a creator to access setup');
			goto('/');
			return;
		}
	});

	function continueToDashboard() {
		goto('/creator/dashboard');
	}
</script>

<svelte:head>
	<title>Creator Setup - Enclave</title>
</svelte:head>

{#if true}
	<div
		class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden"
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

		<div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<!-- Header -->
			<div class="text-center mb-16">
				<div
					class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full mb-6 border border-white/50 shadow-xl"
				>
					<Crown class="h-5 w-5 text-purple-600" />
					<span
						class="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
					>
						Creator Setup
					</span>
				</div>

				<h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-6">
					Welcome to Enclave,
					<br />
					<span
						class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
					>
						Creator!
					</span>
				</h1>
				<p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
					You're ready to start building your privacy-first creator platform. Let's set up your
					profile and subscription tiers.
				</p>
			</div>

			<!-- Setup Steps -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
				{#each [{ icon: Shield, title: 'Privacy Setup', description: 'Configure your privacy settings and zero-knowledge verification requirements for subscribers.', gradient: 'from-purple-100 to-pink-100', iconColor: 'text-purple-600' }, { icon: Zap, title: 'Content Tiers', description: 'Create subscription tiers with different access levels and pricing for your content.', gradient: 'from-pink-100 to-blue-100', iconColor: 'text-pink-600' }, { icon: Users, title: 'Audience Building', description: 'Start building your subscriber base with privacy-preserving fan engagement tools.', gradient: 'from-blue-100 to-purple-100', iconColor: 'text-blue-600' }] as step}
					{@const IconComponent = step.icon}
					<div
						class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2"
					>
						<div
							class="w-16 h-16 bg-gradient-to-br {step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg"
						>
							<IconComponent class="h-8 w-8 {step.iconColor}" />
						</div>
						<h3 class="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
						<p class="text-gray-600 leading-relaxed">
							{step.description}
						</p>
					</div>
				{/each}
			</div>

			<!-- Quick Setup Options -->
			<div
				class="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50 mb-12"
			>
				<div class="flex items-center gap-3 mb-8">
					<div
						class="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center"
					>
						<Settings class="h-6 w-6 text-purple-600" />
					</div>
					<h2 class="text-3xl font-black text-gray-900">Quick Setup Options</h2>
				</div>

				<div class="space-y-6">
					<div
						class="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1"
					>
						<div class="mb-4 md:mb-0">
							<div class="flex items-center gap-2 mb-2">
								<Sparkles class="h-5 w-5 text-purple-600" />
								<h3 class="text-lg font-bold text-gray-900">Use Default Settings</h3>
							</div>
							<p class="text-gray-600 leading-relaxed">
								Start with pre-configured privacy and tier settings
							</p>
						</div>
						<button
							onclick={continueToDashboard}
							class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-xl flex items-center gap-2 justify-center"
						>
							Continue
							<ArrowRight class="h-5 w-5" />
						</button>
					</div>

					<div
						class="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-white/50 border-2 border-gray-200/50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1"
					>
						<div class="mb-4 md:mb-0">
							<div class="flex items-center gap-2 mb-2">
								<Settings class="h-5 w-5 text-gray-600" />
								<h3 class="text-lg font-bold text-gray-900">Custom Configuration</h3>
							</div>
							<p class="text-gray-600 leading-relaxed">
								Manually configure all settings for your specific needs
							</p>
						</div>
						<button
							class="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-bold border-2 border-gray-300 transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-2 justify-center"
						>
							Customize
							<Settings class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>

			<!-- Next Steps -->
			<div class="text-center">
				<button
					onclick={continueToDashboard}
					class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl hover:shadow-purple-500/50 text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all hover:-translate-y-1 shadow-xl mx-auto"
				>
					<Crown class="h-6 w-6" />
					Go to Dashboard
					<ArrowRight class="h-6 w-6" />
				</button>
				<p class="text-gray-600 mt-6 font-medium">
					You can always change these settings later in your dashboard
				</p>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col justify-center items-center min-h-screen gap-6">
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
				Loading Setup...
			</span>
			<Sparkles class="h-5 w-5 text-pink-600 animate-pulse" />
		</div>
	</div>
{/if}
