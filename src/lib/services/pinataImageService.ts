import { PinataSDK } from 'pinata';
import { env } from '$env/dynamic/public';

export class PinataImageService {
	private pinata: PinataSDK;

	constructor() {
		this.pinata = new PinataSDK({
			pinataJwt: env.PUBLIC_PINATA_JWT!,
			pinataGateway: env.PUBLIC_PINATA_GATEWAY_URL!
		});
	}

	/**
	 * Upload an image file to Pinata IPFS
	 * @param file - Image file to upload
	 * @param metadata - Additional metadata for the image
	 * @returns Promise with IPFS hash and gateway URL
	 */
	async uploadImage(
		file: File,
		imageMetadata?: {
			creatorId?: string;
			imageType?: 'profile' | 'banner' | 'content' | 'thumbnail';
			description?: string;
		}
	): Promise<{
		ipfsHash: string;
		gatewayUrl: string;
		fileSize: number;
	}> {
		try {
			// Validate file type
			if (!this.isValidImageType(file.type)) {
				throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`);
			}

			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (file.size > maxSize) {
				throw new Error(`File too large: ${file.size} bytes. Maximum size is ${maxSize} bytes.`);
			}

			const uploadData = new FormData();
			uploadData.append('file', file);

			const pinataMetadata = JSON.stringify({
				name: `${imageMetadata?.imageType || 'image'}-${file.name}`,
				keyvalues: {
					creatorId: imageMetadata?.creatorId || '',
					imageType: imageMetadata?.imageType || 'profile',
					description: imageMetadata?.description || '',
					uploadedAt: new Date().toISOString(),
					fileType: file.type,
					originalName: file.name
				}
			});
			uploadData.append('pinataMetadata', pinataMetadata);

			const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.PINATA_JWT}`
				},
				body: uploadData
			});

			if (!response.ok) {
				throw new Error(`Pinata upload failed: ${response.statusText}`);
			}

			const uploadResult = await response.json();

			const gatewayUrl = `${process.env.PINATA_GATEWAY_URL}/ipfs/${uploadResult.IpfsHash}`;

			console.log('Image uploaded to Pinata:', {
				ipfsHash: uploadResult.IpfsHash,
				fileName: file.name,
				fileSize: file.size,
				imageMetadata
			});

			return {
				ipfsHash: uploadResult.IpfsHash,
				gatewayUrl,
				fileSize: file.size
			};
		} catch (error) {
			console.error('Pinata image upload failed:', error);
			throw new Error(
				`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	/**
	 * Get image URL from IPFS hash
	 * @param ipfsHash - IPFS hash of the image
	 * @returns Gateway URL for the image
	 */
	getImageUrl(ipfsHash: string): string {
		return `${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`;
	}

	/**
	 * Delete/unpin image from Pinata
	 * @param ipfsHash - IPFS hash to unpin
	 */
	async deleteImage(ipfsHash: string): Promise<void> {
		try {
			const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${process.env.PINATA_JWT}`
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to unpin: ${response.statusText}`);
			}

			console.log('Image unpinned from Pinata:', ipfsHash);
		} catch (error) {
			console.error('Failed to unpin image:', error);
			throw new Error(
				`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	/**
	 * Get image metadata from Pinata
	 * @param ipfsHash - IPFS hash of the image
	 * @returns Image metadata
	 */
	async getImageMetadata(ipfsHash: string) {
		try {
			const response = await fetch(
				`https://api.pinata.cloud/data/pinList?hashContains=${ipfsHash}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${process.env.PINATA_JWT}`
					}
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to get metadata: ${response.statusText}`);
			}

			const data = await response.json();
			return data.rows[0] || null;
		} catch (error) {
			console.error('Failed to get image metadata:', error);
			return null;
		}
	}

	/**
	 * Validate if file type is a supported image format
	 * @param mimeType - File MIME type
	 * @returns Boolean indicating if type is valid
	 */
	private isValidImageType(mimeType: string): boolean {
		const validTypes = [
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/webp',
			'image/gif',
			'image/svg+xml'
		];
		return validTypes.includes(mimeType);
	}

	/**
	 * Create optimized image variants (for future use)
	 * This could be expanded to create thumbnails, different sizes, etc.
	 */
	async createImageVariants(
		file: File,
		creatorId: string
	): Promise<{
		original: { ipfsHash: string; gatewayUrl: string };
		thumbnail?: { ipfsHash: string; gatewayUrl: string };
	}> {
		// Upload original
		const original = await this.uploadImage(file, {
			creatorId,
			imageType: 'profile',
			description: 'Original profile image'
		});

		// For now, just return original
		// In future, could add thumbnail generation here
		return { original };
	}
}
