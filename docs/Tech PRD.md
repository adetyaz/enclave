# Technical Product Requirements Document - Enclave

## Overview

The roadmap is split into two waves, with ZK proofs implemented from Wave 1 to support adult content creators' age verification and tiered access based on verification levels. Each wave builds toward a demo-ready product for Token2049, aligning with the Buildathon's multiple-wave submission rules.

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

**Objective:** Enhance Enclave with advanced ZK-based tiers (e.g., "age >21 + Premium Subscriber"), anti-fraud staking, iframe plugin, and Animoca integrations.

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
