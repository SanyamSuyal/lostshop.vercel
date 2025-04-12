// fix-paths.js
// This script ensures paths will work correctly on both Windows development environments
// and Linux-based Vercel deployment environments

const fs = require('fs');
const path = require('path');

// Convert Windows paths to POSIX paths for Vercel compatibility
function fixWindowsPaths() {
  // List of files that might contain Windows paths
  const files = [
    path.join(__dirname, 'dist', 'index.js')
  ];

  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Replace Windows backslashes with forward slashes
      content = content.replace(/\\\\/g, '/').replace(/\\/g, '/');
      
      // Fix any other Windows-specific path issues
      // content = content.replace(/C:\\Users\\[^/]+\//gi, '/');
      
      fs.writeFileSync(file, content);
      console.log(`Fixed paths in ${file}`);
    }
  });
}

fixWindowsPaths(); 