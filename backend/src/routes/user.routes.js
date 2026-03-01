const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authRequired, coordOnly } = require("../middleware/auth.middleware");

// Obtener usuario por email (lo dejé)
router.get("/", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "email requerido" });

  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, cedula, carrera, role FROM users WHERE email = ?`,
      [email],
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("Error getUser:", err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// ✅ (opcional) traer mi perfil desde el token
router.get("/me", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, email, role FROM users WHERE id = ? LIMIT 1`,
      [req.user.id],
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error("Error user/me:", err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// ✅ cambiar rol (solo COORD)
// PATCH /api/user/:id/role  body: { role: "COORD" | "STUDENT" }
router.patch("/:id/role", authRequired, coordOnly, async (req, res) => {
  const { id } = req.params;
  const role = String(req.body.role || "")
    .trim()
    .toUpperCase();

  if (!["STUDENT", "COORD"].includes(role)) {
    return res.status(400).json({ message: "role inválido (STUDENT|COORD)" });
  }

  try {
    await pool.query(
      `UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [role, id],
    );

    const [rows] = await pool.query(
      `SELECT id, nombre, email, role FROM users WHERE id = ? LIMIT 1`,
      [id],
    );

    res.json(rows[0] || null);
  } catch (err) {
    console.error("Error update role:", err);
    res.status(500).json({ message: "Error en servidor" });
  }
});

module.exports = router;
