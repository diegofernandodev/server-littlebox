const {
  obtenerIngresos,
  obtenerSaldoInicial,
} = require("../services/ingreso.service");
const { obtenerEgresos } = require("../services/egresos.service");
const {
  enviarNotificacionPush,
} = require("../services/notificaciones.service");

const Categoria = require('../models/categoria.model'); // Importa el modelo de categoría
const Tercero = require('../models/terceros.Model'); // Importa el modelo de tercero
const Egreso = require('../models/egresos.Model.js')


// Función para obtener el nombre de una categoría a partir de su ObjectId
const obtenerNombreCategoria = async (categoriaId) => {
  const categoria = await Categoria.findById(categoriaId);
  return categoria ? categoria.nombre : null;
};

// Función para obtener el nombre de un tercero a partir de su ObjectId
const obtenerNombreTercero = async (terceroId) => {
  const tercero = await Tercero.findById(terceroId);
  return tercero ? tercero.nombreTercero : null;
};


const obtenerMovimientos = async (
  tenantId,
  fechaInicio,
  fechaFin,
  categoria,
  tercero,
) => {
  try {
    const ingresos = await obtenerIngresos({ tenantId, fechaInicio, fechaFin });
    const egresos = await obtenerEgresos({
      tenantId,
      fechaInicio,
      fechaFin,
      categoria,
      tercero,
    });
    return { ingresos, egresos };
  } catch (error) {
    throw error;
  }
};

const calcularSaldoFinal = (
  saldoInicial,
  totalDebitos,
  totalCreditos,
  movimientos,
) => {
  let saldo = saldoInicial;
  let isFirstMovement = true;

  return movimientos.map((movimiento) => {
    if (isFirstMovement && movimiento.tipo === "Ingreso") {
      movimiento.saldo = movimiento.valor;
      isFirstMovement = false;
    } else {
      saldo +=
        movimiento.tipo === "Ingreso" ? movimiento.valor : -movimiento.valor;
      movimiento.saldo = saldo;
    }
    return movimiento;
  });
};

const movimientoDeCajaMenor = async (
  tenantId,
  fechaInicio,
  fechaFin,
  categoria,
  tercero,
) => {
  try {
    const saldoInicial = await obtenerSaldoInicial(tenantId);
    console.log("Este es el saldo inical: ", saldoInicial);
    const { ingresos, egresos } = await obtenerMovimientos(
      tenantId,
      fechaInicio,
      fechaFin,
      categoria,
      tercero,
    );

    // Combinar ingresos y egresos en una sola lista
    const listaMovimientos = [...ingresos.data, ...egresos.data].sort(
      (a, b) => a.fecha - b.fecha,
    );

    // Calcular débitos y créditos
    const totalDebitos = ingresos.totalIngresos;
    const totalCreditos = egresos.totalEgresos;

    // Calcular el saldo final para cada movimiento
    const movimientosConSaldo = calcularSaldoFinal(
      saldoInicial,
      totalDebitos,
      totalCreditos,
      listaMovimientos,
    );

    // Obtener el saldo final
    const saldoFinal =
      movimientosConSaldo[movimientosConSaldo.length - 1].saldo;

    // Verificar si el saldo final es igual a 50.000 y enviar notificación push si es así
    if (saldoFinal === 50000) {
      await enviarNotificacionPush("¡Alerta! El saldo de la caja es de 50.000");
    }

    // Formatear la lista de movimientos
    const listaMovimientosFormateada = await Promise.all(
      movimientosConSaldo.map(async (movimiento) => {
        const categoriaNombre = await obtenerNombreCategoria(movimiento.categoria);
        const terceroNombre = await obtenerNombreTercero(movimiento.tercero);
        return {
          fecha: movimiento.fecha.toLocaleDateString(),
          numeroDocumento:
            movimiento.tipo === "Ingreso"
              ? movimiento.ingresoId 
              : movimiento.egresoId,
          valor: movimiento.valor.toLocaleString(),
          tipoMovimiento: movimiento.tipo === "Ingreso" ? "Ingreso" : "Egreso",
          detalle: movimiento.detalle,
          saldo: movimiento.saldo,
          categoria: categoriaNombre,
          tercero: terceroNombre,
        };
      }) 
    ); 

    // Devolver el objeto con la información del informe
    return {
      listaMovimientos: listaMovimientosFormateada,
      totalDebitos: totalDebitos.toLocaleString(),
      totalCreditos: totalCreditos.toLocaleString(),
      saldoFinal: saldoFinal,
    };
  } catch (error) {
    throw new Error("Error al obtener el movimiento de caja");
  }
};



const obtenerGastoRealMesActual = async (tenantId) => {
  try {
    // Obtener la fecha actual
    const fechaActual = new Date();

    // Calcular el primer día del mes actual
    const primerDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    // Calcular el primer día del próximo mes
    const primerDiaProximoMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1);

    // Obtener egresos dentro del mes actual
    const egresosMesActual = await Egreso.find({
      tenantId: tenantId,
      fecha: { $gte: primerDiaMesActual, $lt: primerDiaProximoMes }
    });

    return egresosMesActual;
  } catch (error) {
    throw error;
  }
};



const obtenerTercerosMasUtilizados = async (tenantId) => {
  try {
    // Obtener la fecha actual y del mes anterior
    const fechaActual = new Date();
    const primerDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const primerDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);

    const tercerosMasUtilizados = await Egreso.aggregate([
      { 
        $match: { 
          tenantId: tenantId,
          fecha: { 
            $gte: primerDiaMesAnterior, // Desde el primer día del mes anterior
            $lt: primerDiaMesActual // Hasta el primer día del mes actual
          } 
        } 
      },
      { $group: { _id: "$tercero", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Obtener los nombres de los terceros más utilizados
    const tercerosNombres = await Promise.all(tercerosMasUtilizados.map(async (tercero) => {
      const terceroNombre = await obtenerNombreTercero(tercero._id);
      return {
        terceroId: tercero._id,
        terceroNombre: terceroNombre,
        count: tercero.count
      };
    }));

    return tercerosNombres;
  } catch (error) {
    throw new Error("Error al obtener los terceros más utilizados en los egresos");
  }
};


const obtenerCategoriaMasUtilizadas = async (tenantId) => {
  try {
    // Obtener la fecha actual y del mes anterior
    const fechaActual = new Date();
    const primerDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const primerDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);

    const CategoriaMasUtilizadas = await Egreso.aggregate([
      { 
        $match: { 
          tenantId: tenantId,
          fecha: { 
            $gte: primerDiaMesAnterior, // Desde el primer día del mes anterior
            $lt: primerDiaMesActual // Hasta el primer día del mes actual
          } 
        } 
      },
      { $group: { _id: "$categoria", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Obtener los nombres de los terceros más utilizados
    const categoriaNombres = await Promise.all(CategoriaMasUtilizadas.map(async (categoria) => {
      const categoriaNombre = await obtenerNombreCategoria(categoria._id);
      return {
        categoriaId: categoria._id,
        categoriaNombre: categoriaNombre,
        count: categoria.count
      };
    }));

    return categoriaNombres;
  } catch (error) {
    throw new Error("Error al obtener las categorias más utilizadas en los egresos");
  }
};




module.exports = { movimientoDeCajaMenor, obtenerGastoRealMesActual, obtenerTercerosMasUtilizados, obtenerCategoriaMasUtilizadas };
