#!/usr/bin/env node

/**
 * Production startup script for CID Application
 * Handles graceful startup and shutdown in Docker environment
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CID Application in production mode...');

// Set production environment
process.env.NODE_ENV = 'production';

// Path to the main server file
const serverPath = path.join(__dirname, '..', 'server', 'index.ts');

// Start the application using tsx (TypeScript executor)
const app = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  env: process.env
});

// Handle graceful shutdown
const shutdown = (signal) => {
  console.log(`\n📡 Received ${signal}, shutting down gracefully...`);
  
  app.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('⚠️  Force killing application...');
    app.kill('SIGKILL');
    process.exit(1);
  }, 10000); // 10 second timeout for graceful shutdown
};

// Listen for shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle application exit
app.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Application exited with code ${code}`);
    process.exit(code);
  } else {
    console.log('✅ Application shut down successfully');
    process.exit(0);
  }
});

app.on('error', (err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});

console.log('📊 Application started with PID:', app.pid);