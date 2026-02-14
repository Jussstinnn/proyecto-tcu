const express = require("express");
const router = express.Router();
const {
  getMySolicitudes,
  getAllSolicitudes,
  createSolicitud,
  getSolicitudDetalle,
  updateStatus,
  assignReviewer,
} = require("../controllers/solicitud.controller");

console.log("handlers", {
  getMySolicitudes: typeof getMySolicitudes,
  getAllSolicitudes: typeof getAllSolicitudes,
  createSolicitud: typeof createSolicitud,
  getSolicitudDetalle: typeof getSolicitudDetalle,
  updateStatus: typeof updateStatus,
  assignReviewer: typeof assignReviewer,
});

// Estudiante
router.get("/me", getMySolicitudes);
router.post("/", createSolicitud);

// Admin
router.get("/", getAllSolicitudes);
router.get("/:id/detalle", getSolicitudDetalle);
router.patch("/:id/status", updateStatus);
router.patch("/:id/assign", assignReviewer);

module.exports = router;
