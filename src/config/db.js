const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase + Render
  },
});

// Log successful connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

// Log unexpected errors (VERY helpful on Render)
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
  process.exit(1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};