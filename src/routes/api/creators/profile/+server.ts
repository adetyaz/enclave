import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const {
			walletAddress,
			about,
			contentType,
			supportedAges,
			displayPreference,
			imageIpfs,
			mocaCredentialId,
			// We need these from Moca credentials to determine display name
			username,
			realName
		} = await request.json();

		// 🔥 CRITICAL: No database operations without valid credential ID
		if (!mocaCredentialId) {
			console.error('🚨 CRITICAL: Attempted database save without valid credential ID');
			return json(
				{ error: 'Cannot save creator profile - valid Moca credential ID required' },
				{ status: 400 }
			);
		}

		// Validate required fields
		if (!walletAddress || !about || !contentType || !supportedAges?.length || !displayPreference) {
			return json(
				{
					error:
						'Missing required fields: walletAddress, about, contentType, supportedAges, displayPreference'
				},
				{ status: 400 }
			);
		}

		// Validate contentType
		const validContentTypes = ['video', 'audio', 'image', 'mixed'];
		if (!validContentTypes.includes(contentType)) {
			return json(
				{ error: `Invalid content type. Must be one of: ${validContentTypes.join(', ')}` },
				{ status: 400 }
			);
		}

		// Validate supportedAges
		const validAges = ['all-ages', '18+', '21+'];
		const invalidAges = supportedAges.filter((age: string) => !validAges.includes(age));
		if (invalidAges.length > 0) {
			return json(
				{
					error: `Invalid age groups: ${invalidAges.join(', ')}. Must be one of: ${validAges.join(', ')}`
				},
				{ status: 400 }
			);
		}

		// Validate displayPreference
		const validDisplayPrefs = ['username', 'realname'];
		if (!validDisplayPrefs.includes(displayPreference)) {
			return json(
				{ error: `Invalid display preference. Must be one of: ${validDisplayPrefs.join(', ')}` },
				{ status: 400 }
			);
		}

		// Calculate display name based on preference
		let displayName: string;
		if (displayPreference === 'realname' && realName) {
			displayName = realName;
		} else if (username) {
			displayName = `@${username}`;
		} else {
			displayName = `creator_${walletAddress.slice(0, 8)}`;
		}

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { walletAddress }
		});

		let userId: string;

		if (existingUser) {
			userId = existingUser.id;
			// Update user type to creator if not already
			if (existingUser.userType !== 'CREATOR') {
				await prisma.user.update({
					where: { id: userId },
					data: { userType: 'CREATOR' }
				});
			}
		} else {
			// Create new user
			const newUser = await prisma.user.create({
				data: {
					walletAddress,
					userType: 'CREATOR',
					displayName: '', // Will be set from Moca credentials
					isActive: true
				}
			});
			userId = newUser.id;
		}

		// Create or update creator profile
		const creatorProfile = await prisma.creatorProfile.upsert({
			where: { walletAddress },
			create: {
				userId,
				walletAddress,
				displayName,
				displayPreference,
				about,
				contentType,
				supportedAges,
				imageIpfs: imageIpfs || null,
				mocaCredentialId: mocaCredentialId || null,
				verificationStatus: 'pending'
			},
			update: {
				displayName,
				displayPreference,
				about,
				contentType,
				supportedAges,
				imageIpfs: imageIpfs || undefined,
				mocaCredentialId: mocaCredentialId || undefined,
				verificationStatus: 'pending'
			}
		});

		// Profile saved successfully

		return json({
			success: true,
			profile: {
				id: creatorProfile.id,
				walletAddress: creatorProfile.walletAddress,
				about: creatorProfile.about,
				contentType: creatorProfile.contentType,
				supportedAges: creatorProfile.supportedAges,
				imageIpfs: creatorProfile.imageIpfs,
				verificationStatus: creatorProfile.verificationStatus,
				createdAt: creatorProfile.createdAt
			}
		});
	} catch (error) {
		console.error('Creator profile creation failed:', error);

		// Handle Prisma errors
		if (error instanceof Error) {
			if (error.message.includes('Unique constraint')) {
				return json(
					{ error: 'Creator profile already exists for this wallet address' },
					{ status: 409 }
				);
			}
		}

		return json(
			{
				error: `Creator profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			},
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
};
