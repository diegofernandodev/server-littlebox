const estadoSolicitudModel = require("../models/estadosSolicitud.model");

const obtenerEstadoSolicitudes = async () => {
    try {
      // Obtener la lista de todos los estados de las solicitudes
      const Estadosolicitudes = await estadoSolicitudModel.find()
         
      return Estadosolicitudes;
    } catch (error) {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  };


  
module.exports = {
    obtenerEstadoSolicitudes,
  };