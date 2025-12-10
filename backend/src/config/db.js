// Force IPv4 DNS resolution on Render / cloud hosts
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
const { Pool } = require("pg");

// Safe database URL normalizer — logs but never crashes
function normalizeDatabaseUrl(connectionString = process.env.DATABASE_URL) {
  try {
    console.log("🔎 Loaded DB URL:", connectionString);
    console.log("🔎 SUPABASE_PROJECT_REF:", process.env.SUPABASE_PROJECT_REF);
    console.log("🔎 SUPABASE_PROJECT_ID:", process.env.SUPABASE_PROJECT_ID);

    if (!connectionString) {
      console.warn("⚠️ No DATABASE_URL provided — returning undefined");
      return undefined;
    }

    const url = new URL(connectionString);
    const host = url.hostname;
    const projectRef =
      process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;

    // If pooled URL but missing project ref, just warn — never throw
    if (host.includes("pooler.supabase") && !projectRef) {
      console.warn(
        "⚠️ Missing Supabase project ref — using raw connection string"
      );
      return connectionString;
    }

    // If pooled URL and project ref exists but missing param — inject it
    const optionsParam = url.searchParams.get("options") || "";
    if (
      host.includes("pooler.supabase") &&
      projectRef &&
      !optionsParam.includes("project=")
    ) {
      console.log("🔧 Injecting Supabase project ref into pooled URL...");
      url.searchParams.set(
        "options",
        `${optionsParam}${optionsParam ? "&" : ""}project=${projectRef}`
      );
      return url.toString();
    }

    return connectionString;
  } catch (err) {
    console.warn("⚠️ DB URL normalization error — returning raw:", err.message);
    return connectionString;
  }
}

// Postgres pool — Render compatible
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // direct URL use
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  statement_timeout: 10000,
  connectionTimeoutMillis: 10000,
  idle_in_transaction_session_timeout: 10000,
});

pool.on("connect", () =>
  console.log("✅ Connected successfully to database")
);
pool.on("error", (err) => console.error("❌ Pool error:", err.message));

// Safe connectivity test — does not depend on tables existing
function testConnection() {
  return pool
    .query("SELECT 1")
    .then(() => console.log("✔ Database reachable"))
    .catch((err) => {
      console.error("❌ DB unreachable:", err.message);
      throw err;
    });
}

module.exports = { pool, testConnection, normalizeDatabaseUrl };
