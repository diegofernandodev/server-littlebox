const mongoose = require("mongoose");

const SaldoInicialSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  saldoInicial: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("SaldoInicial", SaldoInicialSchema, "saldosIniciales");
