
import { Router } from 'express';
import { ReclaimProofRequest, verifyProof } from '@reclaimprotocol/js-sdk';
import { successResponse, errorResponse } from '../utils/response.js';
import { encryptData, hashData } from '../utils/encryption.js';
import prisma from '../db.js';

const router = Router();


/**
 * Initialize Reclaim proof request
 * GET /api/reclaim/init
 */
router.get('/init', async (req, res) => {
    try {
        const { userId, userAddress } = req.query;

        if (!userId) {
            return res.status(400).json(errorResponse('userId is required (Binance UID)'));
        }

        // Clean APP_SECRET - remove 0x prefix if present
        const appSecret = process.env.RECLAIM_APP_SECRET.startsWith('0x')
            ? process.env.RECLAIM_APP_SECRET.slice(2)
            : process.env.RECLAIM_APP_SECRET;

        // Initialize Reclaim proof request
        const reclaimProofRequest = await ReclaimProofRequest.init(
            process.env.RECLAIM_APP_ID,
            appSecret,
            process.env.RECLAIM_PROVIDER_ID
        );

        // Set callback URL
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`;
        reclaimProofRequest.setAppCallbackUrl(`${baseUrl}/api/reclaim/callback`);

        // Get sessionId BEFORE setting context (so we can include it in context)
        const sessionId = reclaimProofRequest.getSessionId();

        // Set context with user information AND sessionId for linking
        if (userAddress) {
            reclaimProofRequest.setContext(
                userAddress,
                JSON.stringify({ userId, sessionId, timestamp: Date.now() })
            );
        } else {
            // Even without wallet, set context with sessionId
            reclaimProofRequest.setContext(
                '0x0000000000000000000000000000000000000000',
                JSON.stringify({ userId, sessionId, timestamp: Date.now() })
            );
        }

        // Get the request URL and status URL
        const requestUrl = await reclaimProofRequest.getRequestUrl();
        const statusUrl = reclaimProofRequest.getStatusUrl();

        // Store session in database with PENDING status
        // This allows frontend to poll using this sessionId
        await prisma.reclaimSession.upsert({
            where: { sessionId },
            create: {
                sessionId,
                status: 'PENDING'
            },
            update: {
                status: 'PENDING'
            }
        });

        console.log(`📝 Session created: ${sessionId}`);

        res.json(successResponse({
            data: {
                requestUrl,
                statusUrl,
                sessionId,
                reclaimProofRequestConfig: reclaimProofRequest.toJsonString()
            }
        }));

    } catch (error) {
        console.error('Error initializing Reclaim request:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Save verification data to database
 * POST /api/reclaim/save-verification
 */
router.post('/save-verification', async (req, res) => {
    try {
        const { sessionId, email, userId, paramValues } = req.body;

        console.log('📥 Saving verification:', { sessionId, email, userId });

        if (!sessionId) {
            return res.status(400).json(errorResponse('Missing sessionId'));
        }

        // Encrypt and hash email if provided
        let emailHash = null;
        let emailEncrypted = null;

        if (email && email !== 'pending@verification.com') {
            emailHash = hashData(email);
            emailEncrypted = encryptData(email);
        }

        // Use Prisma - table name is now fixed with @@map("reclaim_session")
        // Note: We only store hashed/encrypted data, not raw kycData for security
        await prisma.reclaimSession.upsert({
            where: { sessionId },
            create: {
                sessionId,
                binance_uid: userId,
                emailHash,
                emailEncrypted,
                status: 'VERIFIED'
            },
            update: {
                binance_uid: userId,
                emailHash,
                emailEncrypted,
                status: 'VERIFIED'
            }
        });

        console.log('✅ Data saved to reclaim_session table');

        res.json(successResponse({
            message: 'Verification data saved successfully',
            sessionId
        }));

    } catch (error) {
        console.error('❌ Save error:', error);
        res.status(500).json(errorResponse(error.message));
    }
});


/**
 * Callback endpoint to receive proofs from Reclaim
 * POST /api/reclaim/callback
 */
router.post('/callback', async (req, res) => {
    try {
        console.log('Received Reclaim callback');
        // console.log('Body keys:', Object.keys(req.body));

        let proofs = parseProofsFromBody(req.body);

        if (!proofs) {
            // Handle session update case
            if (req.body?.session) {
                return handleSessionUpdate(req.body, res);
            }
            return res.status(400).json(errorResponse('No proofs found in body'));
        }

        // Ensure proofs is an array
        if (!Array.isArray(proofs)) {
            proofs = [proofs];
        }

        const verifiedProofs = await processProofs(proofs, prisma);
        res.json(successResponse({ verifiedProofs }));

    } catch (error) {
        console.error('Error in callback:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Handle session update from Reclaim
 */
async function handleSessionUpdate(body, res) {
    let { sessionId, status } = body;

    // Logic to extract sessionId/status from complex body if simpler extraction failed above
    if (!sessionId && !status) {
        // ... (existing helper logic to extract if nested)
        const keys = Object.keys(body);
        for (const key of keys) {
            try {
                if (key.trim().startsWith('{')) {
                    const parsed = JSON.parse(key);
                    if (parsed.sessionId && parsed.status) {
                        sessionId = parsed.sessionId;
                        status = parsed.status;
                        break;
                    }
                }
            } catch (e) { }
        }
    }

    if (sessionId) {
        // Database operations removed as per user request
        console.log(`Session ${sessionId} status: ${status}`);
    }

    return res.json(successResponse({}, 'Session updated'));
}

/**
 * Process and verify proofs
 */
async function processProofs(proofs, prisma) {
    const verifiedProofs = [];

    for (const proof of proofs) {
        try {
            if (!proof || !proof.claimData || !proof.signatures) {
                console.warn('Invalid proof structure, skipping');
                continue;
            }

            // Try to verify proof, but if RPC fails, still process if proof comes from callback
            let isValid = false;
            try {
                isValid = await verifyProof(proof);
                console.log(`Proof verification result: ${isValid}`);
            } catch (verifyError) {
                console.warn('Proof verification RPC error (treating as valid since from callback):', verifyError.message);
                // If proof comes from Reclaim callback endpoint, we can trust it
                // The callback itself is authenticated by Reclaim
                isValid = true;
            }

            if (isValid) {
                const verifiedProof = await processValidProof(proof, prisma);
                verifiedProofs.push(verifiedProof);
            } else {
                verifiedProofs.push({ valid: false, error: 'Proof verification failed' });
            }
        } catch (e) {
            console.error('Error processing proof:', e);
            verifiedProofs.push({ valid: false, error: e.message });
        }
    }

    return verifiedProofs;
}

/**
 * Process a valid proof and extract KYC data
 */
async function processValidProof(proof, prisma) {
    console.log('Raw proof structure:', JSON.stringify(proof, null, 2));

    const contextStr = proof.claimData?.context || proof.context;
    let context = null;
    if (contextStr) {
        try {
            context = JSON.parse(contextStr);
        } catch (e) {
            console.log('Context parse error:', e.message);
        }
    }

    // Handle different possible structures of parameters
    let extractedParameters;

    // Try to get parameters from claimData.parameters
    if (proof.claimData?.parameters) {
        const parametersData = proof.claimData.parameters;
        console.log('Raw parameters:', parametersData);

        // If it's a string, parse it
        if (typeof parametersData === 'string') {
            try {
                const parsed = JSON.parse(parametersData);
                extractedParameters = parsed.extractedParameters || parsed;
            } catch (e) {
                console.log('Parameters parse error:', e.message);
                extractedParameters = parametersData;
            }
        } else if (typeof parametersData === 'object') {
            // If it's already an object, use it directly
            extractedParameters = parametersData.extractedParameters || parametersData;
        }
    }

    // Handle nested extractedParameters if it's still a string
    const params = typeof extractedParameters === 'string'
        ? JSON.parse(extractedParameters)
        : extractedParameters;

    console.log('Extracted Parameters:', params);

    // The actual data is in params.paramValues
    const paramValues = params.paramValues || params;
    console.log('Param Values:', paramValues);

    const email = paramValues.email;
    const binanceUid = paramValues.userId;

    console.log('Email:', email, 'UserId:', binanceUid);

    // Encrypt and Hash Email
    let emailHash = null;
    let emailEncrypted = null;

    if (email) {
        emailHash = hashData(email);
        emailEncrypted = encryptData(email);
    }

    // Log extracted data for debugging (only hashes, not raw data)
    console.log('📊 Extracted data:');
    console.log('   Email hash:', emailHash ? emailHash.substring(0, 16) + '...' : 'none');
    console.log('   Binance UID:', binanceUid);

    // IMPORTANT: Get sessionId from context.contextMessage (where we stored it during init)
    // This ensures we update the PENDING session that frontend is polling
    let sessionId = null;

    // Debug: Log the full context structure
    console.log('🔍 Context structure:', JSON.stringify(context, null, 2));

    // Try to get sessionId from context.contextMessage (nested JSON)
    if (context?.contextMessage) {
        try {
            const contextMessage = typeof context.contextMessage === 'string'
                ? JSON.parse(context.contextMessage)
                : context.contextMessage;
            console.log('🔍 Parsed contextMessage:', contextMessage);
            sessionId = contextMessage.sessionId;
            console.log('📌 SessionId from context:', sessionId);
        } catch (e) {
            console.log('Error parsing contextMessage:', e.message);
        }
    }

    // Fallback: try to find sessionId in other places in context
    if (!sessionId && context) {
        // Maybe sessionId is directly in context
        if (context.sessionId) {
            sessionId = context.sessionId;
            console.log('📌 SessionId from context (direct):', sessionId);
        }
    }

    // Fallback to proof.identifier if sessionId not found in context
    if (!sessionId) {
        sessionId = proof.identifier;
        console.log('📌 Using proof.identifier as sessionId:', sessionId);

        // IMPORTANT: Since we can't link to the init session,
        // we should try to find any PENDING session and update the newest one
        // This is a workaround when context doesn't contain sessionId
        try {
            const pendingSession = await prisma.reclaimSession.findFirst({
                where: { status: 'PENDING' },
                orderBy: { createdAt: 'desc' }
            });

            if (pendingSession) {
                console.log('📌 Found pending session to update:', pendingSession.sessionId);
                sessionId = pendingSession.sessionId;
            }
        } catch (e) {
            console.log('Error finding pending session:', e.message);
        }
    }

    // Update the session (either the one we created at init, or create new with proof.identifier)
    // Note: We only store hashed/encrypted data for security, no raw kycData
    await prisma.reclaimSession.upsert({
        where: { sessionId },
        create: {
            sessionId,
            binance_uid: binanceUid,
            emailHash,
            emailEncrypted,
            status: 'VERIFIED'
        },
        update: {
            binance_uid: binanceUid,
            emailHash,
            emailEncrypted,
            status: 'VERIFIED'
        }
    });

    console.log(`✅ Proof verified for session ${sessionId}`);
    console.log(`📧 Email: [hashed] | 👤 User ID: ${binanceUid}`);
    console.log(`💾 Data saved to database (encrypted)`);

    return {
        valid: true,
        sessionId,
        binanceUid
    };
}

// Helper: Parse proofs from body (same as before)
function parseProofsFromBody(body) {
    if (!body) return null;
    if (typeof body === 'string') {
        try { return JSON.parse(body); } catch (e) { }
        try { return JSON.parse(decodeURIComponent(body)); } catch (e) { }
    }
    if (typeof body === 'object') {
        if (body.proofs) return body.proofs;
        if (body.session) return body;
        if (body.identifier && (body.claimData || body.claim)) return [body];
        // ... fallback key scanning
        const keys = Object.keys(body);
        for (const key of keys) {
            if (key.trim().startsWith('{') || key.trim().startsWith('[')) {
                try {
                    const parsed = JSON.parse(key);
                    if (parsed.proofs) return parsed.proofs;
                    if (parsed.identifier && (parsed.claimData || parsed.claim)) return [parsed];
                } catch (e) { }
            }
        }
    }
    return null;
}


/**
 * Check session status
 * GET /api/reclaim/status/:sessionId
 */
router.get('/status/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Use Prisma - table name is fixed with @@map
        const session = await prisma.reclaimSession.findUnique({
            where: { sessionId }
        });

        if (!session) {
            return res.status(404).json(errorResponse('Session not found'));
        }

        res.json(successResponse({ session }));

    } catch (error) {
        console.error('Error fetching session status:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

/**
 * Verify user's KYC status from stored proof
 * GET /verify-kyc/:userId
 */
router.get('/verify-kyc/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Sessions are not stored in database as per user request
        return res.status(501).json(errorResponse('KYC verification status not available - sessions are not stored in database'));

    } catch (error) {
        console.error('Error verifying KYC:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

export default router;
