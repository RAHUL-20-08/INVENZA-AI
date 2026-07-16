import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const controllerPath = path.join(__dirname, '../controllers/chatController.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// Add import
if (!content.includes("import { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';")) {
  content = content.replace("import { fileURLToPath } from 'url';", "import { fileURLToPath } from 'url';\nimport { fetchCerebrasSearch } from '../utils/cerebrasSearch.js';");
}

const chatWikiRegex = /\/\/ 2\. Perform Real-Time Wikipedia Search[\s\S]*?catch \([^\)]+\) \{[\s\S]*?\n  \}/;

const newChatLogic = `// 2. Perform Real-Time Cerebras Search for general questions (ChatGPT/Perplexity Simulator)
  try {
    const cerebrasData = await fetchCerebrasSearch(userQuery);
    if (cerebrasData) {
      const responseText = \`**INVENZA AI Research Agent Insight**\\n\\nBased on global intelligence data regarding **\${cerebrasData.title}**:\\n\\n* **Description**: \${cerebrasData.description}\\n* **Key Details**: Classification: \${cerebrasData.classifications}, Year: \${cerebrasData.year || 'N/A'}\\n* **Technical Claims / Focus Areas**: \\n  - \${(cerebrasData.claims || []).join('\\n  - ')}\\n\\nWould you like me to build a business canvas or generate a specific roadmap based on this entity?\`;
      
      return res.json({
        success: true,
        message: {
          role: "assistant",
          content: responseText
        }
      });
    }
  } catch (e) {
    console.error("Cerebras Live Search Error:", e);
  }`;

content = content.replace(chatWikiRegex, newChatLogic);

fs.writeFileSync(controllerPath, content);
console.log('chatController.js rewritten to use Cerebras API successfully.');
