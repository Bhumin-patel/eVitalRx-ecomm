const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'bhumin@259',
  port: 5432,
  max: 5
});

module.exports = pool;