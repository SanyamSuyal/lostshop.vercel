import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure build directory exists
console.log('Creating build directories if they don\'t exist...');
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public');
}

// Build client
console.log('Building client...');
try {
  execSync('npx vite build', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Client build successful!');
} catch (error) {
  console.error('Client build failed:', error);
  process.exit(1);
}

// Build server
console.log('Building server...');
try {
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Server build successful!');
} catch (error) {
  console.error('Server build failed:', error);
  process.exit(1);
}

console.log('Build completed successfully!');