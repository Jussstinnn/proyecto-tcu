const pool = require("../config/db");

// GET /api/instituciones
async function getAllInstituciones(req, res) {
  try {
    const { estado } = req.query;

    let sql = `
      SELECT id, nombre, contacto_email, tipo_servicio, estado, created_at
      FROM instituciones
    `;
    const params = [];

    if (estado) {
      sql += " WHERE estado = ?";
      params.push(estado);
    }

    sql += " ORDER BY nombre ASC";

    const [rows] = await pool.query(sql, params);
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

// POST /api/instituciones/solicitar (ESTUDIANTE)
async function createInstitucionPublic(req, res) {
  const { nombre, contacto_email, tipo_servicio } = req.body;

  if (!nombre || !contacto_email || !tipo_servicio) {
    return res.status(400).json({
      message: "nombre, contacto_email y tipo_servicio son requeridos",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO instituciones
       (nombre, contacto_email, tipo_servicio, estado)
       VALUES (?,?,?,'Pendiente')`,
      [nombre, contacto_email, tipo_servicio]
    );

    const [rows] = await pool.query(
      "SELECT * FROM instituciones WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error createInstitucionPublic:", err);
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
    const [rows] = await pool.query(
      "SELECT * FROM instituciones WHERE id = ?",
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updateInstitucionStatus:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

module.exports = {
  getAllInstituciones,
  createInstitucion,
  createInstitucionPublic,
  updateInstitucion,
  updateInstitucionStatus,
};
