const { Schema, model } = require("mongoose");

const terceroSchema = new Schema({
  nombreTercero: {
    type: String,
    required: [true, "Nombre del tercero es requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El nombre del tercero debe ser una cadena de texto",
    },
  },
  documentoTercero: {
    type: String,
    required: [true, "Numero de documento requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "EL numero de documento debe ser una cadena de texto",
    },
  },
  direccionTercero: {
    type: String,
    required: [true, "Direccion requerida"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "La direccion debe ser una cadena de texto",
    },
  },
  telefonoTercero: {
    type: String,
    required: [true, "Telefono requerida"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El telefono debe ser una cadena de texto",
    },
  },
  emailTercero: {
    type: String,
    required: [false],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El email debe ser una cadena de texto",
    },
  },
  tenantId: {
    type: String,
    required: true,
  },
});

module.exports = model("tercero", terceroSchema, "terceros");
