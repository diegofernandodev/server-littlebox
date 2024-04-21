const Solicitud = require("../models/solicitud.model");
const categoriaModel = require("../models/categoria.model");
const terceroModel = require("../models/terceros.Model");
const counterService = require("../services/counter.service");
const estadoSolicitudModel = require("../models/estadosSolicitud.model");
const Egreso = require("../models/egresos.Model");
const {
  guardarEgreso,
  actualizarEgresoId,
} = require("../services/egresos.service");
const {createNotificationForAdminSoli, createNotificationForColaborador, sendNotificationToAdminUpdateSol} = require('../services/notificationService')
const {verificarSaldoCaja, actualizarSaldoCaja }= require('../services/saldoDeCaja.Service')


const obtenerSolicitudes = async (fechaInicio, fechaFin, tenantId, usuarioId = null, usuarioRol = null, documento = null) => {
  try {

     // Convertir las fechas a tipo Date si están presentes
     if (!fechaInicio || !fechaFin) {
      throw new Error("Las fechas de inicio y fin son obligatorias para filtrar las solicitudes.");
    }

    // Convertir las fechas a tipo Date
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);

    // Validar las fechas
    if (!fechaInicio || !fechaFin || isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      throw new Error("Las fechas proporcionadas no son válidas");
    }

    let query = { tenantId, fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }, };

    // Si el usuario es colaborador, filtramos por su ID
    if (usuarioRol === 'Colaborador') {
      query.userId = usuarioId;
    }

    // Si se proporciona un documento, se agrega a la consulta
    if (documento) {
      query.userDocument = documento;
    }

    // Verificar que el tenantId coincide con el tenantId de las solicitudes
    const solicitudesExisten = await Solicitud.exists({ tenantId });

    if (!solicitudesExisten) {
      throw new Error(
        "TenantId proporcionado no es válido o no se encuentra en la base de datos",
      );
    }
    console.log("esta es la query", query);
    // Obtener la lista de solicitudes
    const solicitudes = await Solicitud.find(query)
      .populate({
        path: "categoria",
        model: categoriaModel,
      })
      .populate({
        path: "tercero",
        model: terceroModel,
      })
      .populate({
        path: "estado",
        model: estadoSolicitudModel,
      });

    return solicitudes;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};

const obtenerSolicitudesPorId = async (solicitudId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId de la solicitud
    const solicitudExistente = await Solicitud.findOne({
      _id: solicitudId,
      tenantId,
    });

    if (!solicitudExistente) {
      throw new Error(
        "TenantId proporcionado no es valido o no se encuentra en la base de datos",
      );
    }
    const solicitud = await Solicitud.findById({ _id: solicitudId, tenantId })
      .populate({
        path: "categoria",
        model: categoriaModel,
      })
      .populate({
        path: "tercero",
        model: terceroModel,
      })
      .populate({
        path: "estado",
        model: estadoSolicitudModel,
      });
    return solicitud;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontro en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

const guardarSolicitud = async (solicitud, tenantId, pdfFile) => {

  if (pdfFile) {
    // Si se proporciona un archivo adjunto, asigna la ruta del archivo al campo pdfRunt
    solicitud.facturaUrl = pdfFile.path;
  }

  

  console.log("esta es la solicitud para guardar..",solicitud);
  // console.log("esta es la ruta del archivo para guardar..",rutaArchivo);
  // Asignar el solicitudId y el tenantId a la solicitud
  solicitud.tenantId = tenantId;
  solicitud.solicitudId = 0;
  // solicitud.userRole = req.rol.nombre;
  // solicitud.userDocument = req.identification;

  console.log("rol: ", solicitud.userRole, " documento: ", solicitud.userDocument);
// console.log("file factura: ", rutaArchivo);
  // // Validar que el objeto solicitud tenga la estructura correcta y campos requeridos
  // if (!solicitud || !solicitud.detalle || !solicitud.valor) {
  //   throw new Error(
  //     "El objeto solicitud no es valido o no contiene campos requeridos",
  //   );
  // }

  // Agregar la URL de la factura a los  datos (si se adjuntó)
  // if (rutaArchivo) {
  //   solicitud.facturaUrl = rutaArchivo;
  //   console.log("url de la factura", rutaArchivo);
  // }

  // Crear nueva solicitud
  const nuevaSolicitud = new Solicitud(solicitud);

  // Guardar la solicitud
  const solicitudGuardada = await nuevaSolicitud.save();

  await createNotificationForAdminSoli(tenantId, 'Nueva solicitud de gasto');

  return solicitudGuardada;
  
};

const actualizarSolicitudId = async (tenantId, idSolicitudActual, tipoDoc) => {
  // Incrementar la secuencia
  const solicitudId = await counterService.incrementarSecuencia(
    tenantId,
    tipoDoc,
  );
  const filter = { _id: idSolicitudActual };
  const dates = { solicitudId: solicitudId, tipoDoc };
  await Solicitud.findOneAndUpdate(filter, dates);
  return solicitudId;
};

const eliminarSolicitudPorId = async (solicitudId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId de la solicitud
    const solicitudExistente = await Solicitud.findOne({
      _id: solicitudId,
      tenantId,
    });
    console.log("solicitud existente", solicitudExistente);
    if (!solicitudExistente) {
      throw new Error(
        "TenantId proporcionado no coincide con ninguna Solicitud en la base de datos",
      );
    }

    const solicitudEliminada = await Solicitud.findOneAndDelete({
      _id: solicitudId,
      tenantId,
    });
    return solicitudEliminada;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontro en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};


const modificarSolicitudPorId = async (
  solicitudId,
  formulario,
  tenantId,
  facturaUrl,
) => {
  try {
    console.log("formulario recibido del controlador: ",formulario);
    // Verificar que el _id de la solicitud y el tenantId coincidan
    const solicitudExistente = await Solicitud.findById(solicitudId).populate({
      path: "estado",
      model: estadoSolicitudModel,
    });

    console.log("solicitudExistente", solicitudExistente);

    if (!solicitudExistente || solicitudExistente.tenantId !== tenantId) {
      throw new Error(
        "TenantId proporcionado no existe o no coincide con _id de la solicitud a modificar",
      );
    }

    console.log("estado de solicitud existente ", solicitudExistente.estado?.nombre);

    // Verificar si la solicitud ya está finalizada o rechazada
    const nombreEstado = solicitudExistente.estado?.nombre;
    if (nombreEstado === "finalizado" || nombreEstado === "rechazado") {
      throw new Error(
        `La solicitud está ${nombreEstado} y no se puede modificar`,
      );
    }
    

    // Construir un nuevo objeto con todas las propiedades que deseas actualizar
    const datosActualizados = {
      solicitudId: formulario.solicitudId,
      tenantId: formulario.tenantId,
      tercero: formulario.tercero,
      fecha: formulario.fecha,
      detalle: formulario.detalle,
      valor: formulario.valor,
      categoria: formulario.categoria,
      estado: formulario.estado,
      facturaUrl: facturaUrl || solicitudExistente.facturaUrl, // Mantener la facturaUrl original si no se proporciona una nueva
    };

    console.log("Datos que se van a actualizar:", datosActualizados);
    // Realizar la actualización
    const solicitudModificada = await Solicitud.findByIdAndUpdate(
      solicitudId,
      { ...datosActualizados },
      { new: true }, // Opciones para devolver el documento actualizado
    ).populate({
      path: "estado",
      model: estadoSolicitudModel,
    });

    console.log("solicitud modificada", solicitudModificada);
    // Si no se encuentra la solicitud, lanzar un error
    if (!solicitudModificada) {
      throw new Error("Solicitud no encontrada");
    }

    //enviar notificacion a admin

     
     // Crear el mensaje de notificación con el nombre del nuevo estado
// Crear el mensaje de notificación con el número de solicitud
const mensajeNotificacion = `Solicitud: ${solicitudModificada.solicitudId}, ha sido actualizada`;

// Enviar notificación a los administradores que deben ser notificados
await sendNotificationToAdminUpdateSol(tenantId, mensajeNotificacion);


    return solicitudModificada;

  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontró en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

 
const cambiarEstadoSolicitud = async (solicitudId, nuevoEstadoId, tenantId) => {
  try {
    // Verificar si el nuevo estado es "aprobado" y si el saldo de caja es suficiente
    if (nuevoEstadoId === '65d6a435c04706dd1cdafd6d') {
      await verificarSaldoCaja(tenantId);

      const saldoActual = await actualizarSaldoCaja(tenantId);

      // Obtener el valor de la solicitud
      const solicitud = await Solicitud.findById(solicitudId);
      const valorSolicitud = solicitud.valor;

      if (saldoActual <= valorSolicitud) {
        throw new Error('No se puede cambiar el estado a "aprobado" debido a saldo insuficiente en caja. Se notificara a su Gerente');
      }
    }

    // Verificar que el _id de la solicitud y el tenantId coincidan
    const solicitudExistente = await Solicitud.findOne({
      _id: solicitudId,
      tenantId,
    }).populate({
      path: "estado",
      model: estadoSolicitudModel,
    });

    // console.log("solicitud existente", solicitudExistente);

    if (!solicitudExistente) {
      throw new Error("Solicitud no encontrada");
    }

    // Obtener el nombre del estado actual
    const nombreEstado = solicitudExistente.estado?.nombre;
    // console.log("nombre del estado", nombreEstado);

    if (nombreEstado === "finalizado") {
      throw new Error("La solicitud ya ha sido procesada, no se puede cambiar el estado finalizado");
    }

    // Actualizar estado de la solicitud
    solicitudExistente.estado = nuevoEstadoId;

    const solicitudActualizada = await solicitudExistente.save();

    // console.log(
    //   "este es el nuevo id del estado de la solicitud ",
    //   solicitudActualizada.estado._id,
    //   "este es el nuevoEstadoId pasado como parametro: ",
    //   nuevoEstadoId,
    // );

    // Verificar si el nuevo estado es "finalizado"
    if (nuevoEstadoId === solicitudActualizada.estado._id) {
      // Crear egreso de caja utilizando los datos de la solicitud
      const egreso = new Egreso({
        tenantId: solicitudActualizada.tenantId,
        solicitudId: solicitudActualizada.solicitudId,
        tercero: solicitudActualizada.tercero,
        fecha: solicitudActualizada.fecha,
        detalle: solicitudActualizada.detalle,
        categoria: solicitudActualizada.categoria,
        valor: solicitudActualizada.valor,
        factura: solicitudActualizada.facturaUrl,
        // Otros campos necesarios para el egreso de caja...
      });

      // console.log(
      //   "egreso creado de solicitud:",
      //   egreso,
      //   "tenantId de la solicitud:",
      //   solicitudActualizada.tenantId,
      // );

      try {
        // Guardar el egreso de caja
        const egresoGuardado = await guardarEgreso(
          egreso,
          solicitudActualizada.tenantId,
        );
        const idCurrent = egresoGuardado._id;
        const tipoDoc = "egreso";

        const egresoId = await actualizarEgresoId(
          solicitudActualizada.tenantId,
          idCurrent,
          tipoDoc,
        );
        egresoGuardado.egresoId = egresoId;

        // console.log("egreso guardado:", egresoGuardado);

        // Obtener el nombre del nuevo estado
        const nuevoEstado = await estadoSolicitudModel.findById(nuevoEstadoId);
        const nombreNuevoEstado = nuevoEstado ? nuevoEstado.nombre : "Desconocido";

        // Crear el mensaje de notificación con el nombre del nuevo estado
        const mensajeNotificacion = `El estado de la solicitud: ${solicitudActualizada.solicitudId}, ha cambiado a: ${nombreNuevoEstado}`;

        // Enviar notificación a los colaboradores que crearon la solicitud
        await createNotificationForColaborador(tenantId, mensajeNotificacion);

        // Continuar con la lógica, si es necesario
      } catch (error) {
        console.error("Error al guardar el egreso:", error);
        // Manejar el error, si es necesario
      }
    }

    return solicitudActualizada;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontró en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};



module.exports = {
  obtenerSolicitudes,
  obtenerSolicitudesPorId,
  guardarSolicitud,
  actualizarSolicitudId,
  eliminarSolicitudPorId,
  modificarSolicitudPorId,
  cambiarEstadoSolicitud,
};
