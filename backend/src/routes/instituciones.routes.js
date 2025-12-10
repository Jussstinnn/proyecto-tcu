const express = require("express");
const router = express.Router();
const {
  getAllInstituciones,
  createInstitucion,
  createInstitucionPublic,
  updateInstitucion,
  updateInstitucionStatus,
} = require("../controllers/instituciones.controller");

const { authRequired, adminOnly } = require("../middleware/auth.middleware");

// GET público (estudiantes pueden ver la lista)
router.get("/", getAllInstituciones);

// Estudiante registra institución para aprobación
router.post("/solicitar", createInstitucionPublic);

// Solo ADMIN puede crear/editar directamente y cambiar estado
router.post("/", authRequired, adminOnly, createInstitucion);
router.put("/:id", authRequired, adminOnly, updateInstitucion);
router.patch("/:id/status", authRequired, adminOnly, updateInstitucionStatus);

module.exports = router;
