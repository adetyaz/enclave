<script lang="ts">
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		Search,
		Filter,
		Star,
		Users,
		Eye,
		Heart,
		BookOpen,
		Video,
		Image as ImageIcon,
		Film,
		Shield,
		ChevronRight,
		Sparkles,
		Crown,
		TrendingUp
	} from '@lucide/svelte';

	let loading = $state(true);
	let creators = $state<any[]>([]);
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state('popularity');

	const categories = [
		{ id: 'all', label: 'All Categories' },
		{ id: 'crypto', label: 'Cryptocurrency' },
		{ id: 'privacy', label: 'Privacy Tech' },
		{ id: 'defi', label: 'DeFi' },
		{ id: 'nft', label: 'NFTs' },
		{ id: 'education', label: 'Education' },
		{ id: 'news', label: 'News & Analysis' }
	];

	const sortOptions = [
		{ id: 'popularity', label: 'Most Popular' },
		{ id: 'newest', label: 'Newest Creators' },
		{ id: 'subscribers', label: 'Most Subscribers' },
		{ id: 'price_low', label: 'Price: Low to High' },
		{ id: 'price_high', label: 'Price: High to Low' }
	];

	onMount(async () => {
		// TODO: Load creators from backend API
		creators = [];
		loading = false;
	});

	$effect(() => {
		// Refilter when search/category/sort changes
		searchQuery;
		selectedCategory;
		sortBy;
	});

	function viewCreator(walletAddress: string) {
		goto(`/creator/${walletAddress}`);
	}

	function subscribe(creatorId: string) {
		// TODO: Implement subscription flow
		toast.info('Subscription feature coming soon!');
	}
</script>

<svelte:head>
	<title>Discover Creators - Fan Dashboard</title>
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
			<div class="mb-10">
				<div class="flex items-center gap-4 mb-3">
					<div
						class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
					>
						<Sparkles class="h-7 w-7 text-white" />
					</div>
					<h1 class="text-4xl font-black text-gray-900 tracking-tight">Discover Creators</h1>
				</div>
				<p class="text-gray-600 text-lg ml-[72px]">
					Find and subscribe to privacy-focused content creators
				</p>
			</div>

			<!-- Search and Filters -->
			<div
				class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 mb-10"
			>
				<div class="flex flex-col lg:flex-row lg:items-center gap-4">
					<!-- Search Bar -->
					<div class="relative flex-1">
						<Search
							class="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
						/>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search creators, topics, or categories..."
							class="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium shadow-sm"
						/>
					</div>

					<!-- Category Filter -->
					<select
						bind:value={selectedCategory}
						class="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold text-gray-700 cursor-pointer shadow-sm min-w-[200px]"
					>
						{#each categories as category}
							<option value={category.id}>{category.label}</option>
						{/each}
					</select>

					<!-- Sort By -->
					<select
						bind:value={sortBy}
						class="px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold text-gray-700 cursor-pointer shadow-sm min-w-[200px]"
					>
						{#each sortOptions as option}
							<option value={option.id}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Results -->
			{#if creators.length === 0}
				<div class="text-center py-20">
					<div
						class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
					>
						<Search class="h-12 w-12 text-purple-600" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-3">No creators found yet</h3>
					<p class="text-gray-600 text-lg">Creators will appear here once they join the platform</p>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
					{#each creators as creator}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 group"
						>
							<!-- Creator Header -->
							<div class="p-8">
								<div class="flex items-start justify-between mb-4">
									<div class="flex items-center gap-4">
										<div
											class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
										>
											<Crown class="h-8 w-8 text-white" />
										</div>
										<div>
											<h3 class="font-bold text-xl text-gray-900">{creator.displayName}</h3>
											<span
												class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 capitalize mt-1"
											>
												{creator.category || 'General'}
											</span>
										</div>
									</div>
								</div>

								<p class="text-gray-600 leading-relaxed line-clamp-2">{creator.bio}</p>
							</div>

							<!-- Stats -->
							<div
								class="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-y border-white/50"
							>
								<div class="grid grid-cols-3 gap-4 text-center">
									<div>
										<div class="font-black text-2xl text-gray-900">
											{creator.subscribers || 0}
										</div>
										<div class="text-xs font-semibold text-gray-600">Subscribers</div>
									</div>
									<div>
										<div class="font-black text-2xl text-gray-900">{creator.contentCount || 0}</div>
										<div class="text-xs font-semibold text-gray-600">Content</div>
									</div>
									<div>
										<div class="font-black text-2xl text-gray-900">
											{creator.views ? Math.floor(creator.views / 1000) + 'K' : '0'}
										</div>
										<div class="text-xs font-semibold text-gray-600">Views</div>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="p-8">
								<button
									onclick={() => viewCreator(creator.walletAddress)}
									class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all group"
								>
									<span>View Profile</span>
									<ChevronRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
