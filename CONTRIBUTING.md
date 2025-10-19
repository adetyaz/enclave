# Contributing to Enclave

Thank you for your interest in contributing to Enclave! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- Trolling, insulting/derogatory comments, personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- Git
- A GitHub account
- Moca Network wallet (for testing)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/enclave.git
cd enclave
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/adetyaz/enclave.git
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your configuration values in `.env`

### Run Development Server

```bash
npm run dev
```

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linter
npm run lint

# Format code
npm run format
```

### 4. Commit Your Changes

Follow the commit guidelines (see below)

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define interfaces for data structures
- Use type annotations for function parameters and returns

```typescript
// Good
interface Credential {
	id: string;
	type: string;
	status: CredentialStatus;
}

function verifyCredential(id: string): Promise<VerificationResult> {
	// Implementation
}

// Bad
function verifyCredential(id) {
	// Implementation
}
```

### Svelte Components

- Use Svelte 5 runes mode (`$state()`, `$derived()`, etc.)
- Keep components small and focused
- Use TypeScript in script blocks
- Follow component structure: script → markup → style

```svelte
<script lang="ts">
	import type { Credential } from '$lib/types';

	let { credential }: { credential: Credential } = $props();
	let isLoading = $state(false);
</script>

<div class="credential-card">
	<h3>{credential.type}</h3>
	{#if isLoading}
		<p>Loading...</p>
	{/if}
</div>

<style>
	.credential-card {
		/* Styles */
	}
</style>
```

### CSS/TailwindCSS

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use CSS variables for custom values
- Avoid inline styles when possible

```svelte
<!-- Good -->
<div class="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
	<h2 class="text-xl font-bold text-gray-900">Title</h2>
</div>

<!-- Avoid -->
<div style="padding: 16px; background: white;">
	<h2 style="font-size: 20px;">Title</h2>
</div>
```

### File Naming

- Components: PascalCase (`CredentialCard.svelte`)
- Routes: lowercase with hyphens (`+page.svelte`, `credential-detail/`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase (`Credential.ts`)

### Code Organization

```typescript
// 1. Imports
import { onMount } from 'svelte';
import type { Credential } from '$lib/types';

// 2. Types/Interfaces
interface Props {
	credential: Credential;
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Props
let { credential }: Props = $props();

// 5. State
let isLoading = $state(false);

// 6. Derived values
let displayName = $derived(credential.type.toUpperCase());

// 7. Functions
function handleClick() {
	// Implementation
}

// 8. Lifecycle
onMount(() => {
	// Initialization
});
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(marketplace): add filtering by price range

Add price range slider to marketplace filter section.
Users can now filter credentials between min and max price.

Closes #123
```

```bash
fix(auth): resolve wallet connection timeout

Increase timeout from 5s to 15s to handle slow networks.

Fixes #456
```

```bash
docs(readme): update installation instructions

Add steps for configuring environment variables.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated (if needed)
- [ ] No console.log or debugging code
- [ ] Commits follow convention
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue

Closes #(issue number)

## How to Test

1. Step 1
2. Step 2
3. Step 3

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code reviewed
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: At least one maintainer reviews
3. **Changes Requested**: Address feedback and push updates
4. **Approval**: Maintainer approves PR
5. **Merge**: Maintainer merges into main

### Getting Reviews

- Tag relevant reviewers
- Respond to feedback promptly
- Be open to suggestions
- Keep PRs focused and reasonably sized

## Testing Requirements

### Unit Tests

All new functions should have unit tests:

```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice } from './helpers';

describe('formatPrice', () => {
	it('should format price correctly', () => {
		expect(formatPrice(100)).toBe('100 MOCA');
	});

	it('should handle zero', () => {
		expect(formatPrice(0)).toBe('0 MOCA');
	});

	it('should handle decimals', () => {
		expect(formatPrice(1.5)).toBe('1.5 MOCA');
	});
});
```

### Integration Tests

Test component interactions:

```typescript
import { render, screen } from '@testing-library/svelte';
import CredentialCard from './CredentialCard.svelte';

describe('CredentialCard', () => {
	it('should render credential type', () => {
		const credential = {
			id: '1',
			type: 'Social Profile',
			status: 'Compliant'
		};

		render(CredentialCard, { credential });
		expect(screen.getByText('Social Profile')).toBeInTheDocument();
	});
});
```

### E2E Tests

Test critical user flows:

```typescript
import { test, expect } from '@playwright/test';

test('user can verify credential', async ({ page }) => {
	await page.goto('/creator/verify');
	await page.click('button:has-text("Start Verification")');
	await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

### Test Coverage

- Aim for >80% coverage
- Focus on critical paths
- Test edge cases
- Mock external dependencies

## Documentation

### Code Comments

```typescript
/**
 * Verifies a credential using zkTLS proof
 *
 * @param credentialId - The unique credential identifier
 * @param proof - The ZK proof data
 * @returns Promise resolving to verification result
 * @throws {Error} If credential not found or proof invalid
 */
async function verifyCredential(credentialId: string, proof: string): Promise<VerificationResult> {
	// Implementation
}
```

### README Updates

Update README.md if you:

- Add new features
- Change installation process
- Modify configuration options
- Add new dependencies

### API Documentation

Document new API endpoints:

```typescript
/**
 * POST /api/verify-credential
 *
 * Request Body:
 * {
 *   credentialId: string,
 *   proof: string
 * }
 *
 * Response:
 * {
 *   status: 'Compliant' | 'Non-Compliant',
 *   timestamp: string
 * }
 */
```

## Smart Contract Contributions

### Solidity Standards

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use latest stable Solidity version
- Add NatSpec comments
- Include comprehensive tests

```solidity
/// @title Credential Contract
/// @notice Manages ZK credential storage and verification
/// @dev Implements ERC-xxxx standard
contract CredentialContract {
    /// @notice Issues a new credential
    /// @param id Unique credential identifier
    /// @param owner Address of credential owner
    /// @return success Whether issuance succeeded
    function issueCredential(
        bytes32 id,
        address owner
    ) external returns (bool success) {
        // Implementation
    }
}
```

### Contract Testing

- Test all functions
- Test access controls
- Test edge cases
- Test gas optimization

```javascript
describe('CredentialContract', () => {
	it('should issue credential', async () => {
		const tx = await contract.issueCredential(id, owner);
		expect(tx).to.emit(contract, 'CredentialIssued');
	});

	it('should reject unauthorized access', async () => {
		await expect(contract.connect(attacker).issueCredential(id, owner)).to.be.revertedWith(
			'Unauthorized'
		);
	});
});
```

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Changelog

Update CHANGELOG.md with each release:

```markdown
## [1.2.0] - 2025-10-19

### Added

- Credential verification page
- Vouching system

### Fixed

- Wallet connection timeout

### Changed

- Updated UI design
```

## Getting Help

- **Discord**: [discord.gg/mocaverse](https://discord.gg/mocaverse)
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: dev@enclave.app

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

## License

By contributing to Enclave, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Enclave! 🚀

**Questions?** Reach out on [Discord](https://discord.gg/mocaverse) or open an issue.
