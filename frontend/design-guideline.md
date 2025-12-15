Deeproof Protocol - Design Guideline v3.0
1. Brand Philosophy & Identity
Core Concept
"Deep Verification, Zero Disclosure."

Brand Positioning
Primary: Privacy-Preserving Compliance Oracle.

Secondary: Anti-Sybil Identity Infrastructure.

Tertiary: Just-in-Time (JIT) Verification Layer.

Strategic Vision
Deeproof acts as a "Blind Intermediary." We do not give users a file to carry; we act as a secure switchboard. We bind a user's Wallet to their Identity, but we only speak to partners using Cryptographic Hashes, never raw data.

Aesthetic Direction: "The Encrypted Terminal." The interface should feel like a command center where raw data (Emails) is visibly converted into safe data (Hashes). It should visualize the "Binding" process—locking two entities (Wallet + Email) together securely.

2. Color System
Philosophy
Dark, precise, and focused on Data States (Raw vs. Hashed vs. Verified).

Primary Palette
Void Black - #0A0A0A

Main background. Represents the privacy layer.

Deep Charcoal - #171717

Container backgrounds ("Secure Enclaves").

Oracle Gold - #D97706 (New Addition)

Represents the API/Oracle connection.

Used for elements related to "Server-Side Verification" or "API Calls."

Functional Palette
Secure Green - #10B981

State: BOUND / VERIFIED.

Indicates a successful link between Wallet and Email.

Hash Grey - #6B7280

State: MASKED / ANONYMOUS.

Used for displaying hashed data (e.g., 0x9a8b...) to show it is safe/unreadable.

Alert Orange - #F59E0B

State: UNBOUND / PENDING.

Action required (e.g., Verify Email OTP).

Electric Azure - #3B82F6

Action: CONNECT / SIGN.

Interactive elements.

3. Typography System
Font Usage Updates
JetBrains Mono (Monospace) is now CRITICAL.

Usage Rule: Anytime the UI displays an Email Address or a Hash, it MUST be in Monospace.

Visual Logic:

Raw Email: alice@gmail.com (Monospace, White)

Hashed Email: 0x8a7b... (Monospace, Hash Grey, Dimmed)

4. UI Component Library
A. The "Binding Node" (Replacing Credential Card)
Since we no longer download a file, the main UI element is the Identity Dashboard.

Visual Concept: Two circles connecting to form a locked node.

Left Node: Wallet Icon + Address (0x123...).

Connection Line: Animated pulse line.

Right Node: Email Icon + Masked Email (a***@gmail.com).

Status Display:

Unbound: Broken line, Red/Orange status.

Bound & Verified: Solid Glowing Green line, Lock Icon in the center.

B. "Blind Input" Fields
For Email Input.

Design:

Input field with a "Eye-Slash" icon on the right.

Micro-interaction: When user types alice@gmail.com, show a small label below dynamically generating the Hash: Hash: 0x98a...

Why: This visually proves to the user that "We treat your email as a Hash."

C. Status Badges (Oracle States)
BOUND: (Green) Wallet is linked to a KYC'd Identity.

ORACLE ACTIVE: (Gold) API is ready to answer queries.

REVOKED: (Red) Admin has severed the link.

D. Verification Simulation (For Demo)
To show how Partners see the data.

Create a split-view component:

Left (User View): Shows real email alice@example.com.

Right (Partner/RWA View): Shows ONLY the Hash 0xab53....

Divider: A "Privacy Wall" icon between them.

5. Iconography System
New Icon Metaphors
Focus on Linking and Hiding.

Binding: ph-link, ph-plugs-connected (Represents Wallet <-> Email link).

Hashing/Blind: ph-hash, ph-eye-closed, ph-fingerprint (Represents the Blind Match).

Oracle: ph-broadcast, ph-lightning (Represents the JIT API call).

Compliance: ph-shield-check (Represents KYC status).

(Remove all "File Download" or "Storage Drive" icons)

6. Process Flow Visualization
The "Hybrid Pipeline" Animation:

Input: User types Email.

Hashing: Email text dissolves into Matrix-style random characters (The Hash).

Transport: The Hash floats into a central Server Icon (The Oracle).

Verification: A Green Checkmark appears on the Server.

Binding: A Gold Line shoots out to connect the User's Wallet.

7. UX Writing & Tone of Voice
Writing Principles
Trust but Verify

❌ "We store your email."

✅ "Identity bound via cryptographic hash."

Oracle-Centric

❌ "Download your proof."

✅ "Identity active. Oracle ready for verification."

Privacy Assurance

❌ "Partners can see you are verified."

✅ "Partners verify the signature, never the data."

Copy Style Guide
Headings:

"Identity Binding Protocol"

"Blind-Matching Infrastructure"

CTAs:

"Bind Wallet"

"Normalize & Hash"

"Authorize Oracle"

Alerts:

"One Identity, One Wallet. Binding is permanent."

8. Animation & Motion Design
The "Hashing" Effect (Signature Animation)
When the user binds their email:

Text appears: alice@gmail.com

Glitch Effect: Text scrambles rapidly (#x9!a...).

Resolve: Text settles into the Hex Hash 0x19a2... in Grey color.

Lock: A padlock icon snaps shut next to it.

This tells the story: "Your raw data is gone, only the math remains."

9. Implementation Guidelines
Developer/Partner Portal Design
Since this is B2B, the "Developer Docs" section needs specific UI attention.

API Console Component:

Show a code snippet block (dark mode).

Highlight the Normalization Logic (Trim + Lowercase + SHA256) in bright colors to ensure developers don't miss it.