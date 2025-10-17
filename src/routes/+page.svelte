<script lang="ts">
	import { mocaAuth } from '$lib/services/useAirKit';
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import {
		Shield,
		Lock,
		Zap,
		Users,
		ArrowRight,
		CheckCircle,
		Eye,
		CreditCard,
		Sparkles,
		Crown,
		TrendingUp
	} from '@lucide/svelte';

	async function handleGetStarted() {
		try {
			toast.info('Connecting to Moca wallet...');
			const user = await mocaAuth.login();
			toast.success(`Welcome to Enclave! Wallet: ${user.walletAddress.slice(0, 8)}...`);
			goto('/fan/discover');
		} catch (error) {
			console.error('Wallet connection failed:', error);
			toast.error('Failed to connect wallet. Please try again.');
		}
	}

	async function handleCreatorOnboarding() {
		// Direct navigation to creator onboarding - no wallet connection needed yet
		// The onboarding component will handle Moca authentication internally
		goto('/creator/onboarding');
	}

	const features = [
		{
			icon: Shield,
			title: 'Privacy-First',
			description:
				'Zero-knowledge proofs protect your identity while proving eligibility for content access.'
		},
		{
			icon: Lock,
			title: 'Age Verification',
			description:
				'Secure age verification without storing personal data, ensuring compliant access to age-restricted content.'
		},
		{
			icon: Zap,
			title: 'Instant Access',
			description:
				'Lightning-fast credential verification enables immediate access to premium content and subscriptions.'
		},
		{
			icon: Users,
			title: 'Creator Economy',
			description:
				'Empowering creators with new monetization models while protecting fan privacy and creator revenue.'
		}
	];

	const benefits = [
		{
			icon: Eye,
			title: 'For Fans',
			points: [
				'Browse anonymously with verified credentials',
				'Access age-restricted content securely',
				'Support creators without privacy risks',
				'One-time verification, lifetime access'
			]
		},
		{
			icon: CreditCard,
			title: 'For Creators',
			points: [
				'Monetize content with privacy-preserving subscriptions',
				'Verify subscriber eligibility without personal data',
				'Reduce chargebacks and fraud',
				'Build trust with verified audience'
			]
		}
	];
</script>

<svelte:head>
	<title>Enclave - Privacy-First Creator Platform</title>
	<meta
		name="description"
		content="The first privacy-preserving creator platform using zero-knowledge proofs for secure age verification and content access."
	/>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden"
>
	<!-- Animated Background Blobs -->
	<div
		class="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
	></div>
	<div
		class="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
	></div>
	<div
		class="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
	></div>

	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
			<div class="text-center">
				<div
					class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl border border-white/50 mb-8"
				>
					<Sparkles class="h-5 w-5 text-purple-600" />
					<span
						class="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
					>
						Powered by Zero-Knowledge Proofs
					</span>
				</div>

				<h1 class="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
					The Future of
					<br />
					<span
						class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
					>
						Creator Privacy
					</span>
				</h1>
				<p
					class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
				>
					Experience the first privacy-preserving creator platform. Access age-restricted content
					securely with zero-knowledge proofs that protect your identity while ensuring compliance.
				</p>

				<div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
					<button
						onclick={handleGetStarted}
						class="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-2xl shadow-purple-500/50 hover:-translate-y-1 text-lg"
					>
						<Sparkles class="h-6 w-6" />
						Get Started
						<ArrowRight class="h-6 w-6" />
					</button>
					<button
						onclick={handleCreatorOnboarding}
						class="bg-white/80 backdrop-blur-xl hover:bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold border-2 border-white/50 shadow-xl transition-all hover:-translate-y-1 text-lg flex items-center gap-3"
					>
						<Crown class="h-6 w-6 text-purple-600" />
						Become a Creator
					</button>
				</div>

				<!-- Trust Indicators -->
				<div class="flex flex-wrap justify-center items-center gap-6 mb-16">
					{#each [{ text: 'Zero Personal Data Storage', icon: Shield }, { text: 'Cryptographically Verified', icon: Lock }, { text: 'Instant Access', icon: Zap }, { text: 'GDPR Compliant', icon: CheckCircle }] as indicator}
						{@const IconComponent = indicator.icon}
						<div
							class="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/50"
						>
							<IconComponent class="h-5 w-5 text-green-600" />
							<span class="text-sm font-bold text-gray-700">{indicator.text}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="relative py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-5xl font-black text-gray-900 mb-6">Why Choose Enclave?</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
					The first privacy-preserving creator platform that solves the trust, privacy, and
					scalability challenges in the creator economy.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each features as feature}
					{@const IconComponent = feature.icon}
					<div
						class="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
					>
						<div
							class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
						>
							<IconComponent class="h-10 w-10 text-purple-600" />
						</div>
						<h3 class="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
						<p class="text-gray-600 leading-relaxed">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
	<section class="relative py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-5xl font-black text-gray-900 mb-6">Built for Everyone</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
					Whether you're a fan seeking privacy or a creator building trust, Enclave provides the
					tools you need.
				</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{#each benefits as benefit}
					{@const IconComponent = benefit.icon}
					<div
						class="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 hover:shadow-3xl transition-all hover:-translate-y-1"
					>
						<div class="flex items-center gap-4 mb-8">
							<div
								class="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg"
							>
								<IconComponent class="h-8 w-8 text-purple-600" />
							</div>
							<h3 class="text-3xl font-black text-gray-900">{benefit.title}</h3>
						</div>
						<ul class="space-y-4">
							{#each benefit.points as point}
								<li class="flex items-start gap-3">
									<div
										class="w-6 h-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
									>
										<CheckCircle class="h-4 w-4 text-green-600" />
									</div>
									<span class="text-gray-700 font-medium leading-relaxed">{point}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="relative py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-5xl font-black text-gray-900 mb-6">How It Works</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
					Experience seamless privacy-preserving interactions in three simple steps.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#each [{ number: '1', title: 'Verify Once', description: 'Complete a one-time age verification process using your preferred identity provider. No personal data is stored on our platform.', icon: Shield }, { number: '2', title: 'Generate Proof', description: 'Our system generates a zero-knowledge proof of your eligibility. This proof contains no personal information but validates your access rights.', icon: Lock }, { number: '3', title: 'Access Content', description: 'Browse and access age-restricted content anonymously. Creators can verify your eligibility without learning your identity.', icon: Sparkles }] as step}
					{@const IconComponent = step.icon}
					<div
						class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
					>
						<div
							class="w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50"
						>
							<span class="text-4xl font-black text-white">{step.number}</span>
						</div>
						<div
							class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4"
						>
							<IconComponent class="h-6 w-6 text-purple-600" />
						</div>
						<h3 class="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
						<p class="text-gray-600 leading-relaxed">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="relative py-24 overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"></div>
		<div
			class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"
		></div>

		<div class="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
			<div
				class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full mb-8"
			>
				<TrendingUp class="h-5 w-5 text-white" />
				<span class="text-sm font-bold text-white">Join 1,000+ Early Adopters</span>
			</div>

			<h2 class="text-5xl md:text-6xl font-black text-white mb-6">
				Ready to Experience
				<br />
				True Privacy?
			</h2>
			<p class="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
				Join the revolution in creator economy. Protect your privacy while accessing the content you
				love and supporting the creators you trust.
			</p>

			<div class="flex flex-col sm:flex-row gap-6 justify-center">
				<button
					onclick={handleGetStarted}
					class="bg-white hover:bg-gray-50 text-purple-600 px-10 py-5 rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-2xl text-lg flex items-center justify-center gap-3"
				>
					<Sparkles class="h-6 w-6" />
					Get Started Now
					<ArrowRight class="h-6 w-6" />
				</button>
				<button
					onclick={handleCreatorOnboarding}
					class="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white px-10 py-5 rounded-2xl font-bold border-2 border-white/30 transition-all hover:-translate-y-1 text-lg flex items-center justify-center gap-3"
				>
					<Crown class="h-6 w-6" />
					Become a Creator
				</button>
			</div>
		</div>
	</section>
</div>
