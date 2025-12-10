const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/auth.controller");
const { authRequired } = require("../middleware/auth.middleware");

// Para pruebas: registrar usuario (STUDENT / ADMIN)
router.post("/register", register);

// Login
router.post("/login", login);

// Perfil del usuario autenticado
router.get("/me", authRequired, me);

module.exports = router;
