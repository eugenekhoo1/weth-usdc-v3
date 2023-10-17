const { query } = require("../config/db");

async function getLogs(req, res) {
  const num = parseInt(req.query.num);
  const interval = parseInt(req.query.interval);
  const timeframe = num;

  const SQL_QUERY = `
    WITH TimeIntervals AS (
        SELECT 
            timestamp, 
            FLOOR(timestamp / (60 * ${timeframe}000)) * (60 * ${timeframe}000) as interval,
            price, 
            ABS(tkn1volume) as volume
        FROM logs
        ORDER BY timestamp DESC
        ),
        
        OpenClose AS (
        SELECT DISTINCT
            interval AS interval_start,
            FIRST_VALUE(price) OVER(PARTITION BY interval ORDER BY timestamp) as open,
            FIRST_VALUE(price) OVER(PARTITION BY interval ORDER BY timestamp DESC) as close
        FROM TimeIntervals
        ),
        
        HighLow AS (
        SELECT
          interval AS date,
          MAX(price) AS high,
          MIN(price) AS low,
          SUM(volume) AS volume
        FROM TimeIntervals 
        GROUP BY interval
        ORDER BY interval DESC
            )
        
        SELECT
            hl.date,
            oc.open,
            hl.high,
            hl.low,
            oc.close,
            hl.volume
        FROM HighLow hl
        LEFT JOIN OpenClose oc
        ON hl.date = oc.interval_start
        ORDER BY hl.date DESC
    `;

  try {
    const response = await query(SQL_QUERY);
    return res.status(200).json(response.rows);
  } catch (err) {
    console.error(err);
  }
}

async function getTrades(req, res) {
  const numTrades = req.query.numtrades;
  try {
    const response = await query(
      `SELECT * FROM logs ORDER BY timestamp DESC LIMIT $1`,
      [numTrades]
    );
    return res.status(200).json(response.rows);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { getLogs, getTrades };
