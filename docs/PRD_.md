# Enclave - Product Requirements Document

**Version:** 2.0  
**Last Updated:** October 19, 2025  
**Status:** Active Development

## Executive Summary

Enclave is a privacy-first data monetization platform built on Moca Network where users convert their personal data into Zero-Knowledge (ZK) credentials, list them in a decentralized marketplace, and earn $MOCA tokens—all while maintaining complete privacy through zkTLS technology.

**Tagline:** Own Your Data, Earn Your Worth

---

## Problem Statement

### Current State: Users Have No Control Over Their Data

**For Users (Data Providers):**

- Platforms exploit user data (social media activity, game spending, event attendance) without consent or compensation
- Privacy is compromised as raw personal data is shared across platforms
- No way to monetize valuable behavioral data
- Trust is broken due to data breaches and misuse

**For Companies (Data Buyers):**

- Struggle to find verified users for targeted marketing and user acquisition
- Waste resources on fake accounts and bot traffic
- Limited access to quality user data for campaigns
- No reliable way to verify user claims (e.g., "I'm a frequent gamer")

**For the Ecosystem:**

- Centralized platforms control all user data
- No transparency in data usage
- No community trust mechanisms
- Users have no incentive to maintain accurate profiles

### Market Opportunity

- **700M+ users** in Animoca/Moca ecosystem
- **$200B+ data broker industry** (but users get $0)
- **Growing privacy concerns** driving Web3 adoption
- **$MOCA token utility** expansion opportunity

---

## Solution: Decentralized Data Monetization Marketplace

Enclave enables a privacy-preserving data marketplace where:

### For Users (Data Providers)

1. **Create ZK Credentials** from your data using zkTLS (Twitter followers, game activity, event attendance, wallet transactions)
2. **List in Marketplace** - Set your own prices (e.g., "Twitter >1K followers" = 2 $MOCA)
3. **Earn $MOCA** - Get paid when companies purchase access (you keep 95%, platform takes 5%)
4. **Maintain Control** - Revoke access anytime, update credentials, manage permissions

### For Companies (Data Buyers)

1. **Browse Marketplace** - Filter by credential type, price, trust score
2. **Verify Quality** - Check community vouch scores and reputation
3. **Purchase Access** - Buy ZK proofs (not raw data) for targeted marketing
4. **Track Performance** - Monitor campaign success and ROI

### For the Ecosystem (Trust Layer)

1. **Vouching** - Stake $MOCA to endorse credential authenticity
2. **Slashing** - Penalize false credentials (10% penalty distributed to proposers/treasury)
3. **Reputation** - Build reputation through honest participation (Bronze → Silver → Gold → Diamond)
4. **Governance** - Community votes on credential disputes (24-hour voting periods)

---

## Key Features

### 1. Privacy-First Credential System

**Zero-Knowledge Credentials:**

- Users prove claims without revealing raw data
- Example: Prove "Twitter followers >1K" without sharing exact count or handle
- zkTLS technology ensures cryptographic verification
- No platform can access underlying personal information

**Supported Credential Types:**

- 📱 **Social Profiles** - Twitter, Instagram, LinkedIn follower counts, engagement rates
- ⚽ **Event Attendance** - Sports matches, concerts, conferences
- 💰 **Wallet Activity** - DeFi transactions, NFT holdings, token balances
- 🎓 **Professional** - Education, certifications, work experience
- 🎮 **Gaming** - Achievements, playtime, spending habits
- 🏆 **Custom** - Any verifiable data source

### 2. Decentralized Marketplace

**Listing Features:**

- Set custom prices in $MOCA
- Choose visibility (public or private to specific companies)
- Select pricing model (one-time access or subscription)
- Configure access duration
- Update credentials in real-time

**Discovery Features:**

- Browse by category (Social, Events, Wallet, Professional)
- Filter by price range, vouch score, attributes
- Search with advanced filters
- Sort by relevance, price, trust score, recency

**Purchase Flow:**

- Companies pay in $MOCA
- Instant ZK proof delivery
- No personal data exposed
- On-chain transaction record

### 3. Trust & Reputation System

**Vouching Mechanism:**

- Stake minimum 3 $MOCA to vouch for credential
- Build reputation through successful vouches
- Earn rewards for quality endorsements
- Higher reputation = greater voting weight

**Slashing Protection:**

- Community can propose slashing fake credentials
- 24-hour voting period (>50% required)
- 10% penalty from all vouchers if credential deemed false
- 50% to proposer, 50% to community treasury

**Reputation Tiers:**

- 🥉 **Bronze (0-100 points)** - Base voting weight: 1, Min vouch: 3 $MOCA
- 🥈 **Silver (101-500 points)** - Voting weight: 2, Min vouch: 2.5 $MOCA
- 🥇 **Gold (501-1000 points)** - Voting weight: 3, Min vouch: 2 $MOCA
- 💎 **Diamond (1000+ points)** - Voting weight: 4, Min vouch: 1.5 $MOCA, Council privileges

### 4. User Dashboard

**For Data Providers:**

- View all credentials and their status
- Track earnings and transaction history
- See who purchased access
- Manage active listings
- Revoke access controls
- Analytics (sales, revenue, popular credentials)

**For Companies:**

- Browse marketplace with filters
- Purchase history and spending analytics
- Campaign performance tracking
- Credential portfolio management
- Integration tools and APIs

---

## User Flows

### User Flow 1: Creating and Listing First Credential

1. **Login** - Connect Moca wallet (Web3 SSO)
2. **Navigate** to "Issue Credential"
3. **Select Type** - e.g., "Social Profile"
4. **Authorize** data access (zkTLS)
5. **Generate Proof** - System creates ZK credential
6. **Set Price** - e.g., 2 $MOCA
7. **Choose Visibility** - Public or private
8. **List** - Credential goes live in marketplace
9. **Track** - Monitor views and purchases

### User Flow 2: Company Purchasing Credential

1. **Browse Marketplace** - Filter by "Social Profiles"
2. **View Details** - Check attributes, vouch score, price
3. **Purchase** - Pay 2 $MOCA from wallet
4. **Receive Proof** - Instant ZK proof delivery
5. **Verify** - Use proof for targeting
6. **Track ROI** - Monitor campaign performance

### User Flow 3: Vouching for Quality

1. **Browse Marketplace** - Find promising credential
2. **Review Details** - Check attributes and issuer
3. **Vouch** - Stake 3 $MOCA minimum
4. **Build Reputation** - Earn points for successful vouches
5. **Earn Rewards** - Potential future governance rewards

### User Flow 4: Slashing Fraudulent Credential

1. **Detect Fraud** - Notice suspicious credential
2. **Propose Slash** - Pay 0.1 $MOCA proposal fee, provide evidence
3. **Community Votes** - 24-hour voting period
4. **Execute** - If >50% support, 10% slashed from vouchers
5. **Receive Reward** - Proposer gets 50% of slashed amount

---

## Technical Architecture

### Frontend Stack

- **Framework:** SvelteKit 5 with TypeScript
- **Styling:** TailwindCSS
- **Icons:** Lucide Svelte
- **State:** Svelte 5 Runes ($state, $derived, $effect)

### Authentication

- **Moca AIR Account Services** - Web3 SSO
- **JWT Tokens** - Session management (ES256/RS256)
- **Wallet Connection** - MetaMask, WalletConnect

### Credentials

- **Moca AIR Credential Services** - zkTLS-based issuance
- **Zero-Knowledge Proofs** - Privacy-preserving verification
- **zkTLS Oracle** - Data verification endpoint

### Blockchain

- **Network:** Moca Chain (EVM-compatible)
- **Payment Token:** $MOCA
- **Smart Contracts:**
  - `CredentialContract.sol` - Credential storage & verification
  - `MarketplaceContract.sol` - Listings & purchases
  - `GovernanceContract.sol` - Vouching & slashing

### Storage

- **On-chain:** Credentials, transactions, reputation
- **IPFS/Arweave:** Large files, metadata (optional)
- **Database:** User sessions, analytics (PostgreSQL optional)

---

## Success Metrics

### Phase 1 (Months 1-3): MVP Launch

- **Users:** 1,000+ registered users
- **Credentials:** 500+ credentials issued
- **Marketplace Volume:** $10,000+ in transactions
- **Vouchers:** 100+ active vouchers
- **Companies:** 50+ companies onboarded

### Phase 2 (Months 4-6): Growth

- **Users:** 10,000+ registered users
- **Credentials:** 5,000+ credentials issued
- **Marketplace Volume:** $100,000+ in transactions
- **Reputation:** 500+ users with Silver+ tier
- **Integrations:** 5+ partner integrations

### Phase 3 (Months 7-12): Scale

- **Users:** 100,000+ registered users
- **Credentials:** 50,000+ credentials issued
- **Marketplace Volume:** $1M+ in transactions
- **Ecosystem:** Listed on major DEXs
- **Governance:** Active DAO participation

### Key Performance Indicators (KPIs)

- **User Acquisition Cost (UAC):** <$10 per user
- **Credential Creation Rate:** Average 2+ credentials per user
- **Marketplace Conversion:** >15% of browsers purchase
- **Vouch Participation:** >20% of users vouch
- **Platform Revenue:** $50K+ monthly (5% fees)
- **Slash Rate:** <1% of credentials (quality control working)

---

## Competitive Advantage

### vs. Traditional Data Brokers

- ✅ Users get paid directly (not brokers)
- ✅ Privacy-preserving (ZK proofs)
- ✅ Users maintain control
- ✅ Transparent pricing

### vs. Centralized Platforms (Google, Facebook)

- ✅ No data exploitation
- ✅ Decentralized ownership
- ✅ User-set pricing
- ✅ Revocable access

### vs. Other Web3 Data Projects

- ✅ Built on Moca (700M+ user ecosystem)
- ✅ zkTLS technology (superior privacy)
- ✅ Trust system (vouching/slashing)
- ✅ $MOCA utility (established token)
- ✅ AIR Kit integration (easy adoption)

---

## Risks & Mitigation

### Technical Risks

- **Smart Contract Bugs:** → Comprehensive testing + security audit
- **zkTLS Integration Issues:** → Close partnership with Moca team
- **Scalability Concerns:** → Layer 2 solutions + optimization

### Business Risks

- **Low User Adoption:** → Marketing campaign + Animoca partnerships
- **Fraud/Abuse:** → Slashing system + reputation tracking
- **Regulatory Uncertainty:** → Legal consultation + compliance framework

### Market Risks

- **Competition:** → First-mover advantage + unique features
- **Token Volatility:** → Stablecoin option + hedging strategies
- **Bear Market:** → Focus on utility + sustainable growth

---

## Roadmap Summary

- **Phase 1 (Weeks 1-4):** Foundation - Auth, Dashboard, Landing Page
- **Phase 2 (Weeks 5-8):** Credentials - Issuance, Management, Verification ✅
- **Phase 3 (Weeks 9-12):** Smart Contracts - Deploy & Integrate
- **Phase 4 (Weeks 13-16):** Marketplace - Listing, Purchasing, Discovery
- **Phase 5 (Weeks 17-20):** Trust System - Vouching, Slashing, Reputation
- **Phase 6 (Weeks 21-24):** Polish - UI/UX, Testing, Optimization
- **Phase 7 (Weeks 25-26):** Launch - Production Deployment

**Total Timeline:** 26 weeks (~6 months)

---

## Appendix

### Target Personas

**Persona 1: Sarah - Social Media Influencer**

- Has 50K Twitter followers, wants to monetize her influence
- Privacy-conscious, doesn't want to share exact follower count
- Lists "Twitter >10K" credential for 5 $MOCA
- Earns $500/month from companies targeting influencers

**Persona 2: TechCorp - Marketing Agency**

- Needs verified gamers for new game launch campaign
- Browses marketplace for "Gaming" credentials
- Purchases 100 credentials at 3 $MOCA each
- Achieves 20% conversion rate (vs. 2% with traditional ads)

**Persona 3: Alex - Community Builder**

- Active in Web3 community, attends conferences
- Vouches for quality credentials to build reputation
- Reaches Gold tier, reduces vouch cost to 2 $MOCA
- Earns governance tokens and community respect

### Pricing Strategy

**User Credentials (Market-Driven):**

- Social Profile (>1K followers): 1-2 $MOCA
- Event Attendance (5+ events): 2-3 $MOCA
- Wallet Activity (>$100 balance): 3-5 $MOCA
- Professional Credentials: 5-10 $MOCA

**Platform Fees:**

- Marketplace: 5% per transaction
- Vouch Minimum: 3 $MOCA
- Slash Proposal: 0.1 $MOCA
- Slash Penalty: 10% of staked amount

**Revenue Model:**

- 95% to data providers
- 5% to platform treasury
- Slash penalties: 50% proposer, 50% treasury

---

**Document Owner:** Product Team  
**Next Review:** Monthly  
**Feedback:** dev@enclave.app

- Leverage OneFootball (200M users) for "verified fan" credentials (e.g., event attendance)
- Tie to Enclave NFTs for loyalty perks (e.g., Realm Points for subscribers)
- Embed in The Sandbox for gaming content (e.g., exclusive skins)

### Data Monetization (Optional)

- Fans opt-in to share anonymized ZK proofs (e.g., "age >18", "frequent gamer") for $MOCA rewards
- Creators/brands target verified users without accessing raw data

### Iframe Plugin

- Embed MocaFans in high-traffic Animoca apps (e.g., social, gaming dApps) for seamless user acquisition

### ZK Credential Verification

- Age verification via third-party issuer (e.g., implementing zkTLS API) issuing "Over 18" credential
- Platform issues "Subscriber" or "Mocaverse NFT Holder" credentials
- ZK proofs ensure privacy (e.g., creator sees only "Access Granted")

## Moca Stack Integration

### AIR Account Services

**Purpose:** Enable seamless Web3 SSO and wallet management for creators and fans.

**Implementation:**

- Integrate "Log in with Moca" for universal identity across all creators, reducing onboarding friction
- Manage fan wallets for $MOCA payments and creator wallets for payouts

**Use case:** Fans log in once to access multiple creators; creators manage subscriptions without handling wallet addresses directly.

### AIR Credential Services

**Purpose:** Issue and verify ZK credentials to gate content while preserving privacy.

**Implementation:**

**Issuance:**

- Age verification: Integrate with a simulated third-party issuer API (e.g., implementing zkTLS) to issue "Over 18" credential using zkTLS (converting Web2 ID data to ZK proofs)
- Platform issues "Subscriber" credential upon $MOCA payment, tied to specific creators or tiers
- Optional: Issue "Mocaverse NFT Holder" or "OneFootball Fan" credentials via Animoca APIs

**Verification:**

- Fans present ZK proofs (e.g., "Over 18 AND Subscriber") to unlock content
- Location verification: Verify user location without exposing IP addresses using ZK location proofs
- Creators verify proofs without seeing raw data (e.g., only "Access Granted" displayed)
- Geographic restrictions enforced at verification layer without storing location data

**Use case:** A fan proves "Over 18 + Subscriber" to access a video; creator sees no wallet or personal data.

**Hackathon Scope:** Implement issuer for "Over 18" and platform-issued "Subscriber" credentials; code ZK proof verification for content gating.

### Moca Chain

**Purpose:** Ensure cross-chain portability and decentralized storage for credentials and content metadata.

**Implementation:**

- Store ZK credentials (e.g., "Over 18", "Subscriber") on Moca Chain for portability across 25+ chains (e.g., Ethereum, Polygon, Plume Network)
- Record subscription metadata (e.g., tier rules, payment records) on Moca Chain for transparency
- Deploy $MOCA payment contracts (subscriptions, creator payouts) and governance contracts (e.g., creator staking, slashing) on Moca Chain

**Use case:** A fan's "Subscriber" credential is portable to other Animoca apps (e.g., The Sandbox).

Use Moca Chain's chain-agnostic infrastructure for interoperability with Animoca apps.

## User Flow (Journey)

### Creator Journey

1. **Onboarding:** Log in with Moca (AIR Account Services) to create a profile
2. **Setup:** Use dashboard to create subscription tiers (e.g., Basic: 10 $MOCA/month) and set ZK-based rules (e.g., "Over 18 + Subscriber")
3. **Content Upload:** Upload gated content (e.g., video, NFT) linked to tiers
4. **Analytics:** View anonymized stats (e.g., "5 fans accessed Premium tier") without sensitive data
5. **Payouts:** Receive $MOCA payments via wallet, with platform taking a 5% fee
6. **Governance (Optional):** Stake $MOCA to promote tiers or vote on platform rules

### Fan Journey

1. **Onboarding:** Log in with Moca (SSO) using Web3 wallet
2. **Credential Acquisition:**
   - Request "Over 18" credential via implementing zkTLS API
   - Pay $MOCA for subscription, receiving "Subscriber" credential
3. **Content Access:** Browse creator tiers, present ZK proof (e.g., "Over 18 + Subscriber + Location") to unlock content (e.g., video)
4. **Geographic Verification:** Prove location eligibility for region-restricted content using ZK location proofs
5. **Data Monetization (Optional):** Opt-in to share anonymized proofs (e.g., "gaming fan") for $MOCA rewards
6. **Ecosystem Perks:** Use credentials in Animoca apps (e.g., The Sandbox for skins, Mocaverse for Realm Points)

### Example Flow (Demo)

**Fan:** Logs in with Moca, pays 10 $MOCA for "Premium" tier, receives "Subscriber" credential, clicks "Over 18" issuer button, presents ZK proof, and accesses creator's video.

**Creator:** Sets up "Premium" tier requiring "Over 18 + Subscriber", uploads video, sees "Access Granted" for 5 anonymized fans, receives 9.5 $MOCA (after 5% fee).

## Success Metrics

### Hackathon Success

#### Technical Metrics

- Deploy Moca Login, $MOCA payment contracts, and ZK credential contracts on Moca Chain
- Functional ZK credential issuance/verification (e.g., "Over 18", "Subscriber") using AIR Credential Services
- Implement real age verification via implementing zkTLS API (ZK proof generation)

#### Demo Metrics

- Complete user flow in 2-minute demo video: fan login → payment → ZK proof → content access
- Creator dashboard shows anonymized "Access Granted" without sensitive data
- Live testnet demo link works for judges

#### Buildathon Alignment

- Submission includes public GitHub repo with README, setup instructions, and AIR Kit usage notes
- Demo scores high on Innovation (ZK privacy in creator economy), UX (polished interfaces), and Privacy (no data leaks)

#### Judging Criteria Targets

- **Innovation:** 9/10 (novel OnlyFans alternative with ZK privacy)
- **Technical Robustness:** 8/10 (AIR Kit integration, testnet deployment)
- **UX/Design:** 9/10 (intuitive creator/fan flows)
- **Privacy/Trustlessness:** 9/10 (ZK proofs, Moca Chain)
- **Impact/Scalability:** 9/10 (700M+ Animoca users, VC appeal)

### Post-Hackathon Success

#### Adoption Metrics

- 1,000+ fans onboarded via Animoca partners (e.g., OneFootball, The Sandbox) within 3 months
- 100+ creators listing tiers, generating $MOCA revenue
- Integration with 3+ Animoca apps (e.g., Mocaverse, SK Planet)

#### Business Metrics

- Platform earns 5% fee on subscriptions, targeting $10,000 monthly $MOCA revenue
- 10% of fans opt-in to data monetization, earning $MOCA rewards

#### Scalability Metrics

- Expand to education (gated courses) and fitness (exclusive workouts) within 6 months
- Secure VC funding at Token2049 for cross-chain expansion (e.g., Plume Network)

## Execution Plan (10-Day Sprint)

### Days 1-2: Setup & Ideation

**Tasks:**

- Confirm problem statement: "Privacy-first creator platform with ZK-gated access"
- Set up GitHub repo, and Moca Login (AIR Account Services)
- Study Moca Book (https://docs.moca.network/) and AIR Kit SDK
- Consult Moca mentors for ZK proof and cross-chain guidance

**Deliverables:** Repo with Moca Login module, $MOCA payment contract.

### Days 3-4: Core Platform (Milestone 1)

**Tasks:**

- Build creator dashboard: Create tiers, set ZK rules (e.g., "Over 18 + Subscriber")
- Code fan interface: Moca Login, $MOCA payment for subscriptions
- Deploy payment contract on Polygon testnet

**Deliverables:** Testnet dApp with creator page setup and payment flow.

### Days 5-7: Credential Integration (Milestone 2)

**Tasks:**

- Implement "Age Issuer" (button-click "Over 18" credential)
- Code platform to issue "Subscriber" credential post-payment (AIR Credential Services)
- Add ZK proof verification for gated content (e.g., video page)
- Store credentials on Polygon testnet (simulating Moca Chain)

**Deliverables:** Testnet dApp with credential issuance and gated video access.

### Days 8-10: Polish & Submission

**Tasks:**

- Create gated video page; ensure ZK proof unlocks content
- Record 2-minute demo video: Fan login → payment → ZK proof → video access; creator sees "Access Granted"
- Finalize GitHub repo: README, setup instructions, AIR Kit notes
- Deploy live testnet demo; test for edge cases (e.g., failed proofs)
- Prepare Token2049 pitch: Emphasize privacy, Animoca synergy (OneFootball, Mocaverse), and scalability

**Deliverables:**

- **Submission:** Project name ("MocaFans"), repo, demo video, live testnet link, team Telegram/X contacts
- **Pitch:** Highlight 700M+ user reach, $MOCA governance, and creator economy innovation

## Why It's a Winner

### Track Alignment

Fits Universal Identity (verified fan credentials) and Credential-based Apps (gated content), leveraging Moca's AIR Kit for ZK privacy.

### Moca Integration

Deep use of AIR Account Services (SSO), AIR Credential Services (ZK proofs), and Moca Chain (portability), showcasing SDK mastery.

### Impact

Targets Animoca's 700M+ users (e.g., OneFootball's 200M fans, The Sandbox), with scalability to education/fitness. Strong VC appeal for creator economy.

### Privacy

ZK proofs ensure fan anonymity; Moca Chain and $MOCA governance eliminate intermediaries.

### Hackathon Feasibility

Scoped for 10 days (Moca Login, ZK credentials, gated video), with clear demo and submission deliverables.

## Considerations for Functionality (Addressing Provided Tracks)

### Universal Identity

- **Verified Fans:** Anti-scalping via ZK credentials (e.g., "OneFootball fan" for event-based perks)
- **Brand Affiliation:** Creators verify fan loyalty (e.g., "Mocaverse NFT holder") for exclusive tiers

### Credential-based Apps

- **Identity Hooks:** ZK proofs replace manual KYC (e.g., "Over 18" for compliance)
- **Shared Liability (Adapted):** Creators stake $MOCA to promote tiers, slashed for rule violations, ensuring trust

### Identity Infrastructure

- **Data Monetization:** Fans opt-in to share anonymized proofs (e.g., "gaming fan") for $MOCA rewards, enabling targeted marketing
- **User Acquisition:** Iframe plugin embeds MocaFans in Animoca apps, driving verified user onboarding
