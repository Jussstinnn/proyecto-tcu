const pool = require("../config/db");

function generateCodigo() {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `#${num}`;
}

function toDateOnly(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toISOString().slice(0, 10);
  } catch (e) {
    console.error("Error normalizando fecha vencimiento:", e);
    return dateStr;
  }
}

/**
  Estudiante: obtener MIS solicitudes
 */
async function getMySolicitudes(req, res) {
  try {
    const emailParam = req.query.email;
    const ownerEmail = emailParam || "esoto@ufidelitas.ac.cr";

    const [rows] = await pool.query(
      `SELECT *
       FROM solicitudes
       WHERE owner_email = ?
       ORDER BY created_at DESC`,
      [ownerEmail]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error getMySolicitudes:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
  Admin: obtener TODAS las solicitudes
 */
async function getAllSolicitudes(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT *
       FROM solicitudes
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error getAllSolicitudes:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
  Crear solicitud (Estudiante)
 */
async function createSolicitud(req, res) {
  const {
    estudiante_nombre,
    estudiante_cedula,
    carrera,
    institucion_id,
    institucion_nombre,
    titulo_proyecto,
    justificacion,
    objetivo_general,
    objetivos_especificos,
    beneficiario,
    estrategia_solucion,
    prioridad,
    vencimiento,
    owner_email: ownerEmailBody,
  } = req.body;

  if (
    !institucion_nombre ||
    !justificacion ||
    !objetivo_general ||
    !vencimiento
  ) {
    return res.status(400).json({
      message:
        "institucion_nombre, justificacion, objetivo_general y vencimiento son requeridos",
    });
  }

  const ownerUserId = 1;
  const ownerEmail = ownerEmailBody || "esoto@ufidelitas.ac.cr";
  const codigo_publico = generateCodigo();

  const vencimientoDate = toDateOnly(vencimiento);

  try {
    const [result] = await pool.query(
      `INSERT INTO solicitudes (
         codigo_publico,
         estudiante_nombre,
         estudiante_cedula,
         carrera,
         institucion_id,
         institucion_nombre,
         titulo_proyecto,
         justificacion,
         objetivo_general,
         objetivos_especificos,
         beneficiario,
         estrategia_solucion,
         prioridad,
         estado,
         vencimiento,
         owner_user_id,
         owner_email,
         assigned_to,
         assign_date
       )
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL)`,
      [
        codigo_publico,
        estudiante_nombre,
        estudiante_cedula,
        carrera || "",
        institucion_id || null,
        institucion_nombre,
        titulo_proyecto,
        justificacion,
        objetivo_general,
        objetivos_especificos || "",
        beneficiario || "",
        estrategia_solucion || "",
        prioridad || "Medium",
        "Enviado",
        vencimientoDate,
        ownerUserId,
        ownerEmail,
        null,
      ]
    );

    const solicitudId = result.insertId;

    await pool.query(
      `INSERT INTO solicitud_history (solicitud_id, accion, usuario, mensaje)
       VALUES (?,?,?,?)`,
      [
        solicitudId,
        "Solicitud creada y enviada",
        ownerEmail,
        "Creación de anteproyecto por el estudiante",
      ]
    );

    const [rows] = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [
      solicitudId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error createSolicitud:", err);
    res.status(500).json({
      message: "Error en el servidor al crear solicitud",
      error: err.message,
    });
  }
}

/**
  Actualizar estado de la solicitud (Admin)
 */
async function updateStatus(req, res) {
  const { id } = req.params;
  const { status, observation } = req.body;

  try {
    await pool.query(
      "UPDATE solicitudes SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );

    await pool.query(
      `INSERT INTO solicitud_history (solicitud_id, accion, usuario, mensaje)
       VALUES (?,?,?,?)`,
      [
        id,
        `Estado cambiado a: ${status}`,
        "admin@ufidelitas.ac.cr",
        observation || "",
      ]
    );

    const [rows] = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updateStatus:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
  Asignar revisor (Admin)
 */
async function assignReviewer(req, res) {
  const { id } = req.params;
  const { reviewerEmail } = req.body;

  if (!reviewerEmail) {
    return res.status(400).json({ message: "reviewerEmail es requerido" });
  }

  try {
    await pool.query(
      `UPDATE solicitudes
       SET assigned_to = ?, assign_date = NOW(), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [reviewerEmail, id]
    );

    await pool.query(
      `INSERT INTO solicitud_history (solicitud_id, accion, usuario, mensaje)
       VALUES (?,?,?,?)`,
      [
        id,
        "Solicitud asignada a revisor",
        "admin@ufidelitas.ac.cr",
        `Asignada a: ${reviewerEmail}`,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("Error assignReviewer:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

module.exports = {
  getMySolicitudes,
  getAllSolicitudes,
  createSolicitud,
  updateStatus,
  assignReviewer,
};
