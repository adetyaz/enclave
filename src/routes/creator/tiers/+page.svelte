<script lang="ts">
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import CreateTierModal from '$lib/components/CreateTierModal.svelte';
	import {
		Plus,
		Edit3,
		Trash2,
		Shield,
		Users,
		DollarSign,
		CheckCircle,
		AlertCircle,
		Crown,
		ArrowRight,
		Sparkles
	} from '@lucide/svelte';

	let loading = $state(true);
	let tiers = $state<any[]>([]);
	let showCreateModal = $state(false);
	let editingTier = $state<any>(null);

	const availableRequirements = [
		{ id: 'age_18', label: 'Age 18+', color: 'blue', icon: '🔞' },
		{ id: 'age_21', label: 'Age 21+', color: 'purple', icon: '🍷' },
		{ id: 'subscriber', label: 'Subscriber', color: 'green', icon: '⭐' },
		{ id: 'premium_subscriber', label: 'Premium', color: 'yellow', icon: '💎' },
		{ id: 'mocaverse_nft', label: 'Mocaverse NFT', color: 'pink', icon: '🎨' }
	];

	onMount(async () => {
		// TODO: Load tiers from backend API
		// For now, start with empty array
		tiers = [];
		loading = false;
	});

	function openCreateModal() {
		showCreateModal = true;
		editingTier = null;
	}

	function openEditModal(tier: any) {
		showCreateModal = true;
		editingTier = tier;
	}

	async function handleSaveTier(tierData: any) {
		try {
			if (editingTier) {
				// Update existing tier
				const index = tiers.findIndex((t: any) => t.id === editingTier?.id);
				if (index !== -1) {
					tiers[index] = { ...tierData, id: editingTier?.id };
					tiers = [...tiers]; // Trigger reactivity
				}
				toast.success('Tier updated successfully!', 'Your subscription tier has been updated');
			} else {
				// Create new tier
				const newTier = {
					...tierData,
					id: Date.now().toString(),
					createdAt: new Date().toISOString()
				};
				tiers = [...tiers, newTier];
				toast.success('Tier created successfully!', 'Your new subscription tier is now live');
			}
			// TODO: Save to backend API
		} catch (error) {
			toast.error('Failed to save tier');
			throw error;
		}
	}

	function getRequirementLabel(reqId: string) {
		return availableRequirements.find((r) => r.id === reqId)?.label || reqId;
	}

	function closeModal() {
		showCreateModal = false;
		editingTier = null;
	}

	async function saveTier(tierData: any) {
		await handleSaveTier(tierData);
		closeModal();
	}

	function deleteTier(tierId: string) {
		if (confirm('Are you sure you want to delete this tier?')) {
			tiers = tiers.filter((t: any) => t.id !== tierId);
			toast.success('Tier deleted successfully');
			// TODO: Delete from backend API
		}
	}
</script>

<svelte:head>
	<title>Manage Tiers - Creator Dashboard</title>
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
				<p class="text-gray-600 font-medium">Loading tiers...</p>
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
							<Crown class="h-6 w-6 text-white" />
						</div>
						<h1
							class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
						>
							Subscription Tiers
						</h1>
					</div>
					<p class="text-gray-600 text-lg ml-15">Manage your content access levels and pricing</p>
				</div>

				<button
					onclick={openCreateModal}
					class="group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all flex items-center gap-3"
				>
					<Plus class="h-5 w-5" />
					<span>Create New Tier</span>
					<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
				</button>
			</div>

			<!-- Tiers Grid -->
			{#if tiers.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each tiers as tier}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
						>
							<!-- Status Badge -->
							<div class="absolute top-6 right-6">
								<span
									class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
								>
									<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
									Active
								</span>
							</div>

							<!-- Tier Header -->
							<div class="mb-6">
								<div
									class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
								>
									<Crown class="h-7 w-7 text-white" />
								</div>
								<h3 class="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
								<div class="flex items-baseline gap-2">
									<span class="text-4xl font-bold text-purple-600">{tier.price}</span>
									<span class="text-lg text-purple-700 font-medium">$MOCA/month</span>
								</div>
							</div>

							<!-- Description -->
							<p class="text-gray-600 mb-6 leading-relaxed">{tier.description}</p>

							<!-- Requirements -->
							<div class="mb-6">
								<h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
									<Shield class="h-4 w-4 text-purple-600" />
									Requirements
								</h4>
								<div class="flex flex-wrap gap-2">
									{#each tier.requirements as requirement}
										<span
											class="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200"
										>
											{getRequirementLabel(requirement)}
										</span>
									{/each}
								</div>
							</div>

							<!-- Perks -->
							<div class="mb-8">
								<h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
									<Sparkles class="h-4 w-4 text-green-600" />
									Perks
								</h4>
								<ul class="space-y-2">
									{#each tier.perks as perk}
										<li class="text-sm text-gray-700 flex items-start gap-2">
											<CheckCircle class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
											<span class="leading-relaxed">{perk}</span>
										</li>
									{/each}
								</ul>
							</div>

							<!-- Actions -->
							<div
								class="flex gap-3 pt-6 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<button
									onclick={() => openEditModal(tier)}
									class="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-xl text-sm font-semibold transition-all"
								>
									<Edit3 class="h-4 w-4" />
									<span>Edit</span>
								</button>
								<button
									onclick={() => deleteTier(tier.id)}
									class="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 rounded-xl transition-all"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Empty State -->
				<div class="text-center py-20">
					<div
						class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
					>
						<Crown class="h-12 w-12 text-purple-600" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-3">No tiers created yet</h3>
					<p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
						Create your first subscription tier to start offering gated content and building your
						community
					</p>
					<button
						onclick={openCreateModal}
						class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-purple-500/30 hover:shadow-2xl transition-all inline-flex items-center gap-3 group"
					>
						<Crown class="h-6 w-6" />
						<span>Create Your First Tier</span>
						<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Create/Edit Tier Modal -->
<CreateTierModal bind:show={showCreateModal} onClose={closeModal} onSave={saveTier} {editingTier} />
