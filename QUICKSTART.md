# Quick Start Guide for Developers

Get up and running with Enclave development in 10 minutes.

## Prerequisites Checklist

- [ ] Node.js 18.0+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Moca Network wallet (for testing)
- [ ] Basic knowledge of: SvelteKit, TypeScript, Web3

## Step-by-Step Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/adetyaz/enclave.git
cd enclave

# Install dependencies
npm install
```

### 2. Environment Configuration (3 minutes)

Create a `.env` file in the root directory:

```env
# Essential Configuration
PUBLIC_PARTNERID=your_partner_id
PUBLIC_VERIFIER_DID=did:example:verifier123
PUBLIC_CREATOR_VERIFY_ID=your_program_id
PUBLIC_REDIRECT_URL_FOR_ISSUER=http://localhost:5173

# Optional (for testing)
MOCA_NETWORK_RPC=https://test-rpc.moca.network
MOCA_CHAIN_ID=12345
```

**Getting Credentials:**

- Partner ID: Register at [Moca Dashboard](https://dashboard.moca.network)
- Program ID: Create a verification program
- Verifier DID: Generated during registration

### 3. Start Development Server (1 minute)

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 4. Explore the App (2 minutes)

Navigate to key pages:

- Landing: `/`
- Creator Dashboard: `/creator/dashboard`
- Verify Credentials: `/creator/verify` ✅
- (More pages coming soon)

### 5. Run Tests (2 minutes)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Linting
npm run lint
```

---

## Project Structure Overview

```
enclave/
├── src/
│   ├── lib/
│   │   ├── services/         # AIR Kit, auth, blockchain
│   │   ├── stores/           # Svelte stores (state)
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helper functions
│   ├── routes/
│   │   ├── +layout.svelte    # Root layout
│   │   ├── +page.svelte      # Landing page
│   │   ├── creator/          # Creator features
│   │   └── api/              # API endpoints
│   └── app.html
├── static/                   # Static assets
├── tests/                    # Test files
└── docs/                     # Documentation
```

---

## Key Files to Know

### Services

**`src/lib/services/useAirKit.ts`**

- Moca AIR Kit integration
- Authentication and credential services

**`src/lib/services/mocaAuth.ts`**

- Authentication logic
- Wallet connection

### Stores (State Management)

**`src/lib/stores/userStore.ts`**

- User authentication state
- User profile data

**`src/lib/stores/toastStore.ts`**

- Toast notifications
- Error/success messages

### API Routes

**`src/routes/api/generate-jwt/+server.ts`**

- JWT token generation
- Credential verification auth

---

## Common Development Tasks

### 1. Creating a New Page

```bash
# Create route folder
mkdir -p src/routes/new-page

# Create page file
touch src/routes/new-page/+page.svelte
```

```svelte
<!-- src/routes/new-page/+page.svelte -->
<script lang="ts">
	let title = $state('New Page');
</script>

<div class="container mx-auto p-8">
	<h1 class="text-3xl font-bold">{title}</h1>
	<p>Page content here</p>
</div>
```

### 2. Adding a New Component

```bash
# Create component file
touch src/lib/components/MyComponent.svelte
```

```svelte
<!-- src/lib/components/MyComponent.svelte -->
<script lang="ts">
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description = '' }: Props = $props();
</script>

<div class="p-4 bg-white rounded-lg shadow">
	<h3 class="text-xl font-bold">{title}</h3>
	{#if description}
		<p class="text-gray-600">{description}</p>
	{/if}
</div>
```

### 3. Creating a New API Endpoint

```typescript
// src/routes/api/my-endpoint/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	// Your logic here

	return json({ success: true, data });
};
```

### 4. Adding Environment Variables

```bash
# Add to .env
NEW_VARIABLE=value

# Use in code (public variables)
import { PUBLIC_NEW_VARIABLE } from '$env/static/public';

# Use in code (private variables)
import { NEW_VARIABLE } from '$env/static/private';
```

### 5. Writing Tests

```typescript
// src/lib/utils/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from './helpers';

describe('myFunction', () => {
	it('should return expected value', () => {
		const result = myFunction('test');
		expect(result).toBe('expected');
	});
});
```

---

## Debugging Tips

### Browser DevTools

1. **Check Console**: `Ctrl+Shift+J` (Windows) or `Cmd+Option+J` (Mac)
2. **Network Tab**: Monitor API calls
3. **Vue DevTools**: Install Svelte DevTools extension

### VS Code Extensions (Recommended)

- **Svelte for VS Code** - Syntax highlighting
- **Svelte Intellisense** - Auto-completion
- **Tailwind CSS IntelliSense** - TailwindCSS support
- **Error Lens** - Inline error display
- **ESLint** - Linting
- **Prettier** - Code formatting

### Common Issues

**Issue: Port already in use**

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

**Issue: Module not found**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Environment variables not loading**

```bash
# Restart dev server
# Ensure .env is in root directory
# Check variable names start with PUBLIC_ for client-side
```

---

## Development Workflow

### 1. Start a New Feature

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature
```

### 2. Make Changes

```bash
# Edit files
# Test locally
npm run dev

# Run tests
npm test
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add my feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### 4. Push and PR

```bash
git push origin feature/my-feature

# Create Pull Request on GitHub
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --open    # Start dev + open browser
npm run dev -- --port 3000  # Use custom port

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests
npm run test:e2e:ui      # E2E with UI

# Code Quality
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run type-check       # TypeScript checks

# Smart Contracts (if needed)
npx hardhat compile      # Compile contracts
npx hardhat test         # Test contracts
npx hardhat node         # Local blockchain
```

---

## Essential Resources

### Documentation

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/overview)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Moca Network Docs](https://docs.moca.network)
- [Enclave Docs](https://enclave-docs.netlify.app)

### Community

- [Discord](https://discord.gg/mocaverse)
- [GitHub Discussions](https://github.com/adetyaz/enclave/discussions)
- [Twitter](https://twitter.com/mocaverse)

### Tools

- [Moca Dashboard](https://dashboard.moca.network)
- [AIR Kit Examples](https://github.com/MocaNetwork/air-credential-example)

---

## Next Steps

Now that you're set up:

1. **Explore the codebase**: Read through existing components
2. **Check the roadmap**: See what features are planned ([ROADMAP.md](./ROADMAP.md))
3. **Pick a task**: Start with good first issues
4. **Read the docs**: Understand the architecture ([ARCHITECTURE.md](./ARCHITECTURE.md))
5. **Join Discord**: Connect with the community

---

## Quick Reference

### Svelte 5 Runes (New Syntax)

```svelte
<script lang="ts">
	// State
	let count = $state(0);

	// Derived value
	let doubled = $derived(count * 2);

	// Props
	let { title }: { title: string } = $props();

	// Effect
	$effect(() => {
		console.log('Count changed:', count);
	});
</script>

<button onclick={() => count++}>
	Count: {count} (doubled: {doubled})
</button>
```

### TailwindCSS Common Classes

```html
<!-- Layouts -->
<div class="container mx-auto">
	<!-- Centered container -->
	<div class="flex items-center">
		<!-- Flexbox center -->
		<div class="grid grid-cols-3 gap-4">
			<!-- Grid 3 columns -->

			<!-- Spacing -->
			<div class="p-4">
				<!-- Padding all sides -->
				<div class="m-8">
					<!-- Margin all sides -->
					<div class="space-y-4">
						<!-- Vertical spacing -->

						<!-- Colors -->
						<div class="bg-blue-500">
							<!-- Background -->
							<div class="text-gray-900">
								<!-- Text color -->
								<div class="border-green-300">
									<!-- Border color -->

									<!-- Typography -->
									<h1 class="text-3xl font-bold">
										<!-- Large bold text -->
										<p class="text-sm text-gray-600"><!-- Small gray text --></p>
									</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
```

---

## Getting Help

**Stuck? Need help?**

1. Check existing documentation
2. Search GitHub issues
3. Ask on Discord
4. Open a new issue

**Found a bug?**

1. Check if it's already reported
2. Create a detailed issue with steps to reproduce
3. Include error messages and screenshots

---

**Happy coding! 🚀**

Questions? Reach out on [Discord](https://discord.gg/mocaverse)
