import { errorResponse } from '../utils/response.js';

/**
 * Global error handling middleware
 * Catches all unhandled errors and returns consistent response
 */
export function errorHandler(err, req, res, _next) {
    console.error('Unhandled error:', err);

    res.status(err.status || 500).json(
        errorResponse(err.message || 'Internal server error')
    );
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} - Wrapped handler with error catching
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
