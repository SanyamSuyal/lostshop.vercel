// build-sequence.js
// This script manages the build process in the correct sequence,
// ensuring each step completes before the next begins

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Utility function to execute a command and return a promise
function executeCommand(command, options = {}) {
  console.log(`Executing: ${command}`);
  
  return new Promise((resolve, reject) => {
    try {
      const output = execSync(command, {
        stdio: 'inherit',
        ...options
      });
      resolve(output);
    } catch (error) {
      console.error(`Command failed: ${command}`);
      reject(error);
    }
  });
}

// Ensure server and dist directories exist
if (!fs.existsSync('server')) {
  fs.mkdirSync('server', { recursive: true });
}

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Ensure server/index.js exists with basic content
if (!fs.existsSync('server/index.js')) {
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
  
  fs.writeFileSync('server/index.js', serverContent);
  console.log('Created server/index.js successfully');
}

// Run the build process step by step
async function runBuildSequence() {
  try {
    // Step 1: Build the server with esbuild
    await executeCommand('node esbuild.config.js');
    
    // Step 2: Fix Windows paths
    await executeCommand('node fix-paths.js');
    
    // Step 3: Change to client directory and install dependencies
    await executeCommand('cd client && npm install');
    
    // Step 4: Build the client
    await executeCommand('cd client && npm run build');
    
    // Step 5: Create dist/public directory and copy client build
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public', { recursive: true });
    }
    
    // Copy client build to dist/public
    if (fs.existsSync('client/dist')) {
      // Determine the correct copy command based on the OS
      if (process.platform === 'win32') {
        await executeCommand('xcopy /E /I /Y client\\dist\\* dist\\public\\');
      } else {
        await executeCommand('cp -r client/dist/* dist/public/');
      }
    }
    
    console.log('Build sequence completed successfully!');
  } catch (error) {
    console.error('Build sequence failed:', error);
    process.exit(1);
  }
}

runBuildSequence(); 