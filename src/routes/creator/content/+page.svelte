<script lang="ts">
	// Mock data removed - TODO: Replace with real API calls
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import MintContentModal from '$lib/components/MintContentModal.svelte';
	import {
		Upload,
		FileVideo,
		Image,
		Film,
		Eye,
		Calendar,
		Shield,
		Play,
		Trash2,
		Edit3,
		Sparkles,
		ArrowRight
	} from '@lucide/svelte';

	let loading = $state(true);
	let creatorData = $state<any>(null);
	let showUploadModal = $state(false);

	const contentTypes = [
		{ id: 'video', label: 'Video', icon: FileVideo },
		{ id: 'image', label: 'Image', icon: Image },
		{ id: 'stream', label: 'Live Stream', icon: Film }
	];

	onMount(async () => {
		// TODO: Replace with real authentication check
		// if (!currentUser || currentUser.userType !== 'creator') {
		// 	toast.error('Please log in as a creator to access this page');
		// 	goto('/');
		// 	return;
		// }

		// TODO: Load creator data from backend API
		// const response = await fetch('/api/creator/profile');
		// creatorData = await response.json();

		creatorData = {
			content: [],
			tiers: []
		};

		loading = false;
	});

	function openUploadModal() {
		showUploadModal = true;
	}

	async function handleUpload(content: any) {
		try {
			// TODO: Replace with real API call
			// const response = await fetch('/api/creator/content', {
			// 	method: 'POST',
			// 	body: JSON.stringify(content)
			// });

			// Simulate upload for now
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const newContent = {
				...content,
				id: Date.now().toString(),
				thumbnail:
					content.thumbnail ||
					`https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop`,
				uploadDate: new Date().toISOString()
			};

			if (creatorData) {
				creatorData.content = [...(creatorData.content || []), newContent];
			}

			toast.success('Content minted successfully!', 'Your NFT content is now live');
		} catch (error) {
			toast.error('Failed to mint content');
			throw error;
		}
	}

	function getTypeIcon(type: string) {
		return contentTypes.find((t) => t.id === type)?.icon || FileVideo;
	}

	function getTierName(tierId: string) {
		return creatorData?.tiers?.find((t: any) => t.id === tierId)?.name || 'Unknown Tier';
	}
</script>

<svelte:head>
	<title>Content Management - Creator Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
	<!-- Animated background -->
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
				<p class="text-gray-600 font-medium">Loading content...</p>
			</div>
		</div>
	{:else}
		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
				<div>
					<div class="flex items-center gap-3 mb-2">
						<div
							class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
						>
							<Sparkles class="h-6 w-6 text-white" />
						</div>
						<h1
							class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
						>
							Content Management
						</h1>
					</div>
					<p class="text-gray-600 text-lg ml-15">Mint and manage your exclusive NFT content</p>
				</div>

				{#if creatorData?.tiers?.length > 0}
					<button
						onclick={openUploadModal}
						class="group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all flex items-center gap-3"
					>
						<Sparkles class="h-5 w-5" />
						<span>Mint New Content</span>
						<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</button>
				{/if}
			</div>

			{#if !creatorData?.tiers?.length}
				<!-- No Tiers Warning -->
				<div
					class="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 mb-8 shadow-lg"
				>
					<div class="flex flex-col md:flex-row md:items-center gap-6">
						<div
							class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0"
						>
							<Shield class="h-8 w-8 text-amber-600" />
						</div>
						<div class="flex-1">
							<h3 class="font-bold text-amber-900 text-xl mb-2">Create Subscription Tiers First</h3>
							<p class="text-amber-700 leading-relaxed">
								You need to create at least one subscription tier before minting content. Tiers
								define pricing and access levels for your exclusive content.
							</p>
						</div>
						<button
							onclick={() => goto('/creator/tiers')}
							class="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 group"
						>
							<span>Create Tiers</span>
							<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>
				</div>
			{/if}

			<!-- Content Grid -->
			{#if creatorData?.content?.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each creatorData.content as content}
						{@const ContentIcon = getTypeIcon(content.type)}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
						>
							<!-- Thumbnail -->
							<div class="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
								{#if content.thumbnail}
									<img
										src={content.thumbnail}
										alt={content.title}
										class="w-full h-full object-cover"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center">
										<ContentIcon class="h-12 w-12 text-purple-400" />
									</div>
								{/if}

								<!-- Play Button Overlay -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
								>
									<div
										class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
									>
										<Play class="h-8 w-8 text-white" />
									</div>
								</div>

								<!-- Type Badge -->
								<div class="absolute top-3 left-3">
									<span
										class="bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full capitalize"
									>
										{content.type}
									</span>
								</div>

								<!-- Tier Badge -->
								<div class="absolute top-3 right-3">
									<span
										class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
									>
										{getTierName(content.tier)}
									</span>
								</div>
							</div>

							<!-- Content Info -->
							<div class="p-5">
								<h3 class="font-bold text-gray-900 mb-2 line-clamp-1">{content.title}</h3>
								<p class="text-sm text-gray-600 mb-4 line-clamp-2">{content.description}</p>

								<div class="flex items-center justify-between text-xs text-gray-500">
									<div class="flex items-center gap-1.5">
										<Calendar class="h-3.5 w-3.5" />
										<span>{new Date(content.createdAt).toLocaleDateString()}</span>
									</div>
									<div class="flex items-center gap-1.5">
										<Eye class="h-3.5 w-3.5" />
										<span class="font-medium">{Math.floor(Math.random() * 1000)}</span>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div
								class="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<button
									class="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl text-sm font-semibold transition-all"
								>
									<Edit3 class="h-4 w-4" />
									<span>Edit</span>
								</button>
								<button
									class="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 rounded-xl transition-all"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else if creatorData?.tiers?.length > 0}
				<!-- Empty State -->
				<div class="text-center py-20">
					<div
						class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
					>
						<Sparkles class="h-12 w-12 text-purple-600" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-3">No content minted yet</h3>
					<p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
						Start creating exclusive NFT content for your subscribers and build your collection
					</p>
					<button
						onclick={openUploadModal}
						class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-purple-500/30 hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
					>
						<Sparkles class="h-6 w-6" />
						<span>Mint Your First Content</span>
						<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Mint Content Modal -->
<MintContentModal
	bind:show={showUploadModal}
	tiers={creatorData?.tiers || []}
	onClose={() => (showUploadModal = false)}
	onUpload={handleUpload}
/>

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
