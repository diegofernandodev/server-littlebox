const mongoose = require("mongoose");

const {
  obtenerEstadoSolicitudes,
  } = require("../services/estadoSolicitudesService");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const estadoSolicitudesController = {};


estadoSolicitudesController.obtenerEstadoSolicitudes = async (req, res) => {
    try {
        // Obtener la lista de los estados de las solicitudes usando el servicio
    const listaEstadoSolicitudes = await obtenerEstadoSolicitudes();

    // Responder con la lista de solicitudes
    ResponseStructure.status = 200;
    ResponseStructure.message = "Estados de solicitudes encontradas exitosamente";
    ResponseStructure.data = listaEstadoSolicitudes;

    res.status(200).send(ResponseStructure);
    } catch (error) {
         // Manejar los errores y responder con el mensaje adecuado
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener estados de solicitudes";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
    }
}

module.exports = estadoSolicitudesController;