const Ingreso = require("../models/ingreso.model");
const counterService = require("./counter.service");
const Usuario = require("../models/user.model");
const { ResponseStructure } = require("../helpers/ResponseStructure");

async function obtenerIngresos({ tenantId, fechaInicio, fechaFin } = {}) {
  try {
    // Convertir las fechas a tipo Date
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);

    // Validar las fechas
    if (!fechaInicio || !fechaFin || isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new Error("Las fechas proporcionadas no son válidas");
    }

    // Construir el filtro correctamente
    const filtro = {
      tenantId,
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
    };

    // Verificar que el tenantId coincide con el tenantId de los ingresos
    const ingresosExisten = await Ingreso.exists({ tenantId });

    if (!ingresosExisten) {
      throw new Error("TenantId proporcionado no es válido o no se encuentra en la base de datos");
    }

    // Obtener la lista de ingresos
    const ingresos = await Ingreso.find(filtro);

    const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.valor, 0);
    

    // Devolver la estructura de respuesta
    const ResponseStructureService = {
      status: 200,
      message: "Los ingresos fueron encontrados exitosamente",
      data: ingresos,
      totalIngresos
    };

    if (!ingresos.length) {
      ResponseStructureService.status = 404;
      ResponseStructureService.message = "No se encontraron ingresos con los parámetros seleccionados";
    }

    return ResponseStructureService;
  } catch (error) {
    throw error; // Propagar el error para que sea manejado en el controlador
  }
}


const obtenerIngresoPorId = async (ingresoId, tenantId) => {

  try {

    // Verificar que el tenantId coincide con el tenantId del ingreso
    const ingresoExistente = await Ingreso.findOne({ _id: ingresoId, tenantId });

    if (!ingresoExistente) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }
    const ingreso = await Ingreso.findById({ _id: ingresoId, tenantId })
      
    return ingreso;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }


};

const guardarIngreso = async (ingreso, tenantId) => {
  // Asignar el egresoId y el tenantId al ingreso
  ingreso.tenantId = tenantId;
  ingreso.ingresoId = 0;

  // // Validar que el objeto egreso tenga la estructura correcta y campos requeridos
  // if (!ingreso || !ingreso.detalle || !ingreso.valor) {
  //   throw new Error("El objeto egreso no es valido o no contiene campos requeridos");
  // }
console.log("ingreso recibido del controlador",ingreso);
  // Crear nuevo ingreso
  const nuevoIngreso = new Ingreso(ingreso);

  // Guardar el ingreso
  const ingresoGuardado = await nuevoIngreso.save();

  return ingresoGuardado;
};

const actualizarIngresoId = async (tenantId, idIngresoActual, tipoDoc) => {
  // Incrementar la secuencia
  const ingresoId = await counterService.incrementarSecuencia(tenantId, tipoDoc);
  const filter = { _id: idIngresoActual };
  const dates = { ingresoId: ingresoId, tipoDoc };
  await Ingreso.findOneAndUpdate(filter, dates);
  return ingresoId;
};

const eliminarIngresoPorId = async (ingresoId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId del ingreso
    const ingresoExistente = await Ingreso.findOne({ _id: ingresoId, tenantId });

    if (!ingresoExistente) {
      throw new Error("TenantId proporcionado no coincide con ningun Ingreso en la base de datos");
    }

    const ingresoEliminado = await Ingreso.findOneAndDelete({ _id: ingresoId, tenantId });
    return ingresoEliminado;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};


const modificarIngresoPorId = async (ingresoId, nuevosDatos, tenantId) => {

  try {
    // Verificar que el _id del ingreso y el tenantId coincidan
    const ingresoExistente = await Ingreso.findOne({ _id: ingresoId, tenantId });

    if (!ingresoExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id del Ingreso a modificar");
    }
    const ingresoModificado = await Ingreso.findOneAndUpdate(
      { _id: ingresoId, tenantId },
      nuevosDatos,
      { new: true }
    );

    // Si no se encuentra el ingreso, lanzar un error
    if (!ingresoModificado) {
      throw new Error("ingreso no encontrado");
    }

    return ingresoModificado;

  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

const obtenerSaldoInicial = async (tenantId) => {
  try {
    // Obtener el primer ingreso de caja para la empresa
    const primerIngreso = await Ingreso.findOne({ tenantId }).sort({ fecha: 1 });
    return primerIngreso ? primerIngreso.valor : 0;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

module.exports = {
  obtenerIngresos,
  obtenerIngresoPorId,
  guardarIngreso,
  eliminarIngresoPorId,
  modificarIngresoPorId,
  actualizarIngresoId,
  obtenerSaldoInicial,
};
