/**
 * =============================================================================
 * Demo ICO Platform - Backend Server
 * =============================================================================
 * 
 * This server demonstrates how a third-party platform (like an ICO website)
 * can integrate with Deeproof for KYC verification WITHOUT handling user data.
 * 
 * KEY CONCEPT: "Blind Matching"
 * - We hash the user's email using SHA-256 (same method as Deeproof)
 * - We send ONLY the hash to Deeproof's API
 * - Deeproof checks if a verified user exists with that hash
 * - We never see the user's raw email from Deeproof, and Deeproof doesn't
 *   need to know our user's identity - just that the hashes match.
 * 
 * =============================================================================
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3003;

// Deeproof API URL - CONFIGURE THIS TO YOUR DEEPROOF INSTANCE
// For local development: http://localhost:3001
// For production: use your Deeproof ngrok URL or deployed URL
const DEEPROOF_API_URL = process.env.DEEPROOF_API_URL || 'http://localhost:3001';

// =============================================================================
// Middleware
// =============================================================================

app.use(cors({
    origin: '*', // For demo purposes - in production, restrict this
    credentials: true
}));
app.use(express.json());

// =============================================================================
// In-Memory Database (for demo purposes)
// =============================================================================

// Users database: { email, passwordHash, kycVerified, kycVerifiedAt }
let users = {};

// Sessions database: { sessionToken: { email, createdAt } }
let sessions = {};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Hash email using SHA-256 (MUST match Deeproof's hashing method)
 * 
 * CRITICAL: The email normalization MUST be identical to Deeproof:
 * 1. Trim whitespace
 * 2. Convert to lowercase
 * 3. Hash with SHA-256
 * 
 * @param {string} email - The email to hash
 * @returns {string} - SHA-256 hash of the normalized email
 */
function hashEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    return crypto.createHash('sha256').update(normalizedEmail).digest('hex');
}

/**
 * Verify session token and return user email
 */
function verifySession(token) {
    const session = sessions[token];
    if (!session) return null;

    // Check if session is expired (24 hours)
    const expiresAt = new Date(session.createdAt);
    expiresAt.setHours(expiresAt.getHours() + 24);

    if (new Date() > expiresAt) {
        delete sessions[token];
        return null;
    }

    return session.email;
}

// =============================================================================
// API Routes
// =============================================================================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Demo ICO Platform is running',
        deeproofApiUrl: DEEPROOF_API_URL,
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /api/register
 * Register a new user with email and password
 */
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        if (users[normalizedEmail]) {
            return res.status(409).json({
                success: false,
                error: 'User already exists'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        users[normalizedEmail] = {
            email: normalizedEmail,
            passwordHash,
            kycVerified: false,
            kycVerifiedAt: null,
            createdAt: new Date().toISOString()
        };

        console.log(`✅ User registered: ${normalizedEmail}`);

        res.json({
            success: true,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
});

/**
 * POST /api/login
 * Login with email and password, returns session token
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Find user
        const user = users[normalizedEmail];
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Create session
        const sessionToken = uuidv4();
        sessions[sessionToken] = {
            email: normalizedEmail,
            createdAt: new Date().toISOString()
        };

        console.log(`✅ User logged in: ${normalizedEmail}`);

        res.json({
            success: true,
            token: sessionToken,
            user: {
                email: normalizedEmail,
                kycVerified: user.kycVerified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

/**
 * GET /api/user
 * Get current user info (requires session token)
 */
app.get('/api/user', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'No session token provided'
        });
    }

    const email = verifySession(token);
    if (!email) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired session'
        });
    }

    const user = users[email];

    res.json({
        success: true,
        user: {
            email: user.email,
            kycVerified: user.kycVerified,
            kycVerifiedAt: user.kycVerifiedAt
        }
    });
});

/**
 * POST /api/verify-kyc
 * 
 * This is the KEY INTEGRATION POINT with Deeproof.
 * 
 * Flow:
 * 1. Get signed-in user's email
 * 2. Hash the email using SHA-256 (identical to Deeproof's method)
 * 3. Send the hash to Deeproof's verification API
 * 4. Deeproof returns whether a verified user exists with that hash
 * 5. Update our user's KYC status accordingly
 * 
 * PRIVACY GUARANTEE:
 * - We NEVER send the raw email to Deeproof
 * - Deeproof NEVER sends us any user data
 * - Only a hash is exchanged - neither side learns the other's data
 */
app.post('/api/verify-kyc', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No session token provided'
            });
        }

        const email = verifySession(token);
        if (!email) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired session'
            });
        }

        // Step 1: Hash the user's email (EXACTLY as Deeproof does)
        const emailHash = hashEmail(email);

        console.log('');
        console.log('🔐 KYC Verification Request');
        console.log(`   Email: ${email}`);
        console.log(`   Hash:  ${emailHash}`);
        console.log(`   Calling Deeproof API: ${DEEPROOF_API_URL}/api/auth/verify-hash`);

        // Step 2: Call the REAL Deeproof API
        let verified = false;
        let verificationMethod = 'deeproof-api';
        let apiMessage = '';

        try {
            const response = await fetch(`${DEEPROOF_API_URL}/api/auth/verify-hash`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailHash })
            });

            const data = await response.json();
            console.log('   Deeproof Response:', JSON.stringify(data));

            if (data.success && data.data) {
                verified = data.data.verified === true;
                apiMessage = data.data.message || '';
            } else if (data.verified !== undefined) {
                // Handle direct response format
                verified = data.verified === true;
                apiMessage = data.message || '';
            }

            console.log(`   Result: verified=${verified}`);

        } catch (apiError) {
            console.error('   ❌ Deeproof API Error:', apiError.message);
            return res.status(503).json({
                success: false,
                error: 'Unable to connect to Deeproof. Please ensure Deeproof is running.',
                details: apiError.message
            });
        }

        // Step 3: Update user's KYC status
        if (verified) {
            users[email].kycVerified = true;
            users[email].kycVerifiedAt = new Date().toISOString();

            console.log(`   ✅ KYC VERIFIED for ${email}`);

            res.json({
                success: true,
                verified: true,
                message: 'KYC Verified via Deeproof',
                verificationMethod,
                note: 'Your identity was verified without sharing personal data'
            });
        } else {
            console.log(`   ❌ KYC FAILED for ${email}`);

            res.json({
                success: true,
                verified: false,
                message: 'KYC Verification Failed',
                verificationMethod,
                note: 'No matching verified identity found in Deeproof. Please complete KYC on Deeproof first.'
            });
        }

    } catch (error) {
        console.error('KYC verification error:', error);
        res.status(500).json({
            success: false,
            error: 'KYC verification failed'
        });
    }
});

/**
 * POST /api/logout
 * Logout and invalidate session
 */
app.post('/api/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token && sessions[token]) {
        delete sessions[token];
    }

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// =============================================================================
// Start Server
// =============================================================================

app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║           Demo ICO Platform - Backend Server                  ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  Server running on: http://localhost:${PORT}                     ║`);
    console.log('║                                                               ║');
    console.log('║  This demo shows Deeproof KYC integration:                    ║');
    console.log('║  • Users register/login with any email                        ║');
    console.log('║  • KYC is verified via REAL Deeproof API                      ║');
    console.log('║  • No personal data is shared between platforms               ║');
    console.log('║                                                               ║');
    console.log(`║  Deeproof API: ${DEEPROOF_API_URL.padEnd(40)}  ║`);
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
});
