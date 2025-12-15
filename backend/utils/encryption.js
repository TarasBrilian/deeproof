
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Encrypt data using AES-256-GCM
 * @param {string} text - text to encrypt
 * @returns {string} - encrypted text (iv:tag:ciphertext)
 */
export function encryptData(text) {
    if (!process.env.ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY is not defined');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Format: iv:tag:encrypted_content
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt data using AES-256-GCM
 * @param {string} encryptedText - encrypted text (iv:tag:ciphertext)
 * @returns {string} - decrypted text
 */
export function decryptData(encryptedText) {
    if (!process.env.ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY is not defined');
    }

    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Hash data using SHA-256
 * @param {string} text - text to hash
 * @returns {string} - hex string of hash
 */
export function hashData(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Normalize email
 * @param {string} email
 * @returns {string} - normalized email
 */
export function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
