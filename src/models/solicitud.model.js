const { Schema, model } = require("mongoose");

const solicitudSchema = new Schema({
  solicitudId: {
    type: Number,
    required: true,
    autoIncrement: true,
  },

  tenantId: {
    type: String,
    required: true,
  },

  tercero: {
    type: Schema.Types.ObjectId,
    ref: "Tercero",
    required: [true, "El tercero es requerido"],
  },

  fecha: {
    type: Date,
    required: [true, "La fecha es requerida"],
    validate: {
      validator: (value) => {
        // return typeof value === "Date";
        return value instanceof Date;
      },
      message: "La fecha debe ser una cadena de tipo Date",
    },
  },
  detalle: {
    type: String,
    required: [true, "El detalle es requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "string";
      },
      message: "El detalle debe ser una cadena de texto",
    },
    minlength: [10, "El detalle debe tener al menos 10 caracteres"],
    maxlength: [200, "El detalle no debe tener más de 200 caracteres"],
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "categoria",
    required: [true, "La categoría es requerida"],
  },
  valor: {
    type: Number,
    required: [true, "El valor es requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "number";
      },
      message: "El valor debe ser un valor numerico",
    },
    min: [1000, "El precio debe ser superior a mil pesos"],
    max: [100000, "El precio debe ser inferior a cien mil pesos"],
  },
  estado: {
    type: Schema.Types.ObjectId,
    ref: "estadoSolicitud",
    // required: [true, "El estado de la solicitud es requerido"],
    default: "65d6a34bc04706dd1cdafd6c",
  },
  facturaUrl: {
    type: String,
  },
  userRole: {
    type: String,
    required: true,
  },
  userDocument: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = model("Solicitud", solicitudSchema, "solicitudes");
