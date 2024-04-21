const { Error } = require("mongoose");
const Categoria = require("../models/categoria.model");
const EmpresaModel = require("../models/empresas.Model")

const getCategoriasPredeterminadas=async()=>{
  const categorias = await Categoria.find({
    global: true,
  });

  return categorias;
}

/**
 * Obtiene todas las categorías, incluyendo las predeterminadas globales y las específicas del inquilino.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Array>} - Un array que contiene todas las categorías.
 * @throws {Error} - Si hay algún error durante el proceso.
 */
const obtenerCategorias = async (tenantId) => {
  
  const categoriasTenant = await Categoria.find({ tenantId })
  

  const categoriasPredeterminadas = await getCategoriasPredeterminadas();

  categoriasPredeterminadas.push(...categoriasTenant);

  return categoriasPredeterminadas;
};

/**
 * Obtiene una categoría por su ID y tenantId.
 * @param {string} categoriaId - Identificador único de la categoría.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - La categoría encontrada.
 * @throws {Error} - Si hay algún error durante el proceso.
 */

const obtenerCategoriaId = async (categoriaId,tenantId) => {
  try {
    const categoriaExistente = await Categoria.findOne({ _id: categoriaId, tenantId });

    if (!categoriaExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id de la categoria solicitada");
    }

    const categoria = await Categoria.findById({ _id: categoriaId, tenantId })
    return categoria;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

/**
 * Guarda una nueva categoría para un inquilino específico.
 * @param {Object} categoria - Objeto que representa la nueva categoría.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - La categoría guardada.
 * @throws {Error} - Si hay algún error durante el proceso.
 */

const guardarCategoria = async (categoria, tenantId) => {
  // Agrega el campo tenantId al objeto de la categoría antes de guardar
  categoria.tenantId = tenantId;

   // Validar que el objeto egreso tenga la estructura correcta y campos requeridos
   if (!categoria || !categoria.nombre) {
    throw new Error("El objeto categoria no es valido o no contiene campos requeridos");
  }

  // Crear nueva categoria
  const nuevaCategoria = new Categoria(categoria);
  // Guardar la categoria
  const categoriaGuardada = await nuevaCategoria.save();

  return categoriaGuardada;
};

/**
 * Elimina una categoría por su ID y tenantId.
 * @param {string} categoriaId - Identificador único de la categoría.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - La categoría eliminada.
 * @throws {Error} - Si hay algún error durante el proceso.
 */

const eliminarCategoriaId = async (categoriaId, tenantId) => {
    
  try {
      // Verificar que el tenantId coincide con el tenantId de la categoria
    const categoriaExistente = await Categoria.findOne({ _id: categoriaId, tenantId });

    if (!categoriaExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id de la categoria a eliminar");
    }

    const categoriaEliminada = await Categoria.findOneAndDelete({
      _id: categoriaId,
      tenantId,
    });

    return categoriaEliminada;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
  
};

/**
 * Modifica una categoría por su ID, tenantId y nuevos datos.
 * @param {string} categoriaId - Identificador único de la categoría.
 * @param {Object} nuevosDatos - Nuevos datos para actualizar la categoría.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<Object>} - La categoría modificada.
 * @throws {Error} - Si hay algún error durante el proceso.
 */

const modificarCategoriaPorId = async (categoriaId, nuevosDatos, tenantId) => {
  
try {
   // Verificar que el _id de la categoría y el tenantId coincidan
   const categoriaExistente = await Categoria.findOne({ _id: categoriaId, tenantId });

   if (!categoriaExistente) {
     throw new Error("TenantId proporcionado no existe o no coincide con _id de la categoria a modificar");
   }
 
   const categoriaModificada =  await Categoria.findOneAndUpdate(
     { _id: categoriaId, tenantId },
     nuevosDatos,
     { new: true }
   );
 
    // Si no se encuentra la categoría, lanzar un error
    if (!categoriaModificada) {
     throw new Error("Categoria no encontrada");
   }
 
   return categoriaModificada;
} catch (error) {
  if (error.name === 'CastError' && error.path === '_id') {
    throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
  } else {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
}

 
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriaId,
  guardarCategoria,
  eliminarCategoriaId,
  modificarCategoriaPorId,
};
