# Enclave Transition Analysis & Implementation Plan

**Date:** October 19, 2025  
**Status:** Documentation Updated, Code Transition Needed

---

## 📊 Current State Analysis

### What Was Previously Built

#### ✅ **Completed Infrastructure**

1. **Authentication System**
   - Moca AIR Kit integration (`useAirKit.ts`)
   - Web3 wallet connection (Moca SSO)
   - JWT generation for credential operations
   - Session management

2. **Credential Verification Page** (`/creator/verify`)
   - Full credential verification UI
   - 7 status types (Compliant, Non-Compliant, Pending, Revoking, Revoked, Expired, NotFound)
   - Verification history tracking
   - Configuration display
   - Status color-coding and icons
   - **Status:** ✅ Production-ready (495 lines)

3. **Creator Onboarding Flow** (`/creator/onboarding`)
   - Multi-step wizard (3 steps)
   - Form validation
   - Credential issuance integration
   - **Status:** ⚠️ Needs adaptation (OLD: age/location → NEW: wallet-based)

4. **Services Layer**
   - `useAirKit.ts` - Moca authentication service (182 lines)
   - `pinataImageService.ts` - IPFS image uploads
   - `credentialDisplayService.ts` - Credential UI helpers

5. **Component Library**
   - `CreatorOnboarding.svelte` - Onboarding wizard (662 lines)
   - `Header.svelte` - Navigation component
   - `Toast.svelte` / `ToastContainer.svelte` - Notifications
   - `AuthInitializer.svelte` - Auth state management
   - `CreatorCredentialDisplay.svelte` - Credential cards

6. **Environment Configuration**
   - Moca AIR Kit credentials configured
   - Pinata IPFS integration set up
   - JWT signing keys configured
   - Database URL (Neon PostgreSQL) configured

---

### ❌ **OLD Model Components (Need Replacement)**

#### **Route Structure Based on Creator/Fan Model:**

```
src/routes/
├── creator/
│   ├── dashboard/      ❌ References "fans", "tiers", "subscriptions"
│   ├── tiers/          ❌ Subscription tier management
│   ├── content/        ❌ Content upload for fans
│   ├── analytics/      ❌ Fan analytics
│   ├── setup/          ❌ Creator-specific setup
│   ├── onboarding/     ⚠️  Needs adaptation (uses age/location, not wallet)
│   └── verify/         ✅ Keep (but rename route to /verify or /admin/verify)
│
└── fan/
    ├── discover/       ❌ Browse creators
    ├── subscriptions/  ❌ Manage subscriptions
    ├── credentials/    ⚠️  Could be adapted for user credentials
    └── monetization/   ❌ Fan monetization features
```

#### **Landing Page** (`/+page.svelte`)

- ❌ References "age verification", "fans", "creators", "subscriptions"
- ❌ "For Fans" and "For Creators" sections
- ❌ Adult content focus
- **Needs:** Complete rewrite for data marketplace

#### **Components with OLD Terminology:**

- `CreatorOnboarding.svelte` - References age/location verification
- `CreateTierModal.svelte` - Subscription tiers
- `MintContentModal.svelte` - Content uploads for fans

---

## 🎯 NEW Model Architecture

### **Core User Roles:**

| Old Role       | New Role                 | Description                                        |
| -------------- | ------------------------ | -------------------------------------------------- |
| Creator        | **Data Seller**          | Users who generate ZK credentials and list them    |
| Fan            | **Data Buyer**           | Companies/users who purchase access to credentials |
| Platform Admin | **Governance/Moderator** | Manages disputes, slashing, platform parameters    |

### **New Route Structure:**

```
src/routes/
├── marketplace/          🆕 Browse credential listings
│   ├── +page.svelte      → Main marketplace with search/filters
│   └── [id]/             → Individual credential detail page
│
├── dashboard/            🆕 User dashboard (replaces /creator/dashboard)
│   ├── +page.svelte      → Overview: earnings, stats, listings
│   ├── credentials/      → Manage your ZK credentials
│   ├── listings/         → Your marketplace listings
│   ├── purchases/        → Credentials you've bought
│   └── earnings/         → Revenue tracking
│
├── create/               🆕 Credential creation flow
│   ├── +page.svelte      → Data source selection
│   └── [type]/           → Type-specific credential generation (LinkedIn, Twitter, Bank, etc.)
│
├── verify/               ✅ Keep existing (rename from /creator/verify)
│   └── +page.svelte      → Admin credential verification tool
│
├── trust/                🆕 Vouching & Slashing
│   ├── vouch/            → Stake $MOCA to vouch for users
│   ├── disputes/         → View and vote on disputes
│   └── reputation/       → User reputation scores
│
├── governance/           🆕 DAO governance
│   ├── proposals/        → View/create proposals
│   └── vote/             → Vote on proposals
│
└── api/
    ├── generate-jwt/     ✅ Keep (already exists)
    ├── credentials/      🆕 Credential CRUD
    ├── marketplace/      🆕 Listing management
    └── trust/            🆕 Vouching/slashing endpoints
```

---

## 🔄 Migration Strategy

### **Phase 1: Foundation (Week 1-2)**

#### 1.1 Update Landing Page

- [ ] Replace `/+page.svelte` with new data marketplace copy
- [ ] Remove "For Fans" / "For Creators" sections
- [ ] Add "How It Works" for sellers and buyers
- [ ] Update hero section with new value proposition

#### 1.2 Restructure Routes

- [ ] Rename `/creator/verify` → `/verify`
- [ ] Delete `/fan/*` routes
- [ ] Delete `/creator/tiers`, `/creator/content`, `/creator/setup`
- [ ] Create new `/marketplace/+page.svelte`
- [ ] Create new `/dashboard/+page.svelte`

#### 1.3 Update Services

- [ ] Keep `useAirKit.ts` (authentication still valid)
- [ ] Adapt `pinataImageService.ts` for credential metadata
- [ ] Remove creator-specific service logic
- [ ] Add marketplace service (`marketplaceService.ts`)
- [ ] Add trust system service (`trustService.ts`)

---

### **Phase 2: Core Features (Week 3-6)**

#### 2.1 Marketplace Implementation

**File:** `src/routes/marketplace/+page.svelte`

```typescript
// Features to implement:
- Search credentials by type (education, employment, financial, identity, health)
- Filter by price range, seller reputation, date listed
- Sort by popularity, price, newest
- Credential cards with preview (no raw data)
- Purchase flow with $MOCA payment
```

#### 2.2 Credential Creation Flow

**File:** `src/routes/create/+page.svelte`

```typescript
// Data source integrations:
- LinkedIn (employment credentials)
- Twitter/X (social proof credentials)
- Bank accounts (financial credentials via Plaid)
- Government ID (identity credentials)
- Health records (medical credentials)

// zkTLS generation:
- Use Moca AIR Credential SDK
- Encrypt proof with buyer-specific keys
- Upload to IPFS via Pinata
- Store hash on-chain
```

#### 2.3 Dashboard Redesign

**File:** `src/routes/dashboard/+page.svelte`

```svelte
<script lang="ts">
  // Replace creator dashboard with unified user dashboard
  
  let stats = $state({
    totalEarnings: 0,        // $MOCA earned from sales
    activeListings: 0,        // Credentials listed in marketplace
    totalPurchases: 0,        // Credentials bought
    reputationScore: 0,       // Trust system score
    vouchesReceived: 0,       // # of vouches
    vouchesGiven: 0          // # of vouches given
  });
  
  // Quick actions:
  - Create New Credential
  - List Credential in Marketplace
  - Browse Marketplace
  - View Reputation
</script>
```

---

### **Phase 3: Trust System (Week 7-10)**

#### 3.1 Vouching Interface

**File:** `src/routes/trust/vouch/+page.svelte`

```typescript
// Features:
- Search users by wallet address
- View user's credentials and reputation
- Stake $MOCA tokens to vouch (slider: 1-1000 MOCA)
- View your vouching history
- Withdraw vouches (if no disputes)
```

#### 3.2 Slashing & Disputes

**File:** `src/routes/trust/disputes/+page.svelte`

```typescript
// Features:
- Report false credentials (submit evidence IPFS CID)
- View active disputes
- Vote on disputes (governance token holders)
- Automatic slashing after vote passes
- Penalty distribution to reporters
```

#### 3.3 Reputation System

**File:** `src/routes/trust/reputation/+page.svelte`

```typescript
// Display:
- Trust score (0-1000)
- Vouches received/given
- Slashing history
- Transaction history
- Trust network graph (D3.js visualization)
```

---

### **Phase 4: Smart Contracts (Week 11-14)**

#### 4.1 Deploy Contracts to Moca Chain

**Contracts to Deploy:**

1. **CredentialRegistry.sol**
   - Store credential hashes
   - Issue/revoke credentials
   - Verify credential validity

2. **MarketplaceContract.sol**
   - Create listings
   - Process purchases
   - Handle $MOCA payments
   - Distribute royalties

3. **GovernanceContract.sol**
   - Create proposals
   - Vote on proposals
   - Execute proposals
   - Update platform parameters

4. **VouchingContract.sol** (NEW - not in current docs)
   ```solidity
   contract VouchingContract {
       mapping(address => mapping(address => uint256)) public vouches; // voucher => vouchee => stake
       mapping(address => uint256) public totalVouches;
       mapping(address => uint256) public reputationScore;

       event Vouched(address indexed voucher, address indexed vouchee, uint256 amount);
       event Slashed(address indexed slashed, address indexed voucher, uint256 amount);

       function vouch(address vouchee, uint256 amount) external;
       function withdrawVouch(address vouchee) external;
       function slash(address vouchee, bytes32 evidenceHash) external;
   }
   ```

#### 4.2 Contract Integration

**File:** `src/lib/services/contractService.ts`

```typescript
export class ContractService {
	private credentialRegistry: Contract;
	private marketplace: Contract;
	private governance: Contract;
	private vouching: Contract;

	async issueCredential(credentialHash: string, ipfsCid: string): Promise<string>;
	async createListing(credentialHash: string, price: bigint): Promise<string>;
	async purchaseCredential(listingId: bigint): Promise<string>;
	async vouchUser(vouchee: string, amount: bigint): Promise<string>;
	async reportDispute(vouchee: string, evidence: string): Promise<string>;
}
```

---

### **Phase 5: Database Migration (Week 15-16)**

#### 5.1 Update Prisma Schema

**File:** `prisma/schema.prisma`

```prisma
model User {
  id              String   @id @default(uuid())
  walletAddress   String   @unique
  displayName     String?
  avatarUrl       String?
  reputationScore Int      @default(0)
  totalVouches    Int      @default(0)
  totalSlashes    Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  credentials     Credential[]
  listings        Listing[]
  purchases       Purchase[]
  vouchesGiven    Vouch[]      @relation("VouchesGiven")
  vouchesReceived Vouch[]      @relation("VouchesReceived")
}

model Credential {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  type            String   // 'education', 'employment', 'financial', 'identity', 'health'
  credentialHash  String   @unique // Keccak256 hash
  ipfsCid         String   // IPFS content ID
  metadata        Json     // Tags, attributes
  isRevoked       Boolean  @default(false)
  createdAt       DateTime @default(now())

  listings        Listing[]
}

model Listing {
  id             String     @id @default(uuid())
  credentialId   String
  credential     Credential @relation(fields: [credentialId], references: [id])
  sellerId       String
  seller         User       @relation(fields: [sellerId], references: [id])
  title          String
  description    String?
  priceMoca      Decimal    @db.Decimal(18, 8)
  status         String     @default("active") // 'active', 'sold', 'removed'
  viewCount      Int        @default(0)
  purchaseCount  Int        @default(0)
  createdAt      DateTime   @default(now())

  purchases      Purchase[]
}

model Purchase {
  id                String   @id @default(uuid())
  listingId         String
  listing           Listing  @relation(fields: [listingId], references: [id])
  buyerId           String
  buyer             User     @relation(fields: [buyerId], references: [id])
  priceMoca         Decimal  @db.Decimal(18, 8)
  txHash            String   // Blockchain transaction hash
  accessKeyEncrypt  String   // Encrypted access key for ZK proof
  createdAt         DateTime @default(now())
}

model Vouch {
  id         String   @id @default(uuid())
  voucherId  String
  voucher    User     @relation("VouchesGiven", fields: [voucherId], references: [id])
  voucheeId  String
  vouchee    User     @relation("VouchesReceived", fields: [voucheeId], references: [id])
  stakeMoca  Decimal  @db.Decimal(18, 8)
  txHash     String
  status     String   @default("active") // 'active', 'slashed', 'withdrawn'
  createdAt  DateTime @default(now())

  @@unique([voucherId, voucheeId])
}

model SlashingEvent {
  id              String   @id @default(uuid())
  slashedUserId   String
  voucherId       String
  reason          String
  evidenceIpfs    String
  slashedAmount   Decimal  @db.Decimal(18, 8)
  txHash          String
  governanceVote  Int?     // Proposal ID
  createdAt       DateTime @default(now())
}
```

#### 5.2 Run Migration

```bash
npx prisma migrate dev --name transition_to_marketplace
npx prisma generate
```

---

## 🔧 Component Reusability Analysis

### ✅ **Components to KEEP (with minor updates):**

1. **`useAirKit.ts`** - Authentication service
   - ✅ Works as-is (wallet-based auth)
   - Minor update: Remove creator-specific logic

2. **`/creator/verify/+page.svelte`** - Verification tool
   - ✅ Keep functionality (admin tool)
   - Update: Rename route to `/verify`

3. **`Toast.svelte` / `ToastContainer.svelte`** - Notifications
   - ✅ No changes needed

4. **`Header.svelte`** - Navigation
   - ⚠️ Update links:
     - Remove "Creator Dashboard" → "Dashboard"
     - Remove "Fan Discover" → "Marketplace"
     - Add "Create Credential", "Trust System"

5. **`pinataImageService.ts`** - IPFS uploads
   - ✅ Works for credential metadata
   - Minor update: Support credential schemas

---

### ❌ **Components to DELETE:**

1. `CreateTierModal.svelte` - Subscription tiers
2. `MintContentModal.svelte` - Content uploads
3. All `/fan/*` route components
4. `/creator/tiers/*` components
5. `/creator/content/*` components

---

### 🔄 **Components to REFACTOR:**

1. **`CreatorOnboarding.svelte`** → `CredentialCreationWizard.svelte`
   - Remove age/location form fields
   - Replace with data source selection (LinkedIn, Twitter, Bank, etc.)
   - Update credential issuance flow for marketplace context

2. **`CreatorCredentialDisplay.svelte`** → `CredentialCard.svelte`
   - Update for marketplace listing display
   - Add price, purchase button, seller reputation

3. **`/creator/dashboard/+page.svelte`** → `/dashboard/+page.svelte`
   - Remove "tiers", "fans", "subscriptions"
   - Add "listings", "purchases", "earnings", "reputation"

---

## 📋 Step-by-Step Migration Checklist

### **Week 1: Foundation Cleanup**

- [ ] Update README.md (already done ✅)
- [ ] Update all docs/ files (already done ✅)
- [ ] Update landing page (`/+page.svelte`)
- [ ] Update Header navigation
- [ ] Delete `/fan/*` routes
- [ ] Delete `/creator/tiers`, `/creator/content`, `/creator/setup`
- [ ] Rename `/creator/verify` → `/verify`
- [ ] Rename `/creator/dashboard` → `/dashboard`

### **Week 2-3: Marketplace MVP**

- [ ] Create `/marketplace/+page.svelte` (search, filters, cards)
- [ ] Create `/marketplace/[id]/+page.svelte` (detail view)
- [ ] Create `marketplaceService.ts` (API calls)
- [ ] Update Prisma schema (User, Credential, Listing, Purchase)
- [ ] Run database migration
- [ ] Implement basic CRUD for listings

### **Week 4-5: Credential Creation**

- [ ] Create `/create/+page.svelte` (data source selection)
- [ ] Implement zkTLS integration for each data type
- [ ] IPFS upload for encrypted proofs
- [ ] On-chain credential registration
- [ ] Test end-to-end credential generation

### **Week 6-7: Dashboard Redesign**

- [ ] Refactor `/dashboard/+page.svelte`
- [ ] Add earnings tracking
- [ ] Add listings management
- [ ] Add purchases history
- [ ] Add reputation display

### **Week 8-10: Trust System**

- [ ] Deploy VouchingContract.sol
- [ ] Create `/trust/vouch/+page.svelte`
- [ ] Create `/trust/disputes/+page.svelte`
- [ ] Create `/trust/reputation/+page.svelte`
- [ ] Implement vouching flow
- [ ] Implement slashing mechanism

### **Week 11-12: Governance**

- [ ] Deploy GovernanceContract.sol
- [ ] Create `/governance/proposals/+page.svelte`
- [ ] Create `/governance/vote/+page.svelte`
- [ ] Implement proposal creation
- [ ] Implement voting mechanism

### **Week 13-16: Testing & Polish**

- [ ] End-to-end testing (Playwright)
- [ ] Smart contract audits
- [ ] Performance optimization
- [ ] Security review
- [ ] UI/UX refinements
- [ ] Documentation updates

---

## 🚨 Critical Decisions Needed

### 1. **Onboarding Flow**

**Question:** Should users still complete an "onboarding" wizard, or just connect wallet and start?

**Option A:** Keep onboarding wizard

- Ask for display name, avatar
- Select preferred credential types
- Educational walkthrough

**Option B:** Minimal onboarding

- Just connect wallet
- Discover features organically

**Recommendation:** Option B (faster time-to-value)

---

### 2. **Verification Tool Access**

**Question:** Who can access `/verify`?

**Option A:** Public (anyone can verify credentials)
**Option B:** Admin-only (platform moderators)
**Option C:** Buyers-only (after purchase)

**Recommendation:** Option A (transparency builds trust)

---

### 3. **Credential Storage**

**Question:** Where to store ZK proof data?

**Current:** IPFS only
**Alternative:** IPFS + Arweave (permanent backup)

**Recommendation:** Hybrid (IPFS for fast access, Arweave for critical proofs)

---

### 4. **Pricing Model**

**Question:** Platform fees on transactions?

**Options:**

- 0% (fully decentralized, no platform cut)
- 2.5% (standard marketplace fee)
- 5% (with revenue share to vouchers)

**Recommendation:** 2.5% platform fee + 1% to voucher pool

---

## 💡 Quick Wins (Implement First)

1. **Update Landing Page** (4 hours)
   - Highest visibility
   - Clear value proposition

2. **Rename Routes** (2 hours)
   - `/creator/dashboard` → `/dashboard`
   - `/creator/verify` → `/verify`
   - Delete `/fan/*`

3. **Update Header Navigation** (1 hour)
   - Remove old links
   - Add marketplace, create credential

4. **Deploy Credential Registry Contract** (4 hours)
   - Use existing smart contract from Tech PRD
   - Deploy to Moca testnet
   - Test issuance flow

5. **Create Basic Marketplace Page** (8 hours)
   - Static credential cards
   - Mock data for now
   - Search and filter UI

---

## 📈 Success Metrics

### MVP Launch Criteria:

- [ ] 50+ active users
- [ ] 100+ credentials issued
- [ ] 20+ marketplace listings
- [ ] 10+ successful purchases
- [ ] 5+ vouching relationships

### 3-Month Goals:

- [ ] 1,000+ active users
- [ ] 5,000+ credentials issued
- [ ] 500+ marketplace transactions
- [ ] $50,000+ in $MOCA volume
- [ ] 100+ active vouchers

---

## 🎨 Design System Updates

### Color Palette (Keep Existing)

- Primary: Purple (#8B5CF6)
- Secondary: Pink (#EC4899)
- Accent: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography (Keep Existing)

- Headings: Bold, gradient text
- Body: Regular, gray-700
- UI Elements: Semibold

### Components to Add:

- `CredentialCard.svelte` - Marketplace listing card
- `TrustBadge.svelte` - Reputation score display
- `StakeSlider.svelte` - Vouching amount selector
- `DisputeModal.svelte` - Report credential dialog
- `ProofViewer.svelte` - ZK proof metadata display

---

## 🔐 Security Considerations

1. **Credential Access Control**
   - Encrypt proofs with buyer-specific keys
   - Never expose raw proof data in frontend
   - Implement access expiry (optional)

2. **Smart Contract Security**
   - Audit all contracts before mainnet
   - Use OpenZeppelin standards
   - Implement emergency pause mechanism

3. **Frontend Security**
   - Input validation on all forms
   - Rate limiting on API calls
   - XSS protection

4. **Database Security**
   - Row-level security (Neon Postgres)
   - Encrypted sensitive fields
   - Regular backups

---

## 📞 Next Steps

1. **Review this analysis** with team
2. **Approve migration strategy** and timeline
3. **Assign tasks** for Week 1 (Foundation Cleanup)
4. **Set up development environment** with new database schema
5. **Begin implementation** starting with landing page update

---

**Status:** Ready to begin transition  
**Estimated Timeline:** 16 weeks to full MVP  
**Risk Level:** Low (architecture is well-defined, most infrastructure already exists)  
**Confidence:** High (Moca AIR Kit integration proven, zkTLS documented)
