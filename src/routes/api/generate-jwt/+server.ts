import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import {
	PUBLIC_PARTNERID,
	PUBLIC_PRIVATE_KEY,
	PUBLIC_KID,
	PUBLIC_JWT_ALGORITHM,
	PUBLIC_VERIFIER_DID
} from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { partnerId, operation, verifierDid } = await request.json();

		if (!PUBLIC_PRIVATE_KEY || !PUBLIC_PARTNERID || !PUBLIC_KID) {
			return json(
				{ error: 'Private key, Partner ID, and KID required for JWT generation' },
				{ status: 400 }
			);
		}

		// Use provided partnerId or fall back to environment variable
		const effectivePartnerId = partnerId || PUBLIC_PARTNERID;

		// JWT payload - different for verification vs issuance
		let payload;

		if (operation === 'verification') {
			// For verification, use verifier DID as issuer
			const effectiveVerifierDid = verifierDid || PUBLIC_VERIFIER_DID;
			payload = {
				partnerId: effectivePartnerId,
				iss: effectiveVerifierDid,
				aud: 'air.moca.network',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
			};
		} else {
			// For issuance, use partner ID as issuer
			payload = {
				partnerId: effectivePartnerId,
				iss: effectivePartnerId,
				aud: 'air.moca.network',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
			};
		}

		// JWT options with KID
		const jwtOptions = {
			algorithm: (PUBLIC_JWT_ALGORITHM as jwt.Algorithm) || 'RS256',
			keyid: PUBLIC_KID
		};

		// Format the private key properly for RS256
		let formattedPrivateKey = PUBLIC_PRIVATE_KEY;

		// Remove any quotes and normalize the key
		formattedPrivateKey = formattedPrivateKey.replace(/['"]/g, '').trim();

		// If it doesn't have PEM headers, add them
		if (!formattedPrivateKey.includes('-----BEGIN')) {
			// Remove all whitespace to get clean base64
			const cleanBase64 = formattedPrivateKey.replace(/\s+/g, '');
			// Split into 64-character lines and wrap in PEM format
			const base64Lines = cleanBase64.match(/.{1,64}/g) || [];
			formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${base64Lines.join('\n')}\n-----END PRIVATE KEY-----`;
		}

		// Sign the JWT with the private key
		const signedJwt = jwt.sign(payload, formattedPrivateKey, jwtOptions);

		return json({
			success: true,
			token: signedJwt,
			algorithm: jwtOptions.algorithm,
			kid: PUBLIC_KID
		});
	} catch (error) {
		console.error('JWT generation failed:', error);
		return json(
			{
				error: `JWT generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			},
			{ status: 500 }
		);
	}
};
