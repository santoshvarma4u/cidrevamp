#!/usr/bin/env node

/**
 * Security Validation Script for CID Telangana Website
 * This script performs basic security checks on the application
 */

import fs from 'fs';
import path from 'path';

console.log('🔒 CID Telangana Security Validation');
console.log('=====================================\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function checkPass(message) {
  console.log(`✅ ${message}`);
  checks.passed++;
}

function checkFail(message) {
  console.log(`❌ ${message}`);
  checks.failed++;
}

function checkWarning(message) {
  console.log(`⚠️  ${message}`);
  checks.warnings++;
}

// Check 1: Environment Configuration
console.log('1. Environment Configuration:');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  if (envExample.includes('SESSION_SECRET')) {
    checkPass('Environment template contains SESSION_SECRET');
  } else {
    checkFail('Missing SESSION_SECRET in environment template');
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
      checkPass('Production SESSION_SECRET is properly configured');
    } else {
      checkFail('Production SESSION_SECRET is missing or too short');
    }
  } else {
    checkWarning('Running in development mode - ensure production config before deployment');
  }
} catch (error) {
  checkFail('Environment configuration files not found');
}

// Check 2: Security Dependencies
console.log('\n2. Security Dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const securityDeps = ['helmet', 'express-rate-limit', 'bcrypt', 'express-validator', 'cors'];
  
  securityDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      checkPass(`${dep} is installed`);
    } else {
      checkFail(`Missing security dependency: ${dep}`);
    }
  });
} catch (error) {
  checkFail('Cannot read package.json');
}

// Check 3: Security Files
console.log('\n3. Security Implementation Files:');
const securityFiles = [
  'server/security.ts',
  'server/auth.ts',
  'SECURITY.md'
];

securityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checkPass(`${file} exists`);
  } else {
    checkFail(`Missing security file: ${file}`);
  }
});

// Check 4: Database Security
console.log('\n4. Database Security:');
try {
  const dbFile = fs.readFileSync('server/db.ts', 'utf8');
  if (dbFile.includes('ssl:')) {
    checkPass('Database SSL configuration present');
  } else {
    checkWarning('Database SSL configuration should be verified');
  }
  
  if (dbFile.includes('max:')) {
    checkPass('Database connection pooling configured');
  } else {
    checkFail('Missing database connection pooling');
  }
} catch (error) {
  checkFail('Cannot read database configuration');
}

// Check 5: File Upload Security
console.log('\n5. File Upload Security:');
try {
  const routesFile = fs.readFileSync('server/routes.ts', 'utf8');
  if (routesFile.includes('fileFilter')) {
    checkPass('File upload filtering is implemented');
  } else {
    checkFail('Missing file upload security filtering');
  }
  
  if (routesFile.includes('limits:')) {
    checkPass('File upload size limits are configured');
  } else {
    checkFail('Missing file upload size limits');
  }
} catch (error) {
  checkFail('Cannot read routes configuration');
}

// Check 6: Authentication Security
console.log('\n6. Authentication Security:');
try {
  const authFile = fs.readFileSync('server/auth.ts', 'utf8');
  if (authFile.includes('bcrypt')) {
    checkPass('Strong password hashing (bcrypt) is implemented');
  } else {
    checkFail('Weak or missing password hashing');
  }
  
  if (authFile.includes('trackLoginAttempt')) {
    checkPass('Login attempt limiting is implemented');
  } else {
    checkFail('Missing login attempt limiting');
  }
  
  if (authFile.includes('validatePassword')) {
    checkPass('Password strength validation is implemented');
  } else {
    checkFail('Missing password strength validation');
  }
} catch (error) {
  checkFail('Cannot read authentication configuration');
}

// Summary
console.log('\n' + '='.repeat(40));
console.log('SECURITY VALIDATION SUMMARY:');
console.log('='.repeat(40));
console.log(`✅ Passed: ${checks.passed}`);
console.log(`❌ Failed: ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);

const totalChecks = checks.passed + checks.failed + checks.warnings;
const passRate = Math.round((checks.passed / totalChecks) * 100);

console.log(`\n📊 Overall Security Score: ${passRate}%`);

if (checks.failed === 0) {
  console.log('🎉 All critical security checks passed!');
  if (checks.warnings > 0) {
    console.log('⚠️  Please address warnings before production deployment.');
  }
} else {
  console.log('🚨 Critical security issues found. Please fix before deployment.');
  process.exit(1);
}

console.log('\n📚 For detailed security information, see SECURITY.md');