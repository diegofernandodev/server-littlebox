const { Router } = require("express");
const router = Router();
const {
  obtenerIngresoPorId,
  obtenerIngresos,
  modificarIngresoPorId,
  eliminarIngresoPorId,
  guardarIngreso,
} = require("../controller/ingresos.controller");


// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los ingresos
router.get(
  "/obtenerTodosLosIngresos",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  obtenerIngresos,
);

// Ruta para obtener un ingreso por su ID
router.get(
  "/obtenerIngreso/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "administrador"]),
  obtenerIngresoPorId,
);

// Ruta para modificar un ingreso por su ID
router.put(
  "/modificarIngreso/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  modificarIngresoPorId,
);

// Ruta para eliminar un ingreso por su ID
router.delete(
  "/eliminarIngreso/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  eliminarIngresoPorId,
);

// Ruta para guardar un nuevo ingreso
router.post(
  "/guardarIngreso",
  verificarTokenMiddleware,
  checkRoleAuth(["SuperUsuario", "Gerente"]),
  guardarIngreso,
);

module.exports = router;
