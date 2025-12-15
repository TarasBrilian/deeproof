import { Router } from 'express';
import { ethers } from 'ethers';
import { encryptData, hashData, normalizeEmail } from '../utils/encryption.js';
import { successResponse, errorResponse } from '../utils/response.js';
import prisma from '../db.js';

const router = Router();

/**
 * Bind identity to wallet
 * POST /api/bind
 */

router.post('/', async (req, res) => {
    try {
        const { walletAddress, email, signature, sessionId } = req.body;

        // Validate inputs
        if (!walletAddress || !email || !signature || !sessionId) {
            return res.status(400).json(
                errorResponse('Missing required fields: walletAddress, email, signature, sessionId')
            );
        }

        const normalizedEmail = normalizeEmail(email);
        const identityHash = hashData(normalizedEmail); // SHA-256

        // 1. Verify Wallet Signature
        const message = `Bind Identity: ${identityHash}`;
        let recoveredAddress;
        try {
            recoveredAddress = ethers.verifyMessage(message, signature);
        } catch (_err) {
            return res.status(400).json(errorResponse('Invalid signature'));
        }

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json(errorResponse('Signature verification failed: Address mismatch'));
        }

        // 2. Validate against ReclaimSession (The Source of Truth)
        const reclaimSession = await prisma.reclaimSession.findUnique({
            where: { sessionId }
        });

        if (!reclaimSession || reclaimSession.status !== 'VERIFIED') {
            return res.status(400).json(errorResponse('Identity session not found or not verified'));
        }

        // 3. Strict Match Check
        // The email provided by user must match the one in ReclaimSession (hashed)
        // Also the binance_uid is what we are binding to this wallet
        if (reclaimSession.emailHash !== identityHash) {
            return res.status(400).json(errorResponse('Email does not match the verified KYC identity'));
        }

        // 4. Check Duplicate Wallet or Identity in User Table
        const existingWallet = await prisma.user.findUnique({
            where: { walletAddress: walletAddress.toLowerCase() }
        });
        if (existingWallet) {
            return res.status(409).json(errorResponse('This wallet is already bound to an identity'));
        }

        // Check if this Binance UID is already registered
        const existingUser = await prisma.user.findUnique({
            where: { binance_uid: reclaimSession.binance_uid }
        });
        if (existingUser) {
            return res.status(409).json(errorResponse('This Binance Identity is already bound'));
        }

        // 5. Create User Record (Strict Schema)
        const user = await prisma.user.create({
            data: {
                walletAddress: walletAddress.toLowerCase(),
                identityHash: identityHash,
                binance_uid: reclaimSession.binance_uid,
                emailHash: reclaimSession.emailHash,
                emailEncrypted: reclaimSession.emailEncrypted,
                signature: signature
            }
        });

        // Cleanup used session? Or keep for history? Let's keep it but maybe mark it used if we had a used flag.

        res.json(successResponse({
            message: 'Identity successfully bound to wallet',
            data: {
                id: user.id,
                walletAddress: user.walletAddress,
                identityHash: user.identityHash,
                binance_uid: user.binance_uid,
                createdAt: user.createdAt
            }
        }));

    } catch (error) {
        console.error('Error binding identity:', error);
        res.status(500).json(errorResponse(error.message));
    }
});


export default router;
