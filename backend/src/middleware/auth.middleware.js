const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Formato de autorización inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme");
    // decoded: { id, email, role, nombre, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Requiere rol ADMIN" });
  }
  next();
}

module.exports = {
  authRequired,
  adminOnly,
};
