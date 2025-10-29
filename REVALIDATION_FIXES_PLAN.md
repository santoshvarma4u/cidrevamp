# Security Revalidation Fixes Plan

**Date:** October 29, 2025  
**Reference:** Revalidation CID.docx - Security Audit Revalidation Report

## Summary

This document addresses **7 remaining security issues** identified in the revalidation audit where implementations exist but require enhancement or verification:

### Status Overview

| Case | Issue | Severity | Status | Priority |
|------|-------|----------|--------|----------|
| II | Host Header Attack | Medium | Partially Fixed | HIGH |
| III | Malicious File Upload | Medium | Needs Enhancement | HIGH |
| IV | Misconfigured CORS | Medium | Needs Review | HIGH |
| V | Weak Captcha | Medium | Needs Enhancement | MEDIUM |
| VI | Session Replay | Medium | Partially Fixed | HIGH |
| X | TLS/CBC Ciphers | Low | Partially Fixed | MEDIUM |
| XII | Cookie Attributes | Low | Needs Verification | MEDIUM |
| XIII | Unknown Issue | Low | TBD | LOW |

---

## Case II: Host Header Attack

### Current Status
✅ Host header validation moved to application level  
⚠️ Need to verify comprehensive validation covers all edge cases

### Required Fixes

1. **Verify Application-Level Validation Coverage**
   - ✅ Host header validation implemented
   - ✅ X-Forwarded-Host validation implemented
   - ✅ X-Real-Host validation implemented
   - ⚠️ Need to verify it's applied before all routes

2. **Ensure Strict Whitelist Enforcement**
   - Production: Only `cid-staging.tspolice.gov.in` and `cid.tspolice.gov.in`
   - Verify environment variable override is secure

### Action Items
- [ ] Test host header validation with various attack vectors
- [ ] Verify validation runs before all route handlers
- [ ] Confirm production configuration enforces strict whitelist

---

## Case III: Malicious File Upload

### Current Status
✅ Extension whitelist implemented  
✅ MIME type validation implemented  
✅ File size limits implemented  
✅ Filename sanitization implemented  
⚠️ **Missing:** Files stored outside webroot, content scanning, file permissions

### Required Fixes

1. **Verify Files Stored Outside Webroot**
   - Check if `uploads/` directory is served directly
   - Should use `/api/uploads` endpoint with authentication

2. **Content-Based Validation**
   - Add file magic number validation (file signature checking)
   - Implement content scanning for malicious content
   - Validate actual file content matches declared type

3. **File Permissions**
   - Ensure uploaded files have restrictive permissions (644 or 600)
   - Verify directories have correct permissions (755)

4. **Storage Location Security**
   - Verify files cannot be executed directly from uploads directory
   - Ensure .htaccess or equivalent protection

### Action Items
- [ ] Implement file magic number validation
- [ ] Add content scanning (virus/malware check)
- [ ] Verify file permissions are set correctly on upload
- [ ] Ensure uploads directory cannot execute files
- [ ] Test double extension bypass attempts
- [ ] Test MIME type spoofing attempts

---

## Case IV: Misconfigured CORS

### Current Status
✅ CORS configuration exists  
⚠️ Need to verify it's not too permissive  
⚠️ Verify credentials are handled correctly

### Required Fixes

1. **Strict Origin Validation**
   - Production: Only allow `https://cid-staging.tspolice.gov.in` and `https://cid.tspolice.gov.in`
   - Remove wildcard patterns if present
   - Verify regex patterns are secure

2. **Credentials Handling**
   - Only allow credentials from trusted origins
   - Disable credentials for public endpoints
   - Verify `Access-Control-Allow-Credentials` is properly scoped

3. **Method and Header Restrictions**
   - Validate allowed methods are necessary
   - Restrict exposed headers

### Action Items
- [ ] Review CORS_ORIGIN_PATTERNS for security
- [ ] Verify credentials are only allowed for authenticated endpoints
- [ ] Test CORS with malicious origin attempts
- [ ] Document CORS policy

---

## Case V: Weak Captcha Implementation

### Current Status
✅ Client-side CAPTCHA generation  
✅ Server-side validation  
✅ Rate limiting implemented  
⚠️ **Using custom svg-captcha** (security team may prefer proven services like reCAPTCHA)

### Required Fixes

1. **Consider Proven CAPTCHA Service**
   - Option A: Integrate Google reCAPTCHA v3
   - Option B: Integrate hCaptcha
   - Option C: Enhance current implementation with better security

2. **Enhance Current Implementation**
   - If keeping custom CAPTCHA, ensure:
     - Strong randomization
     - Server-side only state
     - Rate limiting per IP
     - One-time use enforcement
     - Time-based expiration

3. **Rotation Enforcement**
   - Ensure CAPTCHA rotates on each request
   - Prevent reuse of same challenge

### Action Items
- [ ] Evaluate integration of reCAPTCHA or hCaptcha
- [ ] If keeping custom, enhance security measures
- [ ] Verify CAPTCHA is required on all auth endpoints
- [ ] Test CAPTCHA bypass attempts

---

## Case VI: Session Replay

### Current Status
✅ Session invalidation on logout  
✅ Session validation middleware  
✅ Session age checking  
⚠️ **Missing:** Session token rotation, IP/user-agent binding

### Required Fixes

1. **Session Token Rotation**
   - Rotate session ID after successful login
   - Regenerate session ID periodically during active session
   - Implement session token refresh mechanism

2. **Session Binding**
   - Bind sessions to IP address (log and enforce)
   - Bind sessions to User-Agent
   - Reject requests with mismatched attributes

3. **Replay Protection**
   - Track used session tokens
   - Implement token nonce/one-time use mechanism
   - Log all replay attempt attempts

### Action Items
- [ ] Implement session ID rotation on login
- [ ] Add IP address binding and validation
- [ ] Add User-Agent binding and validation
- [ ] Implement token nonce system
- [ ] Test session replay scenarios

---

## Case X: SSL/TLS Certificate Supports Older Versions, CBC and Weak Ciphers

### Current Status
✅ TLS 1.2 and 1.3 enforced in nginx  
✅ CBC ciphers removed from nginx  
⚠️ Need to verify configuration is correct and complete

### Required Fixes

1. **Verify Nginx TLS Configuration**
   - Ensure TLS 1.0 and 1.1 are disabled
   - Verify only TLS 1.2 and 1.3 are enabled
   - Confirm CBC ciphers are completely removed
   - Only allow strong cipher suites (GCM, CHACHA20-POLY1305)

2. **Certificate Configuration**
   - Verify certificate uses strong algorithms (RSA 2048+ or ECC)
   - Check certificate chain is complete
   - Ensure proper OCSP stapling

3. **Additional TLS Hardening**
   - Enable perfect forward secrecy
   - Disable SSL compression
   - Set appropriate cipher preference

### Action Items
- [ ] Verify nginx TLS configuration is correct
- [ ] Test TLS handshake with SSL Labs or similar
- [ ] Confirm no weak ciphers are available
- [ ] Document TLS configuration

---

## Case XII: Missing Cookies Attributes

### Current Status
✅ cookieSecurityMiddleware implemented  
⚠️ Need to verify ALL cookies (including session cookies) use secure attributes

### Required Fixes

1. **Session Cookie Configuration**
   - Verify express-session configuration applies secure attributes
   - Ensure `connect.sid` cookie has Secure, HttpOnly, SameSite
   - Check passport session cookie attributes

2. **Application Cookie Enforcement**
   - Ensure cookieSecurityMiddleware runs before session middleware
   - Verify override is working correctly
   - Test cookie attributes in production

3. **Cookie Scope**
   - Verify path restrictions are appropriate
   - Check domain settings are correct
   - Ensure partitioned flag is set in production

### Action Items
- [ ] Verify express-session cookie configuration
- [ ] Test cookie attributes in browser DevTools
- [ ] Ensure all cookies have Secure, HttpOnly, SameSite
- [ ] Verify cookieSecurityMiddleware is applied correctly

---

## Implementation Priority

### Phase 1 (Critical - Immediate)
1. Case III: Malicious File Upload - Content validation and permissions
2. Case VI: Session Replay - Token rotation and binding
3. Case II: Host Header - Complete verification

### Phase 2 (High Priority)
4. Case IV: CORS - Strict origin validation
5. Case XII: Cookies - Complete attribute verification

### Phase 3 (Medium Priority)
6. Case V: CAPTCHA - Evaluate proven service integration
7. Case X: TLS - Final verification and documentation

---

## Testing Requirements

For each fix, the following tests must be performed:

1. **Functional Testing**
   - Verify feature still works correctly
   - Test edge cases and error handling

2. **Security Testing**
   - Attempt bypass techniques
   - Verify security controls work
   - Test with various attack vectors

3. **Integration Testing**
   - Ensure fixes don't break existing functionality
   - Test in both development and production configurations

---

## Next Steps

1. Review each case individually
2. Implement fixes in priority order
3. Test thoroughly
4. Document changes
5. Submit for revalidation

