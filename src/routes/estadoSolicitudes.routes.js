const { Router } = require("express");
const router = Router();
const {
  obtenerEstadoSolicitudes,
} = require("../controller/estadoSolicitudes.controller");


// Ruta para obtener todos los estados de las solicitudes
router.get(
    "/obtenerEstadosSolicitudes",
    obtenerEstadoSolicitudes,
  );


  module.exports = router;