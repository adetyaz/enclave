<script lang="ts">
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Users, Eye, AlertTriangle, CheckCircle, Clock, Crown, Sparkles } from '@lucide/svelte';

	let loading = $state(true);
	let subscriptions = $state<any[]>([]);
	let activeTab = $state('active');
	let showCancelModal = $state(false);
	let cancellingSubscription = $state<any>(null);

	const tabs = [
		{ id: 'active', label: 'Active Subscriptions', count: 0 },
		{ id: 'pending', label: 'Pending', count: 0 },
		{ id: 'expired', label: 'Expired', count: 0 }
	];

	onMount(async () => {
		// TODO: Load subscriptions from backend API
		subscriptions = [];

		// Update tab counts
		tabs[0].count = subscriptions.filter((s: any) => s.status === 'active').length;
		tabs[1].count = subscriptions.filter((s: any) => s.status === 'pending').length;
		tabs[2].count = subscriptions.filter((s: any) => s.status === 'expired').length;

		loading = false;
	});

	function getFilteredSubscriptions() {
		return subscriptions.filter((sub) => {
			if (activeTab === 'active') return sub.status === 'active';
			if (activeTab === 'pending') return sub.status === 'pending';
			if (activeTab === 'expired') return sub.status === 'expired';
			return true;
		});
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'expired':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'active':
				return CheckCircle;
			case 'pending':
				return Clock;
			case 'expired':
				return AlertTriangle;
			default:
				return CheckCircle;
		}
	}

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getRemainingDays(endDate: string | Date) {
		const today = new Date();
		const end = new Date(endDate);
		const diffTime = end.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return Math.max(0, diffDays);
	}

	function openCancelModal(subscription: any) {
		cancellingSubscription = subscription;
		showCancelModal = true;
	}

	async function confirmCancel() {
		try {
			// TODO: Call API to cancel subscription
			const index = subscriptions.findIndex((s: any) => s.id === cancellingSubscription?.id);
			if (index !== -1) {
				subscriptions[index].status = 'expired';
				subscriptions[index].autoRenew = false;
			}

			toast.success('Subscription cancelled successfully');
			showCancelModal = false;
			cancellingSubscription = null;
		} catch (error) {
			toast.error('Failed to cancel subscription');
		}
	}

	async function toggleAutoRenew(subscription: any) {
		try {
			// TODO: Call API to update subscription settings
			subscription.autoRenew = !subscription.autoRenew;
			toast.success(subscription.autoRenew ? 'Auto-renewal enabled' : 'Auto-renewal disabled');
		} catch (error) {
			toast.error('Failed to update subscription settings');
		}
	}

	function viewCreator(walletAddress: string) {
		goto(`/creator/${walletAddress}`);
	}

	function viewContent(subscriptionId: string) {
		goto(`/fan/content?subscription=${subscriptionId}`);
	}
</script>

<svelte:head>
	<title>My Subscriptions - Fan Dashboard</title>
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
						<Crown class="h-7 w-7 text-white" />
					</div>
					<h1 class="text-4xl font-black text-gray-900 tracking-tight">My Subscriptions</h1>
				</div>
				<p class="text-gray-600 text-lg ml-[72px]">
					Manage your creator subscriptions and access exclusive content
				</p>
			</div>

			<!-- Tab Navigation -->
			<div
				class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 mb-10"
			>
				<nav class="flex space-x-2">
					{#each tabs as tab}
						<button
							onclick={() => (activeTab = tab.id)}
							class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all {activeTab ===
							tab.id
								? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
								: 'text-gray-600 hover:bg-gray-100'}"
						>
							<span>{tab.label}</span>
							{#if tab.count > 0}
								<span class="bg-white/20 text-current py-0.5 px-2.5 rounded-full text-xs font-bold">
									{tab.count}
								</span>
							{/if}
						</button>
					{/each}
				</nav>
			</div>

			<!-- Subscriptions List -->
			{#if getFilteredSubscriptions().length === 0}
				<div class="text-center py-20">
					<div
						class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
					>
						<Users class="h-12 w-12 text-purple-600" />
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-3">No {activeTab} subscriptions</h3>
					<p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
						{#if activeTab === 'active'}
							Discover and subscribe to creators to access exclusive content
						{:else if activeTab === 'pending'}
							Your pending subscriptions will appear here once payment is confirmed
						{:else}
							Your expired subscriptions are shown here for reference
						{/if}
					</p>
					{#if activeTab === 'active'}
						<button
							onclick={() => goto('/fan/discover')}
							class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-purple-500/30 hover:shadow-2xl transition-all inline-flex items-center gap-3"
						>
							<Sparkles class="h-6 w-6" />
							<span>Discover Creators</span>
						</button>
					{/if}
				</div>
				<div class="space-y-6">
					{#each getFilteredSubscriptions() as subscription}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all"
						>
							<div class="p-8">
								<!-- Subscription Header -->
								<div class="flex items-start justify-between mb-6">
									<div class="flex items-center gap-4">
										<div
											class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
										>
											<Crown class="h-8 w-8 text-white" />
										</div>
										<div>
											<h3 class="font-bold text-xl text-gray-900">
												{subscription.creator?.name || 'Creator'}
											</h3>
											<p class="text-purple-600 font-semibold">
												{subscription.tier?.name || 'Tier'} • {subscription.tier?.price || 0} $MOCA/mo
											</p>
											<span
												class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold {getStatusColor(
													subscription.status
												)} mt-2"
											>
												{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
											</span>
										</div>
									</div>

									{#if subscription.status === 'active'}
										<div class="flex items-center gap-2">
											<button
												onclick={() => viewContent(subscription.id)}
												class="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-xl transition-colors font-semibold"
											>
												<Eye class="h-5 w-5" />
												<span>View Content</span>
											</button>
										</div>
									{/if}
								</div>

								<!-- Details -->
								<div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
									<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
										<div>
											<div class="text-sm font-semibold text-gray-600 mb-1">Started</div>
											<div class="text-lg font-black text-gray-900">
												{formatDate(subscription.startDate)}
											</div>
										</div>
										<div>
											<div class="text-sm font-semibold text-gray-600 mb-1">Next Payment</div>
											<div class="text-lg font-black text-gray-900">
												{formatDate(subscription.endDate)}
											</div>
										</div>
										<div>
											<div class="text-sm font-semibold text-gray-600 mb-1">Content</div>
											<div class="text-lg font-black text-gray-900">
												{subscription.totalContent || 0} pieces
											</div>
										</div>
										<div>
											<div class="text-sm font-semibold text-gray-600 mb-1">Days Left</div>
											<div class="text-lg font-black text-gray-900">
												{getRemainingDays(subscription.endDate)}
											</div>
										</div>
									</div>
								</div>

								<!-- Actions -->
								{#if subscription.status === 'active'}
									<div class="flex items-center justify-between pt-6 border-t border-gray-200">
										<label class="flex items-center gap-3 cursor-pointer">
											<input
												type="checkbox"
												checked={subscription.autoRenew}
												onchange={() => toggleAutoRenew(subscription)}
												class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
											/>
											<span class="text-sm font-semibold text-gray-700">Auto-renewal</span>
										</label>

										<button
											onclick={() => {
												cancellingSubscription = subscription;
												showCancelModal = true;
											}}
											class="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
										>
											<AlertTriangle class="h-5 w-5" />
											<span>Cancel Subscription</span>
										</button>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Cancel Subscription Modal -->
		{#if showCancelModal && cancellingSubscription}
			<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<div class="bg-white rounded-xl max-w-md w-full">
					<div class="p-6">
						<div class="flex items-center space-x-3 mb-4">
							<div class="p-2 bg-red-100 rounded-full">
								<AlertTriangle class="h-6 w-6 text-red-600" />
							</div>
							<h3 class="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
						</div>

						<p class="text-gray-600 mb-6">
							Are you sure you want to cancel your subscription to <strong
								>{cancellingSubscription.creator.name}</strong
							>? You'll lose access to their content at the end of your current billing period.
						</p>

						<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
							<p class="text-yellow-800 text-sm">
								<strong>Note:</strong> You'll keep access until {formatDate(
									cancellingSubscription.endDate
								)}. Any ZK credentials earned will remain in your account.
							</p>
						</div>

						<div class="flex justify-end gap-4">
							<button
								onclick={() => (showCancelModal = false)}
								class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
							>
								Keep Subscription
							</button>
							<button
								onclick={confirmCancel}
								class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold"
							>
								Cancel Subscription
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
