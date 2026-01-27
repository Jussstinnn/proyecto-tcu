const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "techseed.database.windows.net",
  user: process.env.DB_USER || "techseed_admin",
  password: process.env.DB_PASSWORD || "Molly24",
  database: process.env.DB_NAME || "tcu_techseed",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
