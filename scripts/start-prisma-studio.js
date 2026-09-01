#!/usr/bin/env node

/**
 * Secure Prisma Studio Launcher
 * Adds password protection using HTTP Basic Authentication
 */

const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const PRISMA_PORT = 5555;
const PROXY_PORT = 5556;
const PASSWORD = process.env.PRISMA_STUDIO_PASSWORD || 'admin123';

console.log('🔒 Starting Secure Prisma Studio...\n');

// Start Prisma Studio in background
const prisma = spawn('npx', ['prisma', 'studio', '--port', PRISMA_PORT.toString()], {
  shell: true,
  cwd: path.join(__dirname, '..')
});

let prismaReady = false;

prisma.stdout?.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Studio started')) {
    prismaReady = true;
  }
});

prisma.stderr?.on('data', (data) => {
  console.error('Prisma Studio error:', data.toString());
});

// Wait for Prisma Studio to start
setTimeout(() => {
  // Create authenticated proxy server
  const server = http.createServer((req, res) => {
    // Check for authorization header
    const auth = req.headers.authorization;

    if (!auth) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="Prisma Studio - Enter Password"',
        'Content-Type': 'text/html'
      });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prisma Studio - Authentication Required</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 400px;
              }
              h1 { color: #2D3748; margin-bottom: 10px; }
              p { color: #718096; line-height: 1.6; }
              .icon { font-size: 48px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🔒</div>
              <h1>Authentication Required</h1>
              <p>Please enter your password to access Prisma Studio database management interface.</p>
            </div>
          </body>
        </html>
      `);
      return;
    }

    // Verify password
    const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
    const [username, password] = credentials.split(':');

    if (password !== PASSWORD) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="Prisma Studio - Invalid Password"',
        'Content-Type': 'text/html'
      });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prisma Studio - Access Denied</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 400px;
              }
              h1 { color: #E53E3E; margin-bottom: 10px; }
              p { color: #718096; line-height: 1.6; }
              .icon { font-size: 48px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">❌</div>
              <h1>Access Denied</h1>
              <p>Invalid password. Please try again with the correct credentials.</p>
            </div>
          </body>
        </html>
      `);
      return;
    }

    // Password correct - proxy to Prisma Studio
    const proxy = createProxyMiddleware({
      target: `http://localhost:${PRISMA_PORT}`,
      changeOrigin: true,
      ws: true,
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.writeHead(502, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head><title>Prisma Studio - Connection Error</title></head>
            <body>
              <h1>Connection Error</h1>
              <p>Cannot connect to Prisma Studio. Please wait a moment and refresh.</p>
            </body>
          </html>
        `);
      }
    });

    proxy(req, res);
  });

  server.listen(PROXY_PORT, () => {
    console.log('\n✅ Secure Prisma Studio is running!\n');
    console.log(`📍 URL: http://localhost:${PROXY_PORT}`);
    console.log(`👤 Username: (any username)`);
    console.log(`🔑 Password: ${PASSWORD}\n`);
    console.log('⚠️  IMPORTANT:');
    console.log('   - Change PRISMA_STUDIO_PASSWORD in your .env file');
    console.log('   - Only use this in development, NEVER in production');
    console.log('   - Keep Prisma Studio on localhost only\n');
    console.log('Press Ctrl+C to stop\n');
  });

  // Cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down Secure Prisma Studio...');
    prisma.kill();
    server.close();
    process.exit(0);
  });
}, 3000);
