<script lang="ts">
	import { mocaAuth } from '$lib/services/useAirKit';
	import { toast } from '$lib/stores/toastStore';
	import {
		PUBLIC_PARTNERID,
		PUBLIC_ISSUER_DID,
		PUBLIC_ISSUANCE_PROGRAM_ID,
		PUBLIC_VERIFICATION_PROGRAM_ID,
		PUBLIC_VERIFIER_DID,
		PUBLIC_REDIRECT_URL_FOR_ISSUER,
		PUBLIC_JWT_ALGORITHM
	} from '$env/static/public';
	let isLoading = $state(false);
	let testResults = $state('');

	// Configuration from environment variables
	const testConfig = {
		// Issuance Configuration
		issuerDid: PUBLIC_ISSUER_DID || 'did:example:issuer123',
		credentialId: PUBLIC_ISSUANCE_PROGRAM_ID || 'test-issuance-program', // Using issuance program ID as credential ID

		// Verification Configuration
		verifierDid: PUBLIC_VERIFIER_DID || 'did:example:verifier123',
		programId: PUBLIC_VERIFICATION_PROGRAM_ID || 'test-verification-program',

		// General Configuration
		partnerId: PUBLIC_PARTNERID,
		redirectUrl:
			PUBLIC_REDIRECT_URL_FOR_ISSUER ||
			(typeof window !== 'undefined' ? window.location.href : '') ||
			'http://localhost:5173/credential-test',
		jwtAlgorithm: (PUBLIC_JWT_ALGORITHM as 'ES256' | 'RS256') || 'RS256'
	};

	// JWT token for authentication
	let testAuthToken = $state('');

	// Generate JWT for authentication (server-side)
	async function generateJWT(operation: 'issuance' | 'verification' = 'issuance'): Promise<string> {
		if (!testConfig.partnerId) {
			throw new Error('Partner ID required for JWT generation');
		}

		testResults += `Generating JWT with partnerId: ${testConfig.partnerId}\n`;

		try {
			const response = await fetch('/api/generate-jwt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					partnerId: testConfig.partnerId,
					operation: operation,
					verifierDid: testConfig.verifierDid
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to generate JWT');
			}

			const result = await response.json();
			testResults += `✅ JWT signed with algorithm: ${result.algorithm}, KID: ${result.kid}\n`;
			return result.token;
		} catch (error) {
			throw new Error(
				`JWT generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	async function testCredentialIssuance() {
		isLoading = true;
		testResults = 'Starting credential issuance test...\n';

		try {
			// Generate JWT if not provided
			if (!testAuthToken) {
				testResults += 'Generating authentication token...\n';
				testAuthToken = await generateJWT();
			}

			// Initialize AIR service
			await mocaAuth.init();
			const airService = mocaAuth.getAirService();

			if (!airService) {
				throw new Error('AIR Service not initialized');
			}

			// Test credential data - age and location credential
			const credentialSubject = {
				age: 25,
				location: 'New York, USA'
			};

			testResults += `Issuing credential with ID: ${testConfig.credentialId}\n`;

			// Issue credential (this will open the widget)
			await airService.issueCredential({
				authToken: testAuthToken,
				credentialId: testConfig.credentialId,
				credentialSubject: credentialSubject,
				issuerDid: testConfig.issuerDid
			});

			testResults += '✅ Credential issuance completed successfully!\n';
			toast.success('Credential issued successfully!');
		} catch (error) {
			console.error('Credential issuance failed:', error);
			testResults += `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
			toast.error('Credential issuance failed');
		} finally {
			isLoading = false;
		}
	}

	async function testCredentialVerification() {
		isLoading = true;
		testResults += '\nStarting credential verification test...\n';

		try {
			// Generate verification-specific JWT
			testResults += 'Generating verification authentication token...\n';
			const verificationToken = await generateJWT('verification');

			// Initialize AIR service
			await mocaAuth.init();
			const airService = mocaAuth.getAirService();

			if (!airService) {
				throw new Error('AIR Service not initialized');
			}

			testResults += `Verifying with program ID: ${testConfig.programId}\n`;

			// Verify credential (this will open the widget)
			const result = await airService.verifyCredential({
				authToken: verificationToken,
				programId: testConfig.programId,
				redirectUrl: testConfig.redirectUrl
			});

			testResults += `✅ Verification completed!\n`;
			testResults += `Status: ${result.status}\n`;
			testResults += `Details: ${JSON.stringify(result, null, 2)}\n`;

			toast.success(`Verification result: ${result.status}`);
		} catch (error) {
			console.error('Credential verification failed:', error);
			testResults += `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
			toast.error('Credential verification failed');
		} finally {
			isLoading = false;
		}
	}

	function clearResults() {
		testResults = '';
	}
</script>

<div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
	<h2 class="text-2xl font-bold text-gray-900 mb-6">Credential Test Suite</h2>

	<div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
		<h3 class="text-sm font-medium text-yellow-800 mb-2">Configuration Status:</h3>
		<ul class="text-sm text-gray-700 space-y-1">
			<li>• Partner ID: {testConfig.partnerId ? '✅ Configured' : '❌ Missing'}</li>
			<li>
				• Issuer DID: {testConfig.issuerDid !== 'did:example:issuer123'
					? '✅ Configured'
					: '❌ Using default'}
			</li>
			<li>
				• Credential ID: {testConfig.credentialId !== 'test-issuance-program'
					? '✅ Configured'
					: '❌ Using default'}
			</li>
			<li>
				• Verification Program ID: {testConfig.programId !== 'test-verification-program'
					? '✅ Configured'
					: '❌ Using default'}
			</li>
			<li>
				• JWT Generation: {testConfig.partnerId
					? '✅ Server-side configured'
					: '❌ Partner ID missing'}
			</li>
		</ul>
	</div>

	<div class="grid gap-4 mb-6">
		<div class="flex flex-wrap gap-4">
			<button
				onclick={testCredentialIssuance}
				disabled={isLoading}
				class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Testing...' : 'Test Credential Issuance'}
			</button>

			<button
				onclick={testCredentialVerification}
				disabled={isLoading}
				class="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? 'Testing...' : 'Test Credential Verification'}
			</button>

			<button
				onclick={clearResults}
				class="px-6 py-3 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700"
			>
				Clear Results
			</button>
		</div>
	</div>

	{#if testResults}
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-2">Test Results:</h3>
			<pre
				class="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap overflow-auto">{testResults}</pre>
		</div>
	{/if}

	<div class="grid gap-4 text-sm text-gray-600">
		<div class="p-4 bg-gray-50 rounded-md">
			<h4 class="font-medium text-gray-900 mb-2">Environment Configuration:</h4>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<ul class="space-y-1">
					<li><strong>Partner ID:</strong> {testConfig.partnerId}</li>
					<li><strong>Issuer DID:</strong> {testConfig.issuerDid}</li>
					<li><strong>Verifier DID:</strong> {testConfig.verifierDid}</li>
					<li><strong>Credential ID:</strong> {testConfig.credentialId}</li>
				</ul>
				<ul class="space-y-1">
					<li><strong>Verification Program ID:</strong> {testConfig.programId}</li>
					<li><strong>JWT Algorithm:</strong> {testConfig.jwtAlgorithm}</li>
					<li><strong>Redirect URL:</strong> {testConfig.redirectUrl}</li>
					<li>
						<strong>Auth Token:</strong>
						{testAuthToken ? '✅ Generated' : '❌ Not generated'}
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
