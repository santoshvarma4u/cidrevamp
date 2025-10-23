# Session Debugging - Enhanced Server Logging

## 🚨 Issue Identified

**Problem:** Login succeeds but session isn't established properly, causing `/api/auth/user` to return 401.

**Console Logs Show:**
```
Login successful, user data: {user data}
Fetching user data from /api/auth/user
GET http://localhost:5001/api/auth/user 401 (Unauthorized)
Auth response status: 401
User not authenticated (401)
```

---

## 🔍 Root Cause Analysis

### **The Session Issue:**
1. ✅ **Login API succeeds** - Server returns user data
2. ✅ **Client triggers auth refresh** - `refreshAuth()` is called
3. ❌ **Session not established** - `/api/auth/user` returns 401
4. ❌ **Redirect loop** - AdminDashboard redirects back to login

### **Possible Causes:**
- **Session not created** - `req.login()` might be failing silently
- **Cookie not set** - Session cookie might not be sent to client
- **Session store issue** - Memory store might not be working
- **Cookie security** - Security settings might be blocking cookies

---

## ✅ DEBUGGING ADDED

### **Enhanced Login Endpoint Debugging** (`server/auth.ts`)

**Added to both `/api/login` and `/api/auth/login`:**
```typescript
console.log("Session established successfully:", {
  sessionId: req.sessionID,
  userId: user.id,
  username: user.username,
  isAuthenticated: req.isAuthenticated()
});
```

**What this will show:**
- ✅ Session ID generated
- ✅ User ID stored in session
- ✅ Authentication status after login
- ✅ Any session establishment issues

### **Enhanced Auth User Endpoint Debugging** (`server/auth.ts`)

**Added to `/api/auth/user`:**
```typescript
console.log("Auth user endpoint called:", {
  sessionId: req.sessionID,
  isAuthenticated: req.isAuthenticated(),
  hasSession: !!req.session,
  userAgent: req.get('User-Agent')
});

if (!req.isAuthenticated()) {
  console.log("User not authenticated, returning 401");
  return res.status(401).json({ message: "Unauthorized" });
}

console.log("User authenticated successfully:", {
  userId: user.id,
  username: user.username,
  role: user.role
});
```

**What this will show:**
- ✅ Session ID received from client
- ✅ Authentication status check
- ✅ Session existence
- ✅ User data retrieval

---

## 🧪 Testing Instructions

### **Step 1: Restart Server**
```bash
# Make sure server is running with debugging
DATABASE_URL="postgresql://ciduser:cidpassword@localhost:5432/ciddb" npm run dev
```

### **Step 2: Test Login Flow**
```bash
# 1. Go to http://localhost:5001/admin/login
# 2. Enter credentials and CAPTCHA
# 3. Click login
# 4. Watch BOTH browser console AND server console
```

### **Step 3: Check Server Console Logs**

**Expected Login Logs:**
```
CAPTCHA verification successful, proceeding with authentication
Login successful for user: admin
Session established successfully: {
  sessionId: 'sess_abc123...',
  userId: '3ed49eec-6033-4303-aa12-52054303f02a',
  username: 'admin',
  isAuthenticated: true
}
```

**Expected Auth User Logs:**
```
Auth user endpoint called: {
  sessionId: 'sess_abc123...',
  isAuthenticated: true,
  hasSession: true,
  userAgent: 'Mozilla/5.0...'
}
User authenticated successfully: {
  userId: '3ed49eec-6033-4303-aa12-52054303f02a',
  username: 'admin',
  role: 'admin'
}
```

---

## 🔍 What to Look For

### **If Session Establishment Fails:**
```
Session established successfully: {
  sessionId: undefined,  // ❌ No session ID
  userId: '...',
  username: 'admin',
  isAuthenticated: false  // ❌ Not authenticated
}
```

### **If Session Not Sent to Client:**
```
Auth user endpoint called: {
  sessionId: undefined,  // ❌ No session ID from client
  isAuthenticated: false,
  hasSession: false,     // ❌ No session
  userAgent: 'Mozilla/5.0...'
}
User not authenticated, returning 401
```

### **If Cookie Issues:**
- Check browser DevTools → Application → Cookies
- Look for `cid.session.id` cookie
- Check cookie attributes (secure, httpOnly, sameSite)

---

## 🔧 Potential Fixes Based on Results

### **Fix 1: Session Not Established**
- Check if `req.login()` callback has errors
- Verify session store is working
- Check session configuration

### **Fix 2: Cookie Not Set**
- Check cookie security settings
- Verify domain/path configuration
- Check if HTTPS is required

### **Fix 3: Session Store Issues**
- Switch from memory store to database store
- Check session cleanup interfering
- Verify session persistence

---

## 📊 Expected Results

**After debugging:**
- ✅ **Server logs** show session establishment details
- ✅ **Server logs** show auth user endpoint details
- ✅ **Root cause** identified from logs
- ✅ **Targeted fix** applied based on findings

---

## 🎯 Next Steps

1. **Restart server** with debugging enabled
2. **Test login flow** and watch server console
3. **Share server logs** to identify the exact issue
4. **Apply targeted fix** based on debugging results

---

**Status:** 🔍 SESSION DEBUGGING ENABLED  
**Action Required:** Test login and share server console logs  
**Expected Result:** Server logs will reveal the exact session issue! 🕵️

The enhanced debugging will help us identify exactly where the session establishment is failing.
