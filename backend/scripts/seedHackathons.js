import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../hackathons.json');

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;

const organizers = ["MIT Media Lab", "Stanford AI Hub", "Google Developers Group", "AWS Startups", "Microsoft Garage", "ETH Zurich Tech", "IIT Bombay", "NUS Computing"];
const tagsList = ["AI", "Blockchain", "Web3", "HealthTech", "FinTech", "IoT", "Cybersecurity", "AR/VR"];
const difficulties = ["Beginner-Friendly", "Intermediate", "Advanced", "Expert"];
const modes = ["Online", "Offline", "Hybrid"];
const venues = ["San Francisco, CA", "London, UK", "Bengaluru, India", "Singapore", "Berlin, Germany", "Remote", "New York, NY"];
const platforms = ["Devpost", "Unstop", "HackerEarth", "Devfolio"];

const generateHackathons = (count) => {
  const hackathons = [];
  for (let i = 0; i < count; i++) {
    const org = organizers[i % organizers.length];
    const tag = tagsList[i % tagsList.length];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    
    // Generate dates in the future
    const startObj = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000);
    const endObj = new Date(startObj.getTime() + (2 + Math.floor(Math.random() * 3)) * 24 * 60 * 60 * 1000);
    
    const startDate = startObj.toISOString().split('T')[0];
    const endDate = endObj.toISOString().split('T')[0];

    hackathons.push({
      id: generateId('hackathon'),
      name: `Global ${tag} Innovation Challenge 2026 - Series ${i+1}`,
      organizer: org,
      platform: platforms[i % platforms.length],
      deadline: startDate,
      startDate: startDate,
      endDate: endDate,
      mode: mode,
      venue: mode === 'Online' ? 'Remote' : venues[Math.floor(Math.random() * venues.length)],
      prizePool: `$${(Math.random() * 50 + 10).toFixed(0)},000`,
      teamSize: "1-4 members",
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      eligibleBranches: ["All Branches", "CS", "Data Science", "EECS"],
      technologies: ["Python", "React", "Node.js", "TensorFlow"],
      tags: [tag, "Innovation", "Startups"],
      description: `Join the Global ${tag} Innovation Challenge hosted by ${org}. Build next-generation applications leveraging ${tag}. Expect intensive 48-hour coding, mentorship from industry leaders, and a chance to pitch your product to top-tier VC firms.`,
      officialLink: `https://example.com/hackathon/${tag.toLowerCase()}-2026`,
      registrationFee: i % 4 === 0 ? "$20" : "Free"
    });
  }
  return hackathons;
};

const seedHackathons = () => {
  console.log("Reading hackathons.json...");
  let existing = [];
  
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      existing = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not parse existing database, starting fresh.");
    }
  }

  console.log("Generating 100 new mock hackathons...");
  const newHackathons = generateHackathons(100);

  const combined = [...existing, ...newHackathons];

  console.log("Writing to hackathons.json...");
  fs.writeFileSync(dbPath, JSON.stringify(combined, null, 2));
  console.log(`Successfully added 100 hackathons! Total is now ${combined.length}`);
};

seedHackathons();
