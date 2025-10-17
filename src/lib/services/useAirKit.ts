import { AirService, BUILD_ENV } from '@mocanetwork/airkit';

// Using pattern from official example
const PARTNER_ID = '26d0856f-fc4e-4ae4-9f2d-7f09177b57f1'; // From your .env

// Simplified interface following the official example
interface User {
	walletAddress: string;
	isLoggedIn: boolean;
}

class MocaAuthService {
	private airService: AirService | null = null;
	private _isInitialized = false;
	private _isLoggedIn = false;
	private _userAddress: string | null = null;

	constructor() {
		// Initialize will be called separately like in the example
	}

	async init(): Promise<void> {
		if (this._isInitialized) return;

		try {
			// Initialize AirService like in the official example
			this.airService = new AirService({
				partnerId: PARTNER_ID
			});

			await this.airService.init({
				buildEnv: BUILD_ENV.SANDBOX,
				enableLogging: true,
				skipRehydration: false
			});
			this._isInitialized = true;
			console.log('Moca AIR Kit initialized successfully');
		} catch (error) {
			console.error('Failed to initialize Moca AIR Kit:', error);
			throw error;
		}
	}

	async login(): Promise<User> {
		await this.init();

		if (!this.airService) {
			throw new Error('AirService not initialized');
		}

		try {
			// Use official Moca login method following their example
			const loginResult = await this.airService.login();

			let walletAddress: string;

			// Handle wallet address using official pattern
			if (loginResult.abstractAccountAddress) {
				walletAddress = loginResult.abstractAccountAddress;
			} else {
				// Fallback to eth_accounts as shown in official example
				const accounts = await this.airService.provider.request({
					method: 'eth_accounts',
					params: []
				});
				walletAddress = Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : '';
			}

			if (!walletAddress) {
				throw new Error('No wallet address found after login');
			}

			// Update internal state
			this._isLoggedIn = true;
			this._userAddress = walletAddress;

			// Return simple user object matching official example
			return {
				walletAddress: walletAddress,
				isLoggedIn: true
			};
		} catch (error) {
			console.error('Moca login failed:', error);
			throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async getCurrentUser(): Promise<object | null> {
		await this.init();

		if (!this.airService) {
			return null;
		}

		try {
			// AIR Kit doesn't provide user profile methods
			// We can check if there are connected accounts
			const accounts = await this.airService.provider.request({
				method: 'eth_accounts',
				params: []
			});

			if (Array.isArray(accounts) && accounts.length > 0) {
				return { walletAddress: accounts[0] };
			}
			return null;
		} catch (error) {
			console.error('Failed to get current user:', error);
			return null;
		}
	}

	async isAuthenticated(): Promise<boolean> {
		await this.init();

		try {
			const profile = await this.getCurrentUser();
			return !!profile;
		} catch {
			return false;
		}
	}

	logout(): void {
		try {
			// Only cleanup if properly initialized
			if (this._isInitialized && this.airService) {
				// Don't call cleanUp() as it seems to have issues with logout
				// Just reset our initialization state
				this._isInitialized = false;
				this._isLoggedIn = false;
				this._userAddress = null;
				console.log('Moca AIR Kit logged out (local state cleared)');
			}
		} catch (error) {
			console.error('Error during logout:', error);
			// Reset initialization state
			this._isInitialized = false;
			this._isLoggedIn = false;
			this._userAddress = null;
		}
	}

	cleanup(): void {
		try {
			if (this._isInitialized && this.airService) {
				// Avoid calling cleanUp() as it can cause issues with the message service
				// Instead, just reset our internal state
				this._isInitialized = false;
				this._isLoggedIn = false;
				this._userAddress = null;
				console.log('Moca AIR Kit cleaned up (internal state reset)');
			}
		} catch (error) {
			console.error('Error during cleanup:', error);
			// Ensure we reset state even if cleanup fails
			this._isInitialized = false;
			this._isLoggedIn = false;
			this._userAddress = null;
		}
	}

	getAirService(): AirService | null {
		return this.airService;
	}

	get isLoggedIn(): boolean {
		return this._isLoggedIn;
	}

	get userAddress(): string | null {
		return this._userAddress;
	}

	get isInitialized(): boolean {
		return this._isInitialized;
	}
}

// Export singleton instance
export const mocaAuth = new MocaAuthService();
