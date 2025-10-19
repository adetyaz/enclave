# Credential Verification Implementation

## Overview

# Credential Verification System

Complete technical documentation for Enclave's credential verification system powered by Moca Network's AIR Credential Services.

## Overview

The credential verification system allows creators (companies) to verify fan credentials in real-time using Zero-Knowledge proofs. This ensures privacy while confirming that users meet specific requirements (e.g., "Twitter followers >1K" or "Attended 5+ soccer matches").

## Architecture

### Components

1. **Frontend (SvelteKit)**: User interface for verification flow
2. **AIR Credential SDK**: Handles verification widget and proof validation
3. **JWT Service**: Generates authentication tokens for verification operations
4. **Moca Chain**: Stores verification results and transaction history
5. **zkTLS Oracle**: Validates credentials cryptographically

### Flow Diagram

```
User Request Verification
         ↓
Generate JWT (Server-side with partnerId + scope)
         ↓
Initialize AIR Widget with JWT + programId
         ↓
User Completes Verification (zkTLS proof generation)
         ↓
AIR SDK Returns Verification Result
         ↓
Display Status (Compliant/Non-Compliant/Pending/etc.)
         ↓
Store in Verification History (Local + On-chain option)
```

## Implementation Details

### 1. JWT Generation

**Endpoint**: `/api/generate-jwt`

**Purpose**: Create a signed JWT token for AIR Credential operations

**Parameters**:

```typescript
{
  operation: 'verification',
  scope: 'issue verify',
  partnerId: string,
  algorithm: 'ES256' | 'RS256'
}
```

**Response**:

```typescript
{
  token: string,  // JWT token for authentication
  expiresIn: number
}
```

### 2. Verification Configuration

**Environment Variables**:

```env
PUBLIC_CREATOR_VERIFY_ID=your_program_id        # Moca program ID
PUBLIC_VERIFIER_DID=did:example:verifier123     # Your DID
PUBLIC_PARTNERID=your_partner_id                # Partner identifier
PUBLIC_REDIRECT_URL_FOR_ISSUER=http://localhost:5173
```

### 3. Verification Statuses

The system supports 7 verification states:

| Status            | Description                    | UI Color |
| ----------------- | ------------------------------ | -------- |
| **Compliant**     | User meets all requirements    | Green    |
| **Non-Compliant** | User doesn't meet requirements | Red      |
| **Pending**       | Verification in progress       | Yellow   |
| **Revoking**      | Credential being revoked       | Orange   |
| **Revoked**       | Credential has been revoked    | Gray     |
| **Expired**       | Credential has expired         | Gray     |
| **NotFound**      | No credential found            | Gray     |

### 4. UI Components

**Status Badge**:

- Displays current verification state
- Color-coded for quick visual recognition
- Includes status icon (CheckCircle2, XCircle, Clock, etc.)

**Verification History**:

- Tracks all verification attempts
- Shows timestamp, status, and fan address
- Expandable details for each verification

**Configuration Checker**:

- Validates environment setup
- Shows which variables are configured
- Warns if missing required settings

## Code Examples

### Initialize Verification

```typescript
import { mocaAuth } from '$lib/services/useAirKit';

async function startVerification() {
	// 1. Generate JWT token
	const jwtResponse = await fetch('/api/generate-jwt', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			operation: 'verification',
			scope: 'issue verify'
		})
	});

	const { token: authToken } = await jwtResponse.json();

	// 2. Start verification with AIR SDK
	const result = await mocaAuth.airService.verifyCredential({
		authToken,
		programId: PUBLIC_CREATOR_VERIFY_ID,
		redirectUrl: PUBLIC_REDIRECT_URL_FOR_ISSUER
	});

	// 3. Handle result
	if (result.status === 'Compliant') {
		console.log('User verified successfully!');
		// Grant access, award points, etc.
	}
}
```

### Status Helpers

```typescript
function getStatusColor(status: string): string {
	switch (status) {
		case 'Compliant':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'Non-Compliant':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'Pending':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'Revoking':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'Revoked':
		case 'Expired':
		case 'NotFound':
			return 'bg-gray-100 text-gray-800 border-gray-300';
		default:
			return 'bg-gray-100 text-gray-600 border-gray-200';
	}
}

function getStatusIcon(status: string): typeof LucideIcon {
	switch (status) {
		case 'Compliant':
			return CheckCircle2;
		case 'Non-Compliant':
			return XCircle;
		case 'Pending':
			return Clock;
		case 'Revoking':
			return AlertTriangle;
		case 'Revoked':
			return Ban;
		case 'Expired':
			return Calendar;
		case 'NotFound':
			return Search;
		default:
			return AlertCircle;
	}
}
```

## Security Considerations

### JWT Security

- JWTs are signed server-side with ES256/RS256
- Include `partnerId` in claims for authorization
- Short expiration time (recommended: 1 hour)
- Never expose private keys to frontend

### Privacy Protection

- Zero-Knowledge proofs ensure user data privacy
- Only verification results are shared, not raw data
- User maintains full control over credential lifecycle

### Access Control

- Verify JWT on every verification request
- Validate `programId` matches registered program
- Check user authorization before verification

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Credential Verification', () => {
	it('should generate valid JWT', async () => {
		const jwt = await generateVerificationJWT();
		expect(jwt).toBeDefined();
		expect(jwt.split('.').length).toBe(3);
	});

	it('should return correct status color', () => {
		expect(getStatusColor('Compliant')).toContain('green');
		expect(getStatusColor('Non-Compliant')).toContain('red');
	});

	it('should handle verification result', async () => {
		const result = await verifyCredential('test-program-id');
		expect(result).toHaveProperty('status');
	});
});
```

### Integration Testing

1. **Setup Mock Environment**:

   ```typescript
   process.env.PUBLIC_CREATOR_VERIFY_ID = 'test-program-123';
   process.env.PUBLIC_PARTNERID = 'test-partner';
   ```

2. **Test Verification Flow**:
   - Generate JWT
   - Call verification API
   - Validate response structure
   - Check status handling

3. **Test Edge Cases**:
   - Missing configuration
   - Invalid JWT
   - Network failures
   - Expired credentials

## Troubleshooting

### Common Issues

**Issue**: "Configuration Required" warning

**Solution**: Set `PUBLIC_CREATOR_VERIFY_ID` in `.env`:

```env
PUBLIC_CREATOR_VERIFY_ID=your_program_id
```

---

**Issue**: JWT generation fails

**Solution**:

- Verify `PUBLIC_PARTNERID` is set
- Check server-side signing key configuration
- Ensure ES256/RS256 algorithm is supported

---

**Issue**: Verification widget doesn't load

**Solution**:

- Check `PUBLIC_REDIRECT_URL_FOR_ISSUER` is correct
- Verify domain is whitelisted with Moca team
- Inspect browser console for errors

---

**Issue**: "NotFound" status for valid credentials

**Solution**:

- Ensure `programId` matches the credential's program
- Verify user has issued the credential
- Check credential hasn't expired

## API Reference

### AIR Credential SDK

```typescript
interface VerifyCredentialParams {
  authToken: string;      // JWT from generate-jwt endpoint
  programId: string;      // Program ID for verification
  redirectUrl: string;    // Callback URL after verification
}

interface VerificationResult {
  status: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Revoking' |
          'Revoked' | 'Expired' | 'NotFound';
  credentialId?: string;
  timestamp: string;
  proof?: string;         // ZK proof data
  metadata?: Record<string, any>;
}

// Verify credential
await airService.verifyCredential(params: VerifyCredentialParams): Promise<VerificationResult>
```

## Best Practices

1. **Always Generate Fresh JWTs**: Don't reuse old tokens
2. **Handle All Status Cases**: Plan for Pending, Expired, etc.
3. **Store Verification History**: Keep audit trail for compliance
4. **Validate Configuration**: Check env vars before operations
5. **Provide Clear Feedback**: Show loading states and error messages
6. **Test Edge Cases**: Network failures, timeouts, invalid data
7. **Monitor Performance**: Track verification completion times
8. **Respect Privacy**: Only access necessary credential attributes

## Production Checklist

Before deploying to production:

- [ ] Generate production JWT signing keys (ES256/RS256)
- [ ] Register production domain with Moca Network
- [ ] Obtain production `programId` from Moca Dashboard
- [ ] Configure production environment variables
- [ ] Set up monitoring for verification success rates
- [ ] Implement error tracking (Sentry, etc.)
- [ ] Add rate limiting for JWT generation
- [ ] Test verification flow end-to-end
- [ ] Document user verification requirements
- [ ] Set up backup/recovery procedures

## Resources

- [Moca AIR Credential Docs](https://docs.moca.network/air-credential)
- [zkTLS Documentation](https://docs.moca.network/zktls)
- [Example Implementation](https://github.com/MocaNetwork/air-credential-example)
- [Moca Dashboard](https://dashboard.moca.network)
- [Enclave Documentation](https://enclave-docs.netlify.app)

## Support

For technical support:

- Discord: [discord.gg/mocaverse](https://discord.gg/mocaverse)
- Email: support@enclave.app
- GitHub Issues: [github.com/adetyaz/enclave/issues](https://github.com/adetyaz/enclave/issues)

---

**Last Updated**: October 19, 2025  
**Version**: 1.0.0

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
