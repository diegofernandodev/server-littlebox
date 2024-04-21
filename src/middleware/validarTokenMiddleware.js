const jwt = require("jsonwebtoken");
const ResponseStructure = require("../helpers/ResponseStructure");
const { listaNegraService } = require("../services/blackList.service");

const validarTokenMiddleware = async (req, res, next) => {
  try {
    // Verificamos si la ruta es /logout
    if (req.url !== "/logout") {
      // Verificamos si el token está presente
      const token = req.headers.authorization;
      if (!token) {
        ResponseStructure.status = 401;
        ResponseStructure.message = "Error: Token no proporcionado";
        ResponseStructure.data = null;
        return res.status(401).json(ResponseStructure);
      }

      // Verificamos si el token es válido
      const decodedToken = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
      );
      if (!decodedToken) {
        ResponseStructure.status = 401;
        ResponseStructure.message = "Error: Token no válido";
        ResponseStructure.data = null;
        return res.status(401).json(ResponseStructure);
      }

      // Obtenemos el ID del usuario
      const userId = decodedToken.userId;

      // Verificar si el token está en la lista negra
      const tokenEnListaNegra =
        await listaNegraService.tokenEnListaNegra(token);
      if (tokenEnListaNegra) {
        ResponseStructure.status = 401;
        ResponseStructure.message = "Error: Token en lista negra";
        ResponseStructure.data = null;
        return res.status(401).json(ResponseStructure);
      }

      // Adjuntar tenantId, rol y userId al objeto de solicitud
      req.tenantId = decodedToken.tenantId;
      req.rol = decodedToken.rol;
      req.userId = decodedToken.userId

      // Si no estamos en la ruta /logout, no eliminamos el token de la sesión
      if (req.url !== "/logout") {
        req.session.token = decodedToken;
      }

      // Continuar con el siguiente middleware o la ruta
      next();
    } else {
      // Permitimos el acceso a la ruta /logout para todos los usuarios
      next();
    }
  } catch (error) {
    console.error(error);
    ResponseStructure.status = 500;
    ResponseStructure.message = `Error en validarTokenMiddleware: ${error.message}`;
    ResponseStructure.data = null;
    res.status(500).json(ResponseStructure);
  }
};

module.exports = validarTokenMiddleware;
