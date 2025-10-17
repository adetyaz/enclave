<script lang="ts">
	import { onMount } from 'svelte';
	import {
		credentialDisplayService,
		type CreatorCredentialData
	} from '$lib/services/credentialDisplayService';
	import {
		Shield,
		User,
		Calendar,
		MapPin,
		CheckCircle,
		Clock,
		XCircle,
		AlertTriangle
	} from '@lucide/svelte';

	interface Props {
		walletAddress: string;
	}

	let { walletAddress }: Props = $props();

	let loading = $state(true);
	let credentialData: CreatorCredentialData | null = $state(null);
	let verificationStatus: any = $state(null);
	let displayStatus: 'not_issued' | 'issued' | 'verified' | 'expired' | 'error' =
		$state('not_issued');
	let error = $state('');

	onMount(async () => {
		await loadCredentialData();
	});

	async function loadCredentialData() {
		try {
			loading = true;
			error = '';

			const result = await credentialDisplayService.getCredentialDisplayData(walletAddress);

			credentialData = result.credentialInfo;
			verificationStatus = result.verificationStatus;
			displayStatus = result.displayStatus;
		} catch (err) {
			console.error('Failed to load credential data:', err);
			error = 'Failed to load credential information';
		} finally {
			loading = false;
		}
	}

	async function verifyCredential() {
		try {
			loading = true;
			const result = await credentialDisplayService.verifyCreatorCredential(walletAddress);
			verificationStatus = result;

			// Update display status based on verification
			if (result.hasCredential) {
				displayStatus = result.status === 'Compliant' ? 'verified' : 'issued';
			}
		} catch (err) {
			console.error('Failed to verify credential:', err);
			error = 'Failed to verify credential';
		} finally {
			loading = false;
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'verified':
				return CheckCircle;
			case 'issued':
				return Clock;
			case 'expired':
				return XCircle;
			default:
				return AlertTriangle;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'verified':
				return 'text-green-600 bg-green-100 border-green-200';
			case 'issued':
				return 'text-blue-600 bg-blue-100 border-blue-200';
			case 'expired':
				return 'text-red-600 bg-red-100 border-red-200';
			case 'pending':
				return 'text-yellow-600 bg-yellow-100 border-yellow-200';
			default:
				return 'text-gray-600 bg-gray-100 border-gray-200';
		}
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center space-x-3">
			<Shield class="h-6 w-6 text-purple-600" />
			<h3 class="text-lg font-semibold text-gray-900">Creator Credential</h3>
		</div>

		{#if !loading}
			<button
				onclick={verifyCredential}
				class="text-sm text-purple-600 hover:text-purple-700 font-medium"
			>
				Verify Status
			</button>
		{/if}
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
			<span class="ml-3 text-gray-600">Loading credential data...</span>
		</div>
	{:else if error}
		<div class="text-center py-8">
			<AlertTriangle class="h-12 w-12 text-red-400 mx-auto mb-3" />
			<p class="text-red-600">{error}</p>
			<button
				onclick={loadCredentialData}
				class="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
			>
				Try Again
			</button>
		</div>
	{:else if displayStatus === 'not_issued'}
		<div class="text-center py-8">
			<Shield class="h-12 w-12 text-gray-400 mx-auto mb-3" />
			<h4 class="text-lg font-medium text-gray-900 mb-2">No Creator Credential</h4>
			<p class="text-gray-600 mb-4">Complete creator onboarding to get your credential.</p>
			<a
				href="/creator/onboarding"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
			>
				Start Onboarding
			</a>
		</div>
	{:else if credentialData}
		<!-- Status Badge -->
		<div class="flex items-center justify-center mb-6">
			{#if displayStatus}
				{@const StatusIcon = getStatusIcon(displayStatus)}
				<div
					class="flex items-center space-x-2 px-4 py-2 rounded-full border {getStatusColor(
						displayStatus
					)}"
				>
					<StatusIcon class="h-4 w-4" />
					<span class="text-sm font-medium capitalize">{displayStatus}</span>
				</div>
			{/if}
		</div>

		<!-- Credential Details -->
		<div class="space-y-4">
			<!-- Username/Name -->
			<div class="flex items-center space-x-3">
				<User class="h-5 w-5 text-gray-400" />
				<div>
					<p class="text-sm font-medium text-gray-900">{credentialData.name}</p>
					<p class="text-sm text-gray-600">@{credentialData.username}</p>
				</div>
			</div>

			<!-- Age -->
			<div class="flex items-center space-x-3">
				<Calendar class="h-5 w-5 text-gray-400" />
				<div>
					<p class="text-sm font-medium text-gray-900">Age Verified</p>
					<p class="text-sm text-gray-600">{credentialData.age}+ years old</p>
				</div>
			</div>

			<!-- Location -->
			<div class="flex items-center space-x-3">
				<MapPin class="h-5 w-5 text-gray-400" />
				<div>
					<p class="text-sm font-medium text-gray-900">Location</p>
					<p class="text-sm text-gray-600">{credentialData.location}</p>
				</div>
			</div>

			<!-- Issued Date -->
			<div class="flex items-center space-x-3">
				<Shield class="h-5 w-5 text-gray-400" />
				<div>
					<p class="text-sm font-medium text-gray-900">Credential Issued</p>
					<p class="text-sm text-gray-600">
						{new Date(credentialData.issuedAt).toLocaleDateString()}
					</p>
				</div>
			</div>
		</div>

		<!-- Verification Details -->
		{#if verificationStatus}
			<div class="mt-6 pt-4 border-t border-gray-200">
				<h4 class="text-sm font-medium text-gray-900 mb-3">Verification Status</h4>
				<div class="bg-gray-50 rounded-lg p-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Moca Chain Status:</span>
						<span
							class="text-sm font-medium {verificationStatus.hasCredential
								? 'text-green-600'
								: 'text-gray-600'}"
						>
							{verificationStatus.status}
						</span>
					</div>
					<div class="flex items-center justify-between mt-1">
						<span class="text-sm text-gray-600">Schema ID:</span>
						<span class="text-xs font-mono text-gray-500">{credentialData.schemaId}</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Actions -->
		<div class="mt-6 flex space-x-3">
			<button
				onclick={verifyCredential}
				class="flex-1 px-4 py-2 border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50 text-sm font-medium"
			>
				Verify on Chain
			</button>
			<button
				onclick={() => window.open('https://devnet-scan.mocachain.org/', '_blank')}
				class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
			>
				View on Explorer
			</button>
		</div>
	{/if}
</div>
