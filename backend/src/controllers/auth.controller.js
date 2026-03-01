// backend/src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Helper para firmar JWT
function signToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    nombre: user.nombre,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "changeme", {
    expiresIn: "8h",
  });
}

// ============================================================
// ✅ MOCK SSO (OTP) - SIN AZURE
// ============================================================

// Dominio institucional permitido (configurable)
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || "@ufide.ac.cr";

// OTP en memoria (DEV). En producción se guarda en DB/Redis.
const otpStore = new Map(); // email -> { code, expiresAt, attempts }

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function validateInstitutionalEmail(email) {
  return email.endsWith(ALLOWED_DOMAIN);
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

function generateMockOid(email) {
  // mock estable-ish y único
  return `mock-oid:${email}:${Date.now()}`;
}

// POST /api/auth/mock/request
// body: { email }
async function requestMockOtp(req, res) {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) return res.status(400).json({ message: "email es requerido" });
    if (!validateInstitutionalEmail(email)) {
      return res.status(400).json({
        message: `Solo se permiten correos institucionales ${ALLOWED_DOMAIN}`,
      });
    }

    const code = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min
    otpStore.set(email, { code, expiresAt, attempts: 0 });

    // ✅ Simulación: en vez de enviar correo, lo mostramos en consola
    console.log(`[MOCK-OTP] Código para ${email}: ${code} (expira 5 min)`);

    return res.json({
      message: "Código enviado (modo demo). Revisa la consola del backend.",
      expiresInSeconds: 300,
    });
  } catch (err) {
    console.error("Error requestMockOtp:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// POST /api/auth/mock/verify
// body: { email, code, nombre? }
async function verifyMockOtp(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const code = String(req.body.code || "").trim();
    const nombreInput = String(req.body.nombre || "").trim();

    if (!email || !code) {
      return res.status(400).json({ message: "email y code son requeridos" });
    }
    if (!validateInstitutionalEmail(email)) {
      return res.status(400).json({
        message: `Solo se permiten correos institucionales ${ALLOWED_DOMAIN}`,
      });
    }

    const record = otpStore.get(email);
    if (!record) {
      return res
        .status(401)
        .json({ message: "Código inválido o no solicitado" });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(401).json({ message: "Código expirado" });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      otpStore.delete(email);
      return res
        .status(429)
        .json({ message: "Demasiados intentos. Solicita otro código." });
    }

    if (code !== record.code) {
      otpStore.set(email, record);
      return res.status(401).json({ message: "Código incorrecto" });
    }

    // OTP correcto => eliminamos
    otpStore.delete(email);

    // 1) Buscar usuario
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    let user = rows[0];

    // 2) Si no existe, crear como STUDENT por defecto
    if (!user) {
      const nombre = nombreInput || email.split("@")[0]; // fallback
      const cedulaMock = "0-0000-0000";
      const oidMock = generateMockOid(email);

      // ✅ IMPORTANTE: llenar campos NOT NULL para evitar 500
      // Ajustado a tu tabla actual (email, nombre, cedula, microsoft_oid, role, is_active)
      const [result] = await pool.query(
        `INSERT INTO users (
          email,
          nombre,
          cedula,
          microsoft_oid,
          role,
          is_active
        )
        VALUES (?,?,?,?,?,?)`,
        [email, nombre, cedulaMock, oidMock, "STUDENT", 1],
      );

      user = {
        id: result.insertId,
        nombre,
        email,
        role: "STUDENT",
        cedula: cedulaMock,
        microsoft_oid: oidMock,
      };
    } else {
      // Si existe y viene nombre y está vacío, lo actualizamos
      if (
        nombreInput &&
        (!user.nombre || String(user.nombre).trim().length === 0)
      ) {
        await pool.query("UPDATE users SET nombre = ? WHERE id = ?", [
          nombreInput,
          user.id,
        ]);
        user.nombre = nombreInput;
      }

      // Si existe pero no tiene oid (por si lo creaste manual), lo ponemos
      if (!user.microsoft_oid) {
        const oidMock = generateMockOid(email);
        await pool.query("UPDATE users SET microsoft_oid = ? WHERE id = ?", [
          oidMock,
          user.id,
        ]);
        user.microsoft_oid = oidMock;
      }
    }

    const token = signToken(user);

    return res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Error verifyMockOtp:", err);
    return res.status(500).json({
      message: "Error en el servidor",
      error: err.message, // útil para debug
    });
  }
}

// ============================================================
// LEGACY (register/login/me) - opcional
// ============================================================

// POST /api/auth/register (legacy)
async function register(req, res) {
  const { nombre, email, password, cedula, carrera } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ message: "nombre, email y password son requeridos" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // OJO: si tu tabla users NO tiene password_hash/carrera, no uses register/login.
    const [result] = await pool.query(
      `INSERT INTO users (nombre, email, password_hash, cedula, carrera, role)
       VALUES (?,?,?,?,?,?)`,
      [
        nombre,
        email,
        passwordHash,
        cedula || "0-0000-0000",
        carrera || null,
        "STUDENT",
      ],
    );

    const newUser = {
      id: result.insertId,
      nombre,
      email,
      role: "STUDENT",
    };

    const token = signToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("Error register:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// POST /api/auth/login (legacy)
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email y password son requeridos" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = rows[0];
    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = signToken(user);

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        cedula: user.cedula,
        carrera: user.carrera,
      },
      token,
    });
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, role, cedula, created_at FROM users WHERE id = ?",
      [req.user.id],
    );

    const user = rows[0];
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ user });
  } catch (err) {
    console.error("Error me:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

module.exports = {
  register,
  login,
  me,
  requestMockOtp,
  verifyMockOtp,
};
