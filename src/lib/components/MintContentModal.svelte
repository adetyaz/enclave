<script lang="ts">
	import { Upload, FileVideo, Image, Film, X, Sparkles, Loader2 } from '@lucide/svelte';
	import { toast } from '$lib/stores/toastStore';

	interface Props {
		show: boolean;
		tiers: any[];
		onClose: () => void;
		onUpload: (content: any) => Promise<void>;
	}

	let { show = $bindable(), tiers, onClose, onUpload }: Props = $props();

	let uploading = $state(false);
	let newContent = $state({
		title: '',
		description: '',
		type: 'video',
		tier: '',
		thumbnail: '',
		file: null as File | null
	});

	const contentTypes = [
		{ id: 'video', label: 'Video', icon: FileVideo, gradient: 'from-purple-500 to-pink-500' },
		{ id: 'image', label: 'Image', icon: Image, gradient: 'from-blue-500 to-cyan-500' },
		{ id: 'stream', label: 'Live Stream', icon: Film, gradient: 'from-green-500 to-emerald-500' }
	];

	$effect(() => {
		if (show && tiers?.length > 0 && !newContent.tier) {
			newContent.tier = tiers[0].id;
		}
	});

	function resetForm() {
		newContent = {
			title: '',
			description: '',
			type: 'video',
			tier: tiers?.[0]?.id || '',
			thumbnail: '',
			file: null
		};
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			newContent.file = target.files[0];
		}
	}

	async function handleUpload() {
		if (!newContent.title || !newContent.description || !newContent.tier) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (!newContent.file) {
			toast.error('Please select a file to upload');
			return;
		}

		try {
			uploading = true;
			await onUpload(newContent);
			resetForm();
			onClose();
		} catch (error) {
			console.error('Upload failed:', error);
		} finally {
			uploading = false;
		}
	}

	function handleClose() {
		if (!uploading) {
			resetForm();
			onClose();
		}
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
							<Sparkles class="h-7 w-7 text-white" />
						</div>
						<div>
							<h2 class="text-3xl font-bold text-white">Mint New Content</h2>
							<p class="text-purple-100 text-sm mt-1">Create exclusive NFT content for your fans</p>
						</div>
					</div>
					<button
						onclick={handleClose}
						disabled={uploading}
						class="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
					>
						<X class="h-6 w-6 text-white" />
					</button>
				</div>
			</div>

			<!-- Content -->
			<div class="p-8 space-y-6">
				<!-- Content Type Selection -->
				<div>
					<label class="block text-sm font-bold text-gray-900 mb-4">Content Type</label>
					<div class="grid grid-cols-3 gap-4">
						{#each contentTypes as type}
							<button
								onclick={() => (newContent.type = type.id)}
								class="group relative overflow-hidden rounded-2xl border-2 transition-all {newContent.type ===
								type.id
									? 'border-purple-500 shadow-lg shadow-purple-500/30'
									: 'border-gray-200 hover:border-gray-300'}"
							>
								<div
									class="p-6 {newContent.type === type.id
										? `bg-gradient-to-br ${type.gradient}`
										: 'bg-gray-50 group-hover:bg-gray-100'} transition-all"
								>
									<svelte:component
										this={type.icon}
										class="h-8 w-8 mx-auto mb-3 {newContent.type === type.id
											? 'text-white'
											: 'text-gray-600'}"
									/>
									<p
										class="text-sm font-semibold {newContent.type === type.id
											? 'text-white'
											: 'text-gray-900'}"
									>
										{type.label}
									</p>
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Title -->
				<div>
					<label for="title" class="block text-sm font-bold text-gray-900 mb-3">
						Content Title
					</label>
					<input
						id="title"
						type="text"
						bind:value={newContent.title}
						placeholder="Enter a catchy title"
						class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-bold text-gray-900 mb-3">
						Description
					</label>
					<textarea
						id="description"
						bind:value={newContent.description}
						rows="4"
						placeholder="Describe what fans will get..."
						class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all resize-none"
					></textarea>
				</div>

				<!-- Tier Selection -->
				<div>
					<label for="tier" class="block text-sm font-bold text-gray-900 mb-3"> Access Tier </label>
					<select
						id="tier"
						bind:value={newContent.tier}
						class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
					>
						{#each tiers as tier}
							<option value={tier.id}>{tier.name} - {tier.price} $MOCA</option>
						{/each}
					</select>
				</div>

				<!-- File Upload -->
				<div>
					<label class="block text-sm font-bold text-gray-900 mb-3">Upload File</label>
					<div
						class="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-purple-400 transition-all bg-gradient-to-br from-purple-50 to-pink-50"
					>
						<input
							type="file"
							onchange={handleFileSelect}
							accept={newContent.type === 'image'
								? 'image/*'
								: newContent.type === 'video'
									? 'video/*'
									: '*'}
							class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
						<div class="text-center">
							<Upload class="h-12 w-12 mx-auto mb-4 text-purple-500" />
							{#if newContent.file}
								<p class="text-sm font-semibold text-gray-900 mb-1">{newContent.file.name}</p>
								<p class="text-xs text-gray-500">
									{(newContent.file.size / (1024 * 1024)).toFixed(2)} MB
								</p>
							{:else}
								<p class="text-sm font-semibold text-gray-900 mb-1">
									Click to upload or drag and drop
								</p>
								<p class="text-xs text-gray-500">
									{newContent.type === 'image'
										? 'PNG, JPG, GIF up to 10MB'
										: 'Video files up to 500MB'}
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="p-8 border-t border-gray-200 bg-gray-50 rounded-b-3xl flex gap-4">
				<button
					onclick={handleClose}
					disabled={uploading}
					class="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition-all disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					onclick={handleUpload}
					disabled={uploading}
					class="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
				>
					{#if uploading}
						<Loader2 class="h-5 w-5 animate-spin" />
						<span>Minting...</span>
					{:else}
						<Sparkles class="h-5 w-5" />
						<span>Mint Content</span>
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
