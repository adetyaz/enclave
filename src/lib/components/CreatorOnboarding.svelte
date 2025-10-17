<script lang="ts">
	import { mocaAuth } from '$lib/services/useAirKit';
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import {
		PUBLIC_PARTNERID,
		PUBLIC_ISSUER_DID,
		PUBLIC_CREATOR_ISSUANCE_ID,
		PUBLIC_VERIFIER_DID
	} from '$env/static/public';
	import { Shield, User, Calendar, MapPin, ArrowRight, Loader2 } from '@lucide/svelte';

	let isLoading = $state(false);
	let step = $state(1);
	let totalSteps = 3;
	let credentialIssued = $state(false);

	// Creator data for credential
	let creatorData = $state({
		username: '',
		name: '',
		age: '',
		location: ''
	});

	// Available locations
	const locations = [
		'United States',
		'United Kingdom',
		'Canada',
		'Australia',
		'Germany',
		'France',
		'Japan',
		'Singapore',
		'Netherlands',
		'Other'
	];

	// Validation errors
	let errors = $state({
		username: '',
		name: '',
		age: '',
		location: ''
	});

	function validateForm() {
		errors = { username: '', name: '', age: '', location: '' };
		let isValid = true;

		if (!creatorData.username.trim()) {
			errors.username = 'Username is required';
			isValid = false;
		}

		if (!creatorData.name.trim()) {
			errors.name = 'Full name is required';
			isValid = false;
		}

		if (!creatorData.age || parseInt(creatorData.age) < 18) {
			errors.age = 'Must be 18 or older';
			isValid = false;
		}

		if (!creatorData.location) {
			errors.location = 'Location is required';
			isValid = false;
		}

		return isValid;
	}

	function nextStep() {
		step++;
	}

	function prevStep() {
		step--;
	}

	// Generate JWT for authentication (following official example pattern)
	async function generateJWT(): Promise<string> {
		if (!PUBLIC_PARTNERID) {
			throw new Error('Partner ID required for JWT generation');
		}

		try {
			const response = await fetch('/api/generate-jwt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					partnerId: PUBLIC_PARTNERID,
					operation: 'issuance'
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

	// Apply for credential issuance - Following official Moca AIR example pattern
	async function applyForIssuance() {
		if (!validateForm()) return;

		isLoading = true;
		try {
			// Generate JWT (following official example)
			const authToken = await generateJWT();

			// Initialize AIR service
			await mocaAuth.init();
			const airService = mocaAuth.getAirService();

			if (!airService) {
				throw new Error('AIR Service not initialized. Please check your partner ID.');
			}

			// Convert credential fields to match exact schema requirements
			const walletAddress = mocaAuth.userAddress;
			if (!walletAddress) {
				throw new Error('Wallet address not found - please reconnect wallet');
			}

			const credentialSubject = {
				id: `did:wallet:${walletAddress}`, // Required URI format field
				name: creatorData.name,
				location: creatorData.location,
				age: parseInt(creatorData.age),
				username: creatorData.username
			};

			// Issue credential using EXACT same pattern as official example
			console.log('Starting credential issuance with:', {
				authToken: authToken ? 'JWT present' : 'No JWT',
				credentialId: PUBLIC_CREATOR_ISSUANCE_ID,
				credentialSubject: credentialSubject,
				issuerDid: PUBLIC_ISSUER_DID
			});

			// Following official example - issueCredential returns void, success is determined by no exception
			await airService.issueCredential({
				authToken: authToken,
				credentialId: PUBLIC_CREATOR_ISSUANCE_ID,
				credentialSubject: credentialSubject,
				issuerDid: PUBLIC_ISSUER_DID
			});

			console.log('✅ Credential issuance SUCCESS - now saving to database');

			console.log('Saving profile to database for wallet:', walletAddress);
			const saveResponse = await fetch('/api/creators/profile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					walletAddress: walletAddress,
					displayName: creatorData.username,
					contentType: 'mixed',
					supportedAges: ['18+']
				})
			});

			if (!saveResponse.ok) {
				const error = await saveResponse.json();
				console.error('Database save failed:', error);
				throw new Error(`Failed to save profile: ${error.error || 'Unknown error'}`);
			}

			console.log('✅ Database save SUCCESS');

			credentialIssued = true;
			toast.success('✅ Credential issued and profile saved successfully! You are now verified.');
			nextStep();
		} catch (error) {
			console.error('Credential issuance error:', error);
			toast.error(
				`Credential issuance failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			isLoading = false;
		}
	}

	function completeOnboarding() {
		toast.success('Welcome to Enclave! Your creator account is ready.');
		goto('/creator/dashboard');
	}
</script>

<div class="max-w-4xl mx-auto p-6">
	<!-- Progress Bar -->
	<div class="mb-12">
		<div class="flex items-center justify-between mb-4">
			<span class="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
				Step {step} of {totalSteps}
			</span>
			<span class="text-sm font-medium text-gray-600">
				{Math.round((step / totalSteps) * 100)}% Complete
			</span>
		</div>
		<div
			class="w-full bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-full h-3 shadow-inner"
		>
			<div
				class="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
				style="width: {(step / totalSteps) * 100}%"
			></div>
		</div>
	</div>

	<!-- Step 1: Welcome -->
	{#if step === 1}
		<div class="grid lg:grid-cols-2 gap-8 items-center">
			<!-- Left side - Welcome content -->
			<div class="space-y-6">
				<div
					class="inline-flex w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-3xl items-center justify-center shadow-xl shadow-purple-500/30 rotate-3 hover:rotate-6 transition-transform duration-300"
				>
					<Shield class="h-10 w-10 text-white" />
				</div>
				<h1
					class="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight"
				>
					Welcome to Enclave
				</h1>
				<p class="text-xl text-gray-600 leading-relaxed">
					Join the privacy-first creator platform built on Moca Network. Get verified credentials
					for your creator journey.
				</p>

				<!-- Feature highlights -->
				<div class="grid grid-cols-2 gap-4 pt-4">
					<div class="bg-purple-50 border border-purple-100 rounded-2xl p-4">
						<div class="text-2xl mb-2">🛡️</div>
						<h3 class="font-semibold text-gray-900 text-sm mb-1">Privacy First</h3>
						<p class="text-xs text-gray-600">Zero-knowledge verification</p>
					</div>
					<div class="bg-pink-50 border border-pink-100 rounded-2xl p-4">
						<div class="text-2xl mb-2">⚡</div>
						<h3 class="font-semibold text-gray-900 text-sm mb-1">Instant Setup</h3>
						<p class="text-xs text-gray-600">Ready in minutes</p>
					</div>
				</div>
			</div>

			<!-- Right side - Action card -->
			<div
				class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 space-y-6"
			>
				<div class="space-y-3">
					<div class="inline-block bg-green-50 border border-green-200 px-4 py-2 rounded-full">
						<span class="text-sm font-medium text-green-700">✓ Quick & Easy</span>
					</div>
					<h2 class="text-3xl font-bold text-gray-900">Let's Get Started</h2>
					<p class="text-gray-600">Complete a simple 3-step process to become a verified creator</p>
				</div>

				<div class="space-y-3 pt-4">
					<div class="flex items-start gap-3">
						<div
							class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
						>
							<span class="text-sm font-bold text-purple-600">1</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">Basic Information</p>
							<p class="text-sm text-gray-500">Tell us about yourself</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div
							class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0"
						>
							<span class="text-sm font-bold text-pink-600">2</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">KYC Verification</p>
							<p class="text-sm text-gray-500">Verify your age (18+)</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div
							class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
						>
							<span class="text-sm font-bold text-blue-600">3</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">Get Credential</p>
							<p class="text-sm text-gray-500">Receive your verified badge</p>
						</div>
					</div>
				</div>

				<button
					onclick={nextStep}
					class="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 group"
				>
					<span>Get Started</span>
					<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 2: Creator Information & Credential Issuance -->
	{#if step === 2}
		<div class="grid lg:grid-cols-3 gap-6">
			<!-- Left sidebar - Info card -->
			<div class="lg:col-span-1 space-y-4">
				<div
					class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 space-y-4 sticky top-4"
				>
					<div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
						<Shield class="h-6 w-6 text-purple-600" />
					</div>
					<div>
						<h3 class="font-bold text-gray-900 mb-2">KYC Verification</h3>
						<p class="text-sm text-gray-600 leading-relaxed">
							Your information is secured with zero-knowledge proofs. Only you control your data.
						</p>
					</div>
					<div class="pt-4 border-t border-purple-200 space-y-2">
						<div class="flex items-center gap-2 text-sm text-gray-700">
							<span
								class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs"
								>✓</span
							>
							<span>Encrypted storage</span>
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-700">
							<span
								class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs"
								>✓</span
							>
							<span>Blockchain verified</span>
						</div>
						<div class="flex items-center gap-2 text-sm text-gray-700">
							<span
								class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs"
								>✓</span
							>
							<span>Privacy preserved</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Main form -->
			<div class="lg:col-span-2">
				<div
					class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 space-y-8"
				>
					<div>
						<h2 class="text-3xl font-bold text-gray-900 mb-3">Creator Information</h2>
						<p class="text-gray-600">
							Provide your details to receive a verified creator credential
						</p>
					</div>

					<div class="space-y-6">
						<!-- Username -->
						<div>
							<label
								for="username"
								class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
							>
								<div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
									<User class="h-4 w-4 text-purple-600" />
								</div>
								Username
							</label>
							<input
								id="username"
								type="text"
								bind:value={creatorData.username}
								class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
								placeholder="Choose a unique username"
								class:border-red-300={errors.username}
								class:bg-red-50={errors.username}
							/>
							{#if errors.username}
								<p class="text-red-600 text-sm mt-2 flex items-center gap-1">
									<span class="text-xs">⚠️</span>
									{errors.username}
								</p>
							{/if}
						</div>

						<!-- Full Name -->
						<div>
							<label
								for="name"
								class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
							>
								<div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
									<User class="h-4 w-4 text-pink-600" />
								</div>
								Full Name
							</label>
							<input
								id="name"
								type="text"
								bind:value={creatorData.name}
								class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
								placeholder="Enter your full name"
								class:border-red-300={errors.name}
								class:bg-red-50={errors.name}
							/>
							{#if errors.name}
								<p class="text-red-600 text-sm mt-2 flex items-center gap-1">
									<span class="text-xs">⚠️</span>
									{errors.name}
								</p>
							{/if}
						</div>

						<!-- Age -->
						<div>
							<label
								for="age"
								class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
							>
								<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<Calendar class="h-4 w-4 text-blue-600" />
								</div>
								Age (KYC Verification)
							</label>
							<input
								id="age"
								type="number"
								bind:value={creatorData.age}
								min="18"
								max="120"
								class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
								placeholder="Must be 18 or older"
								class:border-red-300={errors.age}
								class:bg-red-50={errors.age}
							/>
							{#if errors.age}
								<p class="text-red-600 text-sm mt-2 flex items-center gap-1">
									<span class="text-xs">⚠️</span>
									{errors.age}
								</p>
							{:else}
								<p class="text-gray-500 text-xs mt-2">
									✓ Age verification required for creator accounts
								</p>
							{/if}
						</div>

						<!-- Location -->
						<div>
							<label
								for="location"
								class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"
							>
								<div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
									<MapPin class="h-4 w-4 text-green-600" />
								</div>
								Location
							</label>
							<select
								id="location"
								bind:value={creatorData.location}
								class="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all appearance-none"
								class:border-red-300={errors.location}
								class:bg-red-50={errors.location}
							>
								<option value="">Select your country</option>
								{#each locations as location}
									<option value={location}>{location}</option>
								{/each}
							</select>
							{#if errors.location}
								<p class="text-red-600 text-sm mt-2 flex items-center gap-1">
									<span class="text-xs">⚠️</span>
									{errors.location}
								</p>
							{/if}
						</div>

						<!-- Creator Role Status -->
						<div
							class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
						>
							<div class="flex items-center justify-between mb-3">
								<div class="flex items-center gap-3">
									<div
										class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
									>
										<Shield class="h-5 w-5 text-purple-600" />
									</div>
									<span class="font-bold text-purple-900">Creator Credential</span>
								</div>
								{#if credentialIssued}
									<span
										class="bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1"
									>
										<span>✅</span> Verified
									</span>
								{:else}
									<span
										class="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-2 rounded-full"
									>
										Pending
									</span>
								{/if}
							</div>
							<p class="text-sm text-purple-700 leading-relaxed">
								Your credential will be issued on-chain and stored securely with zero-knowledge
								proofs, verifying you as a creator on the Enclave platform
							</p>
						</div>
					</div>

					<div class="flex gap-4 pt-4">
						<button
							onclick={prevStep}
							class="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
						>
							Back
						</button>

						{#if !credentialIssued}
							<button
								onclick={applyForIssuance}
								disabled={isLoading}
								class="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{#if isLoading}
									<Loader2 class="h-5 w-5 animate-spin" />
									<span>Issuing Credential...</span>
								{:else}
									<Shield class="h-5 w-5" />
									<span>Apply for Credential</span>
								{/if}
							</button>
						{:else}
							<button
								onclick={nextStep}
								class="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all group"
							>
								<span>Continue</span>
								<ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Step 3: Complete -->
	{#if step === 3}
		<div class="max-w-3xl mx-auto">
			<div class="text-center mb-10">
				<div
					class="inline-flex w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40 animate-bounce"
				>
					<Shield class="h-12 w-12 text-white" />
				</div>
				<h2
					class="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4"
				>
					Congratulations!
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Your creator credential has been successfully issued. You're now verified and ready to
					start creating on Enclave.
				</p>
			</div>

			<!-- Verified credentials in bento style -->
			<div class="grid md:grid-cols-2 gap-4 mb-10">
				<div
					class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
				>
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
							<Shield class="h-5 w-5 text-green-600" />
						</div>
						<h3 class="font-bold text-green-900">Creator Role</h3>
					</div>
					<p class="text-sm text-green-700 font-medium">✓ Verified & Active</p>
				</div>

				<div
					class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
				>
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
							<User class="h-5 w-5 text-purple-600" />
						</div>
						<h3 class="font-bold text-purple-900">Identity</h3>
					</div>
					<p class="text-sm text-purple-700 font-medium">{creatorData.name}</p>
				</div>

				<div
					class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6"
				>
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
							<User class="h-5 w-5 text-blue-600" />
						</div>
						<h3 class="font-bold text-blue-900">Username</h3>
					</div>
					<p class="text-sm text-blue-700 font-medium">@{creatorData.username}</p>
				</div>

				<div
					class="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-6"
				>
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
							<MapPin class="h-5 w-5 text-pink-600" />
						</div>
						<h3 class="font-bold text-pink-900">Location</h3>
					</div>
					<p class="text-sm text-pink-700 font-medium">{creatorData.location}</p>
				</div>
			</div>

			<!-- Success message -->
			<div
				class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 text-center mb-8"
			>
				<div class="inline-block bg-green-50 border border-green-200 px-6 py-3 rounded-full mb-4">
					<span class="text-sm font-semibold text-green-700">🎉 Setup Complete</span>
				</div>
				<p class="text-gray-600 mb-6">
					Your credential is secured on-chain with zero-knowledge proofs. Start minting content and
					building your audience today!
				</p>

				<button
					onclick={completeOnboarding}
					class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 inline-flex items-center gap-3 group"
				>
					<span>Go to Dashboard</span>
					<ArrowRight class="h-6 w-6 group-hover:translate-x-1 transition-transform" />
				</button>
			</div>
		</div>
	{/if}
</div>
