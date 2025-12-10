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

// POST /api/auth/register
async function register(req, res) {
  const { nombre, email, password, cedula, carrera, role } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ message: "nombre, email y password son requeridos" });
  }

  try {
    // verificar si ya existe
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (nombre, email, password_hash, cedula, carrera, role)
       VALUES (?,?,?,?,?,?)`,
      [
        nombre,
        email,
        passwordHash,
        cedula || null,
        carrera || null,
        role === "ADMIN" ? "ADMIN" : "STUDENT",
      ]
    );

    const newUser = {
      id: result.insertId,
      nombre,
      email,
      role: role === "ADMIN" ? "ADMIN" : "STUDENT",
    };

    const token = signToken(newUser);

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (err) {
    console.error("Error register:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

// POST /api/auth/login
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
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

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
      "SELECT id, nombre, email, role, cedula, carrera, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

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
};
