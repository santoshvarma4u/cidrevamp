# Cookie Validation Guide for https://cid-staging.tspolice.gov.in

## ✅ Current Configuration

- **Domain**: `undefined` (exact domain matching - correct for `cid-staging.tspolice.gov.in`)
- **Secure**: `true` (in production with HTTPS)
- **SameSite**: `'lax'` (compatible with modern browsers)
- **HttpOnly**: `true` (prevents XSS)
- **Path**: `'/'` (applies to entire site)

## 🔍 Why It Works in Preview/Cursor Browsers But Not Regular Browsers

Preview browsers (VS Code/Cursor embedded browsers) often have:
- Relaxed cookie policies
- Less strict SameSite enforcement
- Different third-party cookie handling

Regular browsers (Chrome, Firefox, Safari) have stricter security:
- Enforce SameSite policies more strictly
- Block cookies with invalid configurations
- Require proper HTTPS setup

## 🧪 Debugging Steps

### 1. Check Browser Console
Open DevTools → Console and look for:
- Cookie warnings (SameSite, Secure, Domain)
- CORS errors
- Network errors

### 2. Check Network Tab
1. Open DevTools → Network
2. Attempt login
3. Check the login request:
   - **Request Headers**: Should include `Cookie` header (if cookie exists)
   - **Response Headers**: Should include `Set-Cookie` header
   - **Status Code**: Should be 200 or 401 (if auth fails)

### 3. Check Application/Storage Tab
1. Open DevTools → Application → Cookies
2. Navigate to `https://cid-staging.tspolice.gov.in`
3. Check for `cid.session.id` cookie:
   - **Secure**: Should be ✅ checked
   - **HttpOnly**: Should be ✅ checked
   - **SameSite**: Should show `Lax`
   - **Domain**: Should show `.cid-staging.tspolice.gov.in` or `cid-staging.tspolice.gov.in`

### 4. Verify Server Logs
Check server logs during login for:
```
Login - Cookie configuration: {
  secure: true,
  protocol: 'https',
  secureFlag: true,
  xForwardedProto: 'https'
}
```

## 🔧 Potential Fixes

### Fix 1: Explicit Cookie Domain (if needed)
If cookies aren't being set, try setting explicit domain:
```bash
COOKIE_DOMAIN=.tspolice.gov.in
```

### Fix 2: Check CORS Configuration
Ensure CORS allows the origin:
- `https://cid-staging.tspolice.gov.in` should be in `CORS_ALLOWED_ORIGINS`

### Fix 3: Verify HTTPS Detection
Ensure Nginx sets header:
```nginx
proxy_set_header X-Forwarded-Proto https;
```

### Fix 4: Browser-Specific Issues

#### Chrome
- Check: `chrome://settings/cookies`
- Disable "Block third-party cookies" for testing
- Check Chrome flags: `chrome://flags/#same-site-by-default-cookies`

#### Firefox
- Check: `about:preferences#privacy`
- Check "Cookies and Site Data" settings

#### Safari
- Safari has strict SameSite policies
- May need `SameSite=None; Secure` for cross-site scenarios

## 📋 Quick Test Commands

### Test Cookie Setting
```bash
curl -I https://cid-staging.tspolice.gov.in/api/captcha \
  -H "Host: cid-staging.tspolice.gov.in"
```
Look for `Set-Cookie` header in response.

### Test Authentication
```bash
curl -X POST https://cid-staging.tspolice.gov.in/api/login \
  -H "Content-Type: application/json" \
  -H "Cookie: cid.session.id=test" \
  -d '{"username":"test","password":"test"}'
```

## ✅ Expected Behavior

### When Login Works:
1. POST `/api/login` → 200 OK
2. Response includes `Set-Cookie: cid.session.id=...; Secure; HttpOnly; SameSite=Lax`
3. Browser stores cookie
4. Subsequent requests include `Cookie: cid.session.id=...`
5. GET `/api/auth/user` → 200 OK with user data

### When Login Fails:
1. POST `/api/login` → 200 OK (but cookie not set)
2. GET `/api/auth/user` → 401 Unauthorized
3. Check browser console for cookie errors

## 🚨 Common Issues

### Issue: Cookie Not Set
**Cause**: `Secure=true` but request not HTTPS  
**Fix**: Verify `x-forwarded-proto: https` header

### Issue: Cookie Set But Not Sent
**Cause**: Domain mismatch or SameSite blocking  
**Fix**: Check cookie domain matches request domain exactly

### Issue: Login Success But Immediate Logout
**Cause**: Cookie rejected by browser  
**Fix**: Check browser console for cookie warnings

## 📞 Need More Help?

If issues persist, provide:
1. Browser name and version
2. Browser console errors (copy/paste)
3. Network tab screenshot of login request
4. Server logs showing cookie configuration
