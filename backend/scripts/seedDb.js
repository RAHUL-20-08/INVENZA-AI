import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log('Connecting to TiDB...');
  
  try {
    // Test connection
    const [rows] = await db.query('SELECT 1');
    console.log('Connected successfully!');

    console.log('Creating tables...');
    // Create Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255),
        role VARCHAR(50),
        roles JSON,
        mfaEnabled BOOLEAN DEFAULT false,
        mfaType VARCHAR(50),
        totpSecret VARCHAR(255),
        backupCodes JSON,
        loginFailures INT DEFAULT 0,
        lockoutUntil BIGINT,
        activeSessions JSON,
        loginHistory JSON,
        studentProfile JSON,
        businessProfile JSON
      )
    `);

    // Create Audit Logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp VARCHAR(100),
        email VARCHAR(255),
        action VARCHAR(255),
        metadata JSON
      )
    `);

    // Create Innovations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS innovations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        inventor VARCHAR(255),
        patentId VARCHAR(255),
        yearFiled INT,
        status VARCHAR(100),
        sector VARCHAR(255),
        commercialPotential INT,
        marketGrowth VARCHAR(255),
        revivalViability INT,
        readinessLevel INT,
        recommendationScore INT,
        failureBottlenecks JSON,
        aiEnhancementVector JSON,
        marketTrend JSON,
        swot JSON,
        roadmap JSON,
        financials JSON,
        analysis JSON
      )
    `);

    // We will do basic data migration for users and audit_logs as proof of concept
    console.log('Migrating users.json...');
    const usersPath = path.join(__dirname, '../users.json');
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      for (const u of users) {
        await db.query(`
          INSERT IGNORE INTO users (
            email, password, role, roles, mfaEnabled, mfaType, totpSecret,
            backupCodes, loginFailures, lockoutUntil, activeSessions, loginHistory,
            studentProfile, businessProfile
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          u.email, u.password, u.role, JSON.stringify(u.roles || []), u.mfaEnabled || false,
          u.mfaType || 'none', u.totpSecret || null, JSON.stringify(u.backupCodes || []),
          u.loginFailures || 0, u.lockoutUntil || null, JSON.stringify(u.activeSessions || []),
          JSON.stringify(u.loginHistory || []), JSON.stringify(u.studentProfile || null),
          JSON.stringify(u.businessProfile || null)
        ]);
      }
      console.log(`Inserted ${users.length} users.`);
    }

    console.log('Migrating audit_logs.json...');
    const logsPath = path.join(__dirname, '../audit_logs.json');
    if (fs.existsSync(logsPath)) {
      const logs = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
      for (const l of logs) {
        await db.query(`
          INSERT IGNORE INTO audit_logs (timestamp, email, action, metadata)
          VALUES (?, ?, ?, ?)
        `, [l.timestamp, l.email, l.action, JSON.stringify(l.metadata || {})]);
      }
      console.log(`Inserted ${logs.length} audit logs.`);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
