const mongoose = require("mongoose");

const {
  obtenerEgresoPorId,
  obtenerEgresos,
  guardarEgreso,
  eliminarEgresoPorId,
  modificarEgresoPorId,
  actualizarEgresoId,
} = require("../services/egresos.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const egresosController = {};

egresosController.obtenerEgresoPorId = async (req, res) => {
  try {
    const egresoId = req.params.id;
    const tenantId = req.tenantId;
    const egreso = await obtenerEgresoPorId(egresoId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso encontrado exitosamente";
    ResponseStructure.data = egreso;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 404;
    ResponseStructure.message = "Egreso no encontrado";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

egresosController.obtenerEgresos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, categoria, tercero } = req.body;
    const tenantId = req.tenantId;

    // Obtener la lista de egresos usando el servicio
    const listaEgresos = await obtenerEgresos({
      tenantId,
      fechaInicio,
      fechaFin,
      categoria,
      tercero,
    });

    res.status(listaEgresos.status).send(listaEgresos);
  } catch (error) {
    // Manejar los errores y responder con el mensaje adecuado
    let statusCode = 500;
    let message = "Error al obtener Egresos";
    console.log("este es el error al obtener egresos", error);

    if (
      error.message === "Las fechas o filtros proporcionados no son válidos"
    ) {
      statusCode = 400;
      message = error.message;
    } else if (
      error.message ===
      "No se encontraron engresos con los parámetros seleccionados"
    ) {
      statusCode = 404;
      message = error.message;
    }

    res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  }
};

egresosController.guardarEgreso = async (req, res) => {
  try {
    const nuevoEgreso = {
      ...req.body,
      categoria: req.body.categoria,
    };

    const tenantId = req.tenantId;
    const egresoGuardado = await guardarEgreso(nuevoEgreso, tenantId);
    const idCurrent = egresoGuardado._id;
    const tipoDoc = "egreso";

    const egresoId = await actualizarEgresoId(tenantId, idCurrent, tipoDoc);
    egresoGuardado.egresoId = egresoId;
    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso guardado exitosamente";
    ResponseStructure.data = egresoGuardado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error("Error en el controlador al guardar el egreso:", error);

    // const status = error.name === "ValidationError" ? 400 : 500;
    const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar el egreso";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};

egresosController.eliminarEgresoPorId = async (req, res) => {
  try {
    const egresoId = req.params.id;
    const tenantId = req.tenantId;
    const egresoEliminado = await eliminarEgresoPorId(egresoId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso eliminado exitosamente";
    ResponseStructure.data = egresoEliminado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar el egreso";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

egresosController.modificarEgresoPorId = async (req, res) => {
  try {
    const nuevosDatos = req.body;
    const egresoId = req.params.id;
    const tenantId = req.tenantId;

    const egresoModificado = await modificarEgresoPorId(
      egresoId,
      nuevosDatos,
      tenantId,
    );
    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso modificado exitosamemte";
    ResponseStructure.data = egresoModificado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar el egreso";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = egresosController;
