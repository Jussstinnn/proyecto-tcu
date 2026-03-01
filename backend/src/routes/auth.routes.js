const express = require("express");
const router = express.Router();
const {
  register,
  login,
  me,
  requestMockOtp,
  verifyMockOtp,
} = require("../controllers/auth.controller");
const { authRequired } = require("../middleware/auth.middleware");

// Registrar (legacy)
router.post("/register", register);

// Login (legacy)
router.post("/login", login);

// ✅ MOCK SSO
router.post("/mock/request", requestMockOtp);
router.post("/mock/verify", verifyMockOtp);

// Perfil del usuario autenticado
router.get("/me", authRequired, me);

module.exports = router;
