<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		TrendingUp,
		Users,
		DollarSign,
		Eye,
		Calendar,
		Download,
		Filter,
		BarChart3,
		PieChart,
		Activity,
		ArrowUp,
		ArrowDown,
		Sparkles
	} from '@lucide/svelte';

	let loading = $state(true);
	let timeRange = $state('30d');
	let activeTab = $state('overview');

	// Analytics data (will be loaded from API)
	let analytics = $state<{
		overview: {
			totalRevenue: number;
			totalSubscribers: number;
			totalViews: number;
			avgEngagement: number;
			revenueGrowth: number;
			subscribersGrowth: number;
			viewsGrowth: number;
			engagementGrowth: number;
		};
		topContent: any[];
		tierPerformance: any[];
	}>({
		overview: {
			totalRevenue: 0,
			totalSubscribers: 0,
			totalViews: 0,
			avgEngagement: 0,
			revenueGrowth: 0,
			subscribersGrowth: 0,
			viewsGrowth: 0,
			engagementGrowth: 0
		},
		topContent: [],
		tierPerformance: []
	});

	const timeRanges = [
		{ value: '7d', label: '7 Days' },
		{ value: '30d', label: '30 Days' },
		{ value: '90d', label: '90 Days' },
		{ value: '1y', label: '1 Year' }
	];

	const tabs = [
		{ id: 'overview', label: 'Overview', icon: BarChart3 },
		{ id: 'revenue', label: 'Revenue', icon: DollarSign },
		{ id: 'audience', label: 'Audience', icon: Users },
		{ id: 'content', label: 'Content', icon: Activity }
	];

	onMount(async () => {
		// TODO: Load analytics from backend API
		loading = false;
	});

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatNumber(num: number) {
		if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
		return num.toString();
	}

	function getGrowthPercentage(current: number, previous: number) {
		return (((current - previous) / previous) * 100).toFixed(1);
	}
</script>

<svelte:head>
	<title>Analytics - Creator Dashboard</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden"
>
	<!-- Animated Background Blobs -->
	<div
		class="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
	></div>
	<div
		class="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
	></div>
	<div
		class="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
	></div>

	{#if loading}
		<div class="flex justify-center items-center min-h-screen">
			<div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
		</div>
	{:else}
		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<!-- Header -->
			<div class="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
				<div>
					<div class="flex items-center gap-4 mb-3">
						<div
							class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
						>
							<BarChart3 class="h-7 w-7 text-white" />
						</div>
						<h1 class="text-4xl font-black text-gray-900 tracking-tight">Analytics</h1>
					</div>
					<p class="text-gray-600 text-lg ml-[72px]">Track your performance and growth metrics</p>
				</div>

				<div class="flex items-center gap-3 mt-6 sm:mt-0">
					<!-- Time Range Selector -->
					<select
						bind:value={timeRange}
						class="px-5 py-3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg font-semibold text-gray-700 cursor-pointer transition-all hover:shadow-xl"
					>
						{#each timeRanges as range}
							<option value={range.value}>{range.label}</option>
						{/each}
					</select>

					<button
						class="flex items-center gap-2 bg-white/80 backdrop-blur-xl hover:bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all border border-white/50"
					>
						<Download class="h-5 w-5" />
						<span>Export</span>
					</button>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div
				class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 mb-10"
			>
				<nav class="flex space-x-2">
					{#each tabs as tab}
						{@const TabIcon = tab.icon}
						<button
							onclick={() => (activeTab = tab.id)}
							class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all {activeTab ===
							tab.id
								? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
								: 'text-gray-600 hover:bg-gray-100'}"
						>
							<TabIcon class="h-5 w-5" />
							<span>{tab.label}</span>
						</button>
					{/each}
				</nav>
			</div>

			{#if activeTab === 'overview'}
				<!-- Overview Tab -->
				<div class="space-y-8">
					<!-- Key Metrics -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group"
						>
							<div class="flex items-start justify-between mb-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30"
								>
									<DollarSign class="h-7 w-7 text-white" />
								</div>
								{#if analytics.overview.revenueGrowth !== 0}
									{@const GrowthIcon = analytics.overview.revenueGrowth > 0 ? ArrowUp : ArrowDown}
									<div
										class="flex items-center gap-1 text-sm font-bold {analytics.overview
											.revenueGrowth > 0
											? 'text-green-600'
											: 'text-red-600'}"
									>
										<GrowthIcon class="h-4 w-4" />
										<span>{Math.abs(analytics.overview.revenueGrowth)}%</span>
									</div>
								{/if}
							</div>
							<p class="text-sm font-semibold text-gray-600 mb-2">Total Revenue</p>
							<p class="text-3xl font-black text-gray-900">
								{formatCurrency(analytics.overview.totalRevenue)}
							</p>
						</div>

						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group"
						>
							<div class="flex items-start justify-between mb-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
								>
									<Users class="h-7 w-7 text-white" />
								</div>
								{#if analytics.overview.subscribersGrowth !== 0}
									{@const SubGrowthIcon =
										analytics.overview.subscribersGrowth > 0 ? ArrowUp : ArrowDown}
									<div
										class="flex items-center gap-1 text-sm font-bold {analytics.overview
											.subscribersGrowth > 0
											? 'text-green-600'
											: 'text-red-600'}"
									>
										<SubGrowthIcon class="h-4 w-4" />
										<span>{Math.abs(analytics.overview.subscribersGrowth)}%</span>
									</div>
								{/if}
							</div>
							<p class="text-sm font-semibold text-gray-600 mb-2">Subscribers</p>
							<p class="text-3xl font-black text-gray-900">
								{formatNumber(analytics.overview.totalSubscribers)}
							</p>
						</div>

						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group"
						>
							<div class="flex items-start justify-between mb-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
								>
									<Eye class="h-7 w-7 text-white" />
								</div>
								{#if analytics.overview.viewsGrowth !== 0}
									{@const ViewsGrowthIcon =
										analytics.overview.viewsGrowth > 0 ? ArrowUp : ArrowDown}
									<div
										class="flex items-center gap-1 text-sm font-bold {analytics.overview
											.viewsGrowth > 0
											? 'text-green-600'
											: 'text-red-600'}"
									>
										<ViewsGrowthIcon class="h-4 w-4" />
										<span>{Math.abs(analytics.overview.viewsGrowth)}%</span>
									</div>
								{/if}
							</div>
							<p class="text-sm font-semibold text-gray-600 mb-2">Total Views</p>
							<p class="text-3xl font-black text-gray-900">
								{formatNumber(analytics.overview.totalViews)}
							</p>
						</div>

						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all hover:-translate-y-1 group"
						>
							<div class="flex items-start justify-between mb-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30"
								>
									<TrendingUp class="h-7 w-7 text-white" />
								</div>
								{#if analytics.overview.engagementGrowth !== 0}
									{@const EngagementGrowthIcon =
										analytics.overview.engagementGrowth > 0 ? ArrowUp : ArrowDown}
									<div
										class="flex items-center gap-1 text-sm font-bold {analytics.overview
											.engagementGrowth > 0
											? 'text-green-600'
											: 'text-red-600'}"
									>
										<EngagementGrowthIcon class="h-4 w-4" />
										<span>{Math.abs(analytics.overview.engagementGrowth)}%</span>
									</div>
								{/if}
							</div>
							<p class="text-sm font-semibold text-gray-600 mb-2">Engagement</p>
							<p class="text-3xl font-black text-gray-900">{analytics.overview.avgEngagement}%</p>
						</div>
					</div>

					<!-- Content & Performance Section -->
					{#if analytics.topContent.length > 0}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden"
						>
							<div class="p-8 border-b border-gray-200">
								<h3 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
									<Sparkles class="h-6 w-6 text-purple-600" />
									Top Performing Content
								</h3>
							</div>
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead class="bg-gray-50/50">
										<tr>
											<th
												class="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
												>Content</th
											>
											<th
												class="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
												>Type</th
											>
											<th
												class="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
												>Views</th
											>
											<th
												class="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
												>Revenue</th
											>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										{#each analytics.topContent as content}
											<tr class="hover:bg-purple-50/50 transition-colors">
												<td class="px-8 py-5 whitespace-nowrap">
													<div class="font-semibold text-gray-900">{content.title}</div>
												</td>
												<td class="px-8 py-5 whitespace-nowrap">
													<span
														class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 capitalize"
													>
														{content.type}
													</span>
												</td>
												<td class="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
													{formatNumber(content.views)}
												</td>
												<td class="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
													{formatCurrency(content.revenue)}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{:else}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-12 text-center"
						>
							<div
								class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
							>
								<Activity class="h-10 w-10 text-purple-600" />
							</div>
							<h3 class="text-xl font-bold text-gray-900 mb-2">No content data yet</h3>
							<p class="text-gray-600">Start creating content to see performance analytics</p>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Other Tabs - Coming Soon -->
				{@const EmptyStateIcon = tabs.find((t) => t.id === activeTab)?.icon || BarChart3}
				<div
					class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-20 text-center"
				>
					<div
						class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
					>
						<EmptyStateIcon class="h-12 w-12 text-purple-600" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
					<p class="text-gray-600 text-lg">Advanced {activeTab} analytics will be available here</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
