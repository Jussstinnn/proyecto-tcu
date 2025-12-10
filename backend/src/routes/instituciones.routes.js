const express = require("express");
const router = express.Router();
const {
  getAllInstituciones,
  createInstitucion,
  updateInstitucion,
  updateInstitucionStatus,
} = require("../controllers/instituciones.controller");

const { authRequired, adminOnly } = require("../middleware/auth.middleware");

// Todos los usuarios logueados pueden ver instituciones
router.get("/", authRequired, getAllInstituciones);

// Solo ADMIN puede crear/editar
router.post("/", authRequired, adminOnly, createInstitucion);
router.put("/:id", authRequired, adminOnly, updateInstitucion);
router.patch("/:id/status", authRequired, adminOnly, updateInstitucionStatus);

module.exports = router;
