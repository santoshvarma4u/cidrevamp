# Security Deployment Checklist - CID Telangana

**Last Updated:** October 17, 2025  
**Security Audit Fixes:** Issue #1, #2 Completed

---

## Pre-Deployment Security Configuration

### 1. Environment Variables

Ensure these environment variables are properly configured:

```bash
# Required
NODE_ENV=production
DATABASE_URL=postgresql://ciduser:cidpassword@postgres:5432/ciddb
SESSION_SECRET=<STRONG-SECRET-MIN-32-CHARS>
PORT=5000

# Optional - Add additional trusted domains if needed
TRUSTED_HOSTS=additional-domain1.com,additional-domain2.com
```

### 2. Trusted Hosts Configuration

**Default Trusted Hosts (already configured):**
- ✅ `cid-staging.tspolice.gov.in`
- ✅ `cid.tspolice.gov.in`
- ✅ `localhost`, `127.0.0.1`
- ✅ `*.replit.app`, `*.replit.dev`
- ✅ Docker internal: `app`, `cid-app`

**To Add New Domain:**
```bash
# In .env or docker-compose.yml
TRUSTED_HOSTS=new-domain.com,another-domain.com
```

---

## Security Features Enabled

### ✅ Issue #1: HTTP Method Filtering (CWE-749)
**Status:** Active  
**Protection Level:** Application + Nginx

**Blocked Methods:**
- TRACE (information disclosure)
- TRACK (similar to TRACE)
- CONNECT (tunneling)
- OPTIONS (restricted to CORS only)

**Allowed Methods:**
- GET, POST, PUT, DELETE, PATCH, HEAD

**Verification:**
```bash
curl -X TRACE https://cid-staging.tspolice.gov.in/api/health
# Expected: 405 Method Not Allowed
```

---

### ✅ Issue #2: Host Header Validation (CWE-20)
**Status:** Active  
**Protection Level:** Application + Nginx

**Protection Against:**
- Host Header Injection
- Cache Poisoning
- Password Reset Poisoning
- SSRF attacks

**Verification:**
```bash
# Valid host (should work)
curl -H "Host: cid-staging.tspolice.gov.in" https://cid-staging.tspolice.gov.in/api/health

# Invalid host (should return 403)
curl -H "Host: evil.com" https://cid-staging.tspolice.gov.in/api/health
```

---

## Deployment Steps

### Development Environment

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Verify security features
curl -X TRACE http://localhost:5000/api/health  # Should return 405
curl -H "Host: evil.com" http://localhost:5000/api/health  # Should return 403
```

### Docker Production Deployment

```bash
# 1. Build and start services
./docker-run.sh prod

# 2. Check service health
./docker-run.sh health

# 3. Monitor security logs
./docker-run.sh logs app | grep "SECURITY EVENT"

# 4. Verify security features
curl -X TRACE http://localhost:5000/api/health  # Should return 405
curl -H "Host: malicious.com" http://localhost:5000/api/health  # Should return 403
```

---

## Security Monitoring

### Security Event Logs

Monitor for these security events:
```bash
# View security events
docker logs cid-app 2>&1 | grep "SECURITY EVENT"

# Filter specific events
docker logs cid-app 2>&1 | grep "BLOCKED_HTTP_METHOD"
docker logs cid-app 2>&1 | grep "UNTRUSTED_HOST_HEADER"
```

### Expected Log Format

```json
{
  "timestamp": "2025-10-17T10:30:00.000Z",
  "event": "BLOCKED_HTTP_METHOD",
  "details": {
    "method": "TRACE",
    "path": "/about",
    "ip": "192.168.1.100"
  }
}

{
  "timestamp": "2025-10-17T10:31:00.000Z",
  "event": "UNTRUSTED_HOST_HEADER",
  "details": {
    "host": "evil.com",
    "ip": "192.168.1.101",
    "path": "/api/login"
  }
}
```

---

## Testing Checklist

### Security Tests

Run these tests after deployment:

#### HTTP Method Tests
```bash
# Test 1: TRACE method blocked
curl -X TRACE https://cid-staging.tspolice.gov.in/
# Expected: 405 Method Not Allowed

# Test 2: TRACK method blocked
curl -X TRACK https://cid-staging.tspolice.gov.in/
# Expected: 405 Method Not Allowed

# Test 3: Valid methods work
curl -X GET https://cid-staging.tspolice.gov.in/api/health
# Expected: 200 OK

curl -X POST https://cid-staging.tspolice.gov.in/api/complaints
# Expected: Normal application response
```

#### Host Header Tests
```bash
# Test 1: Valid host works
curl https://cid-staging.tspolice.gov.in/api/health
# Expected: 200 OK with health status

# Test 2: Invalid host blocked
curl -H "Host: evil-domain.com" http://YOUR_SERVER_IP:5000/api/health
# Expected: 403 Forbidden

# Test 3: Missing host header
curl -H "Host:" http://YOUR_SERVER_IP:5000/api/health
# Expected: 400 Bad Request

# Test 4: X-Forwarded-Host validation
curl -H "Host: cid-staging.tspolice.gov.in" \
     -H "X-Forwarded-Host: malicious.com" \
     http://YOUR_SERVER_IP:5000/api/health
# Expected: 403 Forbidden
```

#### Functional Tests
```bash
# Test normal application functionality
curl https://cid-staging.tspolice.gov.in/
# Expected: HTML homepage

curl https://cid-staging.tspolice.gov.in/api/pages
# Expected: JSON with pages

curl https://cid-staging.tspolice.gov.in/api/news
# Expected: JSON with news items
```

---

## Rollback Procedure

If security fixes cause issues:

### Quick Rollback
```bash
# 1. Stop current deployment
./docker-run.sh stop

# 2. Checkout previous version
git checkout <previous-commit-hash>

# 3. Rebuild and restart
./docker-run.sh prod

# 4. Verify services
./docker-run.sh health
```

### Disable Specific Security Feature (Emergency Only)

**To temporarily disable Host validation:**
```typescript
// In server/index.ts, comment out:
// app.use(validateHostHeader);
```

**To temporarily disable HTTP method filtering:**
```typescript
// In server/index.ts, comment out:
// app.use(httpMethodFilter);
```

⚠️ **WARNING:** Only disable as last resort. Document the reason and timeline for re-enabling.

---

## Nginx Configuration

### Verify Nginx Security Settings

```bash
# Check Nginx config syntax
docker exec cid-nginx nginx -t

# Reload Nginx configuration
docker exec cid-nginx nginx -s reload

# View Nginx logs
docker logs cid-nginx
```

### Nginx Security Headers

Verify these headers are present in responses:
```bash
curl -I https://cid-staging.tspolice.gov.in/

# Should include:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Allow: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
```

---

## Performance Impact

### Expected Performance Impact

**HTTP Method Filtering:**
- Impact: < 1ms per request
- Memory: Negligible
- CPU: Negligible

**Host Header Validation:**
- Impact: < 2ms per request
- Memory: Minimal (whitelist in memory)
- CPU: Minimal (string comparison)

### Monitoring

```bash
# Monitor application performance
docker stats cid-app

# Check request latency
curl -w "@curl-format.txt" -o /dev/null -s https://cid-staging.tspolice.gov.in/api/health
```

Create `curl-format.txt`:
```
time_namelookup:  %{time_namelookup}\n
time_connect:     %{time_connect}\n
time_starttransfer: %{time_starttransfer}\n
time_total:       %{time_total}\n
```

---

## Support & Troubleshooting

### Common Issues

**Issue 1: Legitimate requests blocked**
- Check if domain is in TRUSTED_HOSTS
- Add domain via environment variable
- Restart application

**Issue 2: Security logs too verbose**
- Normal - indicates security features working
- Consider log rotation
- Filter by severity in monitoring

**Issue 3: Application not starting**
- Check environment variables
- Verify DATABASE_URL
- Check docker logs: `./docker-run.sh logs app`

### Contact

For security issues or questions:
- Review: `/Users/santosh/cidrevamp/SECURITY_AUDIT_FIXES.md`
- Logs: `./docker-run.sh logs app`
- Health: `./docker-run.sh health`

---

**Security Compliance:** Issues #1, #2 Fixed  
**Next Audit Review:** Pending remaining 11 issues  
**Deployment Status:** Ready for Production

