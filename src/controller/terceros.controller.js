const mongoose = require("mongoose");
const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../services/terceros.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const tercerosController = {};

// Obtener todos los terceros
tercerosController.obtenerTerceros = async (req, res) => {
  try {
    // Obtener el tenantId de la solicitud (req)
    const tenantId = req.tenantId;
    
    // Llamar al servicio para obtener los terceros
    const terceros = await obtenerTerceros(tenantId);

    // Preparar la respuesta exitosa
    ResponseStructure.status = 200;
    ResponseStructure.message = "Terceros encontrados exitosamente";
    ResponseStructure.data = terceros;

    // Enviar la respuesta al cliente
    res.status(200).json(ResponseStructure);
  } catch (error) {
    // Manejar errores en caso de que no se puedan obtener los terceros
    ResponseStructure.status = 404;
    ResponseStructure.message = "Terceros no encontrados";
    ResponseStructure.data = error.message;

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

// Obtener un tercero por su ID
tercerosController.obtenerTerceroPorId = async (req, res) => {
  try {
    // Obtener el ID del tercero de los parámetros de la solicitud (req)
    const terceroId = req.params.id;
    // Obtener el tenantId de la solicitud (req)
    const tenantId = req.tenantId;

    // Llamar al servicio para obtener un tercero por su ID
    const tercero = await obtenerTerceroPorId(terceroId, tenantId);

    // Preparar la respuesta exitosa
    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero encontrado exitosamente";
    ResponseStructure.data = tercero;

    // Enviar la respuesta al cliente
    res.status(200).json(ResponseStructure);
  } catch (error) {
    // Manejar errores en caso de que no se pueda obtener el tercero por su ID
    ResponseStructure.status = 404;
    ResponseStructure.message = "Tercero no encontrado";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

// Guardar un nuevo tercero
tercerosController.guardarTercero = async (req, res) => {
  try {
    // Crear un nuevo objeto de tercero con la información del cuerpo de la solicitud (req.body)
    const nuevoTercero = {
      ...req.body,
    };

    // Obtener el tenantId de la solicitud (req)
    const tenantId = req.tenantId;

    // Llamar al servicio para guardar el nuevo tercero
    const terceroGuardado = await guardarTercero(nuevoTercero, tenantId);

    // Preparar la respuesta exitosa
    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero guardado exitosamente";
    ResponseStructure.data = terceroGuardado;

    // Enviar la respuesta al cliente
    res.status(200).send(ResponseStructure);
  } catch (error) {
    // Manejar errores en caso de que no se pueda guardar el tercero
    const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar el tercero";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

// Eliminar un tercero por su ID
tercerosController.eliminarTerceroPorId = async (req, res) => {
  try {
    // Obtener el ID del tercero de los parámetros de la solicitud (req)
    const terceroId = req.params.id;
    // Obtener el tenantId de la solicitud (req)
    const tenantId = req.tenantId;

    // Llamar al servicio para eliminar el tercero por su ID
    const terceroEliminado = await eliminarTerceroPorId(terceroId, tenantId);

    // Preparar la respuesta exitosa
    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero eliminado exitosamente";
    ResponseStructure.data = terceroEliminado;

    // Enviar la respuesta al cliente
    res.status(200).send(ResponseStructure);
  } catch (error) {
    // Manejar errores en caso de que no se pueda eliminar el tercero por su ID
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar el tercero";
    ResponseStructure.data = error.message;
  
    res.status(500).json(ResponseStructure);
  }
};

// Modificar un tercero por su ID
tercerosController.modificarTerceroPorId = async (req, res) => {
  try {
    // Obtener los nuevos datos del tercero del cuerpo de la solicitud (req.body)
    const nuevosDatos = req.body;
    // Obtener el ID del tercero de los parámetros de la solicitud (req)
    const terceroId = req.params.id;
    // Obtener el tenantId de la solicitud (req)
    const tenantId = req.tenantId;

    // Llamar al servicio para modificar el tercero por su ID
    const terceroModificado = await modificarTerceroPorId(
      terceroId,
      nuevosDatos,
      tenantId
    );

    // Preparar la respuesta exitosa
    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero modificado exitosamente";
    ResponseStructure.data = terceroModificado;

    // Enviar la respuesta al cliente
    res.status(200).send(ResponseStructure);
  } catch (error) {
    // Manejar errores en caso de que no se pueda modificar el tercero por su ID
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar el tercero";
    ResponseStructure.data = error.message;

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

module.exports = tercerosController;

