#!/bin/bash

# Vercel Deployment Helper Script (ULTRA SIMPLIFIED VERSION)
# This script creates a minimal working deployment for Vercel

echo "🔵 Creating minimal Vercel deployment files..."

# Create necessary directories
mkdir -p dist/public api

# Create the API handler file with minimal code
echo "📝 Creating simplified API handler..."
cat > api/index.js << 'EOFAPI'
/**
 * Minimal Vercel Serverless Function 
 */
export default function handler(req, res) {
  // Simple health check
  if (req.url === '/health') {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      message: 'Vercel function is working'
    });
  }
  
  // API test endpoint
  if (req.url === '/api/test' || req.url === '/api') {
    return res.json({
      message: 'API is working correctly!',
      timestamp: new Date().toISOString()
    });
  }
  
  // Fallback response
  return res.status(200).json({ status: 'OK', url: req.url });
}
EOFAPI
echo "✅ API handler created"

# Create a simplified vercel.json
echo "📝 Creating simplified vercel.json..."
cat > vercel.json << 'EOFJSON'
{
  "version": 2,
  "builds": [
    { "src": "api/index.js", "use": "@vercel/node" },
    { "src": "client/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.js" },
    { "src": "/health", "dest": "api/index.js" },
    { "src": "/(.*)", "dest": "/client/$1" }
  ]
}
EOFJSON
echo "✅ vercel.json created"

# Create a simple test file
mkdir -p client
echo "📝 Creating test client file..."
cat > client/index.html << 'EOFHTML'
<!DOCTYPE html>
<html>
<head>
  <title>Vercel Test</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; line-height: 1.5; }
    h1 { color: #0070f3; }
    button { padding: 0.5rem 1rem; background: #0070f3; color: white; border: none; border-radius: 4px; }
    pre { background: #f0f0f0; padding: 1rem; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Vercel Deployment Test</h1>
  <p>If you can see this page, the static assets are working correctly!</p>
  
  <h2>Test API Connection</h2>
  <button onclick="testAPI()">Test API</button>
  <pre id="result">Click the button to test...</pre>

  <script>
    async function testAPI() {
      const result = document.getElementById('result');
      result.textContent = 'Testing API connection...';
      
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        result.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        result.textContent = 'Error: ' + error.message;
      }
    }
  </script>
</body>
</html>
EOFHTML
echo "✅ Test client file created"

echo ""
echo "✅ DEPLOYMENT FILES CREATED SUCCESSFULLY"
echo ""
echo "To deploy to Vercel:"
echo "1. Commit these changes to your repository"
echo "2. Run: vercel"
echo ""
echo "Once deployed, test the following URLs:"
echo "- Main page: https://your-app.vercel.app"
echo "- API test: https://your-app.vercel.app/api/test"
echo "- Health check: https://your-app.vercel.app/health"
echo ""
echo "After confirming these work, you can integrate your full application."
