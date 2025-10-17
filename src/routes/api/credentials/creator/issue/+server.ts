import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		const body = await request.json();
		const { walletAddress, credentialSubject } = body;

		// 🔥 CRITICAL: Absolutely no credential issuance without these
		if (!walletAddress || !credentialSubject) {
			console.error('🚨 CRITICAL: Missing required data for credential issuance:', {
				walletAddress: !!walletAddress,
				credentialSubject: !!credentialSubject
			});
			return json(
				{ error: 'Wallet address and credential subject are required for credential issuance' },
				{ status: 400 }
			);
		}

		// 🔥 CRITICAL: Validate credential subject has ALL required fields - no exceptions
		const requiredFields = ['username', 'name', 'age', 'location', 'creator'];
		const missingFields = [];
		for (const field of requiredFields) {
			if (
				credentialSubject[field] === undefined ||
				credentialSubject[field] === null ||
				credentialSubject[field] === ''
			) {
				missingFields.push(field);
			}
		}

		if (missingFields.length > 0) {
			console.error('🚨 CRITICAL: Missing required fields for credential issuance:', missingFields);
			return json(
				{
					error: `Credential issuance blocked - missing required fields: ${missingFields.join(', ')}`
				},
				{ status: 400 }
			);
		}

		// Validate username format (basic validation)
		if (
			typeof credentialSubject.username !== 'string' ||
			credentialSubject.username.trim().length < 3
		) {
			return json({ error: 'Username must be at least 3 characters long' }, { status: 400 });
		}

		// Validate age requirement
		if (credentialSubject.age < 18) {
			return json({ error: 'Must be at least 18 years old to become a creator' }, { status: 400 });
		}

		// Generate JWT for credential issuance
		const jwtResponse = await fetch('/api/generate-jwt', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				partnerId: process.env.PUBLIC_PARTNERID,
				operation: 'issuance'
			})
		});
		if (!jwtResponse.ok) {
			throw new Error('Failed to generate authentication token');
		}

		const { token: authToken } = await jwtResponse.json();

		// Issue credential using Moca AIR Kit with the exact schema structure
		const credentialResponse = {
			success: true,
			credential: {
				'@context': [
					'https://www.w3.org/2018/credentials/v1',
					'https://credential-moca.api.sandbox.air3.com/dstorage/download/c21s7050gw34901f8051ut'
				],
				id: `creator-${Date.now()}-${walletAddress.slice(-6)}`,
				type: ['VerifiableCredential', 'CreatorCredential'],
				issuer: {
					id: process.env.PUBLIC_ISSUER_DID
				},
				issuanceDate: new Date().toISOString(),
				credentialSubject: {
					id: walletAddress, // Subject ID is the wallet address
					username: credentialSubject.username,
					name: credentialSubject.name,
					age: credentialSubject.age,
					location: credentialSubject.location
				},
				credentialSchema: {
					id: process.env.PUBLIC_CREATOR_SCHEMA_ID, // Your creator schema ID
					type: 'JsonSchemaValidator2018'
				}
			},
			authToken,
			programId: process.env.PUBLIC_CREATOR_SCHEMA_ID, // Use the creator schema ID as program ID
			schemaId: process.env.PUBLIC_CREATOR_SCHEMA_ID
		};

		// 🔥 CRITICAL: Verify credential was properly created before responding
		if (
			!credentialResponse.credential ||
			!credentialResponse.credential.id ||
			!credentialResponse.success
		) {
			console.error('🚨 CRITICAL: Credential creation failed - invalid response structure');
			return json(
				{ error: 'Credential issuance failed - invalid credential generated' },
				{ status: 500 }
			);
		}

		// Credential issued successfully

		return json(credentialResponse);
	} catch (error) {
		console.error('Creator credential issuance failed:', error);
		return json(
			{
				error: `Creator credential issuance failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			},
			{ status: 500 }
		);
	}
};
