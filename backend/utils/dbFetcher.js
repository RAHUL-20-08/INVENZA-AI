import db from '../database/db.js';

export const loadInnovationsFromDB = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM innovations');
    const mapped = rows.map(row => {
      const parseJsonSafely = (str, fallback) => {
        if (!str) return fallback;
        if (typeof str === 'object') return str; // Already parsed by mysql2 maybe
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
    return { innovations: mapped };
  } catch (err) {
    console.error("Error loading innovations from TiDB:", err);
    return { innovations: [] };
  }
};

export const loadSavedStartupsFromDB = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM saved_startups');
    return rows.map(row => {
      if (typeof row.data === 'string') {
        try { return JSON.parse(row.data); } catch(e) { return row.data; }
      }
      return row.data;
    });
  } catch (err) {
    console.error("Error loading saved startups from TiDB:", err);
    return [];
  }
};

export const loadHackathonsFromDB = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM hackathons');
    return rows;
  } catch (err) {
    console.error("Error loading hackathons from TiDB:", err);
    return [];
  }
};
