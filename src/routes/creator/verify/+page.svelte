<script lang="ts">
	import { mocaAuth } from '$lib/services/useAirKit';
	import { toast } from '$lib/stores/toastStore';
	import {
		PUBLIC_PARTNERID,
		PUBLIC_CREATOR_VERIFY_ID,
		PUBLIC_VERIFIER_DID,
		PUBLIC_REDIRECT_URL_FOR_ISSUER
	} from '$env/static/public';
	import {
		CheckCircle2,
		XCircle,
		Clock,
		RefreshCw,
		Ban,
		AlertCircle,
		Search,
		Shield,
		User,
		ChevronDown,
		ChevronUp
	} from '@lucide/svelte';

	// Verification state
	let isLoading = $state(false);
	let verificationResult = $state<any>(null);
	let verificationHistory = $state<any[]>([]);
	let showConfiguration = $state(false);
	let selectedFan = $state<string | null>(null);

	// Configuration from environment variables
	const verificationConfig = {
		verifierDid: PUBLIC_VERIFIER_DID || 'did:example:verifier123',
		programId: PUBLIC_CREATOR_VERIFY_ID || '',
		partnerId: PUBLIC_PARTNERID,
		redirectUrl: PUBLIC_REDIRECT_URL_FOR_ISSUER || 'http://localhost:5173/credential-test'
	};

	// Status helpers
	function getStatusColor(status: string) {
		switch (status) {
			case 'Compliant':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'Non-Compliant':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'Pending':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'Revoking':
			case 'Revoked':
				return 'bg-orange-50 border-orange-200 text-orange-800';
			case 'Expired':
				return 'bg-gray-50 border-gray-200 text-gray-800';
			case 'NotFound':
				return 'bg-purple-50 border-purple-200 text-purple-800';
			default:
				return 'bg-gray-50 border-gray-200 text-gray-800';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'Compliant':
				return CheckCircle2;
			case 'Non-Compliant':
				return XCircle;
			case 'Pending':
				return Clock;
			case 'Revoking':
				return RefreshCw;
			case 'Revoked':
				return Ban;
			case 'Expired':
			case 'NotFound':
				return AlertCircle;
			default:
				return Search;
		}
	}

	function getStatusDescription(status: string) {
		switch (status) {
			case 'Compliant':
				return 'The credential is valid and meets all verification requirements.';
			case 'Non-Compliant':
				return 'The credential does not meet the verification requirements.';
			case 'Pending':
				return 'The credential is waiting for confirmation on the blockchain.';
			case 'Revoking':
				return 'The credential is currently being revoked.';
			case 'Revoked':
				return 'The credential has been revoked and is no longer valid.';
			case 'Expired':
				return 'The credential has expired and is no longer valid.';
			case 'NotFound':
				return 'No credential was found matching the verification criteria.';
			default:
				return 'Unknown verification status.';
		}
	}

	// Generate JWT for verification
	async function generateVerificationJWT(): Promise<string> {
		if (!verificationConfig.partnerId) {
			throw new Error('Partner ID required for JWT generation');
		}

		try {
			const response = await fetch('/api/generate-jwt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					partnerId: verificationConfig.partnerId,
					operation: 'verification',
					verifierDid: verificationConfig.verifierDid
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to generate JWT');
			}

			const result = await response.json();
			return result.token;
		} catch (error) {
			throw new Error(
				`JWT generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	// Start verification process
	async function startVerification() {
		isLoading = true;
		verificationResult = null;

		try {
			// Generate JWT token
			const authToken = await generateVerificationJWT();

			// Initialize AIR service
			await mocaAuth.init();
			const airService = mocaAuth.getAirService();

			if (!airService) {
				throw new Error('AIR Service not initialized. Please connect your wallet.');
			}

			// Verify credential (opens widget)
			const result = await airService.verifyCredential({
				authToken,
				programId: verificationConfig.programId,
				redirectUrl: verificationConfig.redirectUrl
			});

			verificationResult = {
				...result,
				timestamp: new Date().toISOString(),
				fanAddress: selectedFan || 'Unknown'
			};

			// Add to history
			verificationHistory = [verificationResult, ...verificationHistory];

			toast.success(`Verification complete: ${result.status}`);
		} catch (error) {
			console.error('Credential verification failed:', error);
			toast.error(
				`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			isLoading = false;
		}
	}

	// Reset verification
	function resetVerification() {
		verificationResult = null;
		selectedFan = null;
	}

	// Check if verification is configured
	$effect(() => {
		if (!verificationConfig.programId) {
			console.warn('Verification Program ID not configured');
		}
	});
</script>

<svelte:head>
	<title>Verify Credentials - Enclave</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 relative overflow-hidden"
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

	<div class="relative container mx-auto px-4 max-w-6xl">
		<!-- Header -->
		<div class="mb-12">
			<div class="text-center mb-8">
				<div
					class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full mb-6 border border-white/50 shadow-xl"
				>
					<Shield class="h-5 w-5 text-purple-600" />
					<span
						class="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
					>
						Zero-Knowledge Verification
					</span>
				</div>

				<h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">Verify Fan Credentials</h1>
				<p class="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
					Verify fan subscriptions and credentials using zero-knowledge proofs without exposing
					sensitive data.
				</p>
			</div>
		</div>

		<!-- Main Verification Card -->
		<div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
			<!-- Configuration Status Toggle -->
			<button
				onclick={() => (showConfiguration = !showConfiguration)}
				class="w-full flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all"
			>
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
						<Shield class="h-5 w-5 text-white" />
					</div>
					<div class="text-left">
						<h3 class="font-bold text-gray-900">Configuration Status</h3>
						<p class="text-sm text-gray-600">
							{verificationConfig.programId ? '✅ Ready to verify' : '❌ Configuration required'}
						</p>
					</div>
				</div>
				{#if showConfiguration}
					<ChevronUp class="h-5 w-5 text-gray-600" />
				{:else}
					<ChevronDown class="h-5 w-5 text-gray-600" />
				{/if}
			</button>

			{#if showConfiguration}
				<div class="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
					<h4 class="font-bold text-gray-900 mb-4">Environment Configuration</h4>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-gray-600 font-medium mb-1">Verifier DID</p>
							<p class="font-mono text-xs text-gray-900 bg-white p-2 rounded border">
								{verificationConfig.verifierDid}
							</p>
						</div>
						<div>
							<p class="text-gray-600 font-medium mb-1">Program ID</p>
							<p class="font-mono text-xs text-gray-900 bg-white p-2 rounded border">
								{verificationConfig.programId || 'Not configured'}
							</p>
						</div>
						<div>
							<p class="text-gray-600 font-medium mb-1">Partner ID</p>
							<p class="font-mono text-xs text-gray-900 bg-white p-2 rounded border">
								{verificationConfig.partnerId || 'Not configured'}
							</p>
						</div>
						<div>
							<p class="text-gray-600 font-medium mb-1">Redirect URL</p>
							<p class="font-mono text-xs text-gray-900 bg-white p-2 rounded border break-all">
								{verificationConfig.redirectUrl}
							</p>
						</div>
					</div>

					{#if !verificationConfig.programId}
						<div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
							<p class="text-sm text-yellow-800">
								<strong>⚠️ Configuration Required:</strong> Set
								<code class="bg-yellow-100 px-2 py-1 rounded">PUBLIC_CREATOR_VERIFY_ID</code>
								in your environment variables to enable verification.
							</p>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Verification Form -->
			{#if !verificationResult}
				<div class="space-y-6">
					<!-- Optional: Fan Selector -->
					<div>
						<label for="fan-select" class="block text-sm font-bold text-gray-900 mb-2">
							<div class="flex items-center gap-2">
								<User class="h-4 w-4" />
								Fan to Verify (Optional)
							</div>
						</label>
						<input
							type="text"
							id="fan-select"
							bind:value={selectedFan}
							placeholder="Enter fan wallet address or leave empty for widget selection"
							class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
						/>
						<p class="text-xs text-gray-600 mt-2">
							Leave empty to let the verification widget handle fan selection
						</p>
					</div>

					<!-- Start Verification Button -->
					<button
						onclick={startVerification}
						disabled={isLoading || !verificationConfig.programId}
						class="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:-translate-y-1 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
					>
						{#if isLoading}
							<div class="flex items-center justify-center gap-3">
								<RefreshCw class="h-5 w-5 animate-spin" />
								Launching Verification Widget...
							</div>
						{:else}
							<div class="flex items-center justify-center gap-3">
								<Shield class="h-5 w-5" />
								Start Credential Verification
							</div>
						{/if}
					</button>

					<div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
						<h4 class="text-sm font-bold text-blue-900 mb-2">How Verification Works:</h4>
						<ul class="text-xs text-blue-800 space-y-1">
							<li>• Click "Start Credential Verification" to launch the secure widget</li>
							<li>• The widget will guide you through the zero-knowledge verification process</li>
							<li>• No sensitive data is exposed - only verification status is returned</li>
							<li>
								• Results show: Compliant, Non-Compliant, Pending, Revoked, Expired, or NotFound
							</li>
							<li>• All verification is done on-chain with cryptographic proofs</li>
						</ul>
					</div>
				</div>
			{:else}
				<!-- Verification Results -->
				{@const StatusIcon = getStatusIcon(verificationResult.status)}
				<div class="space-y-6">
					<div class="text-center mb-6">
						<div
							class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 {getStatusColor(
								verificationResult.status
							)}"
						>
							<StatusIcon class="h-6 w-6" />
							<span class="font-bold text-lg">{verificationResult.status}</span>
						</div>
					</div>

					<div class="p-6 bg-gray-50 rounded-2xl border border-gray-200">
						<h4 class="font-bold text-gray-900 mb-3">Verification Details</h4>
						<p class="text-sm text-gray-700 mb-4">
							{getStatusDescription(verificationResult.status)}
						</p>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<p class="text-gray-600 font-medium">Status</p>
								<p class="text-gray-900 font-bold">{verificationResult.status}</p>
							</div>
							<div>
								<p class="text-gray-600 font-medium">Timestamp</p>
								<p class="text-gray-900 font-mono text-xs">
									{new Date(verificationResult.timestamp).toLocaleString()}
								</p>
							</div>
							{#if verificationResult.fanAddress}
								<div class="md:col-span-2">
									<p class="text-gray-600 font-medium">Fan Address</p>
									<p class="text-gray-900 font-mono text-xs break-all">
										{verificationResult.fanAddress}
									</p>
								</div>
							{/if}
						</div>

						{#if Object.keys(verificationResult).length > 3}
							<details class="mt-4">
								<summary
									class="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-700"
								>
									View Raw Data
								</summary>
								<pre class="mt-2 p-3 bg-white rounded border text-xs overflow-auto">{JSON.stringify(
										verificationResult,
										null,
										2
									)}</pre>
							</details>
						{/if}
					</div>

					<button
						onclick={resetVerification}
						class="w-full px-6 py-3 border-2 border-purple-300 text-purple-700 rounded-2xl font-bold hover:bg-purple-50 transition-all"
					>
						Verify Another Credential
					</button>
				</div>
			{/if}
		</div>

		<!-- Verification History -->
		{#if verificationHistory.length > 0}
			<div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
				<h3 class="text-2xl font-black text-gray-900 mb-6">Verification History</h3>

				<div class="space-y-4">
					{#each verificationHistory as verification, index (index)}
						{#snippet iconDisplay()}
							{@const StatusIcon = getStatusIcon(verification.status)}
							<StatusIcon class="h-5 w-5" />
						{/snippet}
						<div
							class="p-4 border border-gray-200 rounded-2xl hover:border-purple-300 transition-all"
						>
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-3">
									<div
										class="w-10 h-10 rounded-xl flex items-center justify-center {getStatusColor(
											verification.status
										)}"
									>
										{@render iconDisplay()}
									</div>
									<div>
										<p class="font-bold text-gray-900">{verification.status}</p>
										<p class="text-xs text-gray-600">
											{new Date(verification.timestamp).toLocaleString()}
										</p>
									</div>
								</div>
								{#if verification.fanAddress}
									<p class="text-xs font-mono text-gray-600 truncate max-w-xs">
										{verification.fanAddress}
									</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}

	.animate-blob {
		animation: blob 7s infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
