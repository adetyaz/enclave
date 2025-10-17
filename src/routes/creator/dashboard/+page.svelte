<!-- Creator Dashboard - Following PRD User Journey -->
<script lang="ts">
	// Mock data removed - replace with real implementation
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		Users,
		DollarSign,
		FileVideo,
		TrendingUp,
		Plus,
		Eye,
		Calendar,
		Shield,
		ArrowRight,
		Settings,
		Sparkles,
		BarChart3,
		Wallet,
		Crown
	} from '@lucide/svelte';

	let loading = $state(true);
	let creatorData = $state<any | null>(null);
	let analytics = $state<{
		totalSubscribers: number;
		monthlyRevenue: number;
		contentViews: number;
		newSubscribersThisMonth: number;
		topContent: any[];
	} | null>(null);

	onMount(async () => {
		// TODO: Replace with real authentication and data loading
		toast.info('Dashboard is under development - complete creator onboarding first');
		loading = false;
	});

	function navigateToTiers() {
		goto('/creator/tiers');
	}

	function navigateToContent() {
		goto('/creator/content');
	}

	function navigateToAnalytics() {
		goto('/creator/analytics');
	}

	function navigateToVerify() {
		goto('/creator/verify');
	}
</script>

<svelte:head>
	<title>Creator Dashboard - Enclave</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-700"
		></div>
	</div>

	{#if loading}
		<div class="flex justify-center items-center min-h-screen">
			<div class="text-center space-y-4">
				<div
					class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"
				></div>
				<p class="text-gray-600 font-medium">Loading your dashboard...</p>
			</div>
		</div>
	{:else if creatorData}
		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-10">
				<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
					<div>
						<div class="flex items-center gap-3 mb-2">
							<div
								class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
							>
								<Crown class="h-6 w-6 text-white" />
							</div>
							<div>
								<h1
									class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
								>
									Welcome back, {creatorData.displayName}
								</h1>
							</div>
						</div>
						<p class="text-gray-600 text-lg ml-15">
							Manage your content and track your performance
						</p>
					</div>

					<div class="flex items-center gap-4">
						<div
							class="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-green-200 shadow-sm"
						>
							<div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
								<Wallet class="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p class="text-xs text-gray-600 font-medium">Staked</p>
								<p class="text-sm font-bold text-gray-900">
									{creatorData.stakingInfo.stakedAmount} $MOCA
								</p>
							</div>
						</div>
						<button
							onclick={() => goto('/creator/settings')}
							class="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 px-5 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
						>
							<Settings class="h-5 w-5" />
							<span class="font-medium">Settings</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Stats Cards - Bento Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<!-- Total Subscribers -->
				<div
					class="bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-xl rounded-3xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
				>
					<div class="flex items-start justify-between mb-4">
						<div
							class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20"
						>
							<Users class="h-7 w-7 text-blue-600" />
						</div>
						<div
							class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
						>
							<TrendingUp class="h-3 w-3" />
							+{analytics?.newSubscribersThisMonth || 0}
						</div>
					</div>
					<p class="text-sm font-semibold text-blue-900 mb-1">Total Subscribers</p>
					<p class="text-3xl font-bold text-blue-950">{creatorData.stats.totalSubscribers}</p>
					<p class="text-xs text-blue-700 mt-2">This month growth</p>
				</div>

				<!-- Monthly Revenue -->
				<div
					class="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-xl rounded-3xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
				>
					<div class="flex items-start justify-between mb-4">
						<div
							class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-green-500/20"
						>
							<DollarSign class="h-7 w-7 text-green-600" />
						</div>
						<Sparkles class="h-5 w-5 text-green-600" />
					</div>
					<p class="text-sm font-semibold text-green-900 mb-1">Monthly Revenue</p>
					<p class="text-3xl font-bold text-green-950">
						{analytics?.monthlyRevenue || 0}
						<span class="text-lg text-green-700">$MOCA</span>
					</p>
					<p class="text-xs text-green-700 mt-2">After 5% platform fee</p>
				</div>

				<!-- Content Items -->
				<div
					class="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-xl rounded-3xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
				>
					<div class="flex items-start justify-between mb-4">
						<div
							class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/20"
						>
							<FileVideo class="h-7 w-7 text-purple-600" />
						</div>
						<button
							onclick={navigateToContent}
							class="text-purple-600 hover:text-purple-700 transition-colors"
						>
							<ArrowRight class="h-5 w-5" />
						</button>
					</div>
					<p class="text-sm font-semibold text-purple-900 mb-1">Content Items</p>
					<p class="text-3xl font-bold text-purple-950">{creatorData.stats.contentCount}</p>
					<button
						onclick={navigateToContent}
						class="text-xs text-purple-600 font-medium mt-2 hover:underline"
					>
						View all content →
					</button>
				</div>

				<!-- Total Views -->
				<div
					class="bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-xl rounded-3xl shadow-lg border border-orange-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
				>
					<div class="flex items-start justify-between mb-4">
						<div
							class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-orange-500/20"
						>
							<Eye class="h-7 w-7 text-orange-600" />
						</div>
						<button
							onclick={navigateToAnalytics}
							class="text-orange-600 hover:text-orange-700 transition-colors"
						>
							<BarChart3 class="h-5 w-5" />
						</button>
					</div>
					<p class="text-sm font-semibold text-orange-900 mb-1">Total Views</p>
					<p class="text-3xl font-bold text-orange-950">
						{analytics?.contentViews?.toLocaleString() || '0'}
					</p>
					<button
						onclick={navigateToAnalytics}
						class="text-xs text-orange-600 font-medium mt-2 hover:underline"
					>
						See analytics →
					</button>
				</div>
			</div>

			<!-- Quick Actions - Bento Style -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<!-- Create Tier -->
				<button
					onclick={navigateToTiers}
					class="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
				>
					<div
						class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300"
					>
						<Plus class="h-8 w-8 text-white" />
					</div>
					<h3
						class="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors"
					>
						Create Tier
					</h3>
					<p class="text-sm text-gray-600 mb-4">
						Set up new pricing and access levels for your fans
					</p>
					<div class="flex items-center gap-2 text-purple-600 font-semibold">
						<span>Manage Tiers</span>
						<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</button>

				<!-- Upload Content -->
				<button
					onclick={navigateToContent}
					class="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-green-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
				>
					<div
						class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300"
					>
						<FileVideo class="h-8 w-8 text-white" />
					</div>
					<h3
						class="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors"
					>
						Upload Content
					</h3>
					<p class="text-sm text-gray-600 mb-4">
						Add videos, images, or mint NFTs for your audience
					</p>
					<div class="flex items-center gap-2 text-green-600 font-semibold">
						<span>Create Content</span>
						<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</button>

				<!-- View Analytics -->
				<button
					onclick={navigateToAnalytics}
					class="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
				>
					<div
						class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300"
					>
						<TrendingUp class="h-8 w-8 text-white" />
					</div>
					<h3
						class="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors"
					>
						View Analytics
					</h3>
					<p class="text-sm text-gray-600 mb-4">Track performance, earnings, and engagement</p>
					<div class="flex items-center gap-2 text-blue-600 font-semibold">
						<span>See Analytics</span>
						<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</button>

				<!-- Verify Credentials -->
				<button
					onclick={navigateToVerify}
					class="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-indigo-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
				>
					<div
						class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300"
					>
						<Shield class="h-8 w-8 text-white" />
					</div>
					<h3
						class="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors"
					>
						Verify Credentials
					</h3>
					<p class="text-sm text-gray-600 mb-4">
						Verify fan subscriptions with zero-knowledge proofs
					</p>
					<div class="flex items-center gap-2 text-indigo-600 font-semibold">
						<span>Start Verification</span>
						<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</button>
			</div>

			<!-- Recent Content & Tiers - Bento Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Current Tiers -->
				<div
					class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-100 p-8"
				>
					<div class="flex items-center justify-between mb-8">
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
							>
								<Crown class="h-6 w-6 text-white" />
							</div>
							<h2 class="text-2xl font-bold text-gray-900">Subscription Tiers</h2>
						</div>
						<button
							onclick={navigateToTiers}
							class="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1 group"
						>
							<span>Manage all</span>
							<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					<div class="space-y-4">
						{#each creatorData.tiers as tier}
							<div
								class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
							>
								<div class="flex items-start justify-between mb-3">
									<h3 class="font-bold text-gray-900 text-lg">{tier.name}</h3>
									<div class="text-right">
										<p class="text-2xl font-bold text-purple-600">{tier.price}</p>
										<p class="text-xs text-purple-700 font-medium">$MOCA</p>
									</div>
								</div>
								<p class="text-sm text-gray-700 mb-4 leading-relaxed">{tier.description}</p>
								<div class="flex flex-wrap gap-2">
									{#each tier.requirements as requirement}
										<span
											class="text-xs bg-white/80 text-purple-700 font-medium px-3 py-1.5 rounded-full border border-purple-200"
										>
											{requirement.replace('_', ' ').replace('>', '>')}
										</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Recent Content -->
				<div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 p-8">
					<div class="flex items-center justify-between mb-8">
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
							>
								<FileVideo class="h-6 w-6 text-white" />
							</div>
							<h2 class="text-2xl font-bold text-gray-900">Recent Content</h2>
						</div>
						<button
							onclick={navigateToContent}
							class="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 group"
						>
							<span>View all</span>
							<ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					<div class="space-y-4">
						{#each analytics?.topContent || creatorData.content.slice(0, 3) as content}
							<div
								class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
							>
								<div class="flex items-center gap-4">
									{#if content.thumbnail}
										<img
											src={content.thumbnail}
											alt={content.title}
											class="w-20 h-16 object-cover rounded-xl border-2 border-white shadow-md"
										/>
									{:else}
										<div
											class="w-20 h-16 bg-white rounded-xl flex items-center justify-center border-2 border-blue-200 shadow-sm"
										>
											<FileVideo class="h-6 w-6 text-blue-400" />
										</div>
									{/if}

									<div class="flex-1 min-w-0">
										<h4 class="font-bold text-gray-900 truncate mb-1">{content.title}</h4>
										<p class="text-xs text-gray-600 truncate mb-2">{content.description}</p>
										<div class="flex items-center gap-3">
											<span class="text-xs text-gray-500 flex items-center gap-1">
												<Calendar class="h-3 w-3" />
												{new Date(content.createdAt).toLocaleDateString()}
											</span>
											<span
												class="text-xs bg-white/80 text-purple-700 font-semibold px-3 py-1 rounded-full border border-purple-200"
											>
												{creatorData.tiers.find((t: any) => t.id === content.tier)?.name ||
													'Unknown Tier'}
											</span>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex items-center justify-center min-h-screen">
			<div class="max-w-lg mx-auto text-center">
				<div
					class="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6"
				>
					<Shield class="h-12 w-12 text-gray-500" />
				</div>
				<h2 class="text-3xl font-bold text-gray-900 mb-4">Creator Profile Not Found</h2>
				<p class="text-gray-600 mb-8 text-lg">
					We couldn't find your creator profile. Please complete onboarding first or contact support
					if this continues.
				</p>
				<div class="flex gap-4 justify-center">
					<button
						onclick={() => goto('/creator/onboarding')}
						class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all"
					>
						Complete Onboarding
					</button>
					<button
						onclick={() => goto('/')}
						class="bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all"
					>
						Go Home
					</button>
				</div>
			</div>
		</div>
	{/if}
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
