// fix-paths.js
// This script ensures paths will work correctly on both Windows development environments
// and Linux-based Vercel deployment environments

const fs = require('fs');
const path = require('path');

// Convert Windows paths to POSIX paths for Vercel compatibility
function fixWindowsPaths() {
  const targetFile = path.join(__dirname, 'dist', 'index.js');
  let attempts = 0;
  const maxAttempts = 10;
  
  // Try multiple times with a delay to ensure esbuild has completed
  function attemptFix() {
    attempts++;
    console.log(`Attempt ${attempts} to fix paths in ${targetFile}`);
    
    if (fs.existsSync(targetFile)) {
      console.log(`Fixing paths in ${targetFile}...`);
      
      let content = fs.readFileSync(targetFile, 'utf8');
      
      // Replace Windows backslashes with forward slashes
      content = content.replace(/\\\\/g, '/').replace(/\\/g, '/');
      
      // Fix any other Windows-specific path issues
      // content = content.replace(/C:\\Users\\[^/]+\//gi, '/');
      
      fs.writeFileSync(targetFile, content);
      console.log(`Fixed paths in ${targetFile}`);
      return true;
    } else {
      console.log(`File ${targetFile} does not exist yet, waiting...`);
      
      if (attempts < maxAttempts) {
        setTimeout(attemptFix, 500); // Try again in 500ms
        return false;
      } else {
        console.log(`Giving up after ${maxAttempts} attempts`);
        return false;
      }
    }
  }
  
  attemptFix();
}

fixWindowsPaths(); 