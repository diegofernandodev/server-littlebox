const { Schema, model } = require("mongoose");

const rolSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = model("rol", rolSchema, "rolesDeUsuario");
