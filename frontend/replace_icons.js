import fs from 'fs';
import path from 'path';

// Helper to convert CamelCase to snake_case
function toSnakeCase(str) {
  // Replace numbers like CheckCircle2 -> CheckCircle
  str = str.replace(/[0-9]+$/, '');
  return str.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase()).replace(/^_/, '');
}

// Specific icon mappings from Lucide to Material Symbols
const iconMap = {
  'MessageSquare': 'chat',
  'FolderGit2': 'folder',
  'BrainCircuit': 'memory',
  'Presentation': 'co_present',
  'Sparkles': 'auto_awesome',
  'Rocket': 'rocket_launch',
  'Compass': 'explore',
  'TrendingUp': 'trending_up',
  'AlertTriangle': 'warning',
  'BarChart3': 'bar_chart',
  'FileSpreadsheet': 'table_chart',
  'CheckCircle2': 'check_circle',
  'Circle': 'radio_button_unchecked',
  'HelpCircle': 'help',
  'Save': 'save',
  'Play': 'play_arrow',
  'Trash2': 'delete',
  'RefreshCw': 'refresh',
  'ArrowRight': 'arrow_forward',
  'ArrowLeft': 'arrow_back',
  'Cpu': 'developer_board',
  'ShieldCheck': 'verified_user',
  'FileCheck': 'task',
  'Gavel': 'gavel',
  'Calendar': 'calendar_today',
  'AlertCircle': 'error',
  'Users': 'group',
  'Volume2': 'volume_up',
  'Smile': 'sentiment_satisfied',
  'ShieldAlert': 'security',
  'Award': 'workspace_premium',
  'DollarSign': 'attach_money',
  'Activity': 'monitoring',
  'Clock': 'schedule',
  'Menu': 'menu',
  'X': 'close',
  'Send': 'send',
  'Bot': 'smart_toy',
  'User': 'person',
  'Search': 'search',
  'UploadCloud': 'cloud_upload',
  'Download': 'download',
  'FileText': 'description',
  'Code': 'code',
  'Mic': 'mic',
  'ThumbsUp': 'thumb_up',
  'Bookmark': 'bookmark',
  'Plus': 'add'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // Find the import statement
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g;
  let match = importRegex.exec(content);
  
  if (!match) return;
  
  // Extract icons
  const icons = match[1].split(',').map(i => i.trim()).filter(Boolean);
  
  // Remove the import
  content = content.replace(importRegex, '');
  
  // Replace each icon in the JSX
  icons.forEach(icon => {
    // Sometimes they rename in import like { Icon as MyIcon }
    let iconName = icon;
    if (icon.includes(' as ')) {
      iconName = icon.split(' as ')[1].trim();
      icon = icon.split(' as ')[0].trim();
    }
    
    const matName = iconMap[icon] || toSnakeCase(icon);
    
    // Replace <IconName /> or <IconName prop="val" ... />
    // We need to match <IconName ... > and </IconName> or <IconName ... />
    const tagRegex = new RegExp("<" + iconName + "(\\\\s+[^>]*?)?(?:/>|>.*?</" + iconName + ">)", 'g');
    
    content = content.replace(tagRegex, (fullMatch, propsString) => {
      let size = '24px';
      let className = 'material-symbols-outlined';
      let style = '';
      let color = '';
      
      if (propsString) {
        // Extract size
        let sizeMatch = propsString.match(/size=\{?['"]?([0-9]+)['"]?\}?/);
        if (sizeMatch) size = sizeMatch[1] + 'px';
        
        // Extract className
        let classMatch = propsString.match(/className=(['"]\{?[^'"]+\}?['"]|\{`[^`]+`\})?/);
        if (classMatch) {
            className += ' ' + classMatch[1].replace(/['"{}]/g, '');
        }

        // Extract color
        let colorMatch = propsString.match(/color=\{?['"]([^'"]+)['"]\}?/);
        if (colorMatch) {
            color = colorMatch[1];
        }
        
        // Extract style
        let styleMatch = propsString.match(/style=\{\{([^}]+)\}\}/);
        if (styleMatch) {
            style = styleMatch[1];
        }
      }
      
      let finalStyle = "{ fontSize: '" + size + "'";
      if (color) finalStyle += ", color: '" + color + "'";
      if (style) finalStyle += ", " + style;
      finalStyle += " }";
      
      return "<span className=\"" + className + "\" style={" + finalStyle + "}>" + matName + "</span>";
    });
  });
  
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
console.log('Icon replacement complete');
