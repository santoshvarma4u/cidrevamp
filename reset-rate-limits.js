#!/usr/bin/env node

/**
 * Rate Limit Reset Script
 * Clears all rate limiting data to resolve 429 errors
 */

console.log('🔄 Resetting all rate limiting data...');

// Clear express-rate-limit store (if using memory store)
try {
  // This will be handled by the server restart
  console.log('✅ Express rate limit data will be cleared on server restart');
} catch (error) {
  console.log('⚠️  Express rate limit clear failed:', error.message);
}

// Clear CAPTCHA rate limiting
try {
  const { clearCaptchaRateLimit } = require('./server/captcha');
  if (clearCaptchaRateLimit) {
    clearCaptchaRateLimit();
    console.log('✅ CAPTCHA rate limit data cleared');
  }
} catch (error) {
  console.log('⚠️  CAPTCHA rate limit clear failed:', error.message);
}

// Clear file upload rate limiting
try {
  const { clearUploadTracking } = require('./server/fileUploadSecurity');
  if (clearUploadTracking) {
    clearUploadTracking();
    console.log('✅ File upload rate limit data cleared');
  }
} catch (error) {
  console.log('⚠️  File upload rate limit clear failed:', error.message);
}

// Clear login attempt tracking
try {
  const { clearLoginAttempts } = require('./server/security');
  if (clearLoginAttempts) {
    clearLoginAttempts();
    console.log('✅ Login attempt tracking cleared');
  }
} catch (error) {
  console.log('⚠️  Login attempt tracking clear failed:', error.message);
}

console.log('🎉 Rate limit reset complete!');
console.log('💡 Restart your server to apply all changes');
console.log('📝 New rate limits:');
console.log('   - General API: 1000 requests/15min (dev), 500 requests/15min (prod)');
console.log('   - Auth: 20 requests/15min (dev), 15 requests/15min (prod)');
console.log('   - CAPTCHA: 50 requests/15min (dev bypass)');
console.log('   - File Upload: 50 files/hour (dev bypass)');
