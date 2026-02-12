// database.js - FIXED VERSION

import { Pool } from "pg";
import { DATABASE_URL, NODE_ENV } from "../config/config.js";

// Detect environment
const isProduction = NODE_ENV === "production";
const pool = new Pool({
  connectionString: DATABASE_URL,

  // ⏱ Prevent "Connection timeout" issue
  connectionTimeoutMillis: 20000, // 20 sec

  // ⏱ Prevent server killing idle connections
  idleTimeoutMillis: 30000, // 30 sec

  // 👥 Add pool size configuration
  max: 20, // Maximum number of clients in pool

  // 🔄 Add keep-alive to prevent connection drops
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000, // Send keep-alive after 10 seconds

  // 🔒 Required for Render, Railway, Supabase, Neon, etc.
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ Unexpected DB pool error:", err.message);
});

// Test connection
pool
  .query("SELECT NOW()")
  .then((res) => console.log("✅ DB connected:", res.rows[0].now))
  .catch((err) => console.error("❌ DB connection failed:", err.message));

// Graceful shutdown - FIXED: Use once to prevent multiple handlers
process.once("SIGINT", async () => {
  console.warn("🛑 Received SIGINT. Closing database pool...");
  await pool.end();
  console.warn("✅ Database pool closed.");
  process.exit(0);
});

process.once("SIGTERM", async () => {
  console.warn("🛑 Received SIGTERM. Closing database pool...");
  await pool.end();
  console.warn("✅ Database pool closed.");
  process.exit(0);
});

export default pool;