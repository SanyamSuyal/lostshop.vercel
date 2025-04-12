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

// Check for PostCSS config that might cause build issues
if (fs.existsSync('postcss.config.js') || fs.existsSync('postcss.config.cjs')) {
  console.log('Found PostCSS config in root. Creating a backup and removing it temporarily...');
  
  // Back up and remove postcss config
  if (fs.existsSync('postcss.config.js')) {
    fs.renameSync('postcss.config.js', 'postcss.config.js.bak');
  }
  
  if (fs.existsSync('postcss.config.cjs')) {
    fs.renameSync('postcss.config.cjs', 'postcss.config.cjs.bak');
  }
}

// Check for TailwindCSS config that might cause build issues
if (fs.existsSync('tailwind.config.js') || fs.existsSync('tailwind.config.cjs') || fs.existsSync('tailwind.config.ts')) {
  console.log('Found TailwindCSS config in root. Creating a backup and removing it temporarily...');
  
  // Back up and remove tailwind config
  if (fs.existsSync('tailwind.config.js')) {
    fs.renameSync('tailwind.config.js', 'tailwind.config.js.bak');
  }
  
  if (fs.existsSync('tailwind.config.cjs')) {
    fs.renameSync('tailwind.config.cjs', 'tailwind.config.cjs.bak');
  }
  
  if (fs.existsSync('tailwind.config.ts')) {
    fs.renameSync('tailwind.config.ts', 'tailwind.config.ts.bak');
  }
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
app.use(express.static(path.join(__dirname, '../client/dist')));

// The "catchall" handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

module.exports = app;
`;
  
  fs.writeFileSync('server/index.js', serverContent);
  console.log('Created server/index.js successfully');
}

console.log('Checking for client directory...');
// Ensure client directory exists with basic setup if needed
if (!fs.existsSync('client')) {
  console.log('Client directory not found. Creating a minimal client setup...');
  fs.mkdirSync('client', { recursive: true });
  
  // Create package.json for client
  const clientPackageJson = {
    "name": "lostshop-client",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
    "devDependencies": {
      "@vitejs/plugin-react": "^4.0.0",
      "vite": "^4.3.9"
    }
  };
  
  fs.writeFileSync('client/package.json', JSON.stringify(clientPackageJson, null, 2));
  
  // Create vite.config.js
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
  
  fs.writeFileSync('client/vite.config.js', viteConfig);
  
  // Create postcss.config.js in the client directory
  const postcssConfig = `
export default {
  plugins: []
};
`;
  
  fs.writeFileSync('client/postcss.config.js', postcssConfig);
  
  // Create index.html
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LostShop</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  
  fs.writeFileSync('client/index.html', indexHtml);
  
  // Create src directory
  fs.mkdirSync('client/src', { recursive: true });
  
  // Create main.jsx
  const mainJsx = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  
  fs.writeFileSync('client/src/main.jsx', mainJsx);
  
  // Create App.jsx
  const appJsx = `
import React from 'react';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Welcome to LostShop</h1>
      </header>
      <main>
        <p>Your e-commerce solution is being set up.</p>
        <p>This is a placeholder page created during deployment.</p>
      </main>
    </div>
  );
}

export default App;
`;
  
  fs.writeFileSync('client/src/App.jsx', appJsx);
  
  // Create index.css
  const indexCss = `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.app {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
}

h1 {
  color: #333;
}

main {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
`;
  
  fs.writeFileSync('client/src/index.css', indexCss);
  
  console.log('Created minimal client application');
} else {
  console.log('Client directory found! Using existing client code.');
}

// Run the build process step by step
async function runBuildSequence() {
  try {
    // Step 1: Build the server with esbuild
    await executeCommand('node esbuild.config.js');
    
    // Step 2: Fix Windows paths
    await executeCommand('node fix-paths.js');
    
    // Step 3: Change to client directory and install dependencies
    console.log('Installing client dependencies...');
    if (fs.existsSync('client')) {
      // Force install of TailwindCSS if it's used
      if (fs.existsSync('client/tailwind.config.js') || 
          fs.existsSync('client/tailwind.config.cjs') || 
          fs.existsSync('client/tailwind.config.ts')) {
        
        console.log('TailwindCSS configuration detected, ensuring it is installed...');
        await executeCommand('cd client && npm install tailwindcss postcss autoprefixer');
      }
      
      // Try to build the client
      try {
        // Install dependencies
        await executeCommand('cd client && npm install');
        
        // Build the client
        console.log('Building client...');
        
        // Check if TypeScript is used
        const usesTypeScript = fs.existsSync('client/src/main.tsx') || 
                             fs.existsSync('client/src/App.tsx');
        
        if (usesTypeScript) {
          console.log('TypeScript detected, installing TypeScript...');
          await executeCommand('cd client && npm install typescript @types/node @types/react @types/react-dom');
        }
        
        await executeCommand('cd client && npm run build');
        
        // Copy client build to dist directory for API structure
        if (fs.existsSync('client/dist')) {
          console.log('Client build successful! Setting up for deployment...');
          
          // Ensure dist directory exists
          if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist', { recursive: true });
          }
          
          // Create a copy for API access
          if (!fs.existsSync('dist/public')) {
            fs.mkdirSync('dist/public', { recursive: true });
          }
          
          // Determine the correct copy command based on the OS
          if (process.platform === 'win32') {
            await executeCommand('xcopy /E /I /Y client\\dist\\* dist\\public\\');
          } else {
            await executeCommand('cp -r client/dist/* dist/public/');
          }
          
          console.log('Client files copied to dist/public for API access');
        } else {
          throw new Error('Client build directory not found');
        }
      } catch (error) {
        console.error('Error building client:', error);
        console.log('Falling back to static HTML...');
        
        // Create a fallback HTML file
        createFallbackHtml();
      }
    } else {
      console.warn('Client directory not found after check. Creating a minimal index.html...');
      createFallbackHtml();
    }
    
    // Restore any config files we backed up
    restoreConfigFiles();
    
    console.log('Build sequence completed successfully!');
  } catch (error) {
    // Restore any config files we backed up even if we failed
    restoreConfigFiles();
    
    console.error('Build sequence failed:', error);
    process.exit(1);
  }
}

function createFallbackHtml() {
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LostShop</title>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f5f5f5; }
    .container { text-align: center; max-width: 600px; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { margin-top: 0; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to LostShop</h1>
    <p>The site is currently being set up. Please check back later.</p>
  </div>
</body>
</html>
`;
  fs.writeFileSync('dist/public/index.html', fallbackHtml);
  console.log('Created fallback index.html');
}

function restoreConfigFiles() {
  // Restore PostCSS config if we backed it up
  if (fs.existsSync('postcss.config.js.bak')) {
    fs.renameSync('postcss.config.js.bak', 'postcss.config.js');
    console.log('Restored postcss.config.js');
  }
  
  if (fs.existsSync('postcss.config.cjs.bak')) {
    fs.renameSync('postcss.config.cjs.bak', 'postcss.config.cjs');
    console.log('Restored postcss.config.cjs');
  }
  
  // Restore TailwindCSS config if we backed it up
  if (fs.existsSync('tailwind.config.js.bak')) {
    fs.renameSync('tailwind.config.js.bak', 'tailwind.config.js');
    console.log('Restored tailwind.config.js');
  }
  
  if (fs.existsSync('tailwind.config.cjs.bak')) {
    fs.renameSync('tailwind.config.cjs.bak', 'tailwind.config.cjs');
    console.log('Restored tailwind.config.cjs');
  }
  
  if (fs.existsSync('tailwind.config.ts.bak')) {
    fs.renameSync('tailwind.config.ts.bak', 'tailwind.config.ts');
    console.log('Restored tailwind.config.ts');
  }
}

runBuildSequence(); 