const { Schema, model } = require("mongoose");

const ingresoSchema = new Schema({
  ingresoId: {
    type: Number,
    required: true,
    autoIncrement: true,
  },

  // solicitudId: {
  //   type: Number,
  //   required: false,
  //   // autoIncrement: true,
  // },

  tenantId: {
    type: String,
    required: true,
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
  
  valor: {
    type: Number,
    required: [true, "El valor es requerido"],
    validate: {
      validator: (value) => {
        return typeof value === "number";
      },
      message: "El valor debe ser un valor numerico",
    },
    // min: [1000, "El precio debe ser superior a mil pesos"],
    // max: [100000, "El precio debe ser inferior a cien mil pesos"],
  },
  
  tipo: {
    type: String,
    enum: ['Ingreso'], // Solo permitir valores 'Ingreso' para este campo
    default: 'Ingreso', // Valor por defecto es 'Ingreso'
  },
  
  // aprobadoPor: { 
  //   type: Schema.Types.ObjectId,
  //   ref: 'User', 
  //   required: [true, 'Nombre de usuario es requerido'],
  // },
});


module.exports = model("Ingreso", ingresoSchema, "ingresos");
