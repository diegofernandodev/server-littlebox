const mongoose = require("mongoose");

const {
  obtenerIngresoPorId,
  obtenerIngresos,
  guardarIngreso,
  eliminarIngresoPorId,
  modificarIngresoPorId,
  actualizarIngresoId,
} = require("../services/ingreso.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const ingresosController = {};

ingresosController.obtenerIngresoPorId = async (req, res) => {
  try {
    const ingresoId = req.params.id;
    const tenantId = req.tenantId;
    console.log("id recibido en consulta..", ingresoId);
    console.log("tenantId recibido en consulta..", tenantId);
    const ingreso = await obtenerIngresoPorId(ingresoId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Ingreso encontrado exitosamente";
    ResponseStructure.data = ingreso;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    
    ResponseStructure.status = 404;
    ResponseStructure.message = "Ingreso no encontrado";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

ingresosController.obtenerIngresos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const tenantId = req.tenantId;
  
    // Obtener la lista de ingresos usando el servicio
    const listaIngresos = await obtenerIngresos({ tenantId, fechaInicio, fechaFin });
  
    // Responder con la lista de ingresos
    res.status(listaIngresos.status).send(listaIngresos);
  } catch (error) {
    // Manejar los errores y responder con el mensaje adecuado
    let statusCode = 500;
    let message = "Error al obtener Ingresos";
  
    if (error.message === "Las fechas proporcionadas no son válidas") {
      statusCode = 400;
      message = error.message;
    } else if (error.message === "No se encontraron ingresos con los parámetros seleccionados") {
      statusCode = 404;
      message = error.message;
    }
  
    res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  }
};

ingresosController.guardarIngreso = async (req, res) => {
  try {
  
    const { ingreso, tenantId } = req.body;

    console.log("nuevo ingreso recibido en consulta..", ingreso);
    console.log("tenantId recibido en consulta..", tenantId);
    const ingresoGuardado = await guardarIngreso(ingreso, tenantId);
    const idCurrent = ingresoGuardado._id;
    const tipoDoc = "ingreso"

    const ingresoId = await actualizarIngresoId(tenantId, idCurrent, tipoDoc);
    ingresoGuardado.ingresoId = ingresoId;
    ResponseStructure.status = 200;
    ResponseStructure.message = "Ingreso guardado exitosamente";
    ResponseStructure.data = ingresoGuardado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error("Error en el controlador al guardar el ingreso:", error);

    // const status = error.name === "ValidationError" ? 400 : 500;
    const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar el ingreso";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};

ingresosController.eliminarIngresoPorId = async (req, res) => {
  try {
    const ingresoId = req.params.id;
    const tenantId = req.tenantId;
    const ingresoEliminado = await eliminarIngresoPorId(ingresoId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Ingreso eliminado exitosamente";
    ResponseStructure.data = ingresoEliminado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar el ingreso";
    ResponseStructure.data = error.message;
  
    res.status(500).json(ResponseStructure);
  }
};

ingresosController.modificarIngresoPorId = async (req, res) => {

  try {
    const nuevosDatos = req.body;
    const ingresoId = req.params.id;
    const tenantId = req.tenantId;

    console.log("Body de la solicitud:", req.body);
    console.log("Query de la solicitud:", req.query);

    console.log("nuevos datos recibido..", nuevosDatos);
    console.log("id recibido..", ingresoId);
    console.log("tenantId recibido..", tenantId);
    
    const ingresoModificado = await modificarIngresoPorId(
      ingresoId,
      nuevosDatos,
      tenantId
    );
    ResponseStructure.status = 200;
    ResponseStructure.message = "Ingreso modificado exitosamemte";
    ResponseStructure.data = ingresoModificado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar el ingreso";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = ingresosController;
