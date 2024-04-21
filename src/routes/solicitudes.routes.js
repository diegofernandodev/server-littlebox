const { Router } = require("express");
const router = Router();
const {
  obtenerSolicitudes,
  obtenerSolicitudesPorId,
  guardarSolicitud,
  eliminarSolicitudPorId,
  modificarSolicitudPorId,
  cambiarEstadoSolicitud,
} = require("../controller/solicitud.controller");


// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const validarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require("../middleware/roleAuth");
const upload = require("../middleware/adjFacturaMdw");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

router.post(
  "/guardarSolicitud",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador", "Colaborador"]),
  upload.single("facturaUrl"), // Aquí 'factura' debe ser el nombre del campo en el formulario del frontend
  guardarSolicitud,
);

// Ruta para obtener todas las solicitudes
router.get(
  "/obtenerTodasLasSolicitudes",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador", "Colaborador"]),
  obtenerSolicitudes,
);

// Ruta para obtener una solicitud por su ID
router.get(
  "/obtenerSolicitud/:id",
  validarTokenMiddleware,
  checkRoleAuth(["Administrador", "Gerente", "Colaborador"]),
  obtenerSolicitudesPorId,
);

router.put(
  "/modificarSolicitud/:id",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador", "Colaborador"]),
  upload.single("facturaUrl"), // Aquí 'factura' debe ser el nombre del campo en el formulario del frontend
  modificarSolicitudPorId,
);

// Ruta para modificar estado de una solicitud por su ID
router.put(
  "/modificarEstadoSolicitud/:id",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  cambiarEstadoSolicitud,
);

// Ruta para eliminar una solicitud por su ID
router.delete(
  "/eliminarSolicitud/:id",
  validarTokenMiddleware,
  checkRoleAuth(["Gerente"]),
  eliminarSolicitudPorId,
);


module.exports = router;
