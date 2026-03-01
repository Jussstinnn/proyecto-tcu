// backend/src/routes/auth.routes.js
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

// Legacy
router.post("/register", register);
router.post("/login", login);

// ✅ MOCK SSO
router.post("/mock/request", requestMockOtp);
router.post("/mock/verify", verifyMockOtp);

// Perfil
router.get("/me", authRequired, me);

module.exports = router;
