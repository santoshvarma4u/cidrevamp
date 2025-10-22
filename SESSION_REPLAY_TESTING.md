# Session Replay Fix - Testing Commands

## Test 1: Normal Logout Flow
```bash
# 1. Login first
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password",
    "captchaSessionId": "test_session",
    "captchaInput": "dev"
  }' \
  -c cookies.txt

# 2. Verify authenticated
curl http://localhost:5000/api/auth/user \
  -b cookies.txt

# 3. Logout (should destroy session)
curl -X POST http://localhost:5000/api/logout \
  -b cookies.txt \
  -c cookies.txt

# Response should include:
# {
#   "message": "Logged out successfully",
#   "sessionDestroyed": true,
#   "timestamp": "2025-01-17T..."
# }

# 4. Try to access protected resource (should fail)
curl http://localhost:5000/api/auth/user \
  -b cookies.txt

# Should return: {"message": "Authentication required"}
```

## Test 2: Session Replay Prevention
```bash
# 1. Login and get session cookie
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password",
    "captchaSessionId": "test_session",
    "captchaInput": "dev"
  }' \
  -c session_cookies.txt

# 2. Access protected resource (should work)
curl http://localhost:5000/api/auth/user \
  -b session_cookies.txt

# 3. Logout (destroy session)
curl -X POST http://localhost:5000/api/logout \
  -b session_cookies.txt

# 4. Try to reuse old session cookie (should fail - replay attack)
curl http://localhost:5000/api/auth/user \
  -b session_cookies.txt

# Should return: {"message": "Session has been terminated"}
```

## Test 3: Session Expiration
```bash
# 1. Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password",
    "captchaSessionId": "test_session",
    "captchaInput": "dev"
  }' \
  -c cookies.txt

# 2. Wait for session to expire (8+ hours) or modify server timeout
# 3. Try to access protected resource
curl http://localhost:5000/api/auth/user \
  -b cookies.txt

# Should return: {"message": "Session expired"}
```

## Test 4: Client-Side Logout
```bash
# Test browser logout flow
# 1. Open browser, login to admin panel
# 2. Check browser cookies (should see cid.session.id)
# 3. Click logout button
# 4. Check cookies again (should be cleared)
# 5. Try to access /admin (should redirect to login)
```

## Test 5: Multiple Session Cleanup
```bash
# Monitor server logs for session cleanup
docker logs cid-app | grep "Session cleanup"

# Should see periodic cleanup messages:
# "Session cleanup: destroyed X expired sessions"
```

## Test 6: Security Event Logging
```bash
# Monitor security events
docker logs cid-app | grep "LOGOUT_SUCCESS"
docker logs cid-app | grep "SESSION_DESTRUCTION_ERROR"
docker logs cid-app | grep "SESSION_REPLAY_ATTEMPT"
docker logs cid-app | grep "STALE_SESSION"

# Should see appropriate logging for each scenario
```

## Test 7: Cookie Clearing Verification
```bash
# 1. Login and check cookies
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password",
    "captchaSessionId": "test_session",
    "captchaInput": "dev"
  }' \
  -c before_logout.txt

# 2. Logout
curl -X POST http://localhost:5000/api/logout \
  -b before_logout.txt \
  -c after_logout.txt

# 3. Compare cookie files
echo "=== BEFORE LOGOUT ==="
cat before_logout.txt
echo "=== AFTER LOGOUT ==="
cat after_logout.txt

# After logout should show cookies being cleared
```

## Test 8: Admin Access with Session Validation
```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password",
    "captchaSessionId": "test_session",
    "captchaInput": "dev"
  }' \
  -c admin_cookies.txt

# 2. Access admin endpoint (should work)
curl http://localhost:5000/api/admin/users \
  -b admin_cookies.txt

# 3. Logout
curl -X POST http://localhost:5000/api/logout \
  -b admin_cookies.txt

# 4. Try admin access with old session (should fail)
curl http://localhost:5000/api/admin/users \
  -b admin_cookies.txt

# Should return: {"message": "Session has been terminated"}
```

## Expected Results

### ✅ Successful Logout
- Session completely destroyed
- Cookies cleared
- Client state reset
- Redirect to home page
- Security events logged

### ✅ Session Replay Prevention
- Old session cookies rejected
- "Session has been terminated" error
- Security event logged
- No unauthorized access

### ✅ Session Expiration
- Expired sessions rejected
- "Session expired" error
- Automatic cleanup
- Security events logged

### ✅ Client-Side Integration
- Proper API calls to logout endpoint
- Complete state cleanup
- Cookie clearing
- Redirect handling

### ✅ Security Monitoring
- All logout attempts logged
- Session destruction events logged
- Replay attempts detected and logged
- Cleanup operations logged
