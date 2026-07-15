import fs from 'fs';
import path from 'path';

const allTags = new Set();

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const tagRegex = /<([A-Z][a-zA-Z0-9]+)[\s>]/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    allTags.add(match[1]);
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
console.log(Array.from(allTags).join(', '));
