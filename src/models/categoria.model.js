const { Schema, model } = require("mongoose");

const categoriaSchema = new Schema({
  tenantId: {
    type: String,
    // required: true,
  },
  nombre: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxlength: [50, "El nombre no debe exceder los 50 caracteres"],
    validator: (value) => {
      return typeof value === "string";
    },
    message: "El nombre de la categoria debe ser una cadena de texto",
  },

  global: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("categoria", categoriaSchema, "categoriaEgresos");
