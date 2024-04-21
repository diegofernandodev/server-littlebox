const Tercero = require("../models/terceros.Model");
const EmpresaModel = require("../models/empresas.Model");

/**
 * Función para obtener todos los terceros asociados a un tenantId.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Array>} - Retorna un array de terceros.
 */
const obtenerTerceros = async (tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId de los terceros
    const tercerosExisten = await Tercero.exists({ tenantId });

    if (!tercerosExisten) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }
    
    const terceros = await Tercero.find({ tenantId });
    
    return terceros;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};

/**
 * Función para obtener un tercero por su ID y tenantId.
 * @param {string} terceroId - Identificador único del tercero.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - Retorna el tercero encontrado.
 */
const obtenerTerceroPorId = async (terceroId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId del tercero
    const terceroExistente = await Tercero.findOne({ _id: terceroId, tenantId });

    if (!terceroExistente) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }
    
    const tercero = await Tercero.findById({ _id: terceroId, tenantId });
    
    return tercero;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

/**
 * Función para guardar un nuevo tercero.
 * @param {Object} tercero - Datos del tercero a guardar.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - Retorna el tercero guardado.
 */
const guardarTercero = async (tercero, tenantId) => {
  try {
    // Asignar el tenantId al tercero
    tercero.tenantId = tenantId;

    // Validar que el objeto tercero tenga la estructura correcta y campos requeridos
    if (!tercero || !tercero.nombreTercero || !tercero.documentoTercero) {
      throw new Error("El objeto tercero no es valido o no contiene campos requeridos");
    }

    // Crear nuevo tercero
    const nuevoTercero = new Tercero(tercero);

    // Guardar el tercero
    const terceroGuardado = await nuevoTercero.save();

    return terceroGuardado;
  } catch (error) {
    throw new Error(`Error al guardar el tercero: ${error.message}`);
  }
};

/**
 * Función para eliminar un tercero por su ID y tenantId.
 * @param {string} terceroId - Identificador único del tercero.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - Retorna el tercero eliminado.
 */
const eliminarTerceroPorId = async (terceroId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId del tercero
    const terceroExistente = await Tercero.findOne({ _id: terceroId, tenantId });

    if (!terceroExistente) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }

    const terceroEliminado = await Tercero.findOneAndDelete({ _id: terceroId, tenantId });
    
    return terceroEliminado;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

/**
 * Función para modificar un tercero por su ID, tenantId y nuevos datos.
 * @param {string} terceroId - Identificador único del tercero.
 * @param {Object} nuevosDatos - Nuevos datos a actualizar en el tercero.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - Retorna el tercero modificado.
 */

const modificarTerceroPorId = async (terceroId, nuevosDatos, tenantId) => {
  
  try {
      // Verificar que el tenantId coincide con el tenantId del tercero
  const terceroExistente = await Tercero.findOne({ _id: terceroId, tenantId });

  if (!terceroExistente) {
    throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
  }
  const terceroModificado =  await Tercero.findOneAndUpdate(
    { _id: terceroId, tenantId },
    nuevosDatos,
    { new: true }
  );
  if (!terceroModificado) {
    throw new Error("Tercero no encontrado");
  }

  return terceroModificado;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

module.exports = {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
};
