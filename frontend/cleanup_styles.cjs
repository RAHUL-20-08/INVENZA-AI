const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // Replace dark backgrounds: background: 'rgba(0,0,0,0.X)' or similar
  content = content.replace(/background:\s*['"]rgba\(0,\s*0,\s*0,\s*0\.\d+\)['"]/g, "background: 'var(--bg-panel)'");
  
  // Replace heavy shadows: boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
  content = content.replace(/boxShadow:\s*['"][^'"]*rgba\(0,\s*0,\s*0,\s*0\.[3-9]\d*['"]/g, "boxShadow: 'var(--panel-shadow)'");
  
  // Replace dark borders: rgba(255,255,255,0.05) -> var(--border-color)
  content = content.replace(/border:\s*['"]1px solid rgba\(255,\s*255,\s*255,\s*0\.\d+\)['"]/g, "border: '1px solid var(--border-color)'");

  // Fix custom colors in dashboard that use neon alpha: rgba(52,211,153,0.02)
  // Actually, light alpha on white background is fine, but we can standardize.
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log("Updated " + filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  });
}

walkDir('src');
console.log('Background and shadow cleanup complete');
