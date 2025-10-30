# Password Decryption Error - Debug Guide

## Common Causes

The password decryption error can occur for several reasons:

### 1. **Client-Server Version Mismatch**

**Problem:** Client using new format, server expecting old format or vice versa.

**Check:**
```bash
# Check if client is using new nonce-based encryption
# Open browser console on login page and check:
# Should see nonce-based encryption
```

**Fix:** Ensure both client and server are updated and rebuilt.

### 2. **RSA Key Issues**

**Problem:** Missing or corrupted RSA keys.

**Check:**
```bash
# Check if keys exist
ls -la .keys/

# Should see:
# - password-decrypt-key.pem (private key)
# - password-encrypt-key.pem (public key)
```

**Fix:** Delete `.keys/` directory and restart server to regenerate keys.

### 3. **Nonce Already Seen (Replay Prevention)**

**Problem:** Trying to reuse an old encrypted password.

**Error:** "Replay attack detected - nonce already used"

**Fix:** Each login attempt generates a new nonce automatically.

### 4. **Password Too Old**

**Problem:** Encrypted password older than 5 minutes.

**Error:** "Encrypted password expired - too old"

**Fix:** Encrypt password right before sending (automatic in client).

### 5. **JSON Parse Error**

**Problem:** Decrypted data is not valid JSON.

**Check:**
```bash
# View server logs
docker logs cid-app | grep "decrypt"

# Should see decryption success or specific error
```

---

## Quick Fixes

### Fix 1: Regenerate RSA Keys

```bash
# Stop server
docker-compose down

# Remove keys
rm -rf .keys/

# Restart server (keys will regenerate automatically)
docker-compose up -d
```

### Fix 2: Clear Browser Cache

```javascript
// Run in browser console on login page
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 3: Temporarily Disable Encryption

**ONLY FOR TESTING - NOT FOR PRODUCTION!**

```bash
# In docker-compose.yml or .env
ENABLE_PASSWORD_ENCRYPTION=false

# Restart
docker-compose restart app
```

---

## Detailed Debugging

### Enable Verbose Logging

Add to `server/auth.ts` around line 566:

```typescript
if (isPasswordEncryptionEnabled() && password) {
  try {
    console.log('🔓 Attempting to decrypt password...');
    password = await decryptPassword(password);
    console.log('✅ Password decrypted successfully');
  } catch (error) {
    console.error("❌ Password decryption error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    logSecurityEvent('PASSWORD_DECRYPTION_ERROR', { username, ip: clientIp, error: error.message }, req, 'HIGH', 'FAILURE');
    return res.status(400).json({ message: "Password decryption failed. Please try again." });
  }
}
```

### Test Decryption Manually

```bash
# Test public key endpoint
curl http://localhost:5000/api/auth/public-key

# Should return:
# { "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n..." }
```

---

## Expected Behavior

### Normal Flow

1. Client fetches public key from `/api/auth/public-key`
2. Client generates random nonce (32 bytes)
3. Client creates timestamp
4. Client encrypts: `{password, nonce, timestamp}`
5. Server receives encrypted data
6. Server decrypts and validates nonce
7. Server returns password

### Error Messages

| Error Message | Cause | Fix |
|---------------|-------|-----|
| "Failed to decrypt password" | Generic error | Check logs for details |
| "Encrypted password expired" | Password >5 min old | Encrypt right before sending |
| "Replay attack detected" | Nonce reuse | Each login uses new nonce |
| "Invalid encrypted password format" | Wrong format | Check client version |
| "Password decryption error" | RSA key issue | Regenerate keys |

---

## Verification Steps

### Step 1: Check Server Logs

```bash
# Watch server logs during login
docker logs -f cid-app

# Look for:
# ✅ "Password decrypted successfully"
# OR
# ❌ "Password decryption error: ..."
```

### Step 2: Check Browser Console

Open developer tools (F12) and look for:
- `encryptPassword` being called
- Any encryption errors
- Network tab showing encrypted password sent

### Step 3: Verify Nonce Generation

```javascript
// In browser console on login page
const nonce1 = new Uint8Array(32);
crypto.getRandomValues(nonce1);
console.log('Nonce 1:', Array.from(nonce1).slice(0, 5), '...');

const nonce2 = new Uint8Array(32);
crypto.getRandomValues(nonce2);
console.log('Nonce 2:', Array.from(nonce2).slice(0, 5), '...');

// Should be different!
```

### Step 4: Test Encryption/Decryption

```javascript
// In browser console
import('@/lib/passwordEncryption').then(({ encryptPassword }) => {
  encryptPassword('testpassword').then(encrypted => {
    console.log('Encrypted:', encrypted.substring(0, 50) + '...');
  });
});
```

---

## Common Issues and Solutions

### Issue: "Encrypted password expired"

**Cause:** Delayed login after encryption

**Solution:** Client encrypts right before sending (automatic)

### Issue: "Replay attack detected"

**Cause:** Nonce seen before

**Solution:** Each encryption generates new nonce (automatic)

### Issue: "Invalid format"

**Cause:** Client/server version mismatch

**Solution:** Restart both client and server

### Issue: "RSA key not found"

**Cause:** Missing `.keys/` directory

**Solution:** Restart server to auto-generate keys

---

## Production Checklist

- [ ] RSA keys exist in `.keys/` directory
- [ ] Public key endpoint working: `/api/auth/public-key`
- [ ] Client has latest password encryption code
- [ ] Server has latest password decryption code
- [ ] Browser supports Web Crypto API
- [ ] No errors in server logs
- [ ] No errors in browser console

---

## Still Having Issues?

1. Check exact error message in logs
2. Verify RSA keys exist and are valid
3. Clear browser cache and cookies
4. Restart both client and server
5. Check for client/server version mismatch

**If still failing, temporarily disable encryption for testing:**

```bash
ENABLE_PASSWORD_ENCRYPTION=false
```

**Then fix the issue and re-enable.**

