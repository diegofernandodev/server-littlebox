const Empresa = require("../models/empresas.Model");
const rolModel = require("../models/rolesUser.Model");
const User = require("../models/user.model");
const { sendEmail } = require("../helpers/sendMail");
const {
  guardarUsuario,
  cambiarEstadoRegistroUser,
} = require("../services/user.service");

/**
 * Obtiene las empresas según el estado de registro.
 * @param {string} [estado] - El estado de registro por el cual filtrar las empresas ('Aprobado', 'Pendiente', 'Rechazado').
 * @returns {Promise<Array>} - Un array de empresas según el estado de registro especificado o todas las empresas si no se proporciona un estado.
 * @throws {Error} - Se lanza un error si hay algún problema al obtener las empresas.
 */
const obtenerEmpresas = async (estado) => {
  try {
    const query = estado ? { estadoDeRegistro: estado } : {};
    const empresas = await Empresa.find(query);
    return empresas;
  } catch (error) {
    throw new Error(`Error al obtener las empresas: ${error.message}`);
  }
};

/**
 * Obtiene una empresa por su ID.
 * @param {string} empresaId - El ID de la empresa a obtener.
 * @returns {Promise<Object|null>} - La empresa encontrada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al obtener la empresa por su ID.
 */
const obtenerEmpresaPorId = async (empresaId) => {
  try {
    const empresa = await Empresa.findById(empresaId);
    return empresa;
  } catch (error) {
    throw new Error(`Error al obtener la empresa por ID: ${error.message}`);
  }
};

/**
 * Guarda una nueva empresa.
 * @param {Object} empresa - La información de la empresa a guardar.
 * @returns {Promise<Object>} - La empresa guardada.
 * @throws {Error} - Se lanza un error si hay algún problema al guardar la empresa.
 */
const guardarEmpresa = async (empresa, usuarioPrincipal) => {
  try {
    const nuevaEmpresa = new Empresa(empresa);
    const empresaGuardada = await nuevaEmpresa.save();
    // Crear y guardar el usuario principal asociado a la empresa
    const usuarioPrincipalConTenantId = {
      ...usuarioPrincipal,
      tenantId: nuevaEmpresa.tenantId,
    };

    const usuarioPrincipalGuardado = await guardarUsuario(
      usuarioPrincipalConTenantId,
      nuevaEmpresa.tenantId,
    );

    return {
      empresa: empresaGuardada,
      usuarioPrincipal: usuarioPrincipalGuardado,
    };
  } catch (error) {
    throw new Error(`Error al guardar la empresa: ${error.message}`);
  }
};

/**
 * Actualiza una empresa por su ID con nuevos datos.
 * @param {string} idEmpresaActual - El ID de la empresa a actualizar.
 * @param {Object} datosEmpresaActualizado - Los nuevos datos para la empresa.
 * @returns {Promise<Object|null>} - La empresa actualizada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al actualizar la empresa por su ID.
 */
const actualizarEmpresaId = async (
  idEmpresaActual,
  datosEmpresaActualizado,
) => {
  try {
    const empresaActualizada = await Empresa.findByIdAndUpdate(
      idEmpresaActual,
      { $set: datosEmpresaActualizado },
      { new: true },
    );
    return empresaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la empresa por ID: ${error.message}`);
  }
};

/**
 * Elimina una empresa por su ID.
 * @param {string} empresaId - El ID de la empresa a eliminar.
 * @returns {Promise<Object|null>} - La empresa eliminada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al eliminar la empresa por su ID.
 */
const eliminarEmpresaPorId = async (empresaId) => {
  try {
    const empresa = await Empresa.findById(empresaId);

    if (!empresa) {
      throw new Error("Empresa no encontrada");
    }

    return await Empresa.findByIdAndDelete(empresaId);
  } catch (error) {
    throw new Error(`Error al eliminar la empresa por ID: ${error.message}`);
  }
};

/**
 * Modifica una empresa por su ID con nuevos datos.
 * @param {string} empresaId - El ID de la empresa a modificar.
 * @param {Object} nuevosDatos - Los nuevos datos para la empresa.
 * @returns {Promise<Object|null>} - La empresa modificada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al modificar la empresa por su ID.
 */
const modificarEmpresaPorId = async (empresaId, nuevosDatos) => {
  try {
    const empresaModificada = await Empresa.findByIdAndUpdate(
      empresaId,
      nuevosDatos,
      { new: true },
    );

    if (!empresaModificada) {
      throw new Error("Empresa no encontrada");
    }

    return empresaModificada;
  } catch (error) {
    throw new Error(`Error al modificar la empresa por ID: ${error.message}`);
  }
};

const actualizarEstadoEmpresa = async (empresaId, nuevoEstado) => {
  try {
    const empresaActualizada = await Empresa.findOneAndUpdate(
      { _id: empresaId },
      { estadoDeRegistro: nuevoEstado },
      { new: true },
    );

    if (!empresaActualizada) {
      throw new Error("Empresa no encontrada");
    }

    if (empresaActualizada.estadoDeRegistro === nuevoEstado) {
      console.log("El estado no ha cambiado. No se realizaron cambios.");
      return empresaActualizada;
    }

    if (
      ["Aprobado", "Rechazado"].includes(empresaActualizada.estadoDeRegistro)
    ) {
      throw new Error(
        `La solicitud de registro ya ha sido procesada, se encuentra en estado: ${empresaActualizada.estadoDeRegistro}`,
      );
    }

    await sendEmail(empresaActualizada);

    const usuarios = await User.find({
      "rol.nombre": "Gerente",
      estadoDeRegistro: "Pendiente",
      empresaUser: empresaActualizada._id,
    })
      .populate("rol")
      .populate("empresaUser");

    console.log("estos son los usurios", usuarios);

    if (usuarios && usuarios.length > 0) {
      const userId = usuarios[0]._id;
      const tenantId = usuarios[0].tenantId;
      const nuevoEstadoUsuario = "Aprobado";
      await cambiarEstadoRegistroUser(userId, nuevoEstadoUsuario, tenantId);
    }

    return empresaActualizada;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontró en la base de datos",
      );
    } else {
      throw error;
    }
  }
};

module.exports = {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  actualizarEmpresaId,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
  actualizarEstadoEmpresa,
};
