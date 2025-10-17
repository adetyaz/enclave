<script lang="ts">
	import { X, Crown, Plus, Trash2, Loader2, Shield, Sparkles } from '@lucide/svelte';
	import { toast } from '$lib/stores/toastStore';

	interface Props {
		show: boolean;
		editingTier?: any | null;
		onClose: () => void;
		onSave: (tier: any) => Promise<void>;
	}

	let { show = $bindable(), editingTier = null, onClose, onSave }: Props = $props();

	let saving = $state(false);
	let newTier = $state({
		name: '',
		price: 0,
		description: '',
		requirements: ['age_18'],
		perks: ['']
	});

	const availableRequirements = [
		{ id: 'age_18', label: 'Age 18+', color: 'blue', icon: '🔞' },
		{ id: 'age_21', label: 'Age 21+', color: 'purple', icon: '🍷' },
		{ id: 'subscriber', label: 'Subscriber', color: 'green', icon: '⭐' },
		{ id: 'premium_subscriber', label: 'Premium', color: 'yellow', icon: '💎' },
		{ id: 'mocaverse_nft', label: 'Mocaverse NFT', color: 'pink', icon: '🎨' }
	];

	$effect(() => {
		if (show && editingTier) {
			newTier = {
				name: editingTier.name,
				price: editingTier.price,
				description: editingTier.description,
				requirements: [...editingTier.requirements],
				perks: [...editingTier.perks]
			};
		} else if (show && !editingTier) {
			resetForm();
		}
	});

	function resetForm() {
		newTier = {
			name: '',
			price: 0,
			description: '',
			requirements: ['age_18'],
			perks: ['']
		};
	}

	function addPerk() {
		newTier.perks = [...newTier.perks, ''];
	}

	function removePerk(index: number) {
		if (newTier.perks.length > 1) {
			newTier.perks = newTier.perks.filter((_, i) => i !== index);
		}
	}

	function updatePerk(index: number, value: string) {
		newTier.perks[index] = value;
	}

	function toggleRequirement(reqId: string) {
		if (newTier.requirements.includes(reqId)) {
			newTier.requirements = newTier.requirements.filter((r) => r !== reqId);
		} else {
			newTier.requirements = [...newTier.requirements, reqId];
		}
	}

	async function handleSave() {
		if (!newTier.name || !newTier.description || newTier.price <= 0) {
			toast.error('Please fill in all required fields');
			return;
		}

		const filteredPerks = newTier.perks.filter((p) => p.trim() !== '');
		if (filteredPerks.length === 0) {
			toast.error('Please add at least one perk');
			return;
		}

		try {
			saving = true;
			await onSave({
				...newTier,
				perks: filteredPerks
			});
			resetForm();
			onClose();
		} catch (error) {
			console.error('Save failed:', error);
		} finally {
			saving = false;
		}
	}

	function handleClose() {
		if (!saving) {
			resetForm();
			onClose();
		}
	}

	function getRequirementColor(reqId: string) {
		const req = availableRequirements.find((r) => r.id === reqId);
		return req?.color || 'gray';
	}
</script>

{#if show}
	<div
		class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
		onclick={(e) => e.target === e.currentTarget && handleClose()}
	>
		<div
			class="bg-white/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50 animate-slide-up"
		>
			<!-- Header -->
			<div
				class="sticky top-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-8 rounded-t-3xl"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div
							class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
						>
							<Crown class="h-7 w-7 text-white" />
						</div>
						<div>
							<h2 class="text-3xl font-bold text-white">
								{editingTier ? 'Edit Tier' : 'Create New Tier'}
							</h2>
							<p class="text-purple-100 text-sm mt-1">
								Set pricing and access levels for your content
							</p>
						</div>
					</div>
					<button
						onclick={handleClose}
						disabled={saving}
						class="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
					>
						<X class="h-6 w-6 text-white" />
					</button>
				</div>
			</div>

			<!-- Content -->
			<div class="p-8 space-y-6">
				<!-- Tier Name -->
				<div>
					<label for="tier-name" class="block text-sm font-bold text-gray-900 mb-3">
						Tier Name
					</label>
					<input
						id="tier-name"
						type="text"
						bind:value={newTier.name}
						placeholder="e.g., Gold, Premium, VIP"
						class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
					/>
				</div>

				<!-- Price -->
				<div>
					<label for="tier-price" class="block text-sm font-bold text-gray-900 mb-3">
						Monthly Price
					</label>
					<div class="relative">
						<input
							id="tier-price"
							type="number"
							bind:value={newTier.price}
							min="0"
							step="1"
							placeholder="0"
							class="w-full px-5 py-4 pr-24 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
						/>
						<div class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
							$MOCA
						</div>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label for="tier-description" class="block text-sm font-bold text-gray-900 mb-3">
						Description
					</label>
					<textarea
						id="tier-description"
						bind:value={newTier.description}
						rows="3"
						placeholder="Describe what this tier includes..."
						class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all resize-none"
					></textarea>
				</div>

				<!-- Requirements -->
				<div>
					<label class="block text-sm font-bold text-gray-900 mb-4">Access Requirements</label>
					<div class="grid grid-cols-2 gap-3">
						{#each availableRequirements as req}
							<button
								onclick={() => toggleRequirement(req.id)}
								class="group relative overflow-hidden rounded-2xl border-2 transition-all text-left {newTier.requirements.includes(
									req.id
								)
									? `border-${req.color}-500 bg-${req.color}-50`
									: 'border-gray-200 hover:border-gray-300 bg-gray-50'}"
							>
								<div class="p-4 flex items-center gap-3">
									<div
										class="w-10 h-10 {newTier.requirements.includes(req.id)
											? `bg-${req.color}-100`
											: 'bg-gray-100'} rounded-xl flex items-center justify-center text-xl transition-all"
									>
										{req.icon}
									</div>
									<div class="flex-1">
										<p
											class="text-sm font-semibold {newTier.requirements.includes(req.id)
												? `text-${req.color}-900`
												: 'text-gray-700'}"
										>
											{req.label}
										</p>
									</div>
									{#if newTier.requirements.includes(req.id)}
										<Shield class="h-5 w-5 text-{req.color}-600" />
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Perks -->
				<div>
					<div class="flex items-center justify-between mb-4">
						<label class="text-sm font-bold text-gray-900">Tier Perks</label>
						<button
							onclick={addPerk}
							class="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm"
						>
							<Plus class="h-4 w-4" />
							<span>Add Perk</span>
						</button>
					</div>
					<div class="space-y-3">
						{#each newTier.perks as perk, index}
							<div class="flex gap-3">
								<div class="flex-1 relative">
									<input
										type="text"
										value={perk}
										oninput={(e) => updatePerk(index, e.currentTarget.value)}
										placeholder="e.g., Access to exclusive videos"
										class="w-full px-5 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
									/>
									<div class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-bold">
										✓
									</div>
								</div>
								{#if newTier.perks.length > 1}
									<button
										onclick={() => removePerk(index)}
										class="w-12 h-12 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-all"
									>
										<Trash2 class="h-5 w-5" />
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Preview Card -->
				<div
					class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
				>
					<div class="flex items-center gap-2 mb-3">
						<Sparkles class="h-5 w-5 text-purple-600" />
						<h3 class="font-bold text-purple-900">Preview</h3>
					</div>
					<div class="bg-white/80 backdrop-blur-sm rounded-xl p-6">
						<div class="flex items-start justify-between mb-3">
							<h4 class="text-xl font-bold text-gray-900">
								{newTier.name || 'Tier Name'}
							</h4>
							<div class="text-right">
								<p class="text-2xl font-bold text-purple-600">{newTier.price}</p>
								<p class="text-xs text-purple-700 font-medium">$MOCA/month</p>
							</div>
						</div>
						<p class="text-sm text-gray-600 mb-4">
							{newTier.description || 'Tier description will appear here...'}
						</p>
						<div class="space-y-2">
							{#each newTier.perks.filter((p) => p.trim()) as perk}
								<div class="flex items-center gap-2 text-sm text-gray-700">
									<span class="text-green-600">✓</span>
									<span>{perk}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="p-8 border-t border-gray-200 bg-gray-50 rounded-b-3xl flex gap-4">
				<button
					onclick={handleClose}
					disabled={saving}
					class="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition-all disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					onclick={handleSave}
					disabled={saving}
					class="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
				>
					{#if saving}
						<Loader2 class="h-5 w-5 animate-spin" />
						<span>Saving...</span>
					{:else}
						<Crown class="h-5 w-5" />
						<span>{editingTier ? 'Update Tier' : 'Create Tier'}</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}

	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>
