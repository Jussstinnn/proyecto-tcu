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
    const ownerEmail = req.query.email || "esoto@ufidelitas.ac.cr";

    const [rows] = await pool.query(
      `SELECT *
       FROM solicitudes
       WHERE owner_email = ?
       ORDER BY created_at DESC`,
      [ownerEmail],
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
       ORDER BY created_at DESC`,
    );
    res.json(rows);
  } catch (err) {
    console.error("Error getAllSolicitudes:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
  Crear solicitud (Estudiante)
  ✅ Alineado a BD:
   - solicitudes.descripcion_problema
   - guarda objetivos en solicitud_objetivos_especificos
   - guarda cronograma en solicitud_cronograma
 */
async function createSolicitud(req, res) {
  const {
    // snapshot del estudiante
    estudiante_nombre,
    estudiante_cedula,
    carrera,
    sede,
    estudiante_email,
    estudiante_phone,
    oficio,
    estado_civil,
    domicilio,
    lugar_trabajo,

    // institución
    institucion_id,
    institucion_nombre,

    // anteproyecto
    titulo_proyecto,
    descripcion_problema,
    justificacion, // compat

    objetivo_general,
    objetivos_especificos, // legacy opcional
    beneficiario,
    estrategia_solucion,

    prioridad,
    vencimiento,

    // dueño
    owner_email: ownerEmailBody,
    owner_user_id: ownerUserIdBody,

    // tablas hijas
    objetivos_especificos_items,
    cronograma_items,
  } = req.body;

  const descProblema = (descripcion_problema || justificacion || "").trim();

  if (
    !institucion_nombre ||
    !descProblema ||
    !objetivo_general ||
    !vencimiento
  ) {
    return res.status(400).json({
      message:
        "institucion_nombre, descripcion_problema (o justificacion), objetivo_general y vencimiento son requeridos",
    });
  }

  const ownerUserId = ownerUserIdBody || 1;
  const ownerEmail = ownerEmailBody || "esoto@ufidelitas.ac.cr";
  const codigo_publico = generateCodigo();
  const vencimientoDate = toDateOnly(vencimiento);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Insert principal
    const [result] = await conn.query(
      `INSERT INTO solicitudes (
        codigo_publico,
        estudiante_nombre,
        estudiante_cedula,
        carrera,
        sede,
        estudiante_email,
        estudiante_phone,
        oficio,
        estado_civil,
        domicilio,
        lugar_trabajo,
        institucion_id,
        institucion_nombre,
        titulo_proyecto,
        descripcion_problema,
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
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        codigo_publico,
        estudiante_nombre || "",
        estudiante_cedula || "",
        carrera || null,
        sede || null,
        estudiante_email || null,
        estudiante_phone || null,
        oficio || null,
        estado_civil || null,
        domicilio || null,
        lugar_trabajo || null,
        institucion_id || null,
        institucion_nombre,
        titulo_proyecto || null,
        descProblema,
        objetivo_general,
        objetivos_especificos || null,
        beneficiario || null,
        estrategia_solucion || null,
        prioridad || "Medium",
        "Enviado",
        vencimientoDate,
        ownerUserId,
        ownerEmail,
        null,
        null,
      ],
    );

    const solicitudId = result.insertId;

    // 2) Objetivos específicos
    const objetivosArr = Array.isArray(objetivos_especificos_items)
      ? objetivos_especificos_items
      : [];

    const objetivosClean = objetivosArr
      .map((x) => String(x || "").trim())
      .filter(Boolean);

    if (objetivosClean.length > 0) {
      const values = objetivosClean.map((desc, i) => [
        solicitudId,
        i + 1,
        desc,
      ]);

      await conn.query(
        `INSERT INTO solicitud_objetivos_especificos (solicitud_id, orden, descripcion)
         VALUES ?`,
        [values],
      );
    }

    // 3) Cronograma
    const cronoArr = Array.isArray(cronograma_items) ? cronograma_items : [];

    const cronoClean = cronoArr
      .map((r) => ({
        actividad: String(r?.actividad || "").trim(),
        tarea: String(r?.tarea || "").trim(),
        horas: parseInt(String(r?.horas ?? "").trim(), 10),
      }))
      .filter((r) => r.actividad && r.tarea && Number.isFinite(r.horas));

    if (cronoClean.length > 0) {
      const values = cronoClean.map((r, i) => [
        solicitudId,
        i + 1,
        r.actividad,
        r.tarea,
        r.horas,
      ]);

      await conn.query(
        `INSERT INTO solicitud_cronograma (solicitud_id, orden, actividad, tarea, horas)
         VALUES ?`,
        [values],
      );
    }

    // 4) history
    await conn.query(
      `INSERT INTO solicitud_history (solicitud_id, accion, usuario, mensaje)
       VALUES (?,?,?,?)`,
      [
        solicitudId,
        "Solicitud creada y enviada",
        ownerEmail,
        `Creación de anteproyecto. Objetivos: ${objetivosClean.length}, Cronograma: ${cronoClean.length}`,
      ],
    );

    await conn.commit();

    const [rows] = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [
      solicitudId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    await conn.rollback();
    console.error("Error createSolicitud:", err);
    res.status(500).json({
      message: "Error en el servidor al crear solicitud",
      error: err.message,
    });
  } finally {
    conn.release();
  }
}

/**
 * GET /solicitudes/:id/detalle
 */
async function getSolicitudDetalle(req, res) {
  try {
    const { id } = req.params;

    const [solRows] = await pool.query(
      `SELECT * FROM solicitudes WHERE id = ? LIMIT 1`,
      [id],
    );

    if (solRows.length === 0) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    const [objetivos] = await pool.query(
      `SELECT id, orden, descripcion
       FROM solicitud_objetivos_especificos
       WHERE solicitud_id = ?
       ORDER BY orden ASC, id ASC`,
      [id],
    );

    const [cronograma] = await pool.query(
      `SELECT id, orden, actividad, tarea, horas
       FROM solicitud_cronograma
       WHERE solicitud_id = ?
       ORDER BY orden ASC, id ASC`,
      [id],
    );

    const [history] = await pool.query(
      `SELECT id, accion, usuario, mensaje, created_at
       FROM solicitud_history
       WHERE solicitud_id = ?
       ORDER BY created_at DESC`,
      [id],
    );

    return res.json({
      solicitud: solRows[0],
      objetivos,
      cronograma,
      history,
    });
  } catch (err) {
    console.error("Error getSolicitudDetalle:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

/**
  Actualizar estado (Admin)
 */
async function updateStatus(req, res) {
  const { id } = req.params;
  const { status, observation } = req.body;

  try {
    await pool.query(
      "UPDATE solicitudes SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id],
    );

    await pool.query(
      `INSERT INTO solicitud_history (solicitud_id, accion, usuario, mensaje)
       VALUES (?,?,?,?)`,
      [
        id,
        `Estado cambiado a: ${status}`,
        "admin@ufidelitas.ac.cr",
        observation || "",
      ],
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
      [reviewerEmail, id],
    );

    await pool.query(
      `INSERT INTO solicitud_history (solicitud_id, accion, usuario, mensaje)
       VALUES (?,?,?,?)`,
      [
        id,
        "Solicitud asignada a revisor",
        "admin@ufidelitas.ac.cr",
        `Asignada a: ${reviewerEmail}`,
      ],
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
  getSolicitudDetalle, // ✅
  updateStatus,
  assignReviewer,
};
