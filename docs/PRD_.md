# Enclave

## Problem Statement

The creator economy (e.g., OnlyFans, Fansly) faces significant challenges:

### Fans

Privacy concerns prevent engagement, as platforms often require sharing sensitive data (e.g., real names, wallet addresses, exact age) to access content, risking data leaks or tracking.

### Creators

Fraud (e.g., chargebacks, scalping) and compliance burdens (e.g., manual age verification, KYC/AML) increase operational costs and legal risks.

### Platforms

Centralized systems store sensitive user data, creating honeypots for breaches and limiting interoperability across ecosystems.

These issues hinder trust, scalability, and user empowerment in the creator economy, especially in Web3, where privacy and decentralization are core values.

Enclave solves these by providing a decentralized, privacy-preserving platform on Moca Chain, where creators gate content with ZK credentials, fans prove eligibility without data exposure, and Animoca's 700M+ user ecosystem drives adoption.

## Solution

Enclave is a decentralized, privacy-preserving subscription platform built on Moca Network, enabling creators to offer exclusive content (e.g., videos, NFTs, streams) gated by zero-knowledge (ZK) credentials. Fans prove eligibility (e.g., "age >18", "Tier 1 Subscriber", "Mocaverse NFT holder") without revealing sensitive data, ensuring privacy and preventing fraud. Creators manage subscriptions via a dashboard, using $MOCA for payments and governance. The platform integrates with Animoca's ecosystem (e.g., OneFootball, The Sandbox) to tap 700M+ users, offering a scalable, Web3-native alternative to OnlyFans/Fansly.

## Key Features

### Creator Dashboard

- Create and manage subscription tiers (e.g., Basic, Premium) with $MOCA payments
- Set ZK-based access rules (e.g., "Requires Over 18 + Subscriber" or "Enclave NFT holder")
- Configure location-based content restrictions (e.g., "Allow viewers from US, UK, Canada only")
- Upload content (e.g., videos, NFTs) for gated access with geographic controls
- View anonymized analytics (e.g., "10 users granted access to tier") without sensitive data
- Manage $MOCA payouts (5% platform fee)

### Fan Interface

- Log in via Moca (Web3 SSO) for universal identity across creators
- Pay $MOCA for subscriptions, receiving "Subscriber" credentials
- Present ZK proofs (e.g., "Over 18 + Subscriber") to unlock content without data exposure
- Opt-in to data monetization (e.g., share "gaming fan" proof for rewards)

### Anti-Fraud & Scalping Protection

- ZK credentials ensure only verified fans access content, preventing bots/scalpers
- $MOCA staking for creators to promote tiers, slashed for rule violations (e.g., fake content)

### Animoca Ecosystem Integration

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
