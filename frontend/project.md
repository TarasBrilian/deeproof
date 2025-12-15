Deeproof Protocol: Privacy-Preserving ZK-KYC Infrastructure
Document Version: 3.0 (Hybrid Oracle & Blind Matching Architecture)

Status: In Development

Tagline: Deep Verification, Zero Disclosure.

1. Executive Summary
Deeproof Protocol is a decentralized infrastructure designed to bridge identity verification from the Web2 world (Centralized Exchanges/CEXs) to Web3 using Zero-Knowledge Proofs (ZKP).

Deeproof operates as a Privacy-Preserving Compliance Oracle. Unlike traditional KYC providers that expose user data, or SBTs that leave permanent footprints, Deeproof utilizes a "Just-in-Time" (JIT) Attestation model.

We securely bind a user's wallet to their KYC status and email hash in our encrypted database. When a user interacts with a third-party protocol (ICO/RWA), Deeproof issues a cryptographic signature via a Blind Matching API, proving the user's eligibility without ever revealing their raw identity or email to the third party.

2. Project Background & Objectives
Initially conceptualized as "Im Human," the project pivoted to Deeproof to address the strict compliance needs of Real World Assets (RWA) and Institutional DeFi.

Primary Objectives:

Identity Uniqueness (Anti-Sybil): By binding 1 KYC'd Identity to 1 Wallet (via Email), we prevent users from farming rewards or bypassing limits using multiple wallets.

Zero-Disclosure Verification: Using "Blind Hashing," partners can verify a user's status without ever seeing the user's email or personal data.

Regulatory Readiness: We maintain an encrypted audit trail (Email <-> Wallet link) to satisfy AML regulations, while keeping this data completely hidden from the public blockchain and partners during normal operations.

3. Target Users & Use Cases (B2B2C Model)
Deeproof operates as an Infrastructure Layer, serving:

RWA Protocols: Platforms needing to ensure investors are KYC'd and legally distinct entities without storing sensitive PII (Personally Identifiable Information).

Compliant Launchpads: Ensuring fair participation by enforcing "One Person, One Allocation."

Institutional DeFi: Permissioned pools requiring instant, stateless verification checks.

4. Technical Architecture: The Hybrid Oracle Model
Deeproof leverages Reclaim Protocol for ZK proofs and a Centralized Encrypted Database for identity binding, accessed via a Privacy-Preserving API.

Phase 1: Identity Binding & Onboarding (Deeproof Platform)
Objective: Link a Wallet to a Verified Identity securely.

Wallet Connection: User connects their Web3 Wallet (e.g., MetaMask).

Email Binding:

User inputs email address.

Deeproof verifies email ownership via OTP.

Security: Deeproof stores the Email_Hash (SHA-256) for API matching and Email_Encrypted (AES) for regulatory recovery. Raw email is never exposed in API responses.

ZK-KYC Verification:

User scans a QR code using the Reclaim Protocol app.

Reclaim verifies the user's Binance Account status (KYC Level 2).

Database Indexing:

Upon success, Deeproof updates the database:

Map: Wallet_Address <-> KYC_Status <-> Email_Hash.

Phase 2: Blind Matching & Just-in-Time Signing (Integration Flow)
Objective: Allow a Partner (RWA) to verify a user without seeing their data.

User Action: User attempts to invest on a Partner's RWA Website.

Data Hashing (Client-Side):

The Partner's frontend takes the user's email input.

It applies a strict normalization rule: SHA256(Lowercase(Trim(Email))).

It sends only this Hash (e.g., 0x9a8b...) to the Deeproof API.

Blind Matching (Server-Side):

Deeproof receives the Hash.

Deeproof queries its database: "Do we have a Verified User with this Hash?"

Logic Check: Ensure the Wallet attempting the transaction matches the Wallet bound to this Hash.

JIT Signing:

If matched, Deeproof's Admin Server signs a message using its Private Key.

Signature = Sign(UserAddress + ExpiryTimestamp + "KYC_VALID").

This signature is returned to the Partner's frontend.

Phase 3: On-Chain Settlement
Objective: The Smart Contract enforces the rules.

Transaction: The Partner's frontend submits the transaction to the blockchain, attaching the Deeproof Signature.

Verification:

The Partner's Smart Contract calls ecrecover on the signature.

It verifies the signer is indeed the DEEPROOF_ADMIN.

It verifies the signature has not expired.

Execution: Access is granted, and the investment proceeds.

5. Security & Privacy Principles
The "Blind Matching" Guarantee
Deeproof utilizes a strictly defined hashing protocol for API communication.

Partners send: 0xHash... (Random string)

Deeproof sees: 0xHash...

Result: Partners never send raw emails to Deeproof's API, and Deeproof never returns raw emails to Partners. Verification confirms "This is the same person," without revealing "Who this person is."

The "Right to be Forgotten"
Since verification relies on an off-chain database check (Hybrid Model):

If a user requests data deletion (GDPR), Deeproof deletes the database entry.

The API will immediately stop generating signatures for that user.

Access is instantly revoked across all integrated platforms, satisfying strict regulatory requirements for data control.