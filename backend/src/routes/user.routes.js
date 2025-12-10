const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// DEMO: obtener un usuario por email
router.get("/", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "email requerido" });

  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, cedula, carrera FROM users WHERE email = ?`,
      [email]
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("Error getUser:", err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

module.exports = router;
