/**
 * Client-side password encryption using Web Crypto API
 * Encrypts password with RSA public key before sending to server
 */

// Cache for public key
let cachedPublicKey: CryptoKey | null = null;
let publicKeyFetchPromise: Promise<CryptoKey> | null = null;

/**
 * Fetch and import RSA public key from server
 */
async function getPublicKey(): Promise<CryptoKey> {
  // Return cached key if available
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  // If already fetching, wait for that promise
  if (publicKeyFetchPromise) {
    return publicKeyFetchPromise;
  }

  // Fetch public key from server
  publicKeyFetchPromise = (async () => {
    try {
      const response = await fetch('/api/auth/public-key');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch public key: ${response.status}`);
      }

      const { publicKeyPem } = await response.json();
      
      if (!publicKeyPem) {
        throw new Error('Public key not provided by server');
      }

      // Convert PEM to ArrayBuffer
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';
      const pemContents = publicKeyPem
        .replace(pemHeader, '')
        .replace(pemFooter, '')
        .replace(/\s/g, '');
      
      const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

      // Import public key using Web Crypto API
      const publicKey = await crypto.subtle.importKey(
        'spki',
        binaryDer.buffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['encrypt']
      );

      cachedPublicKey = publicKey;
      return publicKey;
    } catch (error) {
      console.error('Error fetching/importing public key:', error);
      // Clear the promise so we can retry
      publicKeyFetchPromise = null;
      throw error;
    }
  })();

  return publicKeyFetchPromise;
}

/**
 * Encrypt password using RSA-OAEP
 */
export async function encryptPassword(password: string): Promise<string> {
  try {
    // Get public key
    const publicKey = await getPublicKey();

    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);

    // Encrypt using RSA-OAEP
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      passwordBuffer
    );

    // Convert encrypted data to base64 string
    const encryptedBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encrypted))
    );

    return encryptedBase64;
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw new Error('Failed to encrypt password. Please try again.');
  }
}

/**
 * Clear cached public key (useful for testing or key rotation)
 */
export function clearPublicKeyCache(): void {
  cachedPublicKey = null;
  publicKeyFetchPromise = null;
}

/**
 * Check if password encryption is supported
 */
export function isPasswordEncryptionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'crypto' in window &&
    'subtle' in window.crypto
  );
}

