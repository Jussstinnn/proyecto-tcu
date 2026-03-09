const express = require("express");
const router = express.Router();

const {
  getMySolicitudes,
  getAllSolicitudes,
  createSolicitud,
  getSolicitudDetalle,
  updateStatus,
  assignReviewer,
  returnSolicitudWithFlags,
  resubmitSolicitud,
} = require("../controllers/solicitud.controller");

// 🔐 middleware de autenticación
const { authRequired } = require("../middleware/auth.middleware");

console.log("handlers", {
  getMySolicitudes: typeof getMySolicitudes,
  getAllSolicitudes: typeof getAllSolicitudes,
  createSolicitud: typeof createSolicitud,
  getSolicitudDetalle: typeof getSolicitudDetalle,
  updateStatus: typeof updateStatus,
  assignReviewer: typeof assignReviewer,
  returnSolicitudWithFlags: typeof returnSolicitudWithFlags,
  resubmitSolicitud: typeof resubmitSolicitud,
});

/* ============================================================
   ESTUDIANTE
============================================================ */

router.get("/me", authRequired, getMySolicitudes);
router.post("/", authRequired, createSolicitud);
router.patch("/:id/resubmit", authRequired, resubmitSolicitud);

/* ============================================================
   ADMIN / COORDINADORES
============================================================ */

router.get("/", authRequired, getAllSolicitudes);
router.get("/:id/detalle", authRequired, getSolicitudDetalle);
router.patch("/:id/status", authRequired, updateStatus);
router.patch("/:id/assign", authRequired, assignReviewer);
router.patch("/:id/return", authRequired, returnSolicitudWithFlags);

module.exports = router;
