# Enclave Architecture

Technical architecture documentation for the Enclave platform.

## System Overview

Enclave is a decentralized, privacy-first data monetization platform built on three core pillars:

1. **Zero-Knowledge Credentials** - zkTLS-based proof generation
2. **Decentralized Marketplace** - On-chain credential trading
3. **Trust System** - Community-driven vouching and slashing

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│                        (SvelteKit App)                           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  User Pages  │  │   Company    │  │  Governance  │          │
│  │  Dashboard   │  │  Marketplace │  │   Voting     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer (SDK)                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ AIR Account  │  │AIR Credential│  │   Wallet     │          │
│  │   Service    │  │   Service    │  │  Connection  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Blockchain Layer                            │
│                       (Moca Chain)                               │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Credential  │  │ Marketplace  │  │  Governance  │          │
│  │   Contract   │  │   Contract   │  │   Contract   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │zkTLS Oracle  │  │  IPFS/Arweave│  │   Analytics  │          │
│  │  (Moca ID)   │  │   Storage    │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (SvelteKit)

```
src/
├── lib/
│   ├── services/
│   │   ├── useAirKit.ts         # AIR Kit SDK wrapper
│   │   ├── mocaAuth.ts          # Authentication service
│   │   ├── blockchain.ts        # Web3 interactions
│   │   └── marketplace.ts       # Marketplace logic
│   ├── stores/
│   │   ├── userStore.ts         # User state (Svelte store)
│   │   ├── walletStore.ts       # Wallet connection
│   │   ├── credentialStore.ts   # Credential cache
│   │   └── toastStore.ts        # UI notifications
│   ├── types/
│   │   ├── credential.ts        # Credential interfaces
│   │   ├── marketplace.ts       # Marketplace types
│   │   └── governance.ts        # Governance types
│   ├── utils/
│   │   ├── helpers.ts           # Utility functions
│   │   ├── validation.ts        # Input validation
│   │   └── formatting.ts        # Data formatting
│   └── components/
│       ├── auth/                # Authentication UI
│       ├── credentials/         # Credential components
│       ├── marketplace/         # Marketplace UI
│       └── shared/              # Reusable components
├── routes/
│   ├── +layout.svelte           # Root layout
│   ├── +page.svelte             # Landing page
│   ├── auth/                    # Auth pages
│   ├── dashboard/               # User dashboard
│   ├── credentials/             # Credential management
│   ├── marketplace/             # Marketplace browsing
│   ├── creator/                 # Creator features
│   ├── vouch/                   # Vouching interface
│   └── governance/              # Governance pages
└── app.html                     # HTML template
```

### Smart Contracts (Solidity)

```
contracts/
├── core/
│   ├── CredentialContract.sol      # Credential storage & verification
│   ├── MarketplaceContract.sol     # Listing & purchase logic
│   └── GovernanceContract.sol      # Vouching & slashing
├── libraries/
│   ├── ZKVerifier.sol              # ZK proof verification
│   └── AccessControl.sol           # Permission management
├── interfaces/
│   ├── ICredential.sol
│   ├── IMarketplace.sol
│   └── IGovernance.sol
└── test/
    ├── Credential.test.js
    ├── Marketplace.test.js
    └── Governance.test.js
```

## Data Flow

### 1. Credential Issuance Flow

```
User Request → Frontend
              ↓
       Generate JWT (Server)
              ↓
    AIR Credential SDK → zkTLS Oracle
              ↓
    Generate ZK Proof
              ↓
    Store on Moca Chain (CredentialContract)
              ↓
    Return credentialId to User
              ↓
    Update UI & Local State
```

### 2. Marketplace Purchase Flow

```
Company Browse → Filter Credentials
                      ↓
             Select Credential
                      ↓
       Check Vouch Score & Price
                      ↓
        Initiate Purchase (Web3)
                      ↓
      MarketplaceContract.buyAccess()
                      ↓
        Verify Payment & ZK Proof
                      ↓
      Transfer Funds (95% seller, 5% platform)
                      ↓
         Grant Access Rights
                      ↓
    Emit AccessPurchased Event
                      ↓
      Update UI & Analytics
```

### 3. Vouching Flow

```
User Browse Marketplace
         ↓
   Select Credential to Vouch
         ↓
  Stake $MOCA (min 3 tokens)
         ↓
GovernanceContract.vouch()
         ↓
  Lock Stake with Credential
         ↓
  Update Vouch Score
         ↓
  Emit Vouched Event
         ↓
  Update UI & Reputation
```

### 4. Slashing Flow

```
Detect Suspicious Credential
         ↓
  Propose Slash (0.1 $MOCA fee)
         ↓
GovernanceContract.proposeSlash()
         ↓
  24-Hour Voting Period
         ↓
Community Votes (weighted by reputation)
         ↓
  If >50% Support Slash
         ↓
GovernanceContract.executeSlash()
         ↓
  Slash 10% from All Vouchers
         ↓
Distribute: 50% Proposer, 50% Treasury
         ↓
  Deactivate Credential
         ↓
  Update Reputation Scores
```

## Smart Contract Architecture

### CredentialContract

**Purpose**: Store and manage ZK credentials on-chain

**Key Functions**:

```solidity
function issueCredential(
    bytes32 id,
    address owner,
    string memory credentialType,
    bytes memory proof
) external;

function verifyCredential(
    bytes32 id,
    bytes memory proof,
    string[] memory attributes
) external view returns (bool);

function revokeCredential(bytes32 id) external;

function updateCredential(bytes32 id, bytes memory newProof) external;
```

**State Variables**:

```solidity
mapping(bytes32 => Credential) public credentials;
mapping(address => bytes32[]) public userCredentials;
```

### MarketplaceContract

**Purpose**: Handle credential listings and purchases

**Key Functions**:

```solidity
function listCredential(
    bytes32 credentialId,
    uint256 price,
    bool publicListing
) external;

function buyAccess(
    bytes32 credentialId,
    bytes memory proof
) external payable;

function revokeAccess(
    bytes32 credentialId,
    address buyer
) external;
```

**State Variables**:

```solidity
mapping(bytes32 => Listing) public listings;
mapping(bytes32 => address[]) public buyers;
uint256 public constant PLATFORM_FEE = 5; // 5%
```

### GovernanceContract

**Purpose**: Implement vouching and slashing mechanisms

**Key Functions**:

```solidity
function vouch(bytes32 credentialId) external payable;

function proposeSlash(
    bytes32 credentialId,
    string memory reason
) external payable;

function voteSlash(
    uint256 proposalId,
    bool support
) external;

function executeSlash(uint256 proposalId) external;
```

**State Variables**:

```solidity
mapping(bytes32 => Vouch[]) public vouchesForCredential;
mapping(uint256 => SlashProposal) public proposals;
mapping(address => uint256) public reputation;
```

## Security Architecture

### Authentication & Authorization

1. **Web3 SSO (Moca AIR Account)**:
   - Wallet-based authentication
   - No passwords required
   - Session management via JWT

2. **JWT Tokens**:
   - Server-side signing (ES256/RS256)
   - Short expiration (1 hour)
   - Include partnerId in claims

3. **Role-Based Access**:
   - User: Create/list credentials
   - Company: Purchase credentials
   - Voucher: Stake on credentials
   - Admin: Platform management

### Privacy Protection

1. **Zero-Knowledge Proofs**:
   - zkTLS for data verification
   - Only proofs stored on-chain
   - Raw data never exposed

2. **Access Control**:
   - Credential owners control access
   - Revocation anytime
   - On-chain permission tracking

3. **Data Minimization**:
   - Store only necessary metadata
   - Use IPFS/Arweave for large data
   - Client-side encryption option

### Smart Contract Security

1. **Access Modifiers**:

   ```solidity
   modifier onlyOwner(bytes32 credentialId) {
       require(credentials[credentialId].owner == msg.sender);
       _;
   }

   modifier onlyActive(bytes32 credentialId) {
       require(credentials[credentialId].active);
       _;
   }
   ```

2. **Reentrancy Protection**:

   ```solidity
   import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

   function buyAccess(bytes32 credentialId)
       external payable nonReentrant {
       // Purchase logic
   }
   ```

3. **Input Validation**:
   ```solidity
   function listCredential(bytes32 id, uint256 price) external {
       require(price > 0, "Price must be positive");
       require(credentialExists(id), "Credential not found");
       require(isOwner(msg.sender, id), "Not owner");
       // Listing logic
   }
   ```

## Scalability Considerations

### Frontend Optimization

1. **Code Splitting**: Lazy load routes
2. **Image Optimization**: Use WebP, lazy loading
3. **Caching**: Service workers, local storage
4. **Bundle Size**: Tree-shaking, minification

### Blockchain Optimization

1. **Gas Optimization**:
   - Use `bytes32` for IDs
   - Batch operations when possible
   - Optimize storage patterns

2. **Layer 2 Solutions**:
   - Consider Moca Chain's L2 features
   - Off-chain computation for heavy tasks

3. **Indexing**:
   - The Graph protocol for queries
   - Event-based data sync
   - Caching frequently accessed data

### Database Architecture (Optional)

For enhanced performance, consider off-chain database:

```
PostgreSQL/MongoDB
├── users
│   ├── walletAddress
│   ├── credentials[]
│   └── reputation
├── credentials
│   ├── id (indexed)
│   ├── owner
│   ├── type
│   └── status
├── listings
│   ├── credentialId
│   ├── price
│   └── visibility
└── analytics
    ├── purchases
    ├── vouches
    └── slashes
```

## Monitoring & Analytics

### Application Monitoring

1. **Error Tracking**: Sentry integration
2. **Performance**: Web Vitals tracking
3. **User Analytics**: Plausible/Umami (privacy-first)

### Blockchain Monitoring

1. **Event Listeners**: Track contract events
2. **Gas Usage**: Monitor transaction costs
3. **Success Rates**: Track verification completion

### Business Metrics

1. **Marketplace**:
   - Total listings
   - Purchase volume
   - Average price per credential type

2. **Trust System**:
   - Vouch count
   - Slash proposals
   - Reputation distribution

3. **User Engagement**:
   - Active users
   - Credentials issued
   - Revenue generated

## Deployment Architecture

### Development

```
localhost:5173 (Vite dev server)
├── Moca Testnet
├── Mock zkTLS
└── Local contracts
```

### Staging

```
staging.enclave.app
├── Moca Testnet
├── Test zkTLS
└── Deployed test contracts
```

### Production

```
enclave.app (Vercel/Netlify)
├── Moca Mainnet
├── Production zkTLS
├── Verified contracts
└── CDN (static assets)
```

## Technology Stack Summary

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Frontend       | SvelteKit 5, TypeScript     |
| Styling        | TailwindCSS, Lucide Icons   |
| Blockchain     | Solidity, Hardhat           |
| Authentication | Moca AIR Account SDK        |
| Credentials    | Moca AIR Credential SDK     |
| Network        | Moca Chain (EVM-compatible) |
| Storage        | On-chain + IPFS/Arweave     |
| Testing        | Vitest, Playwright, Hardhat |
| Deployment     | Vercel/Netlify              |
| Monitoring     | Sentry, Plausible           |

## Future Enhancements

### Phase 2

- [ ] Mobile app (React Native)
- [ ] Advanced filtering in marketplace
- [ ] Credential templates
- [ ] Bulk operations

### Phase 3

- [ ] API for third-party integrations
- [ ] Credential NFTs
- [ ] Cross-chain support
- [ ] Decentralized storage (IPFS)

### Phase 4

- [ ] AI-powered fraud detection
- [ ] Reputation NFTs
- [ ] Automated market making
- [ ] DAO governance

---

**Version**: 1.0.0  
**Last Updated**: October 19, 2025  
**Maintained by**: Enclave Team
