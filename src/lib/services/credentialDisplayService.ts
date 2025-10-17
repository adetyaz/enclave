import { mocaAuth } from './useAirKit';

export interface CreatorCredentialData {
	id: string;
	username: string;
	name: string;
	age: number;
	location: string;
	issuedAt: string;
	status: 'pending' | 'issued' | 'verified' | 'expired';
	schemaId: string;
}

export interface VerificationResult {
	status:
		| 'Compliant'
		| 'Non-Compliant'
		| 'Pending'
		| 'Revoking'
		| 'Revoked'
		| 'Expired'
		| 'NotFound'
		| 'error';
	transactionHash?: string;
	timestamp?: string;
	message?: string;
}

export interface CredentialVerificationResponse {
	hasCredential: boolean;
	status: string;
	verificationResult?: VerificationResult;
}

export class CredentialDisplayService {
	/**
	 * Based on Moca docs, there's no direct method to "get" credentials.
	 * Instead, we need to verify them or track them via our own database.
	 * This service provides methods to display credential information.
	 */

	/**
	 * Verify if user has a creator credential using Moca's verification flow
	 * @param walletAddress - User's wallet address
	 * @returns Verification result
	 */
	async verifyCreatorCredential(walletAddress: string): Promise<CredentialVerificationResponse> {
		// TODO: Implement actual Moca verification using walletAddress
		try {
			const airService = mocaAuth.getAirService();

			// Generate JWT for verification
			const jwtResponse = await fetch('/api/generate-jwt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					partnerId: process.env.PUBLIC_PARTNERID,
					operation: 'verification',
					walletAddress
				})
			});

			if (!jwtResponse.ok) {
				throw new Error('Failed to generate verification token');
			}

			const { token: authToken } = await jwtResponse.json();

			// Verify creator credential using Moca's verification program
			if (!airService) {
				throw new Error('AirService not available');
			}

			const verificationResult = await airService.verifyCredential({
				authToken,
				programId: process.env.PUBLIC_VERIFICATION_PROGRAM_ID!
				// Note: redirectUrl is optional for credential not found
			});
			console.log('Creator credential verification result:', verificationResult);

			return {
				hasCredential: verificationResult.status === 'Compliant',
				status: verificationResult.status,
				verificationResult
			};
		} catch (error) {
			console.error('Failed to verify creator credential:', error);
			return {
				hasCredential: false,
				status: 'error'
			};
		}
	}

	/**
	 * Get creator credential info from our database metadata
	 * Since Moca doesn't provide direct credential retrieval, we use our DB
	 * @param walletAddress - User's wallet address
	 */
	async getCreatorCredentialInfo(walletAddress: string): Promise<CreatorCredentialData | null> {
		try {
			// Get credential info from our database
			const response = await fetch(`/api/creators/credential-info?wallet=${walletAddress}`);

			if (!response.ok) {
				return null;
			}

			const credentialInfo = await response.json();
			return credentialInfo;
		} catch (error) {
			console.error('Failed to get creator credential info:', error);
			return null;
		}
	}

	/**
	 * Display credential status with verification
	 * Combines database info with Moca verification
	 * @param walletAddress - User's wallet address
	 */
	async getCredentialDisplayData(walletAddress: string): Promise<{
		credentialInfo: CreatorCredentialData | null;
		verificationStatus: CredentialVerificationResponse;
		displayStatus: 'not_issued' | 'issued' | 'verified' | 'expired' | 'error';
	}> {
		try {
			// Get both database info and verification status
			const [credentialInfo, verificationResult] = await Promise.all([
				this.getCreatorCredentialInfo(walletAddress),
				this.verifyCreatorCredential(walletAddress)
			]);

			let displayStatus: 'not_issued' | 'issued' | 'verified' | 'expired' | 'error' = 'not_issued';

			if (credentialInfo && verificationResult.hasCredential) {
				switch (verificationResult.status) {
					case 'Compliant':
						displayStatus = 'verified';
						break;
					case 'Expired':
						displayStatus = 'expired';
						break;
					default:
						displayStatus = 'issued';
				}
			} else if (credentialInfo) {
				displayStatus = 'issued';
			} else if (verificationResult.status === 'error') {
				displayStatus = 'error';
			}

			return {
				credentialInfo,
				verificationStatus: verificationResult,
				displayStatus
			};
		} catch (error) {
			console.error('Failed to get credential display data:', error);
			return {
				credentialInfo: null,
				verificationStatus: { hasCredential: false, status: 'error' },
				displayStatus: 'error'
			};
		}
	}

	/**
	 * Format credential data for display in UI
	 * @param credentialData - Raw credential data
	 */
	formatCredentialForDisplay(credentialData: CreatorCredentialData): {
		title: string;
		subtitle: string;
		fields: Array<{ label: string; value: string }>;
		statusBadge: { text: string; color: string };
	} {
		const statusColors = {
			verified: 'green',
			issued: 'blue',
			pending: 'yellow',
			expired: 'red'
		};

		return {
			title: 'Creator Credential',
			subtitle: `@${credentialData.username}`,
			fields: [
				{ label: 'Name', value: credentialData.name },
				{ label: 'Username', value: `@${credentialData.username}` },
				{ label: 'Age', value: credentialData.age.toString() },
				{ label: 'Location', value: credentialData.location },
				{ label: 'Issued', value: new Date(credentialData.issuedAt).toLocaleDateString() },
				{ label: 'Schema ID', value: credentialData.schemaId }
			],
			statusBadge: {
				text: credentialData.status.toUpperCase(),
				color: statusColors[credentialData.status] || 'gray'
			}
		};
	}
}

// Export singleton instance
export const credentialDisplayService = new CredentialDisplayService();
