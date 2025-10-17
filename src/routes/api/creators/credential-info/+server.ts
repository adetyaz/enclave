import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url }) => {
	try {
		const walletAddress = url.searchParams.get('wallet');

		if (!walletAddress) {
			return json({ error: 'Wallet address is required' }, { status: 400 });
		}

		// Get creator profile from database
		const creatorProfile = await prisma.creatorProfile.findUnique({
			where: { walletAddress },
			include: {
				user: true
			}
		});

		if (!creatorProfile) {
			return json({ error: 'Creator credential not found' }, { status: 404 });
		}

		// Based on Moca docs, we can't directly retrieve the credential data from chain
		// So we return the metadata we stored during issuance
		const credentialInfo = {
			id: creatorProfile.mocaCredentialId || 'pending',
			// We don't store username/name in our DB, they're in Moca credential
			// So we'll need to derive or track them separately
			username: `creator_${walletAddress.slice(0, 8)}`, // Placeholder
			name: creatorProfile.user.displayName || 'Unknown',
			age: 18, // We don't store this, it's in Moca credential
			location: 'Unknown', // We don't store this, it's in Moca credential
			issuedAt: creatorProfile.createdAt.toISOString(),
			status:
				creatorProfile.verificationStatus === 'verified'
					? 'verified'
					: creatorProfile.mocaCredentialId
						? 'issued'
						: 'pending',
			schemaId: process.env.PUBLIC_CREATOR_SCHEMA_ID
		};

		console.log('Retrieved creator credential info:', {
			walletAddress,
			hasCredential: !!creatorProfile.mocaCredentialId,
			status: credentialInfo.status
		});

		return json(credentialInfo);
	} catch (error) {
		console.error('Failed to get creator credential info:', error);
		return json(
			{
				error: `Failed to retrieve credential info: ${error instanceof Error ? error.message : 'Unknown error'}`
			},
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
};
