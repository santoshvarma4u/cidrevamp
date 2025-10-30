# Rebuild and Restart Instructions

## The Problem

Your server is running an **old build** with the `require` statement. The source code has been fixed, but the running server hasn't been rebuilt.

## Solution: Rebuild and Restart

### Option 1: Docker Compose (Production)

```bash
# Stop the current containers
docker-compose down

# Rebuild the images
docker-compose build

# Start fresh
docker-compose up -d

# Check logs
docker logs -f cid-app
```

### Option 2: Development Mode

```bash
# Stop the dev server (Ctrl+C)

# Rebuild
npm run build

# Restart dev server
npm run dev
```

### Option 3: Production Deployment

```bash
# If using production build
npm run build

# Restart production server
pm2 restart cid-app
# OR
systemctl restart cid
```

---

## Verify the Fix

After restarting, check the logs:

```bash
docker logs cid-app | grep "decrypt"

# You should NOT see "require is not defined" anymore
# You should see successful decryption or clear error messages
```

Try logging in again. The error should be gone!

---

## Why This Happened

- **Source code fixed** ✅ (passwordEncryption.ts)
- **Server not rebuilt** ❌ (still running old code)
- **Result**: Old code with `require` still running

The fix is already in the source code - you just need to rebuild and restart!

