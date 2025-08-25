#!/usr/bin/env node

// Production server startup script
import { createServer } from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Starting CID Telangana in production mode...');

// Import the main application
try {
  const { default: mainApp } = await import('../dist/index.js');
  
  if (typeof mainApp === 'function') {
    // If it's a function, call it
    mainApp();
  } else {
    console.log('Application started successfully!');
  }
} catch (error) {
  console.error('Failed to start application:', error);
  
  // Fallback: serve static files if the built server fails
  console.log('Falling back to static file server...');
  
  app.use(express.static(join(__dirname, '..', 'dist')));
  
  app.get('*', (req, res) => {
    const indexPath = join(__dirname, '..', 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Application not found');
    }
  });
  
  const server = createServer(app);
  server.listen(port, '0.0.0.0', () => {
    console.log(`Fallback server running on port ${port}`);
  });
}