const Ingreso = require("../models/ingreso.model");
const Egreso = require("../models/egresos.Model");
const { obtenerSaldoInicial } = require('../services/ingreso.service');
const { notificationSaldoCaja } = require('../services/notificationService');


async function actualizarSaldoCaja(tenantId) {
  try {
    // Obtener total de ingresos
    const totalIngresos = await Ingreso.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);

    // Obtener total de egresos
    const totalEgresos = await Egreso.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);  

    // Calcular saldo de caja
    const saldoCaja = (totalIngresos.length > 0 ? totalIngresos[0].total : 0) - (totalEgresos.length > 0 ? totalEgresos[0].total : 0);

    return saldoCaja;
  } catch (error) {
    throw error;
  }
}



async function verificarSaldoCaja(tenantId) {
  try {
      // Obtener saldo inicial de la caja
      const saldoInicial = await obtenerSaldoInicial(tenantId);
      // console.log('Saldo inicial:', saldoInicial);
      
      // Calcular el 10% del saldo inicial
      const porcentajeSaldoInicial = saldoInicial * 0.1;
      // console.log('10% del saldo inicial:', porcentajeSaldoInicial);

      // Obtener el saldo actual de la caja
      const saldoActual = await actualizarSaldoCaja(tenantId);
      // console.log('Saldo actual:', saldoActual);

      // Verificar si el saldo actual es igual al 10% del saldo inicial
      if (saldoActual <= porcentajeSaldoInicial) {
          // console.log('El saldo actual es menor o igual al 10% del saldo inicial.');
          // Enviar notificación al rol correspondiente
          await notificationSaldoCaja(tenantId, '!Alerta!, Por favor, Ingresar saldo a Caja.');
      } else {
          // console.log('El saldo actual es mayor que el 10% del saldo inicial.');
      }
  } catch (error) {
      console.error('Error al verificar el saldo de caja:', error);
      throw error;
  }
}


module.exports = {
    actualizarSaldoCaja,
    verificarSaldoCaja
}