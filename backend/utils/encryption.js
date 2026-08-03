const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'passlock_secret_key_encryption_32b';
const KEY = crypto.createHash('sha256').update(String(SECRET)).digest();

/**
 * Encrypts a plain text string using AES-256-CBC.
 * Returns iv:ciphertext format in hex.
 */
const encrypt = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypts an encrypted string (iv:ciphertext) back to plain text.
 * Falls back to original text if format does not match (for legacy records).
 */
const decrypt = (text) => {
    if (!text) return text;
    const parts = text.split(':');
    if (parts.length !== 2 || parts[0].length !== 32) {
        return text;
    }
    try {
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        return text;
    }
};

module.exports = { encrypt, decrypt };
