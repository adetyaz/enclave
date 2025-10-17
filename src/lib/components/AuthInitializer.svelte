<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { mocaAuth } from '$lib/services/useAirKit';

	onMount(async () => {
		// Silent initialization - runs in background without UI feedback
		try {
			// Only initialize if not already initialized (prevents unnecessary reloads)
			if (!mocaAuth.isInitialized) {
				await mocaAuth.init();
				console.log('✅ Moca AIR Kit initialized successfully');
			}

			// Silently check for existing wallet connection
			const existingUser = await mocaAuth.getCurrentUser();
			if (existingUser && (existingUser as any).walletAddress) {
				console.log('✅ Existing wallet connection restored:', (existingUser as any).walletAddress);
			}
		} catch (error) {
			// Log error but don't show to user - authentication can be triggered manually
			console.warn('⚠️ AIR Kit initialization failed:', error);
			console.log('ℹ️ User can still authenticate manually via login buttons');
		}
	});

	onDestroy(() => {
		// Cleanup AIR Kit resources
		mocaAuth.cleanup();
	});
</script>

<!-- Completely silent initialization - no UI elements at all -->

<!-- 
This component is designed to be invisible and handle authentication initialization.
It can be placed in the main layout to ensure authentication is initialized app-wide.

Usage in +layout.svelte:
<AuthInitializer />

The component will:
1. Initialize Moca AIR Kit on mount
2. Check for existing authentication sessions
3. Restore user state if already authenticated
4. Handle errors gracefully without breaking the UI
-->

<!-- No styles needed for silent initialization -->
