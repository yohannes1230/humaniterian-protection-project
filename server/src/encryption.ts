import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for GCM
const PREFIX = 'enc:v1:';

function getEncryptionKey(): Buffer {
  const envKey = process.env.FIELD_ENCRYPTION_KEY;
  if (!envKey) {
    if (process.env.NODE_ENV === 'test') {
      // 32-byte fixed test key
      return Buffer.from('01234567890123456789012345678901', 'utf8');
    }
    throw new Error('FIELD_ENCRYPTION_KEY is required for field-level encryption.');
  }

  // Support hex, base64, or raw 32-char string
  if (envKey.length === 64) {
    return Buffer.from(envKey, 'hex');
  } else if (envKey.length === 44 && envKey.endsWith('=')) {
    return Buffer.from(envKey, 'base64');
  } else if (envKey.length === 32) {
    return Buffer.from(envKey, 'utf8');
  }

  // Fallback: derive 32-byte key using sha256
  return crypto.createHash('sha256').update(envKey).digest();
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encryptField(plainText: string | null | undefined): string | null | undefined {
  if (plainText === null || plainText === undefined || plainText === '') {
    return plainText;
  }

  // If already encrypted, avoid double-encrypting
  if (typeof plainText === 'string' && plainText.startsWith(PREFIX)) {
    return plainText;
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${PREFIX}${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Returns the plaintext if encrypted, or the original string if not encrypted.
 */
export function decryptField(cipherText: string | null | undefined): string | null | undefined {
  if (cipherText === null || cipherText === undefined || cipherText === '') {
    return cipherText;
  }

  if (typeof cipherText !== 'string' || !cipherText.startsWith(PREFIX)) {
    // Not encrypted or legacy unencrypted string
    return cipherText;
  }

  try {
    const parts = cipherText.slice(PREFIX.length).split(':');
    if (parts.length !== 3) {
      return cipherText;
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt field:', err);
    return cipherText;
  }
}
