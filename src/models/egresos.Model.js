const { Schema, model } = require("mongoose");

const egresoSchema = new Schema({
  egresoId: {
    type: Number,
    required: true,
    autoIncrement: true,
  },

  solicitudId: {
    type: Number,
    required: false,
    default: 0,
    // autoIncrement: true,
  },

  tenantId: {
    type: String,
    required: true,
  },

  tercero: {
    type: Schema.Types.ObjectId,
    ref: 'Tercero', 
    required: [true, 'El tercero es requerido'],
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
  factura: { 
    type: String 
  },

  tipo: {
    type: String,
    enum: ['Egreso'], // Solo permitir valores 'Egreso' para este campo
    default: 'Egreso', // Valor por defecto es 'Egreso'
  },
});


module.exports = model("Egreso", egresoSchema, "egresos");
