import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

/**
 * Encrypts data using AES-256-GCM with the provided salt
 */
export function encrypt(text: string, salt: string): string {
  try {
    // Derive key from salt
    const key = crypto.pbkdf2Sync(
      salt,
      'cosmopolitan-herbal-verification',
      ITERATIONS,
      KEY_LENGTH,
      'sha512'
    );

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Get the auth tag
    const tag = cipher.getAuthTag();

    // Combine iv + encrypted + tag
    const result = iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex');

    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using AES-256-GCM with the provided salt
 */
export function decrypt(encryptedData: string, salt: string): string {
  try {
    // Split the encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'hex');

    // Derive key from salt
    const key = crypto.pbkdf2Sync(
      salt,
      'cosmopolitan-herbal-verification',
      ITERATIONS,
      KEY_LENGTH,
      'sha512'
    );

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hashes a verification code using SHA-256
 */
export function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Generates a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}
