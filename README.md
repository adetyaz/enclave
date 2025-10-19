# Enclave

**Own Your Data, Earn Your Worth**

Enclave is a privacy-first data monetization platform built on Moca Network where users convert their data into Zero-Knowledge credentials, list them in a decentralized marketplace, and earn $MOCA tokens—all while maintaining complete privacy through zkTLS technology.

![Enclave Banner](https://via.placeholder.com/1200x300/6366f1/ffffff?text=Enclave+-+Privacy-First+Data+Monetization)

## 🌟 What is Enclave?

Enclave enables users to monetize their data without compromising privacy:

- **For Users**: Create ZK credentials from your data, sell access in the marketplace, and earn $MOCA while maintaining full control
- **For Companies**: Access verified user data for targeted marketing and user acquisition without accessing raw personal information
- **For the Ecosystem**: Build trust through community vouching (staking $MOCA) and slashing (penalizing false data)

## 🚀 Key Features

- 🔒 **Privacy-First**: zkTLS ensures your raw data is never exposed
- 💰 **Data Monetization**: Earn $MOCA tokens by sharing verified credentials
- ✅ **Trust Mechanisms**: Vouching and slashing systems ensure credential authenticity
- 📊 **Full Control**: Dashboard to track earnings and manage data access
- 🔌 **Easy Integration**: Widgets, iframes, and SDKs powered by Moca AIR Kit
- ⛓️ **Built on Moca Chain**: Secure, transparent, and interoperable

## 📚 Documentation

For complete documentation, visit: [https://enclave-docs.netlify.app](https://enclave-docs.netlify.app)

### Quick Links

- [Introduction](https://enclave-docs.netlify.app/docs/intro)
- [Quick Start Guide](https://enclave-docs.netlify.app/docs/getting-started/quick-start)
- [Installation](https://enclave-docs.netlify.app/docs/getting-started/installation)
- [Core Concepts](https://enclave-docs.netlify.app/docs/core-concepts/credentials)
- [Marketplace](https://enclave-docs.netlify.app/docs/core-concepts/marketplace)
- [Vouching & Slashing](https://enclave-docs.netlify.app/docs/core-concepts/vouching-slashing)

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 5 with TypeScript
- **Authentication**: Moca Network AIR Account Services (Web3 SSO)
- **Credentials**: Moca AIR Credential Services (zkTLS-based)
- **Blockchain**: Moca Chain
- **Styling**: TailwindCSS
- **Icons**: Lucide Svelte

## 📦 Installation

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Moca Network wallet

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/adetyaz/enclave.git
cd enclave
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Moca Network Configuration
MOCA_NETWORK_RPC=https://test-rpc.moca.network
MOCA_CHAIN_ID=12345

# AIR Kit API Keys
AIR_ACCOUNT_API_KEY=your_air_account_key
AIR_CREDENTIAL_API_KEY=your_air_credential_key
PUBLIC_PARTNERID=your_partner_id
PUBLIC_VERIFIER_DID=your_verifier_did
PUBLIC_CREATOR_VERIFY_ID=your_program_id

# zkTLS Oracle
ZKTLS_ENDPOINT=https://test-id.moca.network/zkTLS-verify

# Smart Contract Addresses (Testnet)
CREDENTIAL_CONTRACT=0x...
MARKETPLACE_CONTRACT=0x...
GOVERNANCE_CONTRACT=0x...

# Platform Settings
PLATFORM_FEE_PERCENT=5
PUBLIC_REDIRECT_URL_FOR_ISSUER=http://localhost:5173
```

4. **Run the development server**

```bash
npm run dev

# or open in browser automatically
npm run dev -- --open
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
enclave/
├── src/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── useAirKit.ts          # Moca AIR Kit integration
│   │   │   └── mocaAuth.ts           # Authentication service
│   │   ├── stores/
│   │   │   ├── toastStore.ts         # Toast notifications
│   │   │   └── userStore.ts          # User state management
│   │   ├── types/
│   │   │   └── credential.ts         # TypeScript types
│   │   └── utils/
│   │       └── helpers.ts            # Utility functions
│   ├── routes/
│   │   ├── +layout.svelte            # Root layout
│   │   ├── +page.svelte              # Landing page
│   │   ├── auth/                     # Authentication pages
│   │   ├── dashboard/                # User dashboard
│   │   ├── credentials/              # Credential management
│   │   │   ├── issue/                # Issue new credentials
│   │   │   └── [id]/                 # Credential details
│   │   ├── marketplace/              # Marketplace browsing
│   │   ├── creator/
│   │   │   ├── dashboard/            # Creator dashboard
│   │   │   └── verify/               # Credential verification ✅
│   │   ├── vouch/                    # Vouching interface
│   │   └── governance/               # Slashing proposals
│   └── app.html                      # HTML template
├── static/                           # Static assets
├── contracts/                        # Smart contracts (Solidity)
│   ├── CredentialContract.sol
│   ├── MarketplaceContract.sol
│   └── GovernanceContract.sol
├── e2e/                             # End-to-end tests
├── .env                             # Environment variables
├── package.json
├── svelte.config.js
├── tailwind.config.js
└── vite.config.ts
```

## 🎯 How It Works

### For Users (Data Providers)

1. **Login**: Connect your Moca wallet through Web3 SSO
2. **Create Credentials**: Generate ZK credentials using zkTLS
   - Social profiles (Twitter followers >1K)
   - Event attendance (Soccer matches, concerts)
   - Wallet activity (DeFi transactions, NFT holdings)
   - Professional credentials (Education, certifications)
3. **List in Marketplace**: Set your price (e.g., 2 $MOCA) and visibility
4. **Earn $MOCA**: Get paid when companies purchase access (you receive 95%, platform takes 5%)
5. **Maintain Control**: Revoke access anytime from your dashboard

### For Companies (Data Buyers)

1. **Browse Marketplace**: Filter by credential type, price, vouch count
2. **Verify Quality**: Check vouch scores and community trust ratings
3. **Purchase Access**: Buy credentials for targeted marketing or user acquisition
4. **Receive ZK Proofs**: Get cryptographic proofs without accessing raw data
5. **Track Performance**: Monitor campaign success through analytics

### Trust System

- **Vouching**: Stake 3+ $MOCA to endorse credential authenticity
- **Slashing**: 10% penalty distributed if credentials are proven false
- **Reputation**: Build reputation through successful vouches (Bronze → Silver → Gold → Diamond)
- **Governance**: Community votes on slash proposals (24-hour voting period)

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run end-to-end tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

### Smart Contract Deployment

```bash
# Install Hardhat
npm install --save-dev hardhat

# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network moca-testnet

# Verify contracts
npx hardhat verify --network moca-testnet DEPLOYED_CONTRACT_ADDRESS
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests with Playwright
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

## 🌐 Deployment

Build the production version:

```bash
npm run build
```

The built files will be in the `build/` directory. Deploy to your preferred hosting:

- Vercel
- Netlify
- Cloudflare Pages
- Your own server with Node.js adapter

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [enclave.app](https://enclave.app) (Coming soon)
- **Documentation**: [enclave-docs.netlify.app](https://enclave-docs.netlify.app)
- **Moca Network**: [moca.network](https://moca.network)
- **Discord**: [discord.gg/mocaverse](https://discord.gg/mocaverse)
- **Twitter**: [@mocaverse](https://twitter.com/mocaverse)

## 🎨 Design

Design assets and UI kit available on Figma:
[Artificium UI Kit](https://www.figma.com/design/BAKFYhWyiM6HdLlSsxXZIG/Artificium---AI-Content-Creation-App---UI-Kit?node-id=322-1281&t=KJcItYMKURwE7oBW-0)

## 🙏 Acknowledgments

Built with:

- [SvelteKit](https://kit.svelte.dev/)
- [Moca Network](https://moca.network/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Enclave** - Privacy-First Data Monetization on Moca Network  
Made with ❤️ by the Enclave Team
