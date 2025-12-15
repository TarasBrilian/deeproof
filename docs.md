# DeepProof Documentation

> **Deep Verification, Zero Disclosure.**

---

## Table of Contents

- [Introduction](#introduction)
- [The Problem](#the-problem)
- [How DeepProof Solves It](#how-deepproof-solves-it)
- [End-to-End User Flow](#end-to-end-user-flow)
- [Trust & Privacy by Design](#trust--privacy-by-design)
- [Technology Overview](#technology-overview)
- [Use Cases](#use-cases)
- [Why DeepProof Is Different](#why-deepproof-is-different)
- [Getting Started](#getting-started)

---

## Introduction

### What is DeepProof?

DeepProof is a privacy-preserving identity verification system that connects your real-world identity to your blockchain wallet—without ever exposing your personal information.

Think of it as a secure bridge between two worlds:
- **Web2**: Traditional platforms where you've already verified your identity (like cryptocurrency exchanges)
- **Web3**: Blockchain applications where you need to prove you're a real, verified person

DeepProof lets you prove who you are without revealing who you are.

### Who is it for?

DeepProof is designed for:

- **Individual Users** who want to participate in blockchain investments, token sales, or decentralized finance while maintaining their privacy
- **Blockchain Platforms** that need to ensure their users are verified individuals without storing sensitive personal data
- **Regulated Projects** in Real World Assets (RWA), institutional DeFi, or compliant token launches that require identity verification for legal reasons

Whether you're an investor wanting to access exclusive opportunities, or a platform needing to meet compliance requirements, DeepProof provides the solution.

---

## The Problem

### What challenges do users face today?

**For Individuals:**

1. **Privacy Invasion**: Traditional verification systems force you to share sensitive personal documents (passport, ID, proof of address) with every platform you use. Your data gets copied and stored in multiple databases, increasing the risk of breaches and identity theft.

2. **Repeated Verification**: You've already proven your identity to your bank, your cryptocurrency exchange, and countless other services. Yet every new platform requires you to go through the same tedious process again.

3. **No Control Over Your Data**: Once you share your information, you lose control over how it's used, stored, or shared with third parties.

4. **Permanent Digital Footprints**: Some blockchain-based identity solutions create permanent, public records of your verification status that can never be deleted.

**For Platforms:**

1. **Sybil Attacks**: Bad actors create multiple fake identities to game systems, such as claiming unfair allocations in token sales or manipulating governance votes.

2. **Data Liability**: Storing sensitive personal information makes platforms targets for hackers and creates significant legal and regulatory burdens.

3. **User Friction**: Complex verification processes drive away legitimate users who don't want to share their personal documents with yet another company.

### Why existing solutions fall short

**Traditional KYC Providers:**
- Store your raw personal data in centralized databases
- Create single points of failure for data breaches
- Share your information with multiple parties
- Offer no way for you to truly delete your data

**Blockchain-Based Identity Tokens (SBTs):**
- Create permanent, immutable records on public blockchains
- Cannot be easily revoked or deleted
- Don't satisfy regulatory requirements for data erasure (like GDPR)
- Your verification status becomes permanently public

**Self-Sovereign Identity Solutions:**
- Often too complex for average users
- Require managing cryptographic keys and credentials
- Lack widespread adoption and integration

---

## How DeepProof Solves It

### The Simple Idea

DeepProof uses a clever approach: instead of storing or sharing your personal information, it works with a cryptographic fingerprint of your identity.

Here's the key insight: **You've already verified your identity** with trusted platforms like Binance, OKX, or other exchanges. These platforms have done thorough KYC (Know Your Customer) checks on you. DeepProof simply creates a privacy-preserving link between that existing verification and your blockchain wallet.

### The Three-Layer Solution

**Layer 1: Prove Without Revealing**

When you verify with DeepProof, you prove that you have a verified account on a trusted exchange—without showing any of your personal details. The exchange never knows you're using DeepProof, and DeepProof never sees your exchange login credentials.

**Layer 2: One Identity, One Wallet**

DeepProof binds your verified identity to one wallet address. This prevents the same person from using multiple wallets to game systems while keeping your real identity completely private.

**Layer 3: Instant Verification for Partners**

When you interact with platforms that use DeepProof, they can instantly verify you're a real, verified person—without ever seeing your email, name, or any personal data. They only see a confirmation: "Yes, this wallet belongs to a verified individual."

### What Happens Behind the Scenes

When you complete verification:

1. **Cryptographic Proof Generation**: A secure proof is created that says "This person has a verified Binance account" without revealing any account details.

2. **Hash Creation**: Your email is converted into a unique mathematical fingerprint (called a hash). This fingerprint can confirm "it's the same person" but cannot be reversed to reveal your actual email.

3. **Encrypted Storage**: For regulatory compliance, an encrypted version of the connection is stored. This can only be accessed under specific legal requirements and is invisible during normal operations.

4. **Wallet Binding**: Your wallet signs a message to confirm ownership, creating a permanent link between your verified status and that specific wallet.

The result: partners can verify you're real without seeing any personal data, and you maintain full control over your privacy.

---

## End-to-End User Flow

### Your Journey with DeepProof

Here's exactly what happens when you use DeepProof, step by step:

---

#### Step 1: Connect Your Wallet

**What you do:**
- Visit DeepProof and click "Start Binding"
- Connect your Web3 wallet (like MetaMask)

**What you see:**
- A wallet connection prompt asking you to approve the connection
- Once connected, your wallet address appears on the screen

**What DeepProof does:**
- Recognizes your wallet address
- Prepares your session for verification

---

#### Step 2: Choose Your Verification Source

**What you do:**
- Select a verification provider (currently Binance is available)
- Click on the Binance option

**What you see:**
- A list of available verification providers
- Clear indicators showing which are available now and which are coming soon

**What DeepProof does:**
- Initiates a secure verification session
- Prepares a QR code for the next step

---

#### Step 3: Scan the Verification QR Code

**What you do:**
- Open the Reclaim Protocol app on your phone
- Scan the QR code displayed on screen
- Follow the prompts in the app to verify your Binance account

**What you see:**
- A QR code with a "Waiting for verification..." status
- Progress updates as the verification proceeds

**What DeepProof does:**
- Waits for cryptographic proof from the Reclaim Protocol
- Verifies the proof is authentic and valid
- Extracts only necessary information (email hash, user ID) from the proof
- Never sees your Binance password or sensitive account details

> **Important**: During this step, you're logging into Binance through the Reclaim app—not sharing your credentials with DeepProof. Reclaim creates a cryptographic proof of your KYC status without exposing any personal data.

---

#### Step 4: Verify Your Email

**What you do:**
- Enter the email address associated with your Binance account
- Click "Verify it's me" to confirm the email matches your KYC identity
- Receive a magic link in your email
- Click the magic link to verify ownership

**What you see:**
- An email input field
- A confirmation message when your email matches the verified identity
- A success message after clicking the magic link

**What DeepProof does:**
- Converts your email into a cryptographic hash
- Compares this hash to the one from your Binance verification (without ever seeing the raw email from Binance)
- Sends a one-time magic link to confirm you own this email
- Marks your email as verified once you click the link

---

#### Step 5: Bind Your Identity

**What you do:**
- Review the binding summary (your wallet address and identity hash)
- Click "Bind Identity & Generate Proof"
- Approve the signature request in your wallet

**What you see:**
- A visual representation of your wallet being linked to your identity hash
- A signature request in your wallet with a message like "Bind Identity: [hash]"
- A success confirmation once complete

**What DeepProof does:**
- Verifies your wallet signature is authentic
- Creates a permanent binding between your wallet and your verified identity
- Stores only the cryptographic hash—never your raw email or personal details
- Confirms the binding is complete

---

#### Step 6: You're Verified!

**What you do:**
- Nothing—you're done!

**What you see:**
- A confirmation that your identity is now bound to your wallet
- You can now use your wallet on any platform that integrates with DeepProof

**What DeepProof does:**
- Your verification is now ready to use
- Partner platforms can instantly verify your status
- You never need to share personal documents again

---

### Using Your Verification on Partner Platforms

After completing the DeepProof process, here's how it works when you want to access a platform that requires identity verification:

1. **You visit a partner platform** (like an RWA investment site or token launchpad)
2. **You connect your verified wallet**
3. **The platform asks DeepProof**: "Is this wallet linked to a verified individual?"
4. **DeepProof responds with a simple yes/no** and a cryptographic signature proving the answer is authentic
5. **You get instant access**—no documents, no waiting, no repeated verification

The entire verification check happens in seconds, and the partner never sees any of your personal information.

---

## Trust & Privacy by Design

### How Your Data is Protected

DeepProof is built from the ground up with privacy as the core principle. Here's exactly how your information is protected:

#### What DeepProof Stores

| Data Type | How It's Stored | Who Can See It |
|-----------|-----------------|----------------|
| Your email | **Never stored in readable form** | No one |
| Email hash (cryptographic fingerprint) | Stored for matching purposes | Used internally, never revealed to partners |
| Email encrypted backup | Encrypted with strong cryptography | Only accessible for legal/regulatory requirements |
| Wallet address | Stored (already public on blockchain) | Part of the binding record |
| Verification signature | Stored as proof of consent | Part of the binding record |

#### What DeepProof Does NOT Store or See

- ❌ Your Binance (or other exchange) password
- ❌ Your raw email address in readable form
- ❌ Your personal documents (passport, ID, etc.)
- ❌ Your full name or physical address
- ❌ Your transaction history or account balances
- ❌ Any data that could directly identify you

### The "Blind Matching" Guarantee

When partner platforms verify users, they use a technique called "Blind Matching":

```
What the partner sends:    A cryptographic hash (like "5d41402abc...")
What DeepProof sees:       The same cryptographic hash
What DeepProof returns:    "Match found" or "No match" + cryptographic signature

Neither side ever sees the actual email address.
```

This means:
- Partners cannot reverse-engineer your email from the hash
- DeepProof only confirms matches, never reveals identities
- Your privacy is preserved at every step

### Your Right to Be Forgotten

Unlike blockchain-based identity tokens that create permanent records, DeepProof respects your right to be forgotten:

- **Request data deletion at any time**: If you want your data removed, DeepProof can delete your binding record
- **Instant effect**: Once deleted, platforms can no longer verify your wallet
- **Regulatory compliance**: This approach satisfies GDPR and similar data protection regulations
- **No permanent blockchain footprint**: Your verification status isn't permanently etched into a public blockchain

### Why You Stay in Control

1. **You initiate everything**: DeepProof only acts when you actively choose to verify
2. **You choose what to bind**: Your wallet, your decision
3. **You can exit anytime**: Request deletion and your verification is revoked
4. **Minimal data philosophy**: We only collect what's absolutely necessary for the service to work

---

## Technology Overview

### The Technologies Behind DeepProof (In Plain Language)

DeepProof combines several technologies to create a privacy-first verification system. Here's what they do and why they matter:

#### Zero-Knowledge Proofs

**What it is**: A way to prove something is true without revealing the underlying information.

**Everyday analogy**: Imagine proving you're over 21 to enter a bar without showing your ID. The bouncer somehow verifies your age but never sees your birthdate, address, or photo.

**Why it matters to you**: You can prove you have a verified Binance account without revealing your account details, email, or any personal information.

#### Cryptographic Hashing (SHA-256)

**What it is**: A mathematical function that converts any text into a fixed-length "fingerprint" that cannot be reversed.

**Everyday analogy**: Like a paper shredder that always produces the same pile of confetti for the same document, but you can never reconstruct the original document from the confetti.

**Why it matters to you**: Your email becomes a unique code that can confirm "it's the same person" but can never reveal what your actual email is.

#### Reclaim Protocol

**What it is**: A system that creates cryptographic proofs from your existing online accounts (like Binance) without requiring those platforms to integrate with DeepProof.

**Everyday analogy**: Like having a trusted notary who can verify you have an account somewhere without needing that company's cooperation or access to your login.

**Why it matters to you**: You can leverage your existing Binance KYC verification without Binance needing to know or participate. Your credentials stay private.

#### End-to-End Encryption (AES-256-GCM)

**What it is**: Military-grade encryption that scrambles data so thoroughly it would take billions of years for even the most powerful computers to crack.

**Everyday analogy**: A lock that would take longer than the age of the universe to pick.

**Why it matters to you**: Any sensitive data that needs to be stored for regulatory purposes is encrypted so strongly that it's essentially inaccessible except under specific legal conditions.

#### Wallet Signatures

**What it is**: A cryptographic proof that you own and control a specific blockchain wallet.

**Everyday analogy**: Like signing a legally binding document, but with mathematics that makes forgery impossible.

**Why it matters to you**: Your wallet signature proves you authorized the identity binding. No one can bind your wallet without your explicit approval.

### How These Technologies Work Together

```
┌─────────────────────────────────────────────────────────────────┐
│                    The DeepProof Process                         │
└─────────────────────────────────────────────────────────────────┘

1. Reclaim Protocol creates a Zero-Knowledge Proof of your Binance KYC
   ↓
2. Your email is converted to a SHA-256 hash (one-way transformation)
   ↓
3. A backup is created using AES-256-GCM encryption (for legal compliance)
   ↓
4. Your wallet signature confirms your consent and ownership
   ↓
5. The binding is stored: Wallet ↔ Hash (never raw personal data)

Result: You're verified. Your privacy is intact.
```

---

## Use Cases

### Real-World Scenarios Where DeepProof Helps

#### Scenario 1: Investing in Real World Assets

**The Situation**: A tokenized real estate platform is offering fractional ownership of a commercial building. By law, they can only accept investments from verified individuals.

**Without DeepProof**: You'd need to submit your passport, proof of address, and bank statements to yet another platform. They'd store your sensitive data, and you'd wait days for manual verification.

**With DeepProof**: You connect your wallet, and the platform instantly confirms you're a verified individual. You can invest in minutes, and the platform never sees your personal documents.

#### Scenario 2: Participating in a Token Launch

**The Situation**: A major project is launching their token with a public sale. To ensure fairness, each verified person can only claim one allocation.

**Without DeepProof**: Speculators create hundreds of wallets to claim multiple allocations, leaving regular users with nothing. Or the project requires invasive KYC that deters participation.

**With DeepProof**: One verified identity = one wallet = one allocation. Fairness is enforced automatically, and legitimate users don't need to share personal data with unknown projects.

#### Scenario 3: Accessing Institutional DeFi

**The Situation**: A lending protocol offers better rates for verified users, satisfying their compliance requirements while serving retail investors.

**Without DeepProof**: Users either get excluded or must complete lengthy verification processes with the protocol directly.

**With DeepProof**: Verified wallets get instant access to premium rates. The protocol confirms compliance status in milliseconds without handling personal data.

#### Scenario 4: Proving Humanity in DAOs

**The Situation**: A DAO wants to ensure governance votes come from real humans, not bots or whale-controlled sock puppets.

**Without DeepProof**: Either votes are easily manipulated, or the DAO requires invasive identification that undermines the ethos of decentralization.

**With DeepProof**: One verified person, one meaningful vote. Bot networks and Sybil attacks are prevented while maintaining voter privacy.

#### Scenario 5: Crossing Borders Between Platforms

**The Situation**: You're verified on multiple DeFi platforms, each requiring separate KYC processes.

**Without DeepProof**: You submit your documents to Platform A, then Platform B, then Platform C. Each stores copies of your sensitive information.

**With DeepProof**: Verify once with DeepProof. Use your wallet across all integrated platforms. One verification, unlimited access.

---

## Why DeepProof Is Different

### Beyond Traditional Verification

| Aspect | Traditional KYC | Other Blockchain ID | DeepProof |
|--------|-----------------|---------------------|-----------|
| **Your data exposure** | Full personal documents shared | Varies widely | Only cryptographic hashes—never raw data |
| **Data storage** | Companies store your documents | Often on public blockchain | Encrypted off-chain, minimal footprint |
| **Verification speed** | Days to weeks | Varies | Seconds |
| **Right to be forgotten** | Often difficult or impossible | Impossible (blockchain is permanent) | Fully supported—delete anytime |
| **Reusability** | Start fresh with each platform | Depends on adoption | One verification, all integrated platforms |
| **Privacy level** | Low—your data is exposed | Medium—depends on implementation | High—partners see only yes/no confirmation |
| **Sybil protection** | Relies on document checking | Varies | Built-in—one identity, one wallet |

### The Key Differences

**1. Privacy-First Architecture**

DeepProof was designed from the start to minimize data exposure. We don't retrofit privacy onto a system designed without it—privacy is the foundation.

**2. Leverage Existing Trust**

You've already proven who you are to trusted platforms. DeepProof builds on that trust rather than making you start over.

**3. Off-Chain by Design**

Your verification status isn't broadcast to a public blockchain. This means true privacy, true data erasure rights, and no permanent public record.

**4. Instant Yet Compliant**

Verification takes seconds, not days. Yet the system still satisfies regulatory requirements for platforms that need compliance.

**5. User Control, Not Platform Control**

You decide when to verify, which wallet to bind, and whether to continue using the service. Your identity, your rules.

---

## Getting Started

### Your Path to Privacy-Preserving Verification

Ready to get started with DeepProof? Here's what you'll need and what to expect:

#### What You'll Need

1. **A Web3 Wallet**: Like MetaMask, WalletConnect-compatible wallet, or similar
2. **A Verified Exchange Account**: Currently, DeepProof supports Binance (with more exchanges coming soon). You should have completed KYC Level 2 on Binance.
3. **The Reclaim Protocol App**: Available for mobile devices, this is used to create the zero-knowledge proof of your exchange account
4. **Access to Your Email**: The same email you used for your exchange account, to verify ownership

#### The Process Overview

1. **Visit DeepProof** and connect your wallet
2. **Select Binance** as your verification source
3. **Scan the QR code** with the Reclaim app
4. **Complete the verification** in the Reclaim app
5. **Verify your email** through a magic link
6. **Sign the binding message** in your wallet

The entire process typically takes 5-10 minutes.

#### After You're Verified

Once your identity is bound to your wallet:

- ✅ You can access any platform integrated with DeepProof
- ✅ Verification is instant—no waiting periods
- ✅ You never need to share personal documents again
- ✅ Your privacy is protected by cryptography

#### Coming Soon

DeepProof is actively expanding:

- **More Exchange Providers**: OKX, Bybit, and others in development
- **Additional Identity Providers**: Fractal ID, Didit, and more
- **Broader Platform Integrations**: More DeFi protocols, launchpads, and RWA platforms

---

## Questions?

If you have questions about DeepProof, how it works, or how to get started, the development team is here to help. DeepProof is committed to building a more private, more fair, and more accessible blockchain ecosystem.

**Remember**: Deep Verification, Zero Disclosure. Your identity, protected.

---

*DeepProof Protocol — Privacy-Preserving ZK-KYC Infrastructure*
