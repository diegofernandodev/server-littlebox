const { Schema, model } = require("mongoose");

const estadoSolicitudchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  });

module.exports = model("estadoSolicitud", estadoSolicitudchema,"estadosSolicitudes");
