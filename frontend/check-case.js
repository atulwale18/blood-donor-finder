const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findCaseMismatch(importPath, currentDir) {
  let resolvedPath = path.resolve(currentDir, importPath);
  
  // Try with .js or .jsx if no extension provided
  if (!fs.existsSync(resolvedPath)) {
    if (fs.existsSync(resolvedPath + '.js')) resolvedPath += '.js';
    else if (fs.existsSync(resolvedPath + '.jsx')) resolvedPath += '.jsx';
    else if (fs.existsSync(resolvedPath + '/index.js')) resolvedPath += '/index.js';
    else if (fs.existsSync(resolvedPath + '/index.jsx')) resolvedPath += '/index.jsx';
  }

  if (!fs.existsSync(resolvedPath)) return null; // Can't resolve physically (e.g. node_modules)

  // Now verify case sensitivity directory by directory backwards
  let currentCheckPath = resolvedPath;
  while (currentCheckPath !== srcDir && currentCheckPath !== path.dirname(srcDir)) {
    const parent = path.dirname(currentCheckPath);
    const basename = path.basename(currentCheckPath);
    
    // Validate with readdir
    try {
      const files = fs.readdirSync(parent);
      if (!files.includes(basename)) {
        return `Case mismatch found: ${basename} doesn't match actual file structure on disk. Did you mean one of: ${files.join(', ')}?`;
      }
    } catch(e) {}
    currentCheckPath = parent;
  }
  return null;
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"]([\.\/]+.*?)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const err = findCaseMismatch(importPath, dir);
        if (err) {
          console.log(`\nERROR IN ${fullPath}\nImporting: "${importPath}"\n${err}`);
        }
      }
    }
  });
}

scanDir(srcDir);
console.log('Case-sensitivity check completed.');
