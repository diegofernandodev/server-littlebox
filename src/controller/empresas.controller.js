const {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  actualizarEmpresaId,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
  actualizarEstadoEmpresa,
} = require("../services/empresas.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const empresasController = {};

/**
 * Obtiene una empresa por su ID.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
empresasController.obtenerEmpresaPorId = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresa = await obtenerEmpresaPorId(empresaId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa encontrada exitosamente";
    ResponseStructure.data = empresa;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 404;
    ResponseStructure.message = "Empresa no encontrada";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

/**
 * Obtiene todas las empresas.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
empresasController.obtenerEmpresas = async (req, res) => {
  try {
    // Obtener el estado de registro de la solicitud (si está presente)
    const estado = req.query.estadoDeRegistro;

    // Obtener la lista de empresas según el estado de registro
    const listaEmpresas = await obtenerEmpresas(estado);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresas encontradas exitosamente";
    ResponseStructure.data = listaEmpresas;
    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener empresas";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

/**
 * Guarda una nueva empresa.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
empresasController.guardarEmpresa = async (req, res) => {
  try {
    const { empresa, usuarioPrincipal } = req.body; // Suponiendo que los datos del formulario se envían en el cuerpo de la solicitud

    const empresaGuardada = await guardarEmpresa(empresa, usuarioPrincipal);
    // const idCurrent = empresaGuardada._id;

    // const empresaId = await actualizarEmpresaId(idCurrent);
    // empresaGuardada.empresaId = empresaId;
    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa guardada exitosamente";
    ResponseStructure.data = empresaGuardada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar la empresa";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};

/**
 * Elimina una empresa por su ID.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
empresasController.eliminarEmpresaPorId = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresaEliminada = await eliminarEmpresaPorId(empresaId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa eliminada exitosamente";
    ResponseStructure.data = empresaEliminada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar empresa";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

/**
 * Modifica una empresa por su ID con nuevos datos.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
empresasController.modificarEmpresaPorId = async (req, res) => {
  try {
    const nuevosDatos = req.body;
    const empresaId = req.params.id;

    const empresaModificada = await modificarEmpresaPorId(
      empresaId,
      nuevosDatos,
    );

    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa modificada exitosamente";
    ResponseStructure.data = empresaModificada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar la empresa";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

empresasController.actualizarEstadoEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const nuevoEstado = req.body.nuevoEstado; // Puedes enviar el nuevo estado desde el cuerpo de la solicitud

    const nuevoEstadoEmpresa = await actualizarEstadoEmpresa(
      empresaId,
      nuevoEstado,
    );

    ResponseStructure.status = 200;
    ResponseStructure.message =
      "Estado registro de empresa modificado exitosamemte";
    ResponseStructure.data = nuevoEstadoEmpresa;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 400;
    ResponseStructure.message =
      "Error al modificar estado  registro de empresa";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = empresasController;
