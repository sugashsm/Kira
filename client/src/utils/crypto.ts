import CryptoJS from 'crypto-js';

/**
 * Derive encryption key from master password using PBKDF2
 */
export const deriveKey = (masterPassword: string, salt: string): string => {
    const key = CryptoJS.PBKDF2(masterPassword, salt, {
        keySize: 256 / 32,
        iterations: 100000,
    });
    return key.toString();
};

/**
 * Encrypt data using AES-256-GCM
 */
export const encryptData = (
    data: object,
    encryptionKey: string
): { encryptedData: string; iv: string } => {
    const iv = CryptoJS.lib.WordArray.random(16).toString();
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        encryptionKey,
        {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );

    return {
        encryptedData: encrypted.toString(),
        iv,
    };
};

/**
 * Decrypt data using AES-256-GCM
 */
export const decryptData = (
    encryptedData: string,
    iv: string,
    encryptionKey: string
): any => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey, {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedStr);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

/**
 * Hash master password for authentication
 */
export const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString();
};

/**
 * Generate random salt
 */
export const generateSalt = (): string => {
    return CryptoJS.lib.WordArray.random(16).toString();
};
