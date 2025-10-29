/**
 * Script to generate RSA key pair for password encryption
 * This generates the keys that will be used for client-side password encryption
 */

import { generateKeyPair } from 'crypto';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generateKeyPairAsync = promisify(generateKeyPair);

const KEY_SIZE = 2048; // 2048-bit RSA key
const KEY_DIR = path.join(process.cwd(), '.keys');
const PRIVATE_KEY_PATH = path.join(KEY_DIR, 'password-decrypt-key.pem');
const PUBLIC_KEY_PATH = path.join(KEY_DIR, 'password-encrypt-key.pem');

async function generateKeys() {
  console.log('🔐 Generating RSA key pair for password encryption...');
  console.log(`📁 Keys will be stored in: ${KEY_DIR}`);
  
  // Create keys directory if it doesn't exist
  if (!fs.existsSync(KEY_DIR)) {
    fs.mkdirSync(KEY_DIR, { recursive: true, mode: 0o700 });
    console.log(`✅ Created directory: ${KEY_DIR}`);
  } else {
    console.log(`✅ Directory exists: ${KEY_DIR}`);
  }

  // Check if keys already exist
  if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
    console.log('⚠️  Keys already exist!');
    console.log(`   Private key: ${PRIVATE_KEY_PATH}`);
    console.log(`   Public key: ${PUBLIC_KEY_PATH}`);
    console.log('');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      readline.question('Do you want to regenerate keys? (yes/no): ', resolve);
    });
    readline.close();
    
    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      console.log('❌ Key generation cancelled. Using existing keys.');
      return;
    }
    
    // Backup existing keys
    const backupDir = path.join(KEY_DIR, 'backup-' + Date.now());
    fs.mkdirSync(backupDir);
    fs.copyFileSync(PRIVATE_KEY_PATH, path.join(backupDir, 'password-decrypt-key.pem'));
    fs.copyFileSync(PUBLIC_KEY_PATH, path.join(backupDir, 'password-encrypt-key.pem'));
    console.log(`📦 Backed up existing keys to: ${backupDir}`);
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

    // Save keys to files
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 }); // Read/write for owner only
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey, { mode: 0o644 }); // Readable by all

    console.log('✅ RSA key pair generated successfully!');
    console.log('');
    console.log(`📄 Private Key: ${PRIVATE_KEY_PATH}`);
    console.log(`   Permissions: 600 (owner read/write only)`);
    console.log('');
    console.log(`📄 Public Key: ${PUBLIC_KEY_PATH}`);
    console.log(`   Permissions: 644 (readable by all)`);
    console.log('');
    console.log('🔒 Security Notes:');
    console.log('   - Private key is stored securely (600 permissions)');
    console.log('   - Public key can be shared with clients (644 permissions)');
    console.log('   - Keys are in .gitignore (will NOT be committed to git)');
    console.log('');
    console.log('✅ Password encryption system is ready to use!');
  } catch (error) {
    console.error('❌ Error generating RSA key pair:', error);
    process.exit(1);
  }
}

generateKeys().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

