const { logVisit } = require("../models/Visit");

const logMiddleware = (req, res, next) => {
  const url = req.originalUrl;

  // Excluir rutas de archivos estáticos o innecesarios
  if (
    url.startsWith("/public") ||
    url.endsWith(".ico") ||
    url.startsWith("/stats")
  ) {
    return next();
  }

  const visit = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    url,
  };

  logVisit(visit);
  next();
};

module.exports = logMiddleware;