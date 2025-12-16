
import { Router } from 'express';
import crypto from 'crypto';
import { encryptData, decryptData, hashData, normalizeEmail } from '../utils/encryption.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { sendMagicLinkEmail } from '../services/mail.service.js';
import prisma from '../db.js';

const router = Router();

// Magic link expiration time (15 minutes)
const MAGIC_LINK_EXPIRY_MS = 15 * 60 * 1000;

// Session expiration time (24 hours)
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

/**
 * Send magic link to email
 * POST /api/auth/send-magic-link
 */
router.post('/send-magic-link', async (req, res) => {
    try {
        const { email, sessionId } = req.body;

        if (!email) {
            return res.status(400).json(errorResponse('Email is required'));
        }

        if (!sessionId) {
            return res.status(400).json(errorResponse('Session ID is required for validation'));
        }

        // Validate against ReclaimSession
        const reclaimSession = await prisma.reclaimSession.findUnique({
            where: { sessionId }
        });

        if (!reclaimSession) {
            return res.status(404).json(errorResponse('Verification session not found'));
        }

        if (reclaimSession.status !== 'VERIFIED') {
            return res.status(400).json(errorResponse('Identity not yet verified via Reclaim'));
        }

        const inputEmailHash = hashData(email);

        // Strict validation: Input email hash must match the one from Reclaim proof
        if (inputEmailHash !== reclaimSession.emailHash) {
            return res.status(403).json(errorResponse('Email does not match the verified identity'));
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MS);

        // Normalize, encrypt and hash the email
        const normalizedEmail = normalizeEmail(email);
        const emailEncrypted = encryptData(normalizedEmail);
        const emailHash = hashData(normalizedEmail);

        // Delete any existing unused magic links for this email hash
        await prisma.magicLink.deleteMany({
            where: { emailHash, used: false }
        });

        // Store magic link in database
        await prisma.magicLink.create({
            data: {
                email: emailEncrypted,
                emailHash,
                token,
                expiresAt
            }
        });

        // Build magic link URL
        const frontendUrl = process.env.FRONTEND_URL;
        const magicLinkUrl = `${frontendUrl}/auth/verify?token=${token}`;

        // Send email
        await sendMagicLinkEmail(normalizedEmail, magicLinkUrl);

        res.json(successResponse({}, 'Magic link sent to your email'));

    } catch (error) {
        console.error('Error sending magic link:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Verify magic link token
 * GET /api/auth/verify-magic-link
 */
router.get('/verify-magic-link', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json(errorResponse('Token is required'));
        }

        // Find magic link
        const magicLink = await prisma.magicLink.findUnique({
            where: { token }
        });

        if (!magicLink) {
            return res.status(400).json(errorResponse('Invalid or expired token'));
        }

        if (magicLink.used) {
            return res.status(400).json(errorResponse('This link has already been used'));
        }

        if (new Date() > magicLink.expiresAt) {
            return res.status(400).json(errorResponse('This link has expired'));
        }

        // Mark token as used
        await prisma.magicLink.update({
            where: { token },
            data: { used: true }
        });

        // Decrypt and create session
        const decryptedEmail = decryptData(magicLink.email);
        const emailHash = hashData(decryptedEmail);
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionExpiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
        const sessionEmailEncrypted = encryptData(decryptedEmail);

        // Delete any existing sessions for this email hash
        await prisma.authSession.deleteMany({
            where: { emailHash }
        });

        // Create new session
        await prisma.authSession.create({
            data: {
                email: sessionEmailEncrypted,
                emailHash,
                sessionToken,
                expiresAt: sessionExpiresAt
            }
        });

        res.json(successResponse({
            sessionToken,
            email: decryptedEmail,
            emailHash,
            expiresAt: sessionExpiresAt
        }));

    } catch (error) {
        console.error('Error verifying magic link:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Check session status
 * GET /api/auth/session
 */
router.get('/session', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(errorResponse('No session token provided'));
        }

        const sessionToken = authHeader.substring(7);

        const session = await prisma.authSession.findUnique({
            where: { sessionToken }
        });

        if (!session) {
            return res.status(401).json(errorResponse('Invalid session'));
        }

        if (new Date() > session.expiresAt) {
            await prisma.authSession.delete({
                where: { sessionToken }
            });
            return res.status(401).json(errorResponse('Session expired'));
        }

        res.json(successResponse({
            email: session.email,
            emailHash: session.emailHash,
            verified: true,
            expiresAt: session.expiresAt
        }));

    } catch (error) {
        console.error('Error checking session:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Logout - delete session
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(errorResponse('No session token provided'));
        }

        const sessionToken = authHeader.substring(7);

        await prisma.authSession.deleteMany({
            where: { sessionToken }
        });

        res.json(successResponse({}, 'Logged out successfully'));

    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Verify email matches the stored one from Reclaim verification
 * POST /api/auth/verify-email-match
 * 
 * This endpoint is used on the verify page to validate that the user
 * entering the email is the same person who completed Reclaim KYC.
 * Uses SHA-256 hashing for deterministic comparison.
 */
router.post('/verify-email-match', async (req, res) => {
    try {
        const { sessionId, email } = req.body;

        // Validate inputs
        if (!sessionId) {
            return res.status(400).json(errorResponse('sessionId is required'));
        }

        if (!email) {
            return res.status(400).json(errorResponse('email is required'));
        }

        // Fetch ReclaimSession to get stored emailHash
        const reclaimSession = await prisma.reclaimSession.findUnique({
            where: { sessionId }
        });

        if (!reclaimSession) {
            return res.status(404).json(errorResponse('Verification session not found'));
        }

        if (reclaimSession.status !== 'VERIFIED') {
            return res.status(400).json(errorResponse('Identity not yet verified via Reclaim'));
        }

        if (!reclaimSession.emailHash) {
            return res.status(400).json(errorResponse('No email was stored during verification'));
        }

        // Hash input email and compare with stored hash
        // Using same normalization as used during Reclaim callback
        const normalizedEmail = normalizeEmail(email);
        const inputEmailHash = hashData(normalizedEmail);

        console.log('🔐 Verifying email match:');
        console.log('   Input hash:', inputEmailHash.substring(0, 16) + '...');
        console.log('   Stored hash:', reclaimSession.emailHash.substring(0, 16) + '...');

        if (inputEmailHash !== reclaimSession.emailHash) {
            console.log('❌ Email hash mismatch');
            return res.status(403).json(errorResponse('Email does not match verified identity'));
        }

        console.log('✅ Email hash matched');
        return res.json(successResponse({ matched: true }));

    } catch (error) {
        console.error('Error verifying email match:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * =============================================================================
 * PARTNER INTEGRATION: Blind Hash Verification
 * POST /api/auth/verify-hash
 * =============================================================================
 * 
 * This endpoint is for EXTERNAL PARTNER integration (e.g., ICO platforms).
 * Partners can verify if a user is KYC'd on Deeproof WITHOUT seeing any personal data.
 * 
 * PRIVACY GUARANTEE: Only a cryptographic hash is exchanged ("Blind Matching")
 */
router.post('/verify-hash', async (req, res) => {
    try {
        const { emailHash } = req.body;

        if (!emailHash) {
            return res.status(400).json(errorResponse('emailHash is required'));
        }

        console.log('🔐 Partner Hash Verification Request');
        console.log('   Hash:', emailHash.substring(0, 16) + '...');

        // Check if a verified user exists with this email hash
        const user = await prisma.user.findUnique({
            where: { emailHash }
        });

        if (user) {
            console.log('✅ Hash found - user is KYC verified');
            return res.json(successResponse({
                verified: true,
                message: 'User is KYC verified via Deeproof'
            }));
        }

        // Also check ReclaimSession for users who completed KYC but haven't bound wallet yet
        const reclaimSession = await prisma.reclaimSession.findFirst({
            where: {
                emailHash,
                status: 'VERIFIED'
            }
        });

        if (reclaimSession) {
            console.log('✅ Hash found in verified sessions');
            return res.json(successResponse({
                verified: true,
                message: 'User is KYC verified via Deeproof'
            }));
        }

        console.log('❌ Hash not found - user not verified');
        return res.json(successResponse({
            verified: false,
            message: 'No verified identity found for this hash'
        }));

    } catch (error) {
        console.error('Error verifying hash:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

export default router;
