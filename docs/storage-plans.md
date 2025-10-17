# Enclave Storage Architecture Plan

## Overview

This document outlines the comprehensive storage strategy for the Enclave privacy-first creator platform, detailing the hybrid approach combining traditional databases with decentralized storage solutions.

## Storage Architecture Decision

**Enclave uses a HYBRID STORAGE ARCHITECTURE:**

1. **PostgreSQL Database** - Operational data, fast queries, user sessions
2. **IPFS/Moca Chain Storage (MCSP)** - Content files, credentials, immutable records
3. **Smart Contracts (Moca Chain)** - Payments, subscriptions, access control

## Storage Components

### 1. Database Storage (PostgreSQL)

#### Purpose

Fast, relational storage for operational data requiring complex queries and frequent updates.

#### Technology Stack

- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Hosting:** Railway/Supabase/Vercel Postgres
- **Backup:** Automated daily backups with point-in-time recovery

#### Data Categories

**User Management:**

- User sessions and authentication tokens
- User preferences and settings
- Login history and security logs

**Creator Operations:**

- Creator profiles and bio information
- Subscription tier configurations
- Content metadata (titles, descriptions, pricing)
- Dashboard settings and customizations

**Platform Analytics:**

- Aggregated usage statistics (no PII)
- Content performance metrics
- Revenue analytics and reporting
- Platform health monitoring data

**Transactional Data:**

- Payment transaction logs
- Subscription status tracking
- Platform configuration data
- Audit logs for compliance

#### Database Schema

```sql
-- User management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('creator', 'fan')),
    display_name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Creator profiles (metadata in database - fans will have different structure)
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) UNIQUE NOT NULL, -- Used for Moca credential verification
    about TEXT, -- Creator bio/description
    content_type VARCHAR(50) NOT NULL, -- Primary content type: 'video', 'audio', 'image', 'mixed'
    supported_ages TEXT[] NOT NULL, -- Age groups they create for: ['18+', '21+', 'all-ages']
    image_ipfs VARCHAR(64), -- Profile image stored on IPFS via Pinata
    social_links JSONB DEFAULT '{}',
    verification_status VARCHAR(20) DEFAULT 'unverified',
    moca_credential_id VARCHAR(100), -- Reference to Moca credential for verification
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- NOTE: Fan profiles will have different schema structure with different fields

-- Subscription tiers
CREATE TABLE subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_moca DECIMAL(18,8) NOT NULL,
    access_rules JSONB NOT NULL, -- ZK credential requirements
    tier_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content metadata (not actual content files)
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES subscription_tiers(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'video', 'image', 'audio', 'nft'
    ipfs_hash VARCHAR(64) NOT NULL, -- Reference to IPFS content
    thumbnail_ipfs VARCHAR(64), -- IPFS hash for thumbnail
    file_size BIGINT, -- Size in bytes
    duration INTEGER, -- For video/audio content in seconds
    tags TEXT[],
    allowed_countries TEXT[], -- Array of ISO country codes for geographic restrictions
    restricted_countries TEXT[], -- Array of ISO country codes to block
    is_public BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription tracking
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fan_id UUID REFERENCES users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES subscription_tiers(id),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    transaction_hash VARCHAR(66), -- Blockchain transaction hash
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(fan_id, creator_id) -- One subscription per fan-creator pair
);

-- Analytics (aggregated, anonymized data)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    creator_id UUID REFERENCES users(id),
    content_id UUID REFERENCES content_items(id),
    tier_id UUID REFERENCES subscription_tiers(id),
    count INTEGER DEFAULT 1,
    revenue_moca DECIMAL(18,8),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    hour INTEGER, -- 0-23 for hourly analytics
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Platform configuration
CREATE TABLE platform_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Performance Optimization

```sql
-- Indexes for optimal query performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_active ON users(is_active, last_active);
CREATE INDEX idx_content_creator_tier ON content_items(creator_id, tier_id);
CREATE INDEX idx_content_type_public ON content_items(content_type, is_public);
CREATE INDEX idx_subscriptions_fan_creator ON subscriptions(fan_id, creator_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status, expires_at);
CREATE INDEX idx_analytics_date_creator ON analytics_events(date, creator_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type, date);
```

### 2. IPFS/Moca Chain Storage (MCSP Network)

#### Purpose

Decentralized, immutable storage for content files and sensitive records.

#### Technology Stack

- **Pinata:** Primary IPFS pinning service with enterprise reliability
- **IPFS:** Content addressing and distributed storage
- **Moca Chain Storage Provider Network (MCSP):** Secondary backup and Moca integration
- **CDN Integration:** Fast global content delivery via Pinata Gateway

#### Data Categories

**Content Files:**

- Video files (encrypted for gated content with geographic metadata)
- Image files (profile pictures, banners, NFTs)
- Audio files and podcasts
- Document files (PDFs, etc.)
- NFT metadata and assets
- Geographic content restrictions metadata

**Immutable Records:**

- ZK credentials and proofs
- Subscription transaction records
- Content access logs (for creator analytics)
- Platform governance decisions
- Audit trails for compliance

**Encrypted Data:**

- Private content (encrypted with access keys)
- User credential data (zero-knowledge format)
- Sensitive platform communications

#### Pinata IPFS Integration Architecture

```typescript
// src/lib/services/pinataStorage.ts
import { PinataSDK } from 'pinata';
import { encrypt, decrypt } from '$lib/crypto/encryption';

export class PinataStorageService {
	private pinata: PinataSDK;

	constructor() {
		this.pinata = new PinataSDK({
			pinataJwt: process.env.PINATA_JWT!,
			pinataGateway: process.env.PINATA_GATEWAY_URL!
		});
	}

	// Upload content with optional encryption and geographic restrictions
	async uploadContent(
		file: File,
		geoRestrictions?: {
			allowedCountries?: string[];
			restrictedCountries?: string[];
		},
		encrypt: boolean = false
	): Promise<{
		ipfsHash: string;
		encryptionKey?: string;
		fileSize: number;
	}> {
		let fileToUpload = file;
		let encryptionKey: string | undefined;

		if (encrypt) {
			const { encryptedFile, key } = await this.encryptFile(file);
			fileToUpload = encryptedFile;
			encryptionKey = key;
		}

		const result = await this.pinata.upload.file(fileToUpload, {
			metadata: {
				name: file.name,
				keyValues: {
					contentType: file.type,
					encrypted: encrypt.toString(),
					allowedCountries: metadata.allowedCountries?.join(',') || '',
					restrictedCountries: metadata.restrictedCountries?.join(',') || ''
				}
			}
		});

		// Store metadata in database
		await this.storeContentMetadata({
			ipfsHash: result.IpfsHash,
			originalName: file.name,
			contentType: file.type,
			fileSize: file.size,
			encrypted: encrypt
		});

		return {
			ipfsHash: result.IpfsHash,
			encryptionKey,
			fileSize: file.size
		};
	}

	// Retrieve content with optional decryption
	async getContent(ipfsHash: string, encryptionKey?: string): Promise<Blob> {
		const gatewayUrl = `${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`;

		const response = await fetch(gatewayUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch content: ${response.statusText}`);
		}

		const fileData = await response.arrayBuffer();

		if (encryptionKey) {
			return await this.decryptFile(new Uint8Array(fileData), encryptionKey);
		}

		return new Blob([fileData]);
	}

	// Pin content (already pinned by default with Pinata upload)
	async pinContent(ipfsHash: string): Promise<void> {
		// Pinata automatically pins uploaded content
		// Optionally pin to backup services for redundancy
		await this.pinToBackupServices(ipfsHash);
	}

	private async encryptFile(file: File): Promise<{
		encryptedFile: File;
		key: string;
	}> {
		const fileBuffer = await file.arrayBuffer();
		const { encrypted, key } = await encrypt(new Uint8Array(fileBuffer));

		return {
			encryptedFile: new File([encrypted], file.name, { type: file.type }),
			key
		};
	}

	private async decryptFile(encryptedData: Uint8Array, key: string): Promise<Blob> {
		const decrypted = await decrypt(encryptedData, key);
		return new Blob([decrypted]);
	}

	private async storeContentMetadata(metadata: any): Promise<void> {
		// Store in database for quick retrieval
		// This is handled by the database layer
	}

	private async pinToBackupServices(ipfsHash: string): Promise<void> {
		// Pin to multiple IPFS services for redundancy
		// Pinata, Web3.Storage, etc.
	}
}
```

### 3. Smart Contract Storage (Moca Chain)

#### Purpose

On-chain storage for critical transactional and governance data.

#### Data Categories

**Financial Transactions:**

- Subscription payments and refunds
- Creator revenue distribution
- Platform fee collection
- Staking and slashing records

**Access Control:**

- ZK proof verification results
- Content access permissions
- Subscription status validation
- Age verification confirmations
- Location verification and geographic restrictions

**Governance:**

- Platform parameter changes
- Creator staking amounts
- Community votes and proposals
- Platform upgrade decisions

#### Smart Contract Storage Schema

```solidity
// contracts/storage/EnclavePlatformStorage.sol
contract EnclavePlatformStorage {
    // Subscription records
    mapping(address => mapping(address => Subscription)) public subscriptions; // fan => creator => subscription

    // Content access control
    mapping(bytes32 => ContentAccess) public contentAccess; // contentId => access rules

    // Creator staking
    mapping(address => uint256) public creatorStakes;

    // Platform revenue
    uint256 public totalPlatformRevenue;
    mapping(address => uint256) public creatorRevenue;

    struct Subscription {
        uint256 tierId;
        uint256 amountPaid;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    struct ContentAccess {
        address creator;
        uint256[] requiredTiers;
        string[] requiredCredentials;
        bool ageRestricted;
        uint256 minAge;
        string[] allowedCountries;
        string[] restrictedCountries;
        bool locationRestricted;
    }
}
```

## Data Flow Architecture

### Content Upload Flow

```mermaid
sequenceDiagram
    participant Creator
    participant Frontend
    participant Database
    participant IPFS
    participant Smart_Contract
    participant Moca_Chain

    Creator->>Frontend: Upload video + metadata
    Frontend->>Frontend: Encrypt content (if gated)
    Frontend->>IPFS: Store encrypted video
    IPFS->>Frontend: Return IPFS hash
    Frontend->>Database: Store content metadata + IPFS hash
    Frontend->>Smart_Contract: Record content access rules
    Smart_Contract->>Moca_Chain: Store on-chain record
    Database->>Frontend: Confirm metadata storage
    Frontend->>Creator: Upload complete with content ID
```

### Content Access Flow

```mermaid
sequenceDiagram
    participant Fan
    participant Frontend
    participant Database
    participant Smart_Contract
    participant IPFS
    participant Moca_Chain

    Fan->>Frontend: Request protected content
    Frontend->>Database: Get content metadata
    Database->>Frontend: Return IPFS hash + access rules
    Frontend->>Smart_Contract: Verify fan credentials
    Smart_Contract->>Moca_Chain: Check ZK proofs
    Moca_Chain->>Smart_Contract: Confirm access granted
    Smart_Contract->>Frontend: Access approved
    Frontend->>IPFS: Fetch content by hash
    Frontend->>Frontend: Decrypt content (if needed)
    IPFS->>Fan: Stream decrypted content
```

### Subscription Payment Flow

```mermaid
sequenceDiagram
    participant Fan
    participant Frontend
    participant Database
    participant Smart_Contract
    participant Moca_Chain
    participant Creator

    Fan->>Frontend: Subscribe to tier
    Frontend->>Smart_Contract: Process $MOCA payment
    Smart_Contract->>Moca_Chain: Record transaction
    Smart_Contract->>Smart_Contract: Calculate fees (5%)
    Smart_Contract->>Creator: Transfer creator payout
    Smart_Contract->>Frontend: Emit subscription event
    Frontend->>Database: Update subscription status
    Database->>Frontend: Confirm update
    Frontend->>Fan: Subscription active
```

## Storage Performance & Optimization

### Database Optimization

**Connection Pooling:**

```typescript
// src/lib/database/connection.ts
import { Pool } from 'pg';

export const dbPool = new Pool({
	host: process.env.DATABASE_HOST,
	port: parseInt(process.env.DATABASE_PORT || '5432'),
	database: process.env.DATABASE_NAME,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	max: 20, // Maximum connections in pool
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000
});
```

### Environment Configuration

**Required Environment Variables:**

```bash
# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
DATABASE_HOST="ep-xxx-xxx.us-east-1.aws.neon.tech"
DATABASE_PORT="5432"
DATABASE_NAME="enclave"
DATABASE_USER="username"
DATABASE_PASSWORD="password"

# Pinata IPFS Configuration
PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
PINATA_GATEWAY_URL="https://gateway.pinata.cloud"
PINATA_API_KEY="your-pinata-api-key"
PINATA_SECRET_KEY="your-pinata-secret-key"

# Moca Network Integration
MOCA_IPFS_TOKEN="moca-ipfs-backup-token"
MOCA_STORAGE_ENDPOINT="https://ipfs.moca.network"

# Cache Configuration (Optional)
REDIS_URL="redis://localhost:6379"
```

**Query Optimization:**

```sql
-- Materialized views for analytics
CREATE MATERIALIZED VIEW creator_analytics_daily AS
SELECT
    creator_id,
    date,
    COUNT(DISTINCT fan_id) as unique_fans,
    SUM(revenue_moca) as daily_revenue,
    COUNT(*) as total_interactions
FROM analytics_events
WHERE event_type IN ('subscription', 'content_view')
GROUP BY creator_id, date;

-- Refresh materialized views daily
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY creator_analytics_daily;
END;
$$ LANGUAGE plpgsql;
```

### IPFS Optimization

**Content Delivery Network:**

```typescript
// src/lib/services/contentDelivery.ts
export class ContentDeliveryService {
	private readonly cdnEndpoints = [
		'https://gateway.pinata.cloud', // Primary Pinata gateway
		'https://ipfs.moca.network', // Secondary Moca gateway
		'https://cf-ipfs.com' // Fallback public gateway
	];

	async getOptimalGateway(ipfsHash: string): Promise<string> {
		// Test latency to each gateway
		const latencyTests = this.cdnEndpoints.map(async (endpoint) => {
			const start = Date.now();
			try {
				await fetch(`${endpoint}/ipfs/${ipfsHash}?timeout=5s`);
				return { endpoint, latency: Date.now() - start };
			} catch {
				return { endpoint, latency: Infinity };
			}
		});

		const results = await Promise.all(latencyTests);
		const fastest = results.reduce((best, current) =>
			current.latency < best.latency ? current : best
		);

		return fastest.endpoint;
	}
}
```

### Caching Strategy

**Multi-Layer Caching:**

```typescript
// src/lib/services/cacheService.ts
import Redis from 'ioredis';

export class CacheService {
	private redis = new Redis(process.env.REDIS_URL);

	// L1: In-memory cache (fastest)
	private memoryCache = new Map<string, any>();

	// L2: Redis cache (fast, persistent)
	async get(key: string): Promise<any> {
		// Check L1 cache first
		if (this.memoryCache.has(key)) {
			return this.memoryCache.get(key);
		}

		// Check L2 cache
		const cached = await this.redis.get(key);
		if (cached) {
			const data = JSON.parse(cached);
			this.memoryCache.set(key, data); // Populate L1
			return data;
		}

		return null;
	}

	async set(key: string, value: any, ttl: number = 300): Promise<void> {
		// Set in both caches
		this.memoryCache.set(key, value);
		await this.redis.setex(key, ttl, JSON.stringify(value));
	}
}
```

## Security & Privacy

### Data Encryption

**Content Encryption:**

```typescript
// src/lib/crypto/encryption.ts
import { randomBytes, createCipher, createDecipher } from 'crypto';

export async function encryptContent(content: Uint8Array): Promise<{
	encrypted: Uint8Array;
	key: string;
}> {
	const key = randomBytes(32).toString('hex');
	const cipher = createCipher('aes-256-cbc', key);

	const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);

	return {
		encrypted: new Uint8Array(encrypted),
		key
	};
}

export async function decryptContent(encrypted: Uint8Array, key: string): Promise<Uint8Array> {
	const decipher = createDecipher('aes-256-cbc', key);

	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

	return new Uint8Array(decrypted);
}
```

### Access Control

**Database Row-Level Security:**

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_isolation ON users
    FOR ALL
    TO authenticated
    USING (wallet_address = current_user_wallet());

-- Creators can only manage their own content
CREATE POLICY creator_content_access ON content_items
    FOR ALL
    TO authenticated
    USING (creator_id = current_user_id());
```

## Backup & Recovery

### Database Backup Strategy

**Automated Backups:**

```bash
#!/bin/bash
# scripts/backup-database.sh

# Full backup daily
pg_dump $DATABASE_URL | gzip > backups/enclave-$(date +%Y%m%d).sql.gz

# Point-in-time recovery setup
pg_basebackup -D /backup/base -Ft -z -P -U postgres

# Upload to cloud storage
aws s3 cp backups/ s3://enclave-backups/ --recursive
```

### IPFS Content Backup

**Multi-Provider Pinning:**

```typescript
// src/lib/services/backupService.ts
export class BackupService {
	private readonly pinningServices = [
		{ name: 'Pinata', endpoint: 'https://api.pinata.cloud', primary: true },
		{ name: 'Web3Storage', endpoint: 'https://api.web3.storage', primary: false },
		{ name: 'MocaIPFS', endpoint: 'https://ipfs.moca.network', primary: false }
	];

	async backupContent(ipfsHash: string): Promise<void> {
		// Pin content to multiple services
		const backupPromises = this.pinningServices.map((service) =>
			this.pinToService(service, ipfsHash)
		);

		await Promise.allSettled(backupPromises);
	}

	private async pinToService(service: any, ipfsHash: string): Promise<void> {
		// Implementation for each pinning service
	}
}
```

## Monitoring & Analytics

### Storage Monitoring

**Database Performance:**

```sql
-- Monitor slow queries
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Query to find slow operations
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

**IPFS Health Monitoring:**

```typescript
// src/lib/monitoring/ipfsHealth.ts
export class IPFSHealthMonitor {
	async checkHealth(): Promise<{
		status: 'healthy' | 'degraded' | 'down';
		latency: number;
		pinCount: number;
	}> {
		const start = Date.now();

		try {
			const id = await this.ipfs.id();
			const pins = await this.ipfs.pin.ls();
			const pinCount = Array.from(pins).length;

			return {
				status: 'healthy',
				latency: Date.now() - start,
				pinCount
			};
		} catch (error) {
			return {
				status: 'down',
				latency: -1,
				pinCount: 0
			};
		}
	}
}
```

## Cost Analysis

### Storage Cost Breakdown

**Database (PostgreSQL on Railway):**

- **Starter Plan:** $5/month - 1GB storage, 1GB RAM
- **Pro Plan:** $20/month - 8GB storage, 8GB RAM
- **Estimated Usage:** ~100MB for 1000 users, $5-20/month

**IPFS Storage:**

- **Pinning Services:** $0.10-0.50 per GB/month
- **Moca MCSP:** Estimated $0.05-0.20 per GB/month
- **Content Delivery:** $0.01-0.05 per GB transferred

**Smart Contract Storage:**

- **Moca Chain:** ~$0.0001 per transaction
- **Storage Fees:** Minimal for small data amounts

**Total Estimated Costs (1000 users, 10TB content):**

- Database: $20/month
- IPFS Storage: $500-2000/month
- CDN: $100-500/month
- **Total: $620-2520/month**

## Implementation Timeline

### Phase 1: Database Setup (Days 1-2)

- PostgreSQL setup and schema creation
- Prisma ORM integration
- Basic CRUD operations
- Connection pooling and optimization

### Phase 2: Pinata IPFS Integration (Days 3-4)

- Pinata SDK implementation
- Content upload with metadata
- Content encryption/decryption
- Gateway optimization and fallbacks

### Phase 3: Smart Contract Storage (Days 5-6)

- Deploy storage contracts to Moca Chain
- Integrate contract interactions
- Implement access control verification
- Test transaction recording

### Phase 4: Optimization & Monitoring (Days 7-8)

- Implement caching layers
- Set up monitoring and alerts
- Performance optimization
- Backup and recovery testing

This storage architecture provides a robust, scalable, and privacy-preserving foundation for the Enclave platform, leveraging the best aspects of both centralized and decentralized storage solutions.
