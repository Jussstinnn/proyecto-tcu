const mysql = require("mysql2/promise");

const isProd = process.env.NODE_ENV === "production";

// ✅ Local por defecto
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Molly24", // en XAMPP suele ser vacío
  database: process.env.DB_NAME || "fidelitas_techseed",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // opcional (para logs de timezone raros)
  timezone: "Z",
});

module.exports = pool;
