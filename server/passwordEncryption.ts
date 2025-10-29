import { generateKeyPair, privateDecrypt, constants } from 'crypto';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const generateKeyPairAsync = promisify(generateKeyPair);

// RSA Key configuration
const KEY_SIZE = 2048; // 2048-bit RSA key
const KEY_DIR = path.join(process.cwd(), '.keys');
const PRIVATE_KEY_PATH = path.join(KEY_DIR, 'password-decrypt-key.pem');
const PUBLIC_KEY_PATH = path.join(KEY_DIR, 'password-encrypt-key.pem');

// Cache keys in memory
let cachedPrivateKey: string | null = null;
let cachedPublicKey: string | null = null;

// Generate or load RSA key pair
async function getOrCreateKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
  // Return cached keys if available
  if (cachedPrivateKey && cachedPublicKey) {
    return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
  }

  // Check if keys exist
  const privateKeyExists = fs.existsSync(PRIVATE_KEY_PATH);
  const publicKeyExists = fs.existsSync(PUBLIC_KEY_PATH);

  if (privateKeyExists && publicKeyExists) {
    // Load existing keys
    cachedPrivateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    cachedPublicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
    
    return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
  }

  // Generate new key pair
  console.log('🔐 Generating RSA key pair for password encryption...');
  
  // Create keys directory if it doesn't exist
  if (!fs.existsSync(KEY_DIR)) {
    fs.mkdirSync(KEY_DIR, { recursive: true, mode: 0o700 }); // Secure permissions
  }

  try {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
      modulusLength: KEY_SIZE,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Save keys to files
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 }); // Read/write for owner only
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey, { mode: 0o644 }); // Readable by all

    cachedPrivateKey = privateKey;
    cachedPublicKey = publicKey;

    console.log('✅ RSA key pair generated and saved');
    
    return { privateKey, publicKey };
  } catch (error) {
    console.error('❌ Error generating RSA key pair:', error);
    throw error;
  }
}

// Initialize keys on server start
let keyPairInitialized = false;

export async function initializePasswordEncryption(): Promise<void> {
  if (keyPairInitialized) {
    return;
  }
  
  try {
    await getOrCreateKeyPair();
    keyPairInitialized = true;
    console.log('✅ Password encryption system initialized');
  } catch (error) {
    console.error('❌ Failed to initialize password encryption:', error);
    // Don't throw - allow server to start even if key generation fails
    // The encryption will fail gracefully if keys aren't available
  }
}

// Get public key for clients (exports in SPKI format)
export async function getPublicKey(): Promise<string> {
  try {
    const { publicKey } = await getOrCreateKeyPair();
    return publicKey;
  } catch (error) {
    console.error('Error getting public key:', error);
    throw new Error('Failed to get encryption public key');
  }
}

// Decrypt password on server side
export async function decryptPassword(encryptedPassword: string): Promise<string> {
  try {
    const { privateKey } = await getOrCreateKeyPair();
    
    // Encrypted password is base64 encoded
    const encryptedBuffer = Buffer.from(encryptedPassword, 'base64');
    
    // Decrypt using RSA-OAEP
    const decrypted = privateDecrypt(
      {
        key: privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      encryptedBuffer
    );
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Error decrypting password:', error);
    throw new Error('Failed to decrypt password');
  }
}

// Check if password encryption is enabled
// Enabled by default (true) unless explicitly disabled
export function isPasswordEncryptionEnabled(): boolean {
  // Default to true unless explicitly set to 'false'
  if (process.env.ENABLE_PASSWORD_ENCRYPTION === 'false') {
    return false;
  }
  // Enable by default
  return true;
}

