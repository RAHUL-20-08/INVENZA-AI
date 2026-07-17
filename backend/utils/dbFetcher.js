import fs from 'fs';
import path from 'path';
import db from '../database/db.js';

const loadLocalJSON = () => {
  try {
    const raw = fs.readFileSync(path.resolve('backend/database/database.json'), 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { innovations: [], patents: [], papers: [] };
  }
};

const withTimeout = (promise, ms = 2000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TiDB connection timeout')), ms))
  ]);
};

export const loadInnovationsFromDB = async () => {
  try {
    const [rows] = await withTimeout(db.query('SELECT * FROM innovations'), 2000);
    if (!rows || rows.length === 0) {
      return loadLocalJSON();
    }
    const mapped = rows.map(row => {
      const parseJsonSafely = (str, fallback) => {
        if (!str) return fallback;
        if (typeof str === 'object') return str;
        try {
          return JSON.parse(str);
        } catch (e) {
          return fallback;
        }
      };

      return {
        id: row.id,
        name: row.name,
        inventor: row.inventor,
        patentId: row.patentId,
        yearFiled: row.yearFiled,
        status: row.status,
        sector: row.sector,
        commercialPotential: row.commercialPotential,
        marketGrowth: row.marketGrowth,
        revivalViability: row.revivalViability,
        readinessLevel: row.readinessLevel,
        recommendationScore: row.recommendationScore,
        failureBottlenecks: parseJsonSafely(row.failureBottlenecks, []),
        aiEnhancementVector: parseJsonSafely(row.aiEnhancementVector, []),
        marketTrend: parseJsonSafely(row.marketTrend, []),
        swot: parseJsonSafely(row.swot, {}),
        roadmap: parseJsonSafely(row.roadmap, []),
        financials: parseJsonSafely(row.financials, {}),
        analysis: parseJsonSafely(row.analysis, null)
      };
    });

    const localData = loadLocalJSON();
    const existingIds = new Set(mapped.map(m => m.id));
    (localData.innovations || []).forEach(item => {
      if (!existingIds.has(item.id)) {
        mapped.push(item);
      }
    });

    return { 
      innovations: mapped,
      patents: localData.patents || [],
      papers: localData.papers || []
    };
  } catch (err) {
    console.warn("TiDB connection timeout/offline, using local database.json dataset.");
    return loadLocalJSON();
  }
};

export const loadSavedStartupsFromDB = async () => {
  try {
    const [rows] = await withTimeout(db.query('SELECT * FROM saved_startups'), 2000);
    return rows.map(row => {
      if (typeof row.data === 'string') {
        try { return JSON.parse(row.data); } catch(e) { return row.data; }
      }
      return row.data;
    });
  } catch (err) {
    try {
      const raw = fs.readFileSync(path.resolve('backend/database/saved_startups.json'), 'utf8');
      return JSON.parse(raw);
    } catch(e) {
      return [];
    }
  }
};

export const loadHackathonsFromDB = async () => {
  try {
    const [rows] = await withTimeout(db.query('SELECT * FROM hackathons'), 2000);
    if (rows && rows.length > 0) return rows;
    const raw = fs.readFileSync(path.resolve('backend/hackathons.json'), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    try {
      const raw = fs.readFileSync(path.resolve('backend/hackathons.json'), 'utf8');
      return JSON.parse(raw);
    } catch(e) {
      return [];
    }
  }
};
