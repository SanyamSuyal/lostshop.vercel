// esbuild.config.js
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const fs = require('fs');
const path = require('path');

// Check if server/index.js exists
const serverIndexPath = path.join(__dirname, 'server', 'index.js');
if (!fs.existsSync(serverIndexPath)) {
  console.log('Creating minimal server/index.js...');
  
  // Ensure server directory exists
  if (!fs.existsSync(path.join(__dirname, 'server'))) {
    fs.mkdirSync(path.join(__dirname, 'server'), { recursive: true });
  }
  
  // Create a minimal Express server file
  const serverContent = `
// Minimal server file for static site
const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '../dist/public')));

// The "catchall" handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

module.exports = app;
`;
  
  fs.writeFileSync(serverIndexPath, serverContent);
  console.log('Created server/index.js successfully');
}

// Ensure dist directory exists
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
}

// Build the server
// Use the async build method instead of buildSync because plugins require it
esbuild.build({
  entryPoints: ['server/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/index.js',
  format: 'cjs',
  plugins: [nodeExternalsPlugin()],
  minify: true,
  sourcemap: true,
}).then(() => {
  console.log('Server build completed successfully');
}).catch(error => {
  console.error('Error building server:', error);
  process.exit(1);
}); 