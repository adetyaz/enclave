<script lang="ts">
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		Shield,
		Award,
		Download,
		Share,
		Eye,
		EyeOff,
		CheckCircle,
		Clock,
		Copy,
		QrCode,
		Key,
		Lock,
		Unlock,
		Sparkles,
		TrendingUp
	} from '@lucide/svelte';

	let loading = $state(true);
	let userCredentials = $state<any[]>([]);
	let selectedCredential = $state<any>(null);
	let showCredentialModal = $state(false);
	let showProofModal = $state(false);
	let activeTab = $state('all');
	let proofData = $state('');

	const tabs = [
		{ id: 'all', label: 'All Credentials', count: 0 },
		{ id: 'verified', label: 'Verified', count: 0 },
		{ id: 'pending', label: 'Pending', count: 0 }
	];

	const credentialTypes = {
		subscription: { label: 'Subscription', color: 'bg-blue-500', icon: Award },
		engagement: { label: 'Engagement', color: 'bg-green-500', icon: Shield },
		payment: { label: 'Payment', color: 'bg-purple-500', icon: Key },
		reputation: { label: 'Reputation', color: 'bg-orange-500', icon: CheckCircle }
	};

	onMount(async () => {
		try {
			// TODO: Fetch user's ZK credentials from API
			// const response = await fetch('/api/fan/credentials');
			// userCredentials = await response.json();

			userCredentials = [];

			// Update tab counts
			tabs[0].count = userCredentials.length;
			tabs[1].count = userCredentials.filter((c) => c.status === 'verified').length;
			tabs[2].count = userCredentials.filter((c) => c.status === 'pending').length;
		} catch (error) {
			toast.error('Failed to load credentials');
		}

		loading = false;
	});

	function generateMockProof(credential: any) {
		return {
			zkProof: `zk_proof_${Math.random().toString(36).substring(2, 15)}`,
			publicSignals: [credential.value, credential.issuer, Date.now()],
			verificationKey: `vk_${Math.random().toString(36).substring(2, 10)}`,
			circuit:
				credential.type === 'subscription' ? 'subscription_proof.circom' : 'engagement_proof.circom'
		};
	}

	function getFilteredCredentials() {
		return userCredentials.filter((cred) => {
			if (activeTab === 'verified') return cred.status === 'verified';
			if (activeTab === 'pending') return cred.status === 'pending';
			return true;
		});
	}

	function getCredentialTypeInfo(type: string) {
		const types: any = credentialTypes;
		return types[type] || { label: 'Unknown', color: 'bg-gray-500', icon: Shield };
	}

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function viewCredential(credential: any) {
		selectedCredential = credential;
		showCredentialModal = true;
	}

	function generateProof(credential: any) {
		selectedCredential = credential;
		proofData = JSON.stringify(credential.proof, null, 2);
		showProofModal = true;
	}

	async function toggleVisibility(credential: any) {
		try {
			// TODO: Update credential visibility via API
			// await fetch(`/api/credentials/${credential.id}/visibility`, {
			//   method: 'PATCH',
			//   body: JSON.stringify({ isVisible: !credential.isVisible })
			// });

			credential.isVisible = !credential.isVisible;
			toast.success(`Credential ${credential.isVisible ? 'made visible' : 'hidden'}`);
		} catch (error) {
			toast.error('Failed to update credential visibility');
		}
	}

	async function shareCredential(credential: any) {
		try {
			// Generate shareable link
			const shareUrl = `${window.location.origin}/verify/${credential.id}`;
			await navigator.clipboard.writeText(shareUrl);
			toast.success('Share link copied to clipboard');
		} catch (error) {
			toast.error('Failed to generate share link');
		}
	}

	async function downloadCredential(credential: any) {
		try {
			const credData = {
				...credential,
				exportedAt: new Date().toISOString(),
				format: 'W3C Verifiable Credential'
			};

			const blob = new Blob([JSON.stringify(credData, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `credential-${credential.id}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toast.success('Credential downloaded');
		} catch (error) {
			toast.error('Failed to download credential');
		}
	}

	function copyProofData() {
		navigator.clipboard.writeText(proofData);
		toast.success('Proof data copied to clipboard');
	}
</script>

<svelte:head>
	<title>ZK Credentials - Fan Dashboard</title>
</svelte:head>

{#if loading}
	<div class="flex justify-center items-center min-h-[60vh]">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
	</div>
{:else}
	<div
		class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden"
	>
		<!-- Animated Background Blobs -->
		<div
			class="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
		></div>
		<div
			class="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
		></div>
		<div
			class="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
		></div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Header -->
			<div class="mb-8 flex items-start space-x-4">
				<div
					class="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
				>
					<Shield class="h-7 w-7 text-white" />
				</div>
				<div>
					<h1
						class="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2"
					>
						ZK Credentials
					</h1>
					<p class="text-lg text-gray-600 ml-[72px]">
						Manage your privacy-preserving credentials and proofs
					</p>
				</div>
			</div>

			<!-- Info Banner -->
			<div
				class="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6"
			>
				<div class="flex items-start space-x-4">
					<div
						class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0"
					>
						<Sparkles class="h-6 w-6 text-purple-600" />
					</div>
					<div>
						<h3 class="text-lg font-bold text-gray-900 mb-2">Zero-Knowledge Credentials</h3>
						<p class="text-gray-600">
							These credentials prove your interactions and achievements without revealing personal
							information. You can use them to verify your reputation across platforms while
							maintaining privacy.
						</p>
					</div>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div
				class="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-2"
			>
				<nav class="flex space-x-2">
					{#each tabs as tab}
						<button
							onclick={() => (activeTab = tab.id)}
							class="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-2xl font-medium text-sm transition-all {activeTab ===
							tab.id
								? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-xl shadow-purple-500/30'
								: 'text-gray-600 hover:bg-white/50'}"
						>
							<span>{tab.label}</span>
							{#if tab.count > 0}
								<span
									class="{activeTab === tab.id
										? 'bg-white/20'
										: 'bg-gray-100'} py-0.5 px-2.5 rounded-full text-xs font-bold"
								>
									{tab.count}
								</span>
							{/if}
						</button>
					{/each}
				</nav>
			</div>

			<!-- Credentials Grid -->
			{#if getFilteredCredentials().length === 0}
				<div class="text-center py-20">
					<div
						class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
					>
						<Shield class="h-12 w-12 text-purple-600" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-3">No credentials found</h3>
					<p class="text-gray-600 mb-8 max-w-md mx-auto">
						{#if activeTab === 'all'}
							Earn credentials by subscribing to creators and engaging with content
						{:else if activeTab === 'verified'}
							Your verified credentials will appear here once validated
						{:else}
							Pending credentials are being processed and will be verified soon
						{/if}
					</p>
					{#if activeTab === 'all'}
						<button
							onclick={() => goto('/fan/discover')}
							class="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/30 transition-all hover:-translate-y-1 font-medium"
						>
							<Sparkles class="h-5 w-5" />
							<span>Discover Creators</span>
						</button>
					{/if}
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each getFilteredCredentials() as credential}
						{@const IconComponent = getCredentialTypeInfo(credential.type).icon}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
						>
							<!-- Credential Header -->
							<div class="p-6 border-b border-gray-100">
								<div class="flex items-start justify-between mb-4">
									<div class="flex items-center space-x-3">
										<div
											class="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
										>
											<IconComponent class="h-6 w-6 text-white" />
										</div>
										<div>
											<h3 class="font-bold text-gray-900">{credential.claim}</h3>
											<p class="text-sm text-gray-600">
												{getCredentialTypeInfo(credential.type).label}
											</p>
										</div>
									</div>

									<button
										onclick={() => toggleVisibility(credential)}
										class="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
									>
										{#if credential.isVisible}
											<Eye class="h-4 w-4" />
										{:else}
											<EyeOff class="h-4 w-4" />
										{/if}
									</button>
								</div>

								<span
									class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold {credential.status ===
									'verified'
										? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
										: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700'}"
								>
									{#if credential.status === 'verified'}
										<CheckCircle class="h-3 w-3 mr-1" />
									{:else}
										<Clock class="h-3 w-3 mr-1" />
									{/if}
									{credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
								</span>
							</div>

							<!-- Credential Details -->
							<div class="p-6 space-y-3 bg-gradient-to-br from-purple-50 to-pink-50">
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-600 font-medium">Value</span>
									<span class="font-bold text-gray-900">{credential.value}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-600 font-medium">Issued</span>
									<span class="font-bold text-gray-900">{formatDate(credential.issuedAt)}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-600 font-medium">Times Used</span>
									<span class="font-bold text-gray-900">{credential.usageCount}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-600 font-medium">Visibility</span>
									<div class="flex items-center space-x-1">
										{#if credential.isVisible}
											<Unlock class="h-4 w-4 text-green-500" />
											<span class="text-sm font-bold text-green-600">Public</span>
										{:else}
											<Lock class="h-4 w-4 text-red-500" />
											<span class="text-sm font-bold text-red-600">Private</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="p-6 space-y-3">
								<button
									onclick={() => viewCredential(credential)}
									class="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white py-3 rounded-2xl shadow-xl shadow-purple-500/30 transition-all hover:-translate-y-0.5 font-medium"
								>
									<Eye class="h-4 w-4" />
									<span>View Details</span>
								</button>

								<div class="grid grid-cols-3 gap-2">
									<button
										onclick={() => generateProof(credential)}
										disabled={credential.status !== 'verified'}
										class="flex items-center justify-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<QrCode class="h-4 w-4" />
										<span>Proof</span>
									</button>

									{#if credential.canShare}
										<button
											onclick={() => shareCredential(credential)}
											class="flex items-center justify-center space-x-1 bg-green-50 hover:bg-green-100 text-green-600 py-2.5 rounded-xl text-xs font-medium transition-colors"
										>
											<Share class="h-4 w-4" />
											<span>Share</span>
										</button>
									{/if}

									<button
										onclick={() => downloadCredential(credential)}
										class="flex items-center justify-center space-x-1 bg-purple-50 hover:bg-purple-100 text-purple-600 py-2.5 rounded-xl text-xs font-medium transition-colors"
									>
										<Download class="h-4 w-4" />
										<span>Export</span>
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Credential Detail Modal -->
	{#if showCredentialModal && selectedCredential}
		{@const ModalIconComponent = getCredentialTypeInfo(selectedCredential.type).icon}
		<div
			class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
		>
			<div
				class="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
			>
				<div
					class="p-8 border-b border-gray-200 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"
							>
								<Shield class="h-6 w-6 text-white" />
							</div>
							<h2 class="text-2xl font-bold text-white">Credential Details</h2>
						</div>
						<button
							onclick={() => (showCredentialModal = false)}
							class="text-white/80 hover:text-white transition-colors"
							aria-label="Close modal"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
				</div>

				<div class="p-8">
					<div class="space-y-6">
						<!-- Credential Overview -->
						<div
							class="flex items-center space-x-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
						>
							<div
								class="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
							>
								<ModalIconComponent class="h-8 w-8 text-white" />
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">{selectedCredential.claim}</h3>
								<p class="text-gray-600 font-medium">
									{getCredentialTypeInfo(selectedCredential.type).label} Credential
								</p>
							</div>
						</div>

						<!-- Credential Properties -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-lg"
							>
								<h4 class="font-bold text-gray-900 mb-2">Credential ID</h4>
								<p class="text-sm text-gray-600 font-mono break-all">{selectedCredential.id}</p>
							</div>
							<div
								class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-lg"
							>
								<h4 class="font-bold text-gray-900 mb-2">Status</h4>
								<span
									class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold {selectedCredential.status ===
									'verified'
										? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
										: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700'}"
								>
									{selectedCredential.status.charAt(0).toUpperCase() +
										selectedCredential.status.slice(1)}
								</span>
							</div>
							<div
								class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-lg"
							>
								<h4 class="font-bold text-gray-900 mb-2">Value</h4>
								<p class="text-sm text-gray-900 font-semibold">{selectedCredential.value}</p>
							</div>
							<div
								class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-lg"
							>
								<h4 class="font-bold text-gray-900 mb-2">Issued Date</h4>
								<p class="text-sm text-gray-900 font-semibold">
									{formatDate(selectedCredential.issuedAt)}
								</p>
							</div>
						</div>

						<!-- Issuer Information -->
						<div
							class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-lg"
						>
							<h4 class="font-bold text-gray-900 mb-2">Issuer</h4>
							<p class="text-sm text-gray-600 font-mono break-all">{selectedCredential.issuer}</p>
						</div>

						<!-- Usage Information -->
						<div
							class="bg-gradient-to-br from-blue-50 to-purple-50 border border-white/50 rounded-2xl p-5"
						>
							<h4 class="font-bold text-gray-900 mb-3 flex items-center space-x-2">
								<TrendingUp class="h-5 w-5 text-purple-600" />
								<span>Usage Statistics</span>
							</h4>
							<div class="grid grid-cols-2 gap-4">
								<div class="bg-white/80 rounded-xl p-3">
									<p class="text-xs text-gray-600 mb-1">Times Used</p>
									<p class="text-2xl font-black text-gray-900">{selectedCredential.usageCount}</p>
								</div>
								<div class="bg-white/80 rounded-xl p-3">
									<p class="text-xs text-gray-600 mb-1">Last Used</p>
									<p class="text-sm font-bold text-gray-900">
										{selectedCredential.lastUsed
											? formatDate(selectedCredential.lastUsed)
											: 'Never'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="p-8 border-t border-gray-200 flex justify-end space-x-4">
					<button
						onclick={() => (showCredentialModal = false)}
						class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors font-medium"
					>
						Close
					</button>
					<button
						onclick={() => generateProof(selectedCredential)}
						disabled={selectedCredential.status !== 'verified'}
						class="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white rounded-2xl shadow-xl shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						Generate Proof
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- ZK Proof Modal -->
	{#if showProofModal && selectedCredential}
		<div
			class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
		>
			<div
				class="bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
			>
				<div
					class="p-8 border-b border-gray-200 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"
							>
								<QrCode class="h-6 w-6 text-white" />
							</div>
							<h2 class="text-2xl font-bold text-white">Zero-Knowledge Proof</h2>
						</div>
						<button
							onclick={() => (showProofModal = false)}
							class="text-white/80 hover:text-white transition-colors"
							aria-label="Close proof modal"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
				</div>

				<div class="p-8">
					<div class="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
						<div class="flex items-start space-x-3">
							<div
								class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0"
							>
								<Shield class="h-5 w-5 text-white" />
							</div>
							<div>
								<h3 class="font-bold text-gray-900 mb-1">Privacy-Preserving Verification</h3>
								<p class="text-sm text-gray-600">
									This zero-knowledge proof verifies your credential without revealing the
									underlying data.
								</p>
							</div>
						</div>
					</div>

					<div
						class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
					>
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-bold text-gray-900 text-lg">Proof Data</h3>
							<button
								onclick={copyProofData}
								class="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-xl transition-all font-medium text-sm"
							>
								<Copy class="h-4 w-4" />
								<span>Copy</span>
							</button>
						</div>
						<pre
							class="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap font-mono bg-gray-50 p-6 rounded-xl border border-gray-200">{proofData}</pre>
					</div>
				</div>

				<div class="p-8 border-t border-gray-200 flex justify-end">
					<button
						onclick={() => (showProofModal = false)}
						class="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white rounded-2xl shadow-xl shadow-purple-500/30 transition-all font-medium"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}
