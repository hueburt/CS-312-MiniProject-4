const { Pool } = require('pg');

// Shared connection pool for BlogDB database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BlogDB',
  password: 'postgres',
  port: 5432
});

module.exports = pool;
