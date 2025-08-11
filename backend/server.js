const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const artistasRoutes = require("./routes/artistas.routes");
app.use("/api/artistas", artistasRoutes);

dotenv.config();

// 📂 Ruta al archivo de estadísticas
const visitsFile = path.join(__dirname, "logs", "visits.json");

// 🧹 Vaciar visitas al reiniciar el servidor
fs.writeFileSync(visitsFile, "[]");

// Middlewares
const logMiddleware = require("./middlewares/logMiddleware");
const statsRoutes = require("./routes/stats.routes");

app.use(express.json());

const spotifyRoutes = require("./routes/spotify.routes");
app.use("/api/spotify", spotifyRoutes);

const novedadesRoutes = require("./routes/novedades.routes");
app.use("/api/novedades", novedadesRoutes);

app.use(logMiddleware);

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use("/public", express.static(path.join(__dirname, "..", "frontend", "public")));

// Ruta principal (cargar index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Ruta para novedades
app.get("/novedades", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "novedades.html"));
});

app.get("/redes", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "redes.html"));
});

// Ruta de estadísticas (formato JSON)
app.use("/stats", statsRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));