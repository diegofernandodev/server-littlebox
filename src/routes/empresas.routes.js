const { Router } = require("express");
const router = Router();
const {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
  actualizarEstadoEmpresa,
} = require("../controller/empresas.controller");

// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las empresas
router.get(
  "/obtenerTodasLasEmpresas",
  verificarTokenMiddleware,
  checkRoleAuth(["SuperUsuario", "Gerente"]),
  obtenerEmpresas,
);

// Ruta para cambiar estado de registro de empresa
router.put(
  "/actualizarEstadoEmpresa/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["SuperUsuario", "Gerente"]),
  actualizarEstadoEmpresa,
);

// Ruta para obtener una empresa por su ID
router.get(
  "/obtenerEmpresa/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador"]),
  obtenerEmpresaPorId,
);

// Ruta para modificar una empresa por su ID
router.put(
  "/modificarEmpresa/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente"]),
  modificarEmpresaPorId,
);

// Ruta para eliminar una empresa por su ID
router.delete(
  "/eliminarEmpresa/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador"]),
  eliminarEmpresaPorId,
);

module.exports = router;
