# DeepProof API Documentation

> **Deep Verification, Zero Disclosure.**

## Table of Contents

- [Introduction](#introduction)
- [Base URL & Environment](#base-url--environment)
- [Authentication](#authentication)
- [General Conventions](#general-conventions)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Reclaim Protocol Endpoints](#reclaim-protocol-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Identity Binding Endpoints](#identity-binding-endpoints)
- [Verification & Proof Flow](#verification--proof-flow)
- [Security Considerations](#security-considerations)
- [Common Integration Flow](#common-integration-flow)
- [FAQ / Troubleshooting](#faq--troubleshooting)

---

## Introduction

### What is DeepProof?

DeepProof Protocol is a decentralized infrastructure designed to bridge identity verification from the Web2 world (Centralized Exchanges/CEXs) to Web3 using Zero-Knowledge Proofs (ZKP). It operates as a **Privacy-Preserving Compliance Oracle**.

### What Problems Does It Solve?

1. **Identity Uniqueness (Anti-Sybil)**: Binds 1 KYC'd Identity to 1 Wallet (via Email), preventing users from farming rewards or bypassing limits using multiple wallets.

2. **Zero-Disclosure Verification**: Using "Blind Hashing," partners can verify a user's status without ever seeing the user's email or personal data.

3. **Regulatory Readiness**: Maintains an encrypted audit trail (Email ↔ Wallet link) to satisfy AML regulations, while keeping data hidden from the public blockchain and partners during normal operations.

### High-Level Integration Overview

DeepProof integrates with third-party applications through a three-phase process:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DeepProof Integration Flow                       │
└─────────────────────────────────────────────────────────────────────────┘

Phase 1: Identity Binding (User Onboarding)
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Connect    │ -> │   Reclaim    │ -> │    Email     │ -> │    Bind      │
│   Wallet     │    │   ZK-KYC     │    │ Verification │    │   Identity   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

Phase 2: Blind Matching (Partner Verification)
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User Inputs │ -> │  Partner     │ -> │  DeepProof   │
│    Email     │    │  Hashes It   │    │   Matches    │
└──────────────┘    └──────────────┘    └──────────────┘

Phase 3: On-Chain Settlement
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  JIT Signed  │ -> │   Contract   │ -> │   Access     │
│  Attestation │    │   Verifies   │    │   Granted    │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Base URL & Environment

### Base API URL

| Environment | Base URL |
|-------------|----------|
| **Development** | `http://localhost:3001` |
| **Production** | Configure via `BASE_URL` environment variable |

### Environment Variables

The following environment variables must be configured:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `BASE_URL` | Public base URL for callbacks |
| `DATABASE_URL` | PostgreSQL connection string |
| `ENCRYPTION_KEY` | 256-bit key for AES-256-GCM encryption |
| `RECLAIM_APP_ID` | Reclaim Protocol application ID |
| `RECLAIM_APP_SECRET` | Reclaim Protocol application secret |
| `RECLAIM_PROVIDER_ID` | Reclaim Protocol provider ID (Binance KYC) |
| `FRONTEND_URL` | Frontend application URL for magic links |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `MAILJET_API_KEY` | Mailjet API key for sending emails |
| `MAILJET_SECRET_KEY` | Mailjet secret key |

---

## Authentication

### Session-Based Authentication

DeepProof uses session token-based authentication for protected endpoints.

### Required Headers

```http
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Token Lifecycle

1. **Magic Link Token**: Generated when requesting email verification. Valid for **15 minutes**.
2. **Session Token**: Created after successfully verifying a magic link. Valid for **24 hours**.

### Obtaining a Session Token

1. Complete Reclaim KYC verification → Receive `sessionId`
2. Request magic link with verified email → Email sent with token
3. Click magic link → Receive `sessionToken`
4. Use `sessionToken` in `Authorization` header for authenticated requests

---

## General Conventions

### Content-Type

All requests and responses use JSON format:

```http
Content-Type: application/json
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Optional success message",
  "data": { ... }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid input or missing required fields |
| `401` | Unauthorized - Missing or invalid session token |
| `403` | Forbidden - Email mismatch or access denied |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists (e.g., wallet already bound) |
| `500` | Internal Server Error |
| `501` | Not Implemented |

### Rate Limiting

Currently, there is no explicit rate limiting configured. Implement rate limiting at the infrastructure level (e.g., API Gateway, reverse proxy) for production deployments.

---

## API Endpoints

### Health Check

#### `GET /health`

Check if the server is running.

**Request Headers:** None required

**Response:**

```json
{
  "success": true,
  "message": "Reclaim Protocol + Binance KYC Server is running",
  "timestamp": "2024-12-15T10:00:00.000Z"
}
```

---

#### `GET /api/binance/kyc-status`

Get Binance account KYC status (for testing purposes only).

> ⚠️ **Note:** This endpoint requires Binance API credentials configured on the server and is intended for internal testing only.

**Response:**

```json
{
  "success": true,
  "data": {
    "data": "Normal"
  }
}
```

---

### Reclaim Protocol Endpoints

#### `GET /api/reclaim/init`

Initialize a new Reclaim proof request for ZK-KYC verification.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Binance User ID (UID) to verify |
| `userAddress` | string | No | User's wallet address for context |

**Request Example:**

```bash
curl -X GET "http://localhost:3001/api/reclaim/init?userId=123456789&userAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4C"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "requestUrl": "https://share.reclaimprotocol.org/...",
    "statusUrl": "https://reclaimprotocol.org/api/status/...",
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "reclaimProofRequestConfig": "{...serialized config...}"
  }
}
```

**Response Fields:**

| Field | Description |
|-------|-------------|
| `requestUrl` | URL for the QR code that users scan with Reclaim app |
| `statusUrl` | URL to check verification status |
| `sessionId` | Unique session identifier for tracking verification progress |
| `reclaimProofRequestConfig` | JSON string for frontend SDK initialization |

---

#### `POST /api/reclaim/callback`

Callback endpoint that receives proofs from the Reclaim Protocol.

> 🔒 **Internal Endpoint:** This endpoint is called by Reclaim Protocol servers, not by client applications.

**Request Body:**

The body format varies based on Reclaim's callback structure. The endpoint handles:
- JSON-encoded proofs
- URL-encoded proofs
- Session status updates

**Response:**

```json
{
  "success": true,
  "verifiedProofs": [
    {
      "valid": true,
      "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "binanceUid": "123456789"
    }
  ]
}
```

---

#### `GET /api/reclaim/status/:sessionId`

Check the verification status of a Reclaim session.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID from `/api/reclaim/init` |

**Request Example:**

```bash
curl -X GET "http://localhost:3001/api/reclaim/status/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**Response (Pending):**

```json
{
  "success": true,
  "session": {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "PENDING",
    "createdAt": "2024-12-15T10:00:00.000Z",
    "updatedAt": "2024-12-15T10:00:00.000Z"
  }
}
```

**Response (Verified):**

```json
{
  "success": true,
  "session": {
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "binance_uid": "123456789",
    "emailHash": "5d41402abc4b2a76b9719d911017c592...",
    "status": "VERIFIED",
    "createdAt": "2024-12-15T10:00:00.000Z",
    "updatedAt": "2024-12-15T10:01:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Session not found"
}
```

---

#### `POST /api/reclaim/save-verification`

Save verification data after a successful Reclaim proof.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID from initialization |
| `email` | string | No | User's email address |
| `userId` | string | No | Binance User ID |
| `paramValues` | object | No | Additional parameters from proof |

**Request Example:**

```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com",
  "userId": "123456789"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Verification data saved successfully",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### Authentication Endpoints

#### `POST /api/auth/send-magic-link`

Send a magic link email for email verification.

> ⚠️ **Prerequisite:** User must have completed Reclaim verification first.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address to verify |
| `sessionId` | string | Yes | Verified Reclaim session ID |

**Request Example:**

```json
{
  "email": "user@example.com",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Magic link sent to your email"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| `400` | "Email is required" | Missing email field |
| `400` | "Session ID is required for validation" | Missing sessionId |
| `403` | "Email does not match the verified identity" | Email hash mismatch |
| `404` | "Verification session not found" | Invalid sessionId |

---

#### `GET /api/auth/verify-magic-link`

Verify a magic link token and create a session.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | Magic link token from email |

**Request Example:**

```bash
curl -X GET "http://localhost:3001/api/auth/verify-magic-link?token=abc123..."
```

**Response:**

```json
{
  "success": true,
  "sessionToken": "def456...",
  "email": "user@example.com",
  "emailHash": "5d41402abc4b2a76b9719d911017c592...",
  "expiresAt": "2024-12-16T10:00:00.000Z"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| `400` | "Token is required" | Missing token |
| `400` | "Invalid or expired token" | Token not found |
| `400` | "This link has already been used" | Token already consumed |
| `400` | "This link has expired" | Token past expiry time |

---

#### `GET /api/auth/session`

Check the current session status.

**Request Headers:**

```http
Authorization: Bearer <session_token>
```

**Response:**

```json
{
  "success": true,
  "email": "[encrypted]",
  "emailHash": "5d41402abc4b2a76b9719d911017c592...",
  "verified": true,
  "expiresAt": "2024-12-16T10:00:00.000Z"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| `401` | "No session token provided" | Missing Authorization header |
| `401` | "Invalid session" | Session not found |
| `401` | "Session expired" | Session past expiry time |

---

#### `POST /api/auth/logout`

End the current session.

**Request Headers:**

```http
Authorization: Bearer <session_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### `POST /api/auth/verify-email-match`

Verify that an email matches the stored identity from Reclaim verification.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | Yes | Reclaim session ID |
| `email` | string | Yes | Email to verify |

**Request Example:**

```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com"
}
```

**Response (Match):**

```json
{
  "success": true,
  "matched": true
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| `400` | "sessionId is required" | Missing sessionId |
| `400` | "email is required" | Missing email |
| `400` | "No email was stored during verification" | Session has no email hash |
| `403` | "Email does not match verified identity" | Hash mismatch |
| `404` | "Verification session not found" | Invalid sessionId |

---

### Identity Binding Endpoints

#### `POST /api/bind`

Bind a verified identity to a wallet address.

> 🔐 **Security:** Requires a cryptographic signature from the wallet.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletAddress` | string | Yes | Ethereum wallet address |
| `email` | string | Yes | Verified email address |
| `signature` | string | Yes | Wallet signature of identity hash |
| `sessionId` | string | Yes | Verified Reclaim session ID |

**Signature Message Format:**

The wallet must sign the following message:
```
Bind Identity: <SHA-256 hash of normalized email>
```

**Request Example:**

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4C",
  "email": "user@example.com",
  "signature": "0x123abc...",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Identity successfully bound to wallet",
  "data": {
    "id": 1,
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f2bd4c",
    "identityHash": "5d41402abc4b2a76b9719d911017c592...",
    "binance_uid": "123456789",
    "createdAt": "2024-12-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| `400` | "Missing required fields: walletAddress, email, signature, sessionId" | Incomplete request |
| `400` | "Invalid signature" | Malformed signature |
| `400` | "Signature verification failed: Address mismatch" | Recovered address doesn't match |
| `400` | "Identity session not found or not verified" | Invalid or unverified session |
| `400` | "Email does not match the verified KYC identity" | Email hash mismatch |
| `409` | "This wallet is already bound to an identity" | Wallet already registered |
| `409` | "This Binance Identity is already bound" | Binance UID already used |

---

## Verification & Proof Flow

### Step-by-Step Verification Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Complete Verification Flow                            │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Initialize Verification
┌────────────────────────────────────────────────────────────────────────────┐
│  Client                     │  DeepProof API           │  Reclaim Protocol │
│                             │                          │                   │
│  GET /api/reclaim/init      │                          │                   │
│  ?userId=<binance_uid>      │                          │                   │
│  ─────────────────────────► │                          │                   │
│                             │  Initialize Proof        │                   │
│                             │  Request ───────────────►│                   │
│                             │                          │                   │
│  ◄───────────────────────── │  Return requestUrl,      │                   │
│  { requestUrl, sessionId }  │  sessionId, config       │                   │
└────────────────────────────────────────────────────────────────────────────┘

Step 2: User Scans QR Code
┌────────────────────────────────────────────────────────────────────────────┐
│  User scans requestUrl QR code with Reclaim mobile app                     │
│  Reclaim verifies Binance account KYC Level 2 status                       │
│  zkTLS proof generated (no raw data exposed)                               │
└────────────────────────────────────────────────────────────────────────────┘

Step 3: Proof Callback & Status Polling
┌────────────────────────────────────────────────────────────────────────────┐
│  Reclaim Protocol           │  DeepProof API           │  Client           │
│                             │                          │                   │
│  POST /api/reclaim/callback │                          │                   │
│  { proof data }             │                          │                   │
│  ─────────────────────────► │                          │                   │
│                             │  Verify proof            │                   │
│                             │  Extract: email, userId  │                   │
│                             │  Hash & encrypt email    │                   │
│                             │  Update session status   │                   │
│                             │                          │                   │
│                             │                          │  Poll status      │
│                             │ ◄───────────────────────│  GET /status/:id  │
│                             │                          │                   │
│                             │  { status: "VERIFIED" } ─┼─────────────────► │
└────────────────────────────────────────────────────────────────────────────┘

Step 4: Email Verification
┌────────────────────────────────────────────────────────────────────────────┐
│  Client                     │  DeepProof API           │  Email Service    │
│                             │                          │                   │
│  POST /api/auth/            │                          │                   │
│  verify-email-match        │                          │                   │
│  { sessionId, email }       │                          │                   │
│  ─────────────────────────► │                          │                   │
│                             │  Hash input email        │                   │
│                             │  Compare with stored     │                   │
│  ◄───────────────────────── │  { matched: true }       │                   │
│                             │                          │                   │
│  POST /api/auth/            │                          │                   │
│  send-magic-link            │                          │                   │
│  ─────────────────────────► │                          │                   │
│                             │  Send email ────────────►│                   │
│  ◄───────────────────────── │  "Magic link sent"       │                   │
└────────────────────────────────────────────────────────────────────────────┘

Step 5: Identity Binding
┌────────────────────────────────────────────────────────────────────────────┐
│  Client                     │  DeepProof API           │  Database         │
│                             │                          │                   │
│  Sign message:              │                          │                   │
│  "Bind Identity: <hash>"    │                          │                   │
│                             │                          │                   │
│  POST /api/bind             │                          │                   │
│  { walletAddress, email,    │                          │                   │
│    signature, sessionId }   │                          │                   │
│  ─────────────────────────► │                          │                   │
│                             │  Verify signature        │                   │
│                             │  Validate session        │                   │
│                             │  Check uniqueness        │                   │
│                             │  Create user ───────────►│                   │
│  ◄───────────────────────── │  { success, userData }   │                   │
└────────────────────────────────────────────────────────────────────────────┘
```

### zkTLS / Cryptographic Guarantees

DeepProof leverages **Reclaim Protocol's zkTLS** technology to provide cryptographic guarantees:

1. **Zero-Knowledge Proofs**: Users prove their Binance KYC status without revealing personal information.

2. **TLS Session Attestation**: Reclaim creates a cryptographic proof of the TLS session with Binance, ensuring the data comes from the authentic source.

3. **Selective Disclosure**: Only specific claims (email, user ID, trade level) are extracted and proven, not entire account data.

4. **Non-Transferable Proofs**: Each proof is bound to the specific session and cannot be reused or transferred.

---

## Security Considerations

### Data Handling

| Data Type | Storage | Exposure |
|-----------|---------|----------|
| Raw Email | Never stored | Never returned in API responses |
| Email Hash (SHA-256) | Stored in DB | Used for blind matching |
| Email Encrypted (AES-256-GCM) | Stored in DB | For regulatory recovery only |
| Binance UID | Stored in DB | Returned in bind response |
| Wallet Address | Stored (lowercase) | Public information |
| Wallet Signature | Stored | Proof of consent |

### Encryption Details

- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key Derivation**: scrypt with configurable salt
- **IV**: Random 16 bytes per encryption
- **Format**: `{iv}:{authTag}:{ciphertext}` (hex encoded)

### Hashing Protocol

```javascript
// Email normalization and hashing
const normalizedEmail = email.trim().toLowerCase();
const hash = SHA256(normalizedEmail);
```

### Developer Responsibilities

1. **Store session tokens securely** (HTTPOnly cookies, secure storage)
2. **Implement HTTPS** in production environments
3. **Hash emails client-side** when implementing blind matching for partner integrations
4. **Never log or store raw email addresses**
5. **Implement rate limiting** at the infrastructure level
6. **Validate all user inputs** before sending to API

### The "Blind Matching" Guarantee

When partners integrate with DeepProof for verification:

```
Partner sees:     SHA256(email)  →  "0x5d41402abc..."
DeepProof sees:   SHA256(email)  →  "0x5d41402abc..."
Neither side sees the raw email during API communication.
```

---

## Common Integration Flow

### Example: RWA Platform Integration

```javascript
// 1. Initialize verification (Frontend)
const response = await fetch('/api/reclaim/init?userId=123456789', {
  method: 'GET'
});
const { data } = await response.json();
const { requestUrl, sessionId } = data;

// 2. Display QR code for user to scan
displayQRCode(requestUrl);

// 3. Poll for verification status
const pollStatus = async () => {
  const statusRes = await fetch(`/api/reclaim/status/${sessionId}`);
  const { session } = await statusRes.json();
  
  if (session.status === 'VERIFIED') {
    return session;
  }
  
  // Retry after 2 seconds
  await new Promise(r => setTimeout(r, 2000));
  return pollStatus();
};

const verifiedSession = await pollStatus();

// 4. Verify email ownership
const matchRes = await fetch('/api/auth/verify-email-match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: verifiedSession.sessionId,
    email: userInputEmail
  })
});

// 5. Send magic link for email verification
await fetch('/api/auth/send-magic-link', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: verifiedSession.sessionId,
    email: userInputEmail
  })
});

// 6. After user clicks magic link, bind identity
const message = `Bind Identity: ${sha256(userInputEmail.toLowerCase())}`;
const signature = await wallet.signMessage(message);

const bindRes = await fetch('/api/bind', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: wallet.address,
    email: userInputEmail,
    signature,
    sessionId: verifiedSession.sessionId
  })
});

const { data: user } = await bindRes.json();
console.log('Identity bound:', user);
```

---

## FAQ / Troubleshooting

### Common Errors

#### "Email does not match the verified identity"

**Cause:** The email entered by the user doesn't match the email from their Binance account (verified via Reclaim).

**Solution:**
- Ensure the user enters the exact email associated with their Binance account
- Check for typos, extra spaces, or capitalization differences (system normalizes to lowercase)

---

#### "Session not found"

**Cause:** The `sessionId` is invalid or the session has not been created.

**Solution:**
- Verify you're using the `sessionId` returned from `/api/reclaim/init`
- Sessions are created immediately when calling `/api/reclaim/init`
- Check that the Reclaim callback was received

---

#### "This wallet is already bound to an identity"

**Cause:** The wallet address has already been linked to another identity.

**Solution:**
- Each wallet can only be bound once (1:1 relationship)
- Users cannot change their bound wallet unless the admin deletes the record

---

#### "This Binance Identity is already bound"

**Cause:** The Binance UID from the KYC verification is already linked to another wallet.

**Solution:**
- This prevents Sybil attacks
- Users cannot use the same Binance account for multiple wallets

---

#### "Invalid signature" or "Signature verification failed"

**Cause:** The wallet signature doesn't match the expected message or wallet address.

**Solution:**
- Ensure the message being signed is exactly: `Bind Identity: <identity_hash>`
- The `identity_hash` must be the SHA-256 hash of the lowercase, trimmed email
- Verify the signing wallet matches the `walletAddress` in the request

---

#### "Verification session not found or not verified"

**Cause:** The Reclaim verification has not completed yet.

**Solution:**
- Poll `/api/reclaim/status/:sessionId` until status is `VERIFIED`
- Ensure the user completes the Reclaim verification flow

---

### Debugging Tips

1. **Check Session Status First**
   ```bash
   curl "http://localhost:3001/api/reclaim/status/YOUR_SESSION_ID"
   ```

2. **Verify Email Hash Locally**
   ```javascript
   const crypto = require('crypto');
   const normalizedEmail = email.trim().toLowerCase();
   const hash = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
   console.log('Expected hash:', hash);
   ```

3. **Test Signature Verification**
   ```javascript
   const { ethers } = require('ethers');
   const message = `Bind Identity: ${identityHash}`;
   const recoveredAddress = ethers.verifyMessage(message, signature);
   console.log('Recovered:', recoveredAddress);
   console.log('Expected:', walletAddress);
   ```

4. **Enable Server Logs**
   - The server logs verification progress with emoji indicators:
     - `📝` Session created
     - `📥` Save verification received
     - `✅` Verification successful
     - `❌` Verification failed
     - `🔐` Email match verification

---

## Data Models Reference

### User

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Auto-increment primary key |
| `binance_uid` | String | Unique Binance user ID |
| `emailHash` | String | SHA-256 hash of email |
| `emailEncrypted` | String | AES-256-GCM encrypted email |
| `walletAddress` | String | Ethereum wallet address (lowercase) |
| `identityHash` | String | SHA-256 hash used for binding |
| `signature` | String | Wallet signature proof |
| `createdAt` | DateTime | Record creation time |
| `updatedAt` | DateTime | Last update time |

### ReclaimSession

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | String | Primary key (from Reclaim) |
| `binance_uid` | String | Verified Binance user ID |
| `emailHash` | String | SHA-256 hash of verified email |
| `emailEncrypted` | String | AES-256-GCM encrypted email |
| `status` | String | `PENDING` or `VERIFIED` |
| `createdAt` | DateTime | Session creation time |
| `updatedAt` | DateTime | Last update time |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-15 | Initial API documentation |

---

*DeepProof Protocol - Deep Verification, Zero Disclosure.*
