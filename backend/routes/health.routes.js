import { Router } from 'express';
import { getBinanceKYCStatus } from '../services/binance.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/health', (_req, res) => {
    res.json(successResponse({
        message: 'Reclaim Protocol + Binance KYC Server is running',
        timestamp: new Date().toISOString()
    }));
});

/**
 * Get Binance account KYC status (direct API call - for testing)
 * GET /api/binance/kyc-status
 */
router.get('/binance/kyc-status', async (_req, res) => {
    try {
        const kycStatus = await getBinanceKYCStatus();
        res.json(successResponse({ data: kycStatus }));
    } catch (error) {
        console.error('Error fetching Binance KYC:', error);
        res.status(500).json(errorResponse(error.message));
    }
});

export default router;
