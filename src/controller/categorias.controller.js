const {
  obtenerCategorias,
  obtenerCategoriaId,
  guardarCategoria,
  eliminarCategoriaId,
  modificarCategoriaPorId,
} = require("../services/categoria.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");
const categoriasController = {};

/**
 * Obtiene una categoría por su ID y tenantId.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto de respuesta con la categoría encontrada.
 */

categoriasController.obtenerCategoriaId = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const tenantId = req.tenantId;
    const verCategoria = await obtenerCategoriaId(categoriaId, tenantId);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria encontrada exitosamente";
    ResponseStructure.data = verCategoria;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error("Error al obtener la categoria:", error);

    ResponseStructure.status = 404;
    ResponseStructure.message = "Error al obtener categoria";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

/**
 * Obtiene todas las categorías para un inquilino específico.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto de respuesta con la lista de categorías.
 */

categoriasController.obtenerCategorias = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const listaCategorias = await obtenerCategorias(tenantId);
    ResponseStructure.message = "Categorias encontradas exitosamente";
    ResponseStructure.data = listaCategorias;
    res.status(200).send(ResponseStructure);
  } catch (error) {

    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener categorias";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

/**
 * Guarda una nueva categoría para un inquilino específico.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto de respuesta con la categoría guardada.
 */

categoriasController.guardarCategoria = async (req, res) => {
  try {
    const newCategoria = {
      ...req.body,
    };
    const tenantId = req.tenantId;
    const categoriaGuardada = await guardarCategoria(newCategoria, tenantId);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria guardada exitosamente";
    ResponseStructure.data = categoriaGuardada;

    res.status(200).send(ResponseStructure);
  } catch (error) {


    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al guardar la categoria";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

/**
 * Elimina una categoría por su ID y tenantId.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto de respuesta con la categoría eliminada.
 */

categoriasController.eliminarCategoriaId = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const tenantId = req.tenantId;

    const categoriaEliminada = await eliminarCategoriaId(categoriaId, tenantId);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria eliminada exitosamemte";
    ResponseStructure.data = categoriaEliminada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar la categoria";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

/**
 * Modifica una categoría por su ID, tenantId y nuevos datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} - Objeto de respuesta con la categoría modificada.
 */

categoriasController.modificarCategoriaPorId = async (req, res) => {

  try {
    const nuevosDatos = req.body;
    const categoriaId = req.params.id;
    const tenantId = req.tenantId;

    const categoriaModificada = await modificarCategoriaPorId(
      categoriaId,
      nuevosDatos,
      tenantId
    );
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria modificada exitosamemte";
    ResponseStructure.data = categoriaModificada;

    res.status(200).send(ResponseStructure);
  } catch (error) {

    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar la categoria";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = categoriasController;
