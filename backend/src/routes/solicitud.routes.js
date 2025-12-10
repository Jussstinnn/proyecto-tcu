const express = require("express");
const router = express.Router();
const {
  getMySolicitudes,
  getAllSolicitudes,
  createSolicitud,
  updateStatus,
  assignReviewer,
} = require("../controllers/solicitud.controller");
// const { authRequired, adminOnly } = require("../middleware/auth.middleware");

// 🔓 MODO DEMO: SIN AUTENTICACIÓN
// Cuando quieras volver a asegurar, re-activas authRequired/adminOnly

// Estudiante
router.get("/me", getMySolicitudes);
router.post("/", createSolicitud);

// Admin
router.get("/", getAllSolicitudes);
router.patch("/:id/status", updateStatus);
router.patch("/:id/assign", assignReviewer);

module.exports = router;
