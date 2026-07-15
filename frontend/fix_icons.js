import fs from 'fs';
import path from 'path';

// Helper to convert CamelCase to snake_case
function toSnakeCase(str) {
  str = str.replace(/[0-9]+$/, '');
  return str.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase()).replace(/^_/, '');
}

const customIconMap = {
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
  'CheckCircle': 'check_circle',
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
  'Plus': 'add',
  'Shield': 'shield',
  'Key': 'key',
  'Globe': 'language',
  'Terminal': 'terminal',
  'Moon': 'dark_mode',
  'Sun': 'light_mode',
  'Settings': 'settings',
  'Icon': 'star',
  'LogOut': 'logout',
  'BookOpen': 'menu_book',
  'Lightbulb': 'lightbulb',
  'ChevronRight': 'chevron_right',
  'Star': 'star',
  'GitFork': 'fork_right',
  'ExternalLink': 'open_in_new',
  'Folder': 'folder',
  'File': 'insert_drive_file',
  'Trophy': 'emoji_events',
  'MapPin': 'location_on',
  'Zap': 'bolt',
  'Edit2': 'edit',
  'Edit': 'edit',
  'Layers': 'layers',
  'ChevronLeft': 'chevron_left',
  'GraduationCap': 'school',
  'Briefcase': 'work',
  'Mail': 'mail',
  'Lock': 'lock',
  'Building': 'business',
  'Quote': 'format_quote',
  'FileCode': 'data_object',
  'Timer': 'timer',
  'XCircle': 'cancel',
  'Eye': 'visibility',
  'EyeOff': 'visibility_off',
  'VolumeX': 'volume_off',
  'SkipBack': 'skip_previous',
  'Pause': 'pause',
  'SkipForward': 'skip_next',
  'Minimize2': 'close_fullscreen',
  'Maximize2': 'open_in_full',
  'Heart': 'favorite',
  'Library': 'local_library',
  'Type': 'text_fields'
};

const lucideIcons = Object.keys(customIconMap);

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  lucideIcons.forEach(iconName => {
    const matName = customIconMap[iconName] || toSnakeCase(iconName);
    
    const tagRegex = new RegExp("<" + iconName + "(\\s+[^>]*?)?(?:/>|>.*?</" + iconName + ">)", 'g');
    
    content = content.replace(tagRegex, (fullMatch, propsString) => {
      let size = '24px';
      let className = 'material-symbols-outlined';
      let style = '';
      let color = '';
      
      if (propsString) {
        let sizeMatch = propsString.match(/size=\{?['"]?([0-9]+)['"]?\}?/);
        if (sizeMatch) size = sizeMatch[1] + 'px';
        
        let classMatch = propsString.match(/className=(['"]\{?[^'"]+\}?['"]|\{`[^`]+`\})?/);
        if (classMatch) {
            className += ' ' + classMatch[1].replace(/['"{}]/g, '');
        }

        let colorMatch = propsString.match(/color=\{?['"]([^'"]+)['"]\}?/);
        if (colorMatch) {
            color = colorMatch[1];
        }
        
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
    console.log("Updated icons in " + filePath);
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
console.log('Final icon replacement complete');
