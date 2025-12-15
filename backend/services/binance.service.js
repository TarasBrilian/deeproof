import crypto from 'crypto';

/**
 * Generate Binance API signature using HMAC-SHA256
 * @param {string} queryString - Query string to sign
 * @param {string} secretKey - Binance secret key
 * @returns {string} - HMAC signature
 */
export function generateBinanceSignature(queryString, secretKey) {
    if (!secretKey) {
        throw new Error('BINANCE_SECRET_KEY is not configured');
    }
    return crypto
        .createHmac('sha256', secretKey)
        .update(queryString)
        .digest('hex');
}

/**
 * Call Binance API with authentication
 * @param {string} endpoint - API endpoint path
 * @param {Object} params - Request parameters
 * @returns {Promise<Object>} - API response
 */
export async function callBinanceAPI(endpoint, params = {}) {
    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_SECRET_KEY) {
        throw new Error('Binance API credentials not configured. This is optional - only needed for direct API testing.');
    }

    const timestamp = Date.now();
    const queryParams = new URLSearchParams({
        ...params,
        timestamp,
        recvWindow: 5000
    });

    const signature = generateBinanceSignature(
        queryParams.toString(),
        process.env.BINANCE_SECRET_KEY
    );

    queryParams.append('signature', signature);

    const url = `https://api.binance.com${endpoint}?${queryParams.toString()}`;

    const response = await fetch(url, {
        headers: {
            'X-MBX-APIKEY': process.env.BINANCE_API_KEY
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Binance API Error: ${JSON.stringify(errorData)}`);
    }

    return response.json();
}

/**
 * Get user's KYC status from Binance (Direct API - for testing only)
 * @returns {Promise<Object>} - Account status
 */
export async function getBinanceKYCStatus() {
    try {
        const accountInfo = await callBinanceAPI('/sapi/v1/account/status');
        return accountInfo;
    } catch (error) {
        console.error('Error fetching Binance KYC status:', error);
        throw error;
    }
}
