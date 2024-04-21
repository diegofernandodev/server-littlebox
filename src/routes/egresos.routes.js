const { Router } = require("express");
const router = Router();
const {
  obtenerEgresoPorId,
  obtenerEgresos,
  modificarEgresoPorId,
  eliminarEgresoPorId,
  guardarEgreso,
} = require("../controller/egresos.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const validarTokenMiddleware = require('../middleware/userAuthentication')

const checkRoleAuth = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los egresos
router.post(
  "/obtenerTodosLosEgresos",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  obtenerEgresos,
);

// Ruta para obtener un egreso por su ID
router.get(
  "/obtenerEgreso/:id",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "administrador"]),
  obtenerEgresoPorId,
);

// Ruta para modificar un egreso por su ID
router.put(
  "/modificarEgreso/:id",
  validarTokenMiddleware, 
  checkRoleAuth(["Gerente", "Administrador"]),
  modificarEgresoPorId,
);

// Ruta para eliminar un egreso por su ID
router.delete(
  "/eliminarEgreso/:id",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente"]),
  eliminarEgresoPorId,
);

// Ruta para guardar un nuevo egreso
router.post(
  "/guardarEgreso",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  guardarEgreso,
);

module.exports = router;
