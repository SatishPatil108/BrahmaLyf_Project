import pool from './database.js';

(async () => {
    try {
        const query = `
  SELECT 
      COUNT(*) AS active_connections,
      s.max_conn,
      (s.max_conn - COUNT(*)) AS available_connections
  FROM pg_stat_activity
  CROSS JOIN (
      SELECT setting::int AS max_conn 
      FROM pg_settings 
      WHERE name = 'max_connections'
  ) AS s
  GROUP BY s.max_conn;
`;


        const result = await pool.query(query);
        console.log('📊 DB Connection Info:', result.rows[0]);
    } catch (err) {
        console.error('❌ Error fetching connection info:', err);
    } finally {
        pool.end();
    }
})();
