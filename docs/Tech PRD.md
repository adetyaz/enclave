# Technical Product Requirements Document - Enclave

**Version:** 2.0  
**Last Updated:** October 19, 2025  
**Status:** Active Development

## Executive Summary

Enclave is a privacy-first data monetization platform that enables users to convert their personal data into Zero-Knowledge credentials, list them in a decentralized marketplace, and earn $MOCA tokens. This document outlines the technical architecture, implementation details, and development roadmap for building the platform on Moca Network.

## Technical Overview

### Core Technology Stack

**Frontend:**

- SvelteKit 5 (TypeScript)
- TailwindCSS for styling
- Lucide Svelte for icons
- Vite for build tooling

**Blockchain:**

- Moca Chain (EVM-compatible)
- Solidity smart contracts
- Hardhat for development

**Authentication & Credentials:**

- Moca AIR Account Services (Web3 SSO)
- Moca AIR Credential Services (zkTLS-based)
- Zero-Knowledge proof generation

**Infrastructure:**

- Vercel/Netlify for hosting
- IPFS/Arweave for decentralized storage (optional)
- The Graph for blockchain indexing

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (SvelteKit)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Dashboard  │  │  Marketplace │  │  Governance  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AIR Kit Services (Moca Network)                 │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │AIR Account   │  │AIR Credential│                        │
│  │  Service     │  │   Service    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Smart Contracts (Moca Chain)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Credential   │  │ Marketplace  │  │ Governance   │     │
│  │  Contract    │  │  Contract    │  │  Contract    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Wave 1: Core Platform with ZK Age Verification (Days 1-2)

**Objective:** Build a functional dApp on Moca Chain with Moca Login, creator age verification, subscription payments, and basic ZK-gated content for adult content creators.

### Features

- **Moca Login** (AIR Account Services) for creator/fan SSO
- **Creator age verification:** Implementing zkTLS API issues "Creator age >18" credential using zkTLS
- **Creator dashboard** (SvelteKit): Create basic tier (e.g., 10 $MOCA, requires "age >18 + Subscriber"), upload adult video
- **Fan interface** (SvelteKit): Log in, verify "age >18" (implementing zkTLS API), pay $MOCA, receive "Subscriber" credential, present ZK proof to access video
- **$MOCA payment contract** on Moca Chain (subscriptions, 5% fee)

### Technical Tasks

- **Frontend** (SvelteKit): Build `/creator/dashboard` (tier setup, video upload) and `/fan` (login, age verification, payment, content access)
- **Smart Contracts** (Solidity): Deploy `SubscriptionContract.sol` (payments, credential issuance) and `ZKVerificationContract.sol` (ZK proof verification) on Moca Chain
- **Age Verification:** Integrate implementing zkTLS API (Node.js endpoint) to issue "Creator age >18" and "Fan age >18" credentials
- **Moca Chain:** Store credentials and metadata; deploy contracts

### Deliverables

- Testnet dApp on Moca Chain with Moca Login, creator/fan interfaces, and ZK-gated video
- GitHub repo with README, SvelteKit code, Solidity contracts, and setup instructions
- 1-minute demo video: Creator verifies age, sets up tier, uploads video; fan verifies age, pays, accesses video

### Success Metrics

- Stable Moca Login and payment contract on Moca Chain
- Functional ZK age verification for creators and fans
- Demo shows basic adult content gating (e.g., "age >18 + Subscriber")

**Buildathon Fit:** Establishes core privacy and compliance for adult content, scoring high on Privacy (ZK proofs) and UX (SvelteKit).

## Wave 2: Advanced ZK Tiers & Ecosystem Integration (Days 6-10)

## Phase 1: Core Infrastructure (Weeks 1-4)

### 1.1 Authentication System

**Implementation: Moca AIR Account Services**

```typescript
// src/lib/services/mocaAuth.ts
import { AIRAccountSDK } from '@moca/air-account-sdk';

export class MocaAuthService {
	private sdk: AIRAccountSDK;

	constructor() {
		this.sdk = new AIRAccountSDK({
			partnerId: import.meta.env.PUBLIC_PARTNERID,
			environment: 'staging' // or 'production'
		});
	}

	async login(): Promise<string> {
		const { walletAddress } = await this.sdk.authenticate();
		return walletAddress;
	}

	async logout(): Promise<void> {
		await this.sdk.disconnect();
	}

	isAuthenticated(): boolean {
		return this.sdk.isConnected();
	}
}
```

**Required Environment Variables:**

```env
PUBLIC_PARTNERID=your_partner_id
AIR_ACCOUNT_API_KEY=your_api_key
```

### 1.2 Frontend Structure

**SvelteKit Routes:**

```
src/routes/
├── +layout.svelte              # Root layout with auth
├── +page.svelte                # Landing page
├── auth/
│   └── +page.svelte            # Login page
├── dashboard/
│   └── +page.svelte            # User dashboard
├── credentials/
│   ├── issue/+page.svelte      # Create credentials
│   └── [id]/+page.svelte       # Credential details
├── marketplace/
│   └── +page.svelte            # Browse marketplace
├── creator/
│   ├── dashboard/+page.svelte  # Creator dashboard
│   └── verify/+page.svelte     # Verify credentials ✅
├── vouch/
│   └── +page.svelte            # Vouching interface
└── governance/
    └── +page.svelte            # Slashing proposals
```

## Phase 2: Credential System (Weeks 5-8)

### 2.1 Credential Issuance with zkTLS

**Implementation: AIR Credential Services**

```typescript
// src/lib/services/credentialService.ts
import { AIRCredentialSDK } from '@moca/air-credential-sdk';

export class CredentialService {
	private sdk: AIRCredentialSDK;

	constructor() {
		this.sdk = new AIRCredentialSDK({
			apiKey: import.meta.env.AIR_CREDENTIAL_API_KEY,
			endpoint: import.meta.env.ZKTLS_ENDPOINT
		});
	}

	async issueCredential(params: {
		type: CredentialType;
		attributes: Record<string, any>;
	}): Promise<Credential> {
		// Generate JWT for authorization
		const authToken = await generateJWT({
			operation: 'issue',
			scope: 'issue verify'
		});

		// Issue credential via AIR SDK
		const credential = await this.sdk.issueCredential({
			authToken,
			programId: import.meta.env.PUBLIC_PROGRAM_ID,
			credentialType: params.type,
			attributes: params.attributes
		});

		return credential;
	}

	async verifyCredential(credentialId: string): Promise<VerificationResult> {
		const authToken = await generateJWT({
			operation: 'verification'
		});

		return await this.sdk.verifyCredential({
			authToken,
			credentialId,
			programId: import.meta.env.PUBLIC_CREATOR_VERIFY_ID
		});
	}
}
```

### 2.2 Supported Credential Types

**Social Profile Credentials:**

```typescript
interface SocialProfileCredential {
	type: 'Social Profile';
	platform: 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
	attributes: {
		followers: string; // e.g., ">1K"
		verified: boolean;
		accountAge: string; // e.g., ">1 year"
		engagementRate?: string;
	};
}
```

**Event Attendance Credentials:**

```typescript
interface EventAttendanceCredential {
	type: 'Event Attendance';
	eventType: 'sports' | 'concert' | 'conference' | 'meetup';
	attributes: {
		eventsAttended: string; // e.g., "5+"
		eventCategory: string;
		timeframe: string; // e.g., "last 6 months"
	};
}
```

**Wallet Activity Credentials:**

```typescript
interface WalletActivityCredential {
	type: 'Wallet Activity';
	blockchain: 'ethereum' | 'polygon' | 'moca';
	attributes: {
		balance: string; // e.g., ">$100"
		transactions: string; // e.g., "50+"
		nftCount?: string;
		defiActive: boolean;
	};
}
```

## Phase 3: Smart Contracts (Weeks 9-12)

### 3.1 CredentialContract.sol

**Purpose:** Store and manage ZK credentials on-chain

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CredentialContract {
    struct Credential {
        bytes32 id;
        address owner;
        string credentialType;
        bytes zkProof;
        uint256 issuedAt;
        uint256 expiresAt;
        bool active;
    }

    mapping(bytes32 => Credential) public credentials;
    mapping(address => bytes32[]) public userCredentials;

    event CredentialIssued(
        bytes32 indexed id,
        address indexed owner,
        string credentialType
    );

    event CredentialRevoked(bytes32 indexed id);

    function issueCredential(
        bytes32 id,
        string memory credentialType,
        bytes memory zkProof,
        uint256 expirationDuration
    ) external {
        require(credentials[id].id == bytes32(0), "Credential exists");

        credentials[id] = Credential({
            id: id,
            owner: msg.sender,
            credentialType: credentialType,
            zkProof: zkProof,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + expirationDuration,
            active: true
        });

        userCredentials[msg.sender].push(id);

        emit CredentialIssued(id, msg.sender, credentialType);
    }

    function revokeCredential(bytes32 id) external {
        require(credentials[id].owner == msg.sender, "Not owner");
        require(credentials[id].active, "Already revoked");

        credentials[id].active = false;

        emit CredentialRevoked(id);
    }

    function verifyCredential(
        bytes32 id,
        bytes memory proof
    ) external view returns (bool) {
        Credential memory cred = credentials[id];
        require(cred.active, "Credential not active");
        require(block.timestamp < cred.expiresAt, "Credential expired");

        // Verify ZK proof
        return _verifyZKProof(cred.zkProof, proof);
    }

    function _verifyZKProof(
        bytes memory storedProof,
        bytes memory providedProof
    ) internal pure returns (bool) {
        // ZK proof verification logic
        return keccak256(storedProof) == keccak256(providedProof);
    }
}
```

### 3.2 MarketplaceContract.sol

**Purpose:** Handle credential listings and purchases

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MarketplaceContract {
    struct Listing {
        bytes32 credentialId;
        address seller;
        uint256 price;
        bool publicListing;
        bool active;
        uint256 listedAt;
    }

    mapping(bytes32 => Listing) public listings;
    mapping(bytes32 => address[]) public buyers;
    mapping(bytes32 => mapping(address => bool)) public hasAccess;

    uint256 public constant PLATFORM_FEE_PERCENT = 5;
    address public platformAddress;

    event CredentialListed(
        bytes32 indexed credentialId,
        address indexed seller,
        uint256 price
    );

    event AccessPurchased(
        bytes32 indexed credentialId,
        address indexed buyer,
        uint256 price
    );

    constructor(address _platformAddress) {
        platformAddress = _platformAddress;
    }

    function listCredential(
        bytes32 credentialId,
        uint256 price,
        bool publicListing
    ) external {
        require(price > 0, "Invalid price");
        require(!listings[credentialId].active, "Already listed");

        listings[credentialId] = Listing({
            credentialId: credentialId,
            seller: msg.sender,
            price: price,
            publicListing: publicListing,
            active: true,
            listedAt: block.timestamp
        });

        emit CredentialListed(credentialId, msg.sender, price);
    }

    function buyAccess(bytes32 credentialId) external payable {
        Listing memory listing = listings[credentialId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(!hasAccess[credentialId][msg.sender], "Already has access");

        // Calculate fees
        uint256 platformFee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerAmount = msg.value - platformFee;

        // Transfer funds
        payable(listing.seller).transfer(sellerAmount);
        payable(platformAddress).transfer(platformFee);

        // Grant access
        buyers[credentialId].push(msg.sender);
        hasAccess[credentialId][msg.sender] = true;

        emit AccessPurchased(credentialId, msg.sender, msg.value);
    }

    function revokeAccess(bytes32 credentialId, address buyer) external {
        require(listings[credentialId].seller == msg.sender, "Not seller");
        hasAccess[credentialId][buyer] = false;
    }
}
```

### 3.3 GovernanceContract.sol

**Purpose:** Implement vouching and slashing mechanisms

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GovernanceContract {
    struct Vouch {
        address voucher;
        bytes32 credentialId;
        uint256 amount;
        uint256 vouchedAt;
    }

    struct SlashProposal {
        address proposer;
        bytes32 credentialId;
        string reason;
        bool active;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 totalVotingPower;
        uint256 deadline;
    }

    mapping(bytes32 => Vouch[]) public vouchesForCredential;
    mapping(uint256 => SlashProposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256) public reputation;

    uint256 public proposalCount;
    uint256 public constant VOUCH_MINIMUM = 3 ether; // 3 $MOCA
    uint256 public constant SLASH_PENALTY_PERCENT = 10;
    uint256 public constant VOTING_PERIOD = 24 hours;

    event Vouched(
        bytes32 indexed credentialId,
        address voucher,
        uint256 amount
    );

    event SlashProposed(
        uint256 indexed proposalId,
        bytes32 credentialId,
        string reason
    );

    function vouch(bytes32 credentialId) external payable {
        require(msg.value >= VOUCH_MINIMUM, "Minimum 3 MOCA required");

        vouchesForCredential[credentialId].push(Vouch({
            voucher: msg.sender,
            credentialId: credentialId,
            amount: msg.value,
            vouchedAt: block.timestamp
        }));

        reputation[msg.sender] += 10; // Gain reputation

        emit Vouched(credentialId, msg.sender, msg.value);
    }

    function proposeSlash(
        bytes32 credentialId,
        string memory reason
    ) external payable {
        require(msg.value >= 0.1 ether, "Proposal fee required");

        proposals[proposalCount] = SlashProposal({
            proposer: msg.sender,
            credentialId: credentialId,
            reason: reason,
            active: true,
            votesFor: 0,
            votesAgainst: 0,
            totalVotingPower: 0,
            deadline: block.timestamp + VOTING_PERIOD
        });

        emit SlashProposed(proposalCount, credentialId, reason);
        proposalCount++;
    }

    function voteSlash(uint256 proposalId, bool support) external {
        SlashProposal storage proposal = proposals[proposalId];
        require(proposal.active, "Proposal not active");
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 votingWeight = _calculateVotingWeight(msg.sender);

        if (support) {
            proposal.votesFor += votingWeight;
        } else {
            proposal.votesAgainst += votingWeight;
        }

        proposal.totalVotingPower += votingWeight;
        hasVoted[proposalId][msg.sender] = true;
    }

    function executeSlash(uint256 proposalId) external {
        SlashProposal storage proposal = proposals[proposalId];
        require(proposal.active, "Already executed");
        require(block.timestamp >= proposal.deadline, "Voting ongoing");
        require(
            proposal.votesFor * 100 > proposal.totalVotingPower * 50,
            "Insufficient support"
        );

        // Slash 10% from all vouchers
        Vouch[] storage vouches = vouchesForCredential[proposal.credentialId];
        for (uint i = 0; i < vouches.length; i++) {
            uint256 penalty = (vouches[i].amount * SLASH_PENALTY_PERCENT) / 100;

            // Distribute penalty
            payable(proposal.proposer).transfer(penalty / 2);
            payable(address(this)).transfer(penalty / 2);

            vouches[i].amount -= penalty;
            reputation[vouches[i].voucher] -= 50; // Penalty to reputation
        }

        proposal.active = false;
    }

    function _calculateVotingWeight(address voter)
        internal view returns (uint256)
    {
        uint256 baseWeight = 1;
        uint256 reputationBonus = reputation[voter] / 100; // +1 per 100 rep
        return baseWeight + reputationBonus;
    }
}
```

## Phase 4: Testing & Deployment

### 4.1 Unit Testing (Hardhat)

```javascript
// test/CredentialContract.test.js
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CredentialContract', function () {
	let contract;
	let owner, user1;

	beforeEach(async function () {
		[owner, user1] = await ethers.getSigners();

		const CredentialContract = await ethers.getContractFactory('CredentialContract');
		contract = await CredentialContract.deploy();
	});

	it('Should issue a credential', async function () {
		const credentialId = ethers.utils.id('test-credential');
		const zkProof = ethers.utils.toUtf8Bytes('proof-data');

		await contract.issueCredential(
			credentialId,
			'Social Profile',
			zkProof,
			86400 // 1 day expiration
		);

		const credential = await contract.credentials(credentialId);
		expect(credential.active).to.be.true;
	});

	it('Should revoke a credential', async function () {
		const credentialId = ethers.utils.id('test-credential');
		const zkProof = ethers.utils.toUtf8Bytes('proof-data');

		await contract.issueCredential(credentialId, 'Social Profile', zkProof, 86400);
		await contract.revokeCredential(credentialId);

		const credential = await contract.credentials(credentialId);
		expect(credential.active).to.be.false;
	});
});
```

### 4.2 Integration Testing (Playwright)

```typescript
// e2e/marketplace.spec.ts
import { test, expect } from '@playwright/test';

test('complete marketplace flow', async ({ page }) => {
	// Login
	await page.goto('/auth');
	await page.click('button:has-text("Connect Wallet")');

	// Create credential
	await page.goto('/credentials/issue');
	await page.selectOption('select[name="type"]', 'Social Profile');
	await page.fill('input[name="followers"]', '>1K');
	await page.click('button:has-text("Issue Credential")');

	// Wait for success
	await expect(page.locator('text=Credential issued')).toBeVisible();

	// List in marketplace
	await page.click('button:has-text("List in Marketplace")');
	await page.fill('input[name="price"]', '2');
	await page.click('button:has-text("List")');

	// Verify listing
	await page.goto('/marketplace');
	await expect(page.locator('text=Social Profile')).toBeVisible();
});
```

### 4.3 Deployment Process

**Step 1: Deploy to Moca Testnet**

```bash
# Compile contracts
npx hardhat compile

# Deploy contracts
npx hardhat run scripts/deploy.js --network moca-testnet

# Verify contracts
npx hardhat verify --network moca-testnet DEPLOYED_CONTRACT_ADDRESS
```

**Step 2: Configure Frontend**

```env
# Production environment variables
PUBLIC_CREATOR_VERIFY_ID=prod_program_id
PUBLIC_PARTNERID=production_partner_id
CREDENTIAL_CONTRACT=0x...
MARKETPLACE_CONTRACT=0x...
GOVERNANCE_CONTRACT=0x...
```

**Step 3: Deploy Frontend**

```bash
# Build production bundle
npm run build

# Deploy to Vercel/Netlify
vercel deploy --prod
```

## Performance Requirements

### Frontend Performance

- **Page Load Time**: <2 seconds
- **Time to Interactive**: <3 seconds
- **Lighthouse Score**: >90

### Smart Contract Performance

- **Gas Optimization**: <500k gas per transaction
- **Transaction Time**: <30 seconds on Moca Chain

### API Response Times

- **Authentication**: <1 second
- **Credential Issuance**: <5 seconds
- **Marketplace Queries**: <500ms

## Security Requirements

### Smart Contract Security

- [ ] OpenZeppelin security audits
- [ ] Reentrancy protection
- [ ] Access control modifiers
- [ ] Input validation
- [ ] Emergency pause mechanism

### Frontend Security

- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Secure session management
- [ ] Rate limiting

### Privacy Requirements

- [ ] Zero-knowledge proofs for all credentials
- [ ] No raw data storage on-chain
- [ ] Encrypted client-side storage
- [ ] GDPR compliance
- [ ] User data deletion capability

## Monitoring & Analytics

### Application Monitoring

- **Error Tracking**: Sentry integration
- **Performance**: Web Vitals tracking
- **User Analytics**: Privacy-first analytics (Plausible)

### Blockchain Monitoring

- **Event Listeners**: Track contract events
- **Gas Usage**: Monitor transaction costs
- **Success Rates**: Track transaction success/failure

## Documentation Requirements

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Smart contract documentation (NatSpec)
- [ ] User guides and tutorials
- [ ] Developer setup instructions
- [ ] Architecture diagrams
- [ ] Security audit reports

---

**Version**: 2.0  
**Last Updated**: October 19, 2025  
**Status**: Active Development

### Features

- **Advanced tiered access:** Add Premium tier (e.g., 20 $MOCA, requires "age >21 + Premium Subscriber") for adult content
- **Geographic content controls:** Location-based access restrictions with ZK location proofs for compliance
- **Fan age verification:** Support "age >21" credential via implementing zkTLS API
- **Location verification:** ZK-based location proofs for region-restricted content without IP exposure
- **Anti-fraud:** Creators stake $MOCA to publish tiers, slashed for non-compliant content (e.g., underage access)
- **Iframe plugin:** Embed Enclave in Animoca apps (e.g., OneFootball, The Sandbox)
- **Ecosystem integration:** Verify "Mocaverse NFT Holder" or "OneFootball Fan" credentials for loyalty perks
- **Data monetization:** Fans opt-in to share anonymized proofs (e.g., "adult content fan") for $MOCA rewards

### Technical Tasks

- **Frontend** (SvelteKit): Update dashboard to support multiple tiers (Basic, Premium); add iframe component
- **Smart Contracts:** Enhance `SubscriptionContract.sol` for Premium tiers; add `GovernanceContract.sol` for $MOCA staking/slashing
- **ZK Verification:** Extend `ZKVerificationContract.sol` to handle "age >21 + Premium Subscriber" proofs
- **Ecosystem APIs:** Integrate Mocaverse NFT ownership check (e.g., via Animoca API) and OneFootball fan status
- **Moca Chain:** Store advanced credentials and metadata; ensure cross-chain portability

### Deliverables

- Testnet dApp on Moca Chain with advanced tiers, iframe, and ecosystem integrations
- Updated GitHub repo with new contracts, SvelteKit updates, and AIR Kit notes
- 2-minute demo video: Creator verifies "age >18", sets Premium tier; fan verifies "age >21", pays, proves ZK credential, accesses adult video; iframe shown in mock Animoca app
- Live Moca Chain demo link

### Success Metrics

- Stable advanced ZK verification (e.g., "age >21 + Premium Subscriber")
- Functional iframe and Mocaverse/OneFootball integrations
- Demo scores high on Innovation (adult content compliance) and Impact (Animoca ecosystem)

**Buildathon Fit:** Adds scalability and ecosystem synergy, targeting 700M+ users and VC appeal at Token2049

## Technical Documentation & Implementation

### Architecture Overview

#### Frontend (SvelteKit)

- **Routes:** `/creator/dashboard` (tier setup, age verification, content upload), `/fan` (login, age verification, subscription, content access), `/iframe` (embeddable plugin)
- **Components:** `MocaLogin.svelte`, `ZKCredential.svelte`, `ContentPlayer.svelte`, `IframePlugin.svelte`

#### Smart Contracts (Solidity, Moca Chain)

- **`SubscriptionContract.sol`:** Manages $MOCA payments, issues "Subscriber"/"Premium Subscriber" credentials, handles 5% fees
- **`ZKVerificationContract.sol`:** Verifies ZK proofs for age, subscription, and location
- **`LocationVerificationContract.sol`:** Manages geographic access controls with ZK location proofs
- **`GovernanceContract.sol`:** Manages creator $MOCA staking/slashing and platform rules
- **Moca Chain:** Stores credentials (e.g., "age >18", "Premium Subscriber", "Location_US"), metadata, and contract state

#### APIs

- **AIR Account Services:** SSO and wallet management ([Documentation](https://docs.moca.network/airkit/usage/user-authentication))
- **AIR Credential Services:** ZK proof issuance/verification ([Documentation](https://docs.moca.network/airkit/usage/credential/))
- **Implementing zkTLS API:** Issues "age >18"/"age >21" credentials (hackathon scope)
- **Animoca APIs:** Verify Mocaverse NFT ownership or OneFootball fan status

## Implementation Details

### 1. Moca Login (AIR Account Services)

**Reference:** [AIR Kit Authentication Documentation](https://docs.moca.network/airkit/usage/user-authentication)

````svelte
<!-- MocaLogin.svelte -->

<script>

import \{ authenticate \} from '@moca/air-account-sdk'; let walletAddress = '';

async function login\(\) \{

try \{

walletAddress = await authenticate\(\);

console.log\('Logged in:', walletAddress\);

\} catch \(error\) \{

console.error\('Login failed:', error\);

\}

\}

</script>

<button onclick=\{login\}>Log in with Moca</button> Backend: SvelteKit server routes call AIR Account Services API for SSO; store session securely.

2. Age Issuance & Verification \(AIR Credential Services\)

- Implementing zkTLS API \(Real Implementation\):

- Node.js endpoint implementing zkTLS for age verification \(hackathon scope\):

\`\`\`javascript

// server.js

const express = require\('express'\);

const \{ issueZKCrediential \} = require\('@moca/air-credential-sdk'\); const app = express\(\);

app.use\(express.json\(\)\);

app.post\('/issue-age-credential', async \(req, res\) => \{

const \{ walletAddress, age \} = req.body;

// Simulate zkTLS: Convert age to ZK proof const credentialType = age >= 21 ? 'age >21' : age >= 18 ? 'age >18' : null; if \(\!credentialType\) return res.status\(400\).json\(\{ error: 'Age verification failed' \}\); const credential = await issueZKCrediential\(walletAddress, \{ type: credentialType, issuer:

'zkTLS' \}\);

res.json\(\{ credential \}\);

\}\);

app.listen\(3000\);

- SvelteKit triggers age verification:

\`\`\`svelte

<\!-- ZKCrediential.svelte -->

<script>

import \{ issueCredential \} from '@moca/air-credential-sdk'; let walletAddress = '0x...'; // From Moca Login async function verifyAge\(\) \{

const response = await fetch\('http://localhost:3000/issue-age-credential',

\{

method: 'POST',

body: JSON.stringify\(\{ walletAddress, age: 21 \}\) // Mock age for

hackathon

\}\);

const \{ credential \} = await response.json\(\); await issueCredential\(walletAddress, credential\);

\}

</script>

<button on:click=\{verifyAge\}>Verify Age</button> Verification \(ZK Proof\):

Smart contract verifies proof

// ZKVerificationContract.sol

contract ZKVerificationContract \{

function verifyProof\(address user, bytes memory proof, string\[\] memory requiredCredentials\) public view returns \(bool\) \{

// Call AIR Credential Services to verify ZK proof bool isValid = verifyZKCrediential\(user, proof, requiredCredentials\);

// e.g., \["age >21", "Premium Subscriber"\]

return isValid;

\}

\}

SvelteKit triggers proof generation:

<script>

import \{ generateProof \} from '@moca/air-credential-sdk'; async function accessContent\(contentId\) \{

const proof = await generateProof\(walletAddress, \['age >21', 'Premium Subscriber'\]\);

const isValid = await contract.verifyProof\(walletAddress, proof, \['age

>21', 'Premium Subscriber'\]\);

if \(isValid\) window.location.href = \`/content/$\{contentId\}\`;

\}

</script>

<button onclick=\{\(\) => accessContent\('video1'\)\}>Access Premium Video</button> 3. $MOCA Payment & Subscriber Credential

// SubscriptionContract.sol

contract SubscriptionContract \{

address public platform;

uint256 public feePercent = 5;

mapping\(address => mapping\(address => string\)\) public subscriptions; //

creator -> fan -> credential event Subscribed\(address fan, address creator, uint256 amount, string credential\);

function subscribe\(address creator, uint256 amount, string memory tier\) public payable \{

require\(msg.value == amount, "Incorrect $MOCA amount"\); uint256 fee = \(amount \* feePercent\) / 100; uint256 creatorAmount = amount - fee;

payable\(platform\).transfer\(fee\);

payable\(creator\).transfer\(creatorAmount\); subscriptions\[creator\]\[msg.sender\] = tier; // e.g., "Subscriber" or

"Premium Subscriber"

emit Subscribed\(msg.sender, creator, amount, tier\);

// Issue credential via AIR Credential Services issueZKCrediential\(msg.sender, \{ type: tier, creator: creator \}\);

\}

\}

SvelteKit Integration:

<\!-- Subscription.svelte -->

<script>

import \{ ethers \} from 'ethers';

async function subscribe\(creatorAddress, amount, tier\) \{

const contract = new ethers.Contract\(contractAddress, abi, wallet\); await contract.subscribe\(creatorAddress, amount, tier, \{ value: ethers.utils.parseEther\(amount.toString\(\)\) \}\);

\}

</script>

<button onclick=\{\(\) => subscribe\(creatorAddress, 20, 'Premium Subscriber'\)\}> Subscribe to Premium \(20 $MOCA\)

</button>

4. Creator Staking & Governance

// GovernanceContract.sol

contract GovernanceContract \{

mapping\(address => uint256\) public stakes; function stake\(address creator, uint256 amount\) public payable \{

require\(msg.value == amount, "Incorrect $MOCA amount"\); stakes\[creator\] \+= amount;

\}

function slash\(address creator, uint256 amount\) public \{

// Platform governance slashes for non-compliant content require\(stakes\[creator\] >= amount, "Insufficient stake"\); stakes\[creator\] -= amount;

payable\(platform\).transfer\(amount\);

\}

\}

5. Moca Chain Deployment

Deploy contracts on Moca Chain testnet \(per Moca Book: https://docs.mocaverse.xyz/\).

Store credentials/metadata:

// Store credential

await storeCredentialOnMocaChain\(walletAddress, \{ type: 'age >21', issuer:

'zkTLS' \}\);

### 6. Iframe Plugin

```svelte
<!-- IframePlugin.svelte -->
<iframe
  src="https://enclave.moca.network/fan"
  width="100%"
  height="600px">
</iframe>
````

Embed in Animoca apps (e.g., OneFootball) for acquisition.

## Key Documentation References

### Moca Network Core Documentation

- **Main Documentation:** [https://docs.moca.network/](https://docs.moca.network/)
- **Moca Book (Learn):** [https://docs.moca.network/learn/](https://docs.moca.network/learn/)

### AIR Kit Integration

- **AIR Kit Overview:** [https://docs.moca.network/airkit/](https://docs.moca.network/airkit/)
- **Installation Guide:** [https://docs.moca.network/airkit/usage/installation](https://docs.moca.network/airkit/usage/installation)
- **Authentication Guide:** [https://docs.moca.network/airkit/usage/user-authentication](https://docs.moca.network/airkit/usage/user-authentication)
- **User Management:** [https://docs.moca.network/airkit/usage/user-management](https://docs.moca.network/airkit/usage/user-management)
- **Credential Documentation:** [https://docs.moca.network/airkit/usage/credential/](https://docs.moca.network/airkit/usage/credential/)
- **Issuing Credentials:** [https://docs.moca.network/airkit/usage/credential/issue](https://docs.moca.network/airkit/usage/credential/issue)
- **Verifying Credentials:** [https://docs.moca.network/airkit/usage/credential/verify](https://docs.moca.network/airkit/usage/credential/verify)
- **Quickstart Guides:**
  - [Login & User Onboarding](https://docs.moca.network/airkit/quickstart/)
  - [Issue Credentials](https://docs.moca.network/airkit/quickstart/issue-credentials)
  - [Verify Credentials](https://docs.moca.network/airkit/quickstart/verify-credentials)

### Moca Chain Development

- **Moca Chain Overview:** [https://docs.moca.network/mocachain/](https://docs.moca.network/mocachain/)
- **Connect to Moca Chain:** [https://docs.moca.network/mocachain/using-moca-chain/connect-to-mocachain](https://docs.moca.network/mocachain/using-moca-chain/connect-to-mocachain)
- **Network Information:** [https://docs.moca.network/mocachain/using-moca-chain/network-information](https://docs.moca.network/mocachain/using-moca-chain/network-information)
- **EVM Compatibility:** [https://docs.moca.network/mocachain/technical-details/evm-compatibility](https://docs.moca.network/mocachain/technical-details/evm-compatibility)
