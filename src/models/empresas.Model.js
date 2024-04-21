const { model, Schema } = require("mongoose");
const userController = require("../controller/user.controller");

const empresaSchema = new Schema({
  // El tenantId hace referencia al Nit de la empresa
  tenantId: {
    type: String,
    required: [true, "Numero de documento requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "EL numero de documento debe ser una cadena de texto",
    },
  },
  nombreEmpresa: {
    type: String,
    required: [true, "Nombre de la empresa es requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El nombre de la empresa debe ser una cadena de texto",
    },
  },

  direccionEmpresa: {
    type: String,
    required: [true, "Direccion requerida"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "La direccion debe ser una cadena de texto",
    },
  },
  telefonoEmpresa: {
    type: String,
    required: [true, "Telefono requerida"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El telefono debe ser una cadena de texto",
    },
  },
  emailEmpresa: {
    type: String,
    required: [true],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El email debe ser una cadena de texto",
    },
  },
  estadoDeRegistro: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente",
  },
  // saldoInicialCaja: {
  //   type: Schema.Types.ObjectId,
  //   ref: "SaldoInicial",
  // },
  saldoAutorizado: {
    type: Number,
    default: 0, // Valor inicial del saldo autorizado
  },
  type: {
    type: String,
    enum: ["company"],
    default: "company",
  },
});

module.exports = model("Empresa", empresaSchema, "empresas");
