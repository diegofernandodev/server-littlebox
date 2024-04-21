
const { ResponseStructure } = require("../helpers/ResponseStructure");

const multitenancyMiddleware = (req, res, next) => {
  // Extraer el identificador del inquilino de la solicitud
  const tenantId = req.headers["x-tenant-id"];

  // Verificar si el tenantId está presente en la solicitud
  if (!tenantId) {
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error: Falta el identificador del inquilino (tenantId) en la solicitud";
    ResponseStructure.data = null;

    return res.status(400).json(ResponseStructure);
  }

  // Adjuntar el tenantId al objeto de solicitud para que esté disponible en las rutas
  req.tenantId = tenantId;

  // Continuar con el siguiente middleware o la ruta
  next();
};

module.exports = multitenancyMiddleware;
