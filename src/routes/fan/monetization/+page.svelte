<script lang="ts">
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		Wallet,
		DollarSign,
		CreditCard,
		ArrowUpRight,
		ArrowDownLeft,
		Plus,
		CheckCircle,
		Clock,
		RefreshCw,
		Download,
		Sparkles,
		TrendingUp
	} from '@lucide/svelte';

	let loading = $state(true);
	let walletBalance = $state(0);
	let paymentMethods = $state<any[]>([]);
	let transactions = $state<any[]>([]);
	let activeTab = $state('wallet');
	let showAddPaymentModal = $state(false);
	let showTopUpModal = $state(false);

	// Add payment method form
	let newPaymentMethod = $state({
		type: 'card',
		cardNumber: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
		name: '',
		billingAddress: ''
	});

	// Top up form
	let topUpAmount = $state(50);
	let selectedPaymentMethod = $state('');

	const tabs = [
		{ id: 'wallet', label: 'Wallet', icon: Wallet },
		{ id: 'payments', label: 'Payment Methods', icon: CreditCard },
		{ id: 'transactions', label: 'Transaction History', icon: ArrowUpRight }
	];

	onMount(async () => {
		try {
			// TODO: Load wallet and payment data from API
			// const response = await fetch('/api/fan/wallet');
			// const data = await response.json();
			// walletBalance = data.balance;
			// paymentMethods = data.paymentMethods;
			// transactions = data.transactions;

			walletBalance = 0;
			paymentMethods = [];
			transactions = [];

			if (paymentMethods.length > 0) {
				selectedPaymentMethod =
					paymentMethods.find((pm) => pm.isDefault)?.id || paymentMethods[0].id;
			}
		} catch (error) {
			toast.error('Failed to load monetization data');
		}

		loading = false;
	});

	function getCardBrandIcon(brand: string) {
		const brands: { [key: string]: string } = {
			visa: '💳',
			mastercard: '💳',
			amex: '💳',
			discover: '💳'
		};
		return brands[brand] || '💳';
	}

	function getTransactionIcon(type: string) {
		switch (type) {
			case 'subscription':
				return ArrowUpRight;
			case 'top_up':
				return ArrowDownLeft;
			case 'refund':
				return RefreshCw;
			default:
				return DollarSign;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'text-green-600';
			case 'pending':
				return 'text-yellow-600';
			case 'failed':
				return 'text-red-600';
			default:
				return 'text-gray-600';
		}
	}

	function formatAmount(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(Math.abs(amount));
	}

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function resetPaymentForm() {
		newPaymentMethod = {
			type: 'card',
			cardNumber: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
			name: '',
			billingAddress: ''
		};
	}

	async function addPaymentMethod() {
		if (!newPaymentMethod.cardNumber || !newPaymentMethod.name) {
			toast.error('Please fill in all required fields');
			return;
		}

		try {
			const paymentMethod = {
				id: `pm_${Date.now()}`,
				type: 'card',
				brand: newPaymentMethod.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
				last4: newPaymentMethod.cardNumber.slice(-4),
				expiryMonth: parseInt(newPaymentMethod.expiryMonth),
				expiryYear: parseInt(newPaymentMethod.expiryYear),
				name: newPaymentMethod.name,
				isDefault: paymentMethods.length === 0,
				status: 'active'
			};

			paymentMethods.push(paymentMethod);
			toast.success('Payment method added successfully');
			showAddPaymentModal = false;
			resetPaymentForm();
		} catch (error) {
			toast.error('Failed to add payment method');
		}
	}

	async function removePaymentMethod(methodId: string) {
		try {
			paymentMethods = paymentMethods.filter((pm) => pm.id !== methodId);
			toast.success('Payment method removed');
		} catch (error) {
			toast.error('Failed to remove payment method');
		}
	}

	async function setDefaultPaymentMethod(methodId: string) {
		try {
			paymentMethods = paymentMethods.map((pm) => ({
				...pm,
				isDefault: pm.id === methodId
			}));
			toast.success('Default payment method updated');
		} catch (error) {
			toast.error('Failed to update default payment method');
		}
	}

	async function topUpWallet() {
		if (!selectedPaymentMethod) {
			toast.error('Please select a payment method');
			return;
		}

		if (topUpAmount < 10) {
			toast.error('Minimum top-up amount is $10');
			return;
		}

		try {
			// Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 1500));

			walletBalance += topUpAmount;

			// Add transaction record
			transactions.unshift({
				id: `tx_${Date.now()}`,
				type: 'top_up',
				description: `Wallet top-up via ${getPaymentMethodDisplay(selectedPaymentMethod)}`,
				amount: topUpAmount,
				status: 'completed',
				date: new Date(),
				recipient: null
			});

			toast.success(`Successfully added ${formatAmount(topUpAmount)} to your wallet`);
			showTopUpModal = false;
			topUpAmount = 50;
		} catch (error) {
			toast.error('Failed to process payment');
		}
	}

	function getPaymentMethodDisplay(methodId: string) {
		const method = paymentMethods.find((pm) => pm.id === methodId);
		return method ? `${method.brand.toUpperCase()} ****${method.last4}` : 'Unknown';
	}

	function downloadTransactionHistory() {
		const csvContent = [
			['Date', 'Type', 'Description', 'Amount', 'Status', 'Recipient'],
			...transactions.map((tx) => [
				formatDate(tx.date),
				tx.type,
				tx.description,
				tx.amount,
				tx.status,
				tx.recipient || 'N/A'
			])
		]
			.map((row) => row.join(','))
			.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'transaction-history.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast.success('Transaction history downloaded');
	}
</script>

<svelte:head>
	<title>Monetization - Fan Dashboard</title>
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
					<Wallet class="h-7 w-7 text-white" />
				</div>
				<div>
					<h1
						class="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2"
					>
						Monetization
					</h1>
					<p class="text-lg text-gray-600 ml-[72px]">
						Manage your wallet, payments, and subscriptions
					</p>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div
				class="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-2"
			>
				<nav class="flex space-x-2">
					{#each tabs as tab}
						{@const IconComponent = tab.icon}
						<button
							onclick={() => (activeTab = tab.id)}
							class="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-2xl font-medium text-sm transition-all {activeTab ===
							tab.id
								? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-xl shadow-purple-500/30'
								: 'text-gray-600 hover:bg-white/50'}"
						>
							<IconComponent class="h-5 w-5" />
							<span>{tab.label}</span>
						</button>
					{/each}
				</nav>
			</div>

			{#if activeTab === 'wallet'}
				<!-- Wallet Tab -->
				<div class="space-y-8">
					<!-- Wallet Balance Card -->
					<div
						class="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl border border-white/20"
					>
						<div class="flex items-center justify-between">
							<div>
								<div class="flex items-center space-x-3 mb-3">
									<div
										class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"
									>
										<Wallet class="h-6 w-6 text-white" />
									</div>
									<h2 class="text-2xl font-bold">MOCA Wallet</h2>
								</div>
								<div class="flex items-baseline space-x-3 mb-2">
									<span class="text-5xl font-black">{walletBalance.toFixed(2)}</span>
									<span class="text-2xl opacity-90 font-bold">$MOCA</span>
								</div>
								<p class="opacity-90 text-lg">Available for subscriptions and content</p>
							</div>
							<div class="text-right">
								<button
									onclick={() => (showTopUpModal = true)}
									class="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white px-6 py-3 rounded-2xl transition-all hover:shadow-xl font-medium flex items-center space-x-2"
								>
									<Plus class="h-5 w-5" />
									<span>Top Up</span>
								</button>
							</div>
						</div>
					</div>

					<!-- Quick Actions -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<button
							onclick={() => (showTopUpModal = true)}
							class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
						>
							<div class="flex items-center space-x-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center"
								>
									<ArrowDownLeft class="h-7 w-7 text-green-600" />
								</div>
								<div>
									<h3 class="font-bold text-gray-900">Add Funds</h3>
									<p class="text-sm text-gray-600">Top up your wallet balance</p>
								</div>
							</div>
						</button>

						<button
							onclick={() => goto('/fan/subscriptions')}
							class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
						>
							<div class="flex items-center space-x-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center"
								>
									<ArrowUpRight class="h-7 w-7 text-purple-600" />
								</div>
								<div>
									<h3 class="font-bold text-gray-900">My Subscriptions</h3>
									<p class="text-sm text-gray-600">Manage your active subscriptions</p>
								</div>
							</div>
						</button>

						<button
							onclick={() => (activeTab = 'transactions')}
							class="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1 text-left"
						>
							<div class="flex items-center space-x-4">
								<div
									class="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center"
								>
									<Clock class="h-7 w-7 text-blue-600" />
								</div>
								<div>
									<h3 class="font-bold text-gray-900">Transaction History</h3>
									<p class="text-sm text-gray-600">View your payment history</p>
								</div>
							</div>
						</button>
					</div>

					<!-- Recent Transactions Preview -->
					{#if transactions.length === 0}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 text-center py-20"
						>
							<div
								class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
							>
								<TrendingUp class="h-12 w-12 text-purple-600" />
							</div>
							<h3 class="text-2xl font-bold text-gray-900 mb-3">No transactions yet</h3>
							<p class="text-gray-600 mb-8">
								Your transaction history will appear here once you start using your wallet
							</p>
							<button
								onclick={() => (showTopUpModal = true)}
								class="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/30 transition-all hover:-translate-y-1 font-medium"
							>
								<Plus class="h-5 w-5" />
								<span>Top Up Wallet</span>
							</button>
						</div>
					{:else}
						<div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50">
							<div class="p-6 border-b border-gray-200">
								<div class="flex items-center justify-between">
									<h3 class="text-xl font-bold text-gray-900">Recent Transactions</h3>
									<button
										onclick={() => (activeTab = 'transactions')}
										class="text-purple-600 hover:text-purple-700 text-sm font-bold"
									>
										View All →
									</button>
								</div>
							</div>
							<div class="divide-y divide-gray-200">
								{#each transactions.slice(0, 3) as transaction}
									{@const IconComponent = getTransactionIcon(transaction.type)}
									<div
										class="p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors"
									>
										<div class="flex items-center space-x-4">
											<div
												class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center"
											>
												<IconComponent class="h-6 w-6 text-purple-600" />
											</div>
											<div>
												<p class="font-bold text-gray-900">{transaction.description}</p>
												<p class="text-sm text-gray-600">{formatDate(transaction.date)}</p>
											</div>
										</div>
										<div class="text-right">
											<p
												class="font-black text-lg {transaction.amount > 0
													? 'text-green-600'
													: 'text-gray-900'}"
											>
												{transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
											</p>
											<p class="text-xs font-bold {getStatusColor(transaction.status)}">
												{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
											</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'payments'}
				<!-- Payment Methods Tab -->
				<div class="space-y-8">
					<!-- Header with Add Button -->
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-2xl font-bold text-gray-900">Payment Methods</h2>
							<p class="text-gray-600 mt-1">Manage your saved payment methods</p>
						</div>
						<button
							onclick={() => (showAddPaymentModal = true)}
							class="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white px-6 py-3 rounded-2xl shadow-xl shadow-purple-500/30 transition-all hover:-translate-y-1 font-medium"
						>
							<Plus class="h-5 w-5" />
							<span>Add Payment Method</span>
						</button>
					</div>

					<!-- Payment Methods List -->
					{#if paymentMethods.length === 0}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 text-center py-20"
						>
							<div
								class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
							>
								<CreditCard class="h-12 w-12 text-purple-600" />
							</div>
							<h3 class="text-2xl font-bold text-gray-900 mb-3">No payment methods</h3>
							<p class="text-gray-600 mb-8">Add a payment method to top up your wallet</p>
							<button
								onclick={() => (showAddPaymentModal = true)}
								class="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/30 transition-all hover:-translate-y-1 font-medium"
							>
								<Plus class="h-5 w-5" />
								<span>Add Your First Payment Method</span>
							</button>
						</div>
					{:else}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							{#each paymentMethods as method}
								<div
									class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all hover:-translate-y-1"
								>
									<div class="flex items-start justify-between mb-4">
										<div class="flex items-center space-x-3">
											<div
												class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl"
											>
												{getCardBrandIcon(method.brand)}
											</div>
											<div>
												<h3 class="font-bold text-gray-900">
													{method.brand.toUpperCase()} ****{method.last4}
												</h3>
												<p class="text-sm text-gray-600">
													Expires {method.expiryMonth
														.toString()
														.padStart(2, '0')}/{method.expiryYear}
												</p>
											</div>
										</div>

										{#if method.isDefault}
											<span
												class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
											>
												<CheckCircle class="h-3 w-3 mr-1" />
												Default
											</span>
										{/if}
									</div>

									<div class="mb-4 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
										<p class="text-sm font-medium text-gray-700">
											Cardholder: <span class="font-bold">{method.name}</span>
										</p>
									</div>

									<div class="flex justify-between items-center">
										{#if !method.isDefault}
											<button
												onclick={() => setDefaultPaymentMethod(method.id)}
												class="text-purple-600 hover:text-purple-700 text-sm font-bold"
											>
												Set as Default
											</button>
										{:else}
											<span class="text-sm text-gray-500 font-medium">Primary method</span>
										{/if}

										<button
											onclick={() => removePaymentMethod(method.id)}
											class="text-red-600 hover:text-red-700 text-sm font-bold"
										>
											Remove
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{:else if activeTab === 'transactions'}
				<!-- Transactions Tab -->
				<div class="space-y-6">
					<!-- Header with Export -->
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-2xl font-bold text-gray-900">Transaction History</h2>
							<p class="text-gray-600 mt-1">View all your payment activity</p>
						</div>
						<button
							onclick={downloadTransactionHistory}
							class="flex items-center space-x-2 bg-white/80 backdrop-blur-xl hover:bg-white shadow-xl hover:shadow-2xl text-gray-700 px-6 py-3 rounded-2xl transition-all border border-white/50 font-medium"
						>
							<Download class="h-5 w-5" />
							<span>Export CSV</span>
						</button>
					</div>

					<!-- Transactions List -->
					{#if transactions.length === 0}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 text-center py-20"
						>
							<div
								class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
							>
								<TrendingUp class="h-12 w-12 text-purple-600" />
							</div>
							<h3 class="text-2xl font-bold text-gray-900 mb-3">No transactions yet</h3>
							<p class="text-gray-600">Your transaction history will appear here</p>
						</div>
					{:else}
						<div
							class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden"
						>
							<div class="divide-y divide-gray-200">
								{#each transactions as transaction}
									{@const IconComponent = getTransactionIcon(transaction.type)}
									<div
										class="p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors"
									>
										<div class="flex items-center space-x-4">
											<div
												class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center"
											>
												<IconComponent class="h-6 w-6 text-purple-600" />
											</div>
											<div>
												<p class="font-bold text-gray-900">{transaction.description}</p>
												<div class="flex items-center space-x-4 mt-1">
													<p class="text-sm text-gray-600">{formatDate(transaction.date)}</p>
													{#if transaction.recipient}
														<p class="text-sm text-gray-500">
															To: <span class="font-medium">{transaction.recipient}</span>
														</p>
													{/if}
												</div>
											</div>
										</div>
										<div class="text-right">
											<p
												class="font-black text-lg {transaction.amount > 0
													? 'text-green-600'
													: 'text-gray-900'}"
											>
												{transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
											</p>
											<p class="text-xs font-bold {getStatusColor(transaction.status)}">
												{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
											</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Add Payment Method Modal -->
	{#if showAddPaymentModal}
		<div
			class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
		>
			<div
				class="bg-white/95 backdrop-blur-xl rounded-3xl max-w-md w-full shadow-2xl border border-white/50"
			>
				<div
					class="p-8 border-b border-gray-200 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"
							>
								<CreditCard class="h-6 w-6 text-white" />
							</div>
							<h2 class="text-2xl font-bold text-white">Add Payment Method</h2>
						</div>
						<button
							onclick={() => (showAddPaymentModal = false)}
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

				<div class="p-8 space-y-5">
					<div>
						<label class="block text-sm font-bold text-gray-900 mb-2">Card Number</label>
						<input
							type="text"
							bind:value={newPaymentMethod.cardNumber}
							placeholder="1234 5678 9012 3456"
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
						/>
					</div>

					<div class="grid grid-cols-3 gap-4">
						<div>
							<label class="block text-sm font-bold text-gray-900 mb-2">Month</label>
							<select
								bind:value={newPaymentMethod.expiryMonth}
								class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
							>
								<option value="">MM</option>
								{#each Array(12) as _, i}
									<option value={i + 1}>{(i + 1).toString().padStart(2, '0')}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-900 mb-2">Year</label>
							<select
								bind:value={newPaymentMethod.expiryYear}
								class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
							>
								<option value="">YYYY</option>
								{#each Array(10) as _, i}
									<option value={2024 + i}>{2024 + i}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="block text-sm font-bold text-gray-900 mb-2">CVV</label>
							<input
								type="text"
								bind:value={newPaymentMethod.cvv}
								placeholder="123"
								maxlength="4"
								class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
							/>
						</div>
					</div>

					<div>
						<label class="block text-sm font-bold text-gray-900 mb-2">Cardholder Name</label>
						<input
							type="text"
							bind:value={newPaymentMethod.name}
							placeholder="John Doe"
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
						/>
					</div>
				</div>

				<div class="p-8 border-t border-gray-200 flex justify-end space-x-4">
					<button
						onclick={() => (showAddPaymentModal = false)}
						class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onclick={addPaymentMethod}
						class="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white rounded-2xl shadow-xl shadow-purple-500/30 transition-all font-medium"
					>
						Add Payment Method
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Top Up Modal -->
	{#if showTopUpModal}
		<div
			class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
		>
			<div
				class="bg-white/95 backdrop-blur-xl rounded-3xl max-w-md w-full shadow-2xl border border-white/50"
			>
				<div
					class="p-8 border-b border-gray-200 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div
								class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"
							>
								<Wallet class="h-6 w-6 text-white" />
							</div>
							<h2 class="text-2xl font-bold text-white">Top Up Wallet</h2>
						</div>
						<button
							onclick={() => (showTopUpModal = false)}
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

				<div class="p-8 space-y-6">
					<div>
						<label class="block text-sm font-bold text-gray-900 mb-2">Amount</label>
						<div class="relative">
							<span
								class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-bold"
								>$</span
							>
							<input
								type="number"
								bind:value={topUpAmount}
								min="10"
								max="1000"
								step="10"
								class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg font-bold"
							/>
						</div>
						<p class="text-sm text-gray-600 mt-2 font-medium">Minimum: $10, Maximum: $1,000</p>
					</div>

					<!-- Quick Amount Buttons -->
					<div class="grid grid-cols-4 gap-3">
						{#each [25, 50, 100, 200] as amount}
							<button
								onclick={() => (topUpAmount = amount)}
								class="py-3 px-3 border-2 rounded-2xl hover:shadow-lg transition-all text-sm font-bold {topUpAmount ===
								amount
									? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700'
									: 'border-gray-200 text-gray-700 hover:border-purple-300'}"
							>
								${amount}
							</button>
						{/each}
					</div>

					{#if paymentMethods.length > 0}
						<div>
							<label class="block text-sm font-bold text-gray-900 mb-2">Payment Method</label>
							<select
								bind:value={selectedPaymentMethod}
								class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
							>
								{#each paymentMethods as method}
									<option value={method.id}>
										{method.brand.toUpperCase()} ****{method.last4}
										{method.isDefault ? '(Default)' : ''}
									</option>
								{/each}
							</select>
						</div>
					{:else}
						<div
							class="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4"
						>
							<p class="text-yellow-800 text-sm font-medium mb-2">
								You need to add a payment method first.
							</p>
							<button
								onclick={() => {
									showTopUpModal = false;
									showAddPaymentModal = true;
								}}
								class="text-yellow-600 hover:text-yellow-700 text-sm font-bold"
							>
								Add Payment Method →
							</button>
						</div>
					{/if}
				</div>

				<div class="p-8 border-t border-gray-200 flex justify-end space-x-4">
					<button
						onclick={() => (showTopUpModal = false)}
						class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						onclick={topUpWallet}
						disabled={!selectedPaymentMethod || topUpAmount < 10}
						class="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white rounded-2xl shadow-xl shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						Top Up ${topUpAmount}
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}
