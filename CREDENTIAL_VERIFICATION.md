# Credential Verification Implementation

## Overview

This document details the credential verification system implemented in Enclave, based on the [MocaNetwork/air-credential-example](https://github.com/MocaNetwork/air-credential-example) reference implementation.

## Architecture

### Core Components

1. **Verification Page** (`/creator/verify/+page.svelte`)
   - Main UI for credential verification
   - Handles verification flow and displays results
   - Shows verification history

2. **AIR Service Integration** (`$lib/services/useAirKit.ts`)
   - Moca AIR Kit SDK wrapper
   - Handles authentication and widget initialization

3. **JWT Generation API** (`/api/generate-jwt`)
   - Server-side JWT signing
   - Supports both issuance and verification operations

## Verification Flow

### 1. Configuration

Environment variables required:

```bash
# .env
PUBLIC_PARTNERID=your-partner-id
PUBLIC_VERIFICATION_PROGRAM_ID=your-verification-program-id
PUBLIC_VERIFIER_DID=did:example:verifier123
PUBLIC_REDIRECT_URL_FOR_ISSUER=http://localhost:5173/credential-test
```

### 2. JWT Authentication

**Payload Structure:**

```typescript
{
  partnerId: string,
  scope: "issue verify",
  verifierDid?: string  // Required for verification
}
```

**Signing:**

- Algorithm: ES256 or RS256
- KID: Key ID for JWKS lookup
- Expiration: 1 hour
- **IMPORTANT:** JWT must be signed server-side for security

### 3. Verification Process

```typescript
// 1. Generate JWT
const authToken = await generateVerificationJWT();

// 2. Initialize AIR Service
await mocaAuth.init();
const airService = mocaAuth.getAirService();

// 3. Call verifyCredential (opens widget)
const result = await airService.verifyCredential({
	authToken,
	programId: PUBLIC_VERIFICATION_PROGRAM_ID,
	redirectUrl: PUBLIC_REDIRECT_URL_FOR_ISSUER
});

// 4. Handle result
console.log('Status:', result.status);
```

## Verification Statuses

The verification result contains a `status` field with one of these values:

| Status          | Icon | Description                                        | Color  |
| --------------- | ---- | -------------------------------------------------- | ------ |
| `Compliant`     | ✅   | Credential is valid and meets all requirements     | Green  |
| `Non-Compliant` | ❌   | Credential does not meet verification requirements | Red    |
| `Pending`       | ⏳   | Credential is waiting for blockchain confirmation  | Yellow |
| `Revoking`      | 🔄   | Credential is currently being revoked              | Orange |
| `Revoked`       | 🚫   | Credential has been revoked and is no longer valid | Orange |
| `Expired`       | ⏰   | Credential has expired and is no longer valid      | Gray   |
| `NotFound`      | 🔍   | No credential was found matching the criteria      | Purple |

## UI Components

### Status Display

```svelte
<script>
	function getStatusColor(status) {
		switch (status) {
			case 'Compliant':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'Non-Compliant':
				return 'bg-red-50 border-red-200 text-red-800';
			// ... other cases
		}
	}
</script>

<div class="status-badge {getStatusColor(result.status)}">
	{@const StatusIcon = getStatusIcon(result.status)}
	<StatusIcon class="h-6 w-6" />
	<span>{result.status}</span>
</div>
```

### Verification History

The page maintains a history of all verification attempts:

```typescript
let verificationHistory = $state<any[]>([]);

// After verification
verificationHistory = [
	{
		...result,
		timestamp: new Date().toISOString(),
		fanAddress: selectedFan || 'Unknown'
	},
	...verificationHistory
];
```

## Security Considerations

### 1. JWT Security

**✅ DO:**

- Sign JWTs server-side only
- Use secure private key storage
- Set appropriate expiration times
- Validate partnerId matches configuration

**❌ DON'T:**

- Store private keys in client-side code
- Share private keys between environments
- Use hardcoded JWTs

### 2. Widget Integration

The AIR verification widget:

- Opens in a secure iframe or popup
- Handles all credential verification logic
- Returns only the verification result (no credential data exposed)
- Uses zero-knowledge proofs for privacy

### 3. CORS Configuration

For production, whitelist your domain:

```typescript
// Contact Moca team to whitelist
domains: ['https://your-app.com', 'https://staging.your-app.com'];
```

## API Integration

### Generate JWT Endpoint

```typescript
// POST /api/generate-jwt
{
  partnerId: string,
  operation: 'verification' | 'issuance',
  verifierDid?: string  // Required for verification
}

// Response
{
  token: string,        // Signed JWT
  algorithm: 'ES256' | 'RS256',
  kid: string          // Key ID used
}
```

### Verification Result

```typescript
interface VerificationResult {
	status:
		| 'Compliant'
		| 'Non-Compliant'
		| 'Pending'
		| 'Revoking'
		| 'Revoked'
		| 'Expired'
		| 'NotFound';
	// Additional fields may be present depending on the program
	[key: string]: any;
}
```

## Testing

### 1. Development Testing

Use the credential test page (`/credential-test`):

1. Issue a test credential
2. Verify the credential
3. Check status and result

### 2. Environment Setup

**Staging:**

```bash
PUBLIC_BUILD_ENV=staging
PUBLIC_VERIFICATION_PROGRAM_ID=test-verification-program
```

**Sandbox:**

```bash
PUBLIC_BUILD_ENV=sandbox
PUBLIC_VERIFICATION_PROGRAM_ID=your-sandbox-program-id
```

**Production:**

```bash
PUBLIC_BUILD_ENV=production
PUBLIC_VERIFICATION_PROGRAM_ID=your-production-program-id
```

## Troubleshooting

### Common Issues

#### 1. "AIR Service not initialized"

**Solution:** Ensure user is logged in and mocaAuth.init() is called

#### 2. "Failed to generate JWT"

**Solution:** Check partnerId configuration and API endpoint

#### 3. "Widget not loading"

**Solution:**

- Verify domain is whitelisted
- Check browser console for CORS errors
- Confirm programId is valid

#### 4. "Verification returns NotFound"

**Solution:**

- User may not have the required credential
- Check redirectUrl is set correctly
- Verify programId matches the credential type

## Reference Implementation

The verification flow is based on:

- [MocaNetwork/air-credential-example](https://github.com/MocaNetwork/air-credential-example)
- AIR Credential SDK Documentation
- Moca Network Developer Portal

### Key Files from Reference:

1. **CredentialVerification.tsx** - Main verification component
2. **jwt.ts** - JWT generation utilities
3. **environments.ts** - Environment configuration
4. **App.tsx** - AirService initialization

## Next Steps

### For Creators:

1. Configure verification programs in Moca Dashboard
2. Define verification requirements (e.g., age > 18, location = US)
3. Test verification flow with test credentials
4. Deploy to production with proper environment variables

### For Developers:

1. Review AIR SDK documentation for advanced features
2. Implement verification result handling in your business logic
3. Add verification checks to content access gates
4. Monitor verification success rates

## Support

- **AIR Kit Issues:** Contact Moca Network team
- **Integration Help:** See Moca Developer Documentation
- **This Implementation:** Check `/credential-test` for testing

## Additional Resources

- [Moca Network Documentation](https://docs.moca.network)
- [AIR Kit SDK Reference](https://github.com/MocaNetwork/airkit)
- [ZK Credentials Overview](https://docs.moca.network/credentials)
- [Example Repository](https://github.com/MocaNetwork/air-credential-example)
