const { Router } = require("express");
const router = Router();
const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../controller/terceros.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const validarTokenMiddleware = require('../middleware/userAuthentication')
const checkRol = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los terceros
router.get(
  "/obtenerTodosLosTerceros",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador", "Colaborador"]),
  obtenerTerceros,
);

// Ruta para obtener un tercero por su ID
router.get(
  "/obtenerTercero/:id",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador", "Colaborador"]),
  obtenerTerceroPorId,
);

// Ruta para modificar un tercero por su ID
router.put(
  "/modificarTercero/:id",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador", "Colaborador"]),
  modificarTerceroPorId,
);

// Ruta para eliminar un tercero por su ID
router.delete(
  "/eliminarTercero/:id",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador"]),
  eliminarTerceroPorId,
);

// Ruta para guardar un nuevo egreso
router.post(
  "/guardarTercero",
  validarTokenMiddleware , checkRol(['Gerente','Administrador','Colaborador']),
  guardarTercero
);

module.exports = router;
