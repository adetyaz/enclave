# Changelog

All notable changes to the Enclave project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- User authentication with Moca SSO
- Credential issuance flow
- Marketplace browsing and filtering
- Smart contract deployment
- Complete vouching/slashing system

## [0.2.0] - 2025-10-19

### Added

- Complete project documentation
  - Updated README.md with full project overview
  - Added ARCHITECTURE.md with technical design
  - Added CONTRIBUTING.md with contribution guidelines
  - Added CHANGELOG.md (this file)
- Credential verification page (`/creator/verify`) ✅
  - JWT-based authentication
  - Support for 7 verification statuses
  - Verification history tracking
  - Configuration status checker
  - Modern glassmorphism UI
- Creator dashboard integration
  - Added "Verify Credentials" quick action
  - Updated grid layout to 4 columns
- Technical documentation
  - CREDENTIAL_VERIFICATION.md - Complete verification docs
  - VERIFICATION_IMPLEMENTATION.md - Implementation guide

### Changed

- Updated environment variable naming
  - `PUBLIC_VERIFICATION_PROGRAM_ID` → `PUBLIC_CREATOR_VERIFY_ID`
- Improved verification page UI
  - Added animated gradient blobs
  - Glassmorphism effects with backdrop-blur
  - Responsive mobile-first design
  - Color-coded status badges

### Fixed

- Svelte 5 `{@const}` placement syntax errors
  - Fixed results section placement
  - Fixed history section with `{#snippet}` pattern

## [0.1.0] - 2025-10-16

### Added

- Initial SvelteKit 5 project setup
- Basic project structure
- TailwindCSS configuration
- TypeScript configuration
- Vite configuration
- ESLint and Prettier setup
- Playwright E2E testing setup
- Basic routing structure
  - Landing page (`/`)
  - Creator dashboard (`/creator/dashboard`)
- Moca AIR Kit integration
  - Authentication service setup
  - Credential service setup
- Environment configuration
  - `.env` template
  - Public environment variables
- Basic UI components
  - Toast notification system
  - Layout structure

### Changed

- Migrated from default Svelte template to custom structure
- Updated dependencies to latest versions

### Security

- Added environment variable validation
- Implemented JWT-based authentication pattern

## [0.0.1] - 2025-10-15

### Added

- Project initialization
- Repository setup
- Initial commit with Svelte template

---

## Legend

- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Now removed features
- `Fixed` - Bug fixes
- `Security` - Vulnerability fixes

## Version Numbering

- **Major version** (1.0.0): Breaking changes
- **Minor version** (0.1.0): New features, backward compatible
- **Patch version** (0.0.1): Bug fixes, backward compatible

## Links

- [Project Repository](https://github.com/adetyaz/enclave)
- [Documentation](https://enclave-docs.netlify.app)
- [Issue Tracker](https://github.com/adetyaz/enclave/issues)
- [Releases](https://github.com/adetyaz/enclave/releases)
