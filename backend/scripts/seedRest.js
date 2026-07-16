import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log('Connecting to TiDB...');
  
  try {
    const dbPath = path.join(__dirname, '../database/database.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      for (const i of data.innovations) {
        await db.query(`
          INSERT IGNORE INTO innovations (
            id, name, inventor, patentId, yearFiled, status, sector,
            commercialPotential, marketGrowth, revivalViability, readinessLevel,
            recommendationScore, failureBottlenecks, aiEnhancementVector, marketTrend,
            swot, roadmap, financials, analysis
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          i.id, i.name, i.inventor, i.patentId, i.yearFiled, i.status, i.sector,
          i.commercialPotential, i.marketGrowth, i.revivalViability, i.readinessLevel,
          i.recommendationScore, JSON.stringify(i.failureBottlenecks || []), JSON.stringify(i.aiEnhancementVector || []),
          JSON.stringify(i.marketTrend || []), JSON.stringify(i.swot || {}), JSON.stringify(i.roadmap || []),
          JSON.stringify(i.financials || {}), JSON.stringify(i.analysis || null)
        ]);
      }
      console.log(`Inserted ${data.innovations.length} innovations.`);
    }

    const startupsPath = path.join(__dirname, '../database/saved_startups.json');
    if (fs.existsSync(startupsPath)) {
      await db.query(`
        CREATE TABLE IF NOT EXISTS saved_startups (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          savedAt VARCHAR(255),
          data JSON
        )
      `);
      const startups = JSON.parse(fs.readFileSync(startupsPath, 'utf8'));
      for (const s of startups) {
        await db.query(`
          INSERT IGNORE INTO saved_startups (id, title, description, savedAt, data)
          VALUES (?, ?, ?, ?, ?)
        `, [s.id, s.title, s.description, s.savedAt, JSON.stringify(s)]);
      }
      console.log(`Inserted ${startups.length} saved startups.`);
    }

    const hackathonsPath = path.join(__dirname, '../hackathons.json');
    if (fs.existsSync(hackathonsPath)) {
       await db.query(`
        CREATE TABLE IF NOT EXISTS hackathons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255),
          image VARCHAR(255),
          location VARCHAR(255),
          participants INT,
          timeLeft VARCHAR(50),
          prize VARCHAR(50),
          date VARCHAR(100),
          description TEXT,
          status VARCHAR(50)
        )
      `);
      const hacks = JSON.parse(fs.readFileSync(hackathonsPath, 'utf8'));
      for (const h of hacks) {
        await db.query(`
          INSERT IGNORE INTO hackathons (title, image, location, participants, timeLeft, prize, date, description, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [h.title, h.image, h.location, h.participants, h.timeLeft, h.prize, h.date, h.description, h.status]);
      }
      console.log(`Inserted ${hacks.length} hackathons.`);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
