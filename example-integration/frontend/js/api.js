/**
 * =============================================================================
 * Demo ICO Platform - API Client
 * =============================================================================
 * 
 * Handles all API communication with the Demo ICO backend.
 * The backend integrates with Deeproof for KYC verification.
 * 
 * =============================================================================
 */

const API_URL = 'http://localhost:3003';

/**
 * Make an API request with optional authentication
 */
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('demoico_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    return response.json();
}

/**
 * Register a new user
 */
async function register(email, password) {
    return apiRequest('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

/**
 * Login user
 */
async function login(email, password) {
    const result = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (result.success && result.token) {
        localStorage.setItem('demoico_token', result.token);
        localStorage.setItem('demoico_user', JSON.stringify(result.user));
    }

    return result;
}

/**
 * Get current user info
 */
async function getCurrentUser() {
    return apiRequest('/api/user');
}

/**
 * Verify KYC via Deeproof
 * 
 * This calls our backend which then:
 * 1. Takes the logged-in user's email
 * 2. Hashes it using SHA-256 (same as Deeproof)
 * 3. Sends ONLY the hash to Deeproof
 * 4. Returns whether Deeproof has a verified user with that hash
 * 
 * NO PERSONAL DATA IS SHARED between platforms!
 */
async function verifyKYC() {
    return apiRequest('/api/verify-kyc', {
        method: 'POST'
    });
}

/**
 * Logout
 */
async function logout() {
    await apiRequest('/api/logout', { method: 'POST' });
    localStorage.removeItem('demoico_token');
    localStorage.removeItem('demoico_user');
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return !!localStorage.getItem('demoico_token');
}

/**
 * Get stored user data
 */
function getStoredUser() {
    const user = localStorage.getItem('demoico_user');
    return user ? JSON.parse(user) : null;
}

// Export for use in other scripts
window.DemoICOApi = {
    register,
    login,
    getCurrentUser,
    verifyKYC,
    logout,
    isLoggedIn,
    getStoredUser
};
