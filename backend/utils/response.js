/**
 * Create a standardized success response
 * @param {Object} data - Response data
 * @param {string} [message] - Optional message
 * @returns {Object} - Formatted success response
 */
export function successResponse(data = {}, message = null) {
    const response = { success: true };
    if (message) response.message = message;
    return { ...response, ...data };
}

/**
 * Create a standardized error response
 * @param {string} error - Error message
 * @returns {Object} - Formatted error response
 */
export function errorResponse(error) {
    return {
        success: false,
        error
    };
}
