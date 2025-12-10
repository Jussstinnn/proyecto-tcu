require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const solicitudRoutes = require("./routes/solicitud.routes");
const institucionRoutes = require("./routes/instituciones.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173", // donde corre tu React/Vite
    credentials: true,
  })
);

app.use(express.json());

// Endpoint simple para probar
app.get("/", (req, res) => {
  res.json({ message: "API Fidélitas TechSeed OK" });
});

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/instituciones", institucionRoutes);
app.use("/api/user", userRoutes);

// Middleware de errores (catch-all)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Backend TechSeed escuchando en http://localhost:${PORT}`);
});
