const pool = require("../config/db");

// GET /api/instituciones
// Todos pueden ver la lista (students y admins)
async function getAllInstituciones(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, contacto_email, tipo_servicio, estado, created_at
       FROM instituciones
       ORDER BY nombre ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error getAllInstituciones:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// POST /api/instituciones (ADMIN)
async function createInstitucion(req, res) {
  const { nombre, contacto_email, tipo_servicio, estado } = req.body;

  if (!nombre || !contacto_email || !tipo_servicio) {
    return res.status(400).json({
      message: "nombre, contacto_email y tipo_servicio son requeridos",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO instituciones
       (nombre, contacto_email, tipo_servicio, estado)
       VALUES (?,?,?,?)`,
      [nombre, contacto_email, tipo_servicio, estado || "Pendiente"]
    );

    const [rows] = await pool.query(
      "SELECT * FROM instituciones WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error createInstitucion:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// PUT /api/instituciones/:id (ADMIN)
async function updateInstitucion(req, res) {
  const { id } = req.params;
  const { nombre, contacto_email, tipo_servicio, estado } = req.body;

  try {
    await pool.query(
      `UPDATE instituciones
       SET nombre = ?, contacto_email = ?, tipo_servicio = ?, estado = ?
       WHERE id = ?`,
      [nombre, contacto_email, tipo_servicio, estado || "Pendiente", id]
    );

    const [rows] = await pool.query(
      "SELECT * FROM instituciones WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updateInstitucion:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// PATCH /api/instituciones/:id/status (ADMIN)
async function updateInstitucionStatus(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: "estado es requerido" });
  }

  try {
    await pool.query("UPDATE instituciones SET estado = ? WHERE id = ?", [
      estado,
      id,
    ]);
    res.json({ message: "Estado actualizado" });
  } catch (err) {
    console.error("Error updateInstitucionStatus:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

module.exports = {
  getAllInstituciones,
  createInstitucion,
  updateInstitucion,
  updateInstitucionStatus,
};
