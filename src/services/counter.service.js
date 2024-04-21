const Counter = require("../models/counter.model");

/**
 * Incrementa la secuencia para un inquilino (tenant) específico.
 * @param {string} tenantId - Identificador único del inquilino.
 * @returns {Promise<number>} - La secuencia incrementada.
 * @throws {Error} - Si hay algún error durante el proceso.
 */
const incrementarSecuencia = async (tenantId,tipoDoc) => {
  try {
    console.log("Intentando incrementar la secuencia...");

    // Encuentra y actualiza el contador correspondiente al inquilino
    const counter = await Counter.findOneAndUpdate(
      { tenantId, tipoDoc },
      // { tipoDoc },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Agregamos 'upsert' para crear el documento si no existe
    );

    console.log("Secuencia incrementada exitosamente:", counter.seq);
    
    // Devuelve la secuencia incrementada (o 1 si el contador no existía)
    return counter ? counter.seq : 1;
  } catch (error) {
    console.error("Error al incrementar la secuencia:", error);
    throw new Error("Error al incrementar la secuencia: " + error.message);
  }
};

module.exports = {
  incrementarSecuencia,
};