/**
 * Script to generate RSA key pair for password encryption
 * Run this before starting the server in production or when you want to pre-generate keys
 */

import { generateKeyPair } from 'crypto';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const generateKeyPairAsync = promisify(generateKeyPair);

// Match the paths from passwordEncryption.ts
const KEY_SIZE = 2048;
const KEY_DIR = path.join(process.cwd(), '.keys');
const PRIVATE_KEY_PATH = path.join(KEY_DIR, 'password-decrypt-key.pem');
const PUBLIC_KEY_PATH = path.join(KEY_DIR, 'password-encrypt-key.pem');

async function generateKeys() {
  console.log('🔐 Generating RSA key pair for password encryption...\n');
  
  // Create keys directory if it doesn't exist
  if (!fs.existsSync(KEY_DIR)) {
    fs.mkdirSync(KEY_DIR, { recursive: true, mode: 0o700 });
    console.log(`✅ Created directory: ${KEY_DIR}`);
    console.log(`   Permissions: 700 (owner read/write/execute only)\n`);
  } else {
    console.log(`📁 Directory exists: ${KEY_DIR}\n`);
  }

  // Check if keys already exist
  if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
    console.log('⚠️  Keys already exist!\n');
    console.log(`   Private: ${PRIVATE_KEY_PATH}`);
    console.log(`   Public:  ${PUBLIC_KEY_PATH}\n`);
    
    // Check file stats
    try {
      const privateStat = fs.statSync(PRIVATE_KEY_PATH);
      const publicStat = fs.statSync(PUBLIC_KEY_PATH);
      console.log(`   Private key size: ${privateStat.size} bytes`);
      console.log(`   Public key size: ${publicStat.size} bytes`);
      console.log(`   Private key permissions: 0${privateStat.mode.toString(8).slice(-3)}`);
      console.log(`   Public key permissions: 0${publicStat.mode.toString(8).slice(-3)}\n`);
    } catch (err) {
      // Ignore stat errors
    }
    
    console.log('✅ Keys are ready to use!');
    console.log('   (No action needed - keys will be loaded automatically on server start)\n');
    return;
  }

  try {
    console.log(`🔑 Generating ${KEY_SIZE}-bit RSA key pair...`);
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

    // Save keys to files with secure permissions
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 }); // Read/write for owner only
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey, { mode: 0o644 }); // Readable by all

    console.log('\n✅ RSA key pair generated successfully!\n');
    console.log(`📄 Private Key: ${PRIVATE_KEY_PATH}`);
    console.log(`   Size: ${privateKey.length} bytes`);
    console.log(`   Permissions: 600 (owner read/write only)`);
    console.log(`   Purpose: Decrypt passwords on server\n`);
    console.log(`📄 Public Key: ${PUBLIC_KEY_PATH}`);
    console.log(`   Size: ${publicKey.length} bytes`);
    console.log(`   Permissions: 644 (readable by all)`);
    console.log(` bil Purpose: Encrypt passwords on client\n`);
    console.log('🔒 Security Notes:');
    console.log('   ✓ Private key is stored securely (600 permissions)');
    console.log('   ✓ Public key can be shared with clients (644 permissions)');
    console.log('   ✓ Keys are in .gitignore (will NOT be committed to git)');
    console.log('   ✓ Keys will be auto-loaded when server starts\n');
    console.log('✅ Password encryption system is ready to use!\n');
  } catch (error) {
    console.error('❌ Error generating RSA key pair:', error);
    process.exit(1);
  }
}

generateKeys().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

