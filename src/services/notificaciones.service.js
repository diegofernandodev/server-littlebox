// const admin = require("firebase-admin");

// // Inicializar la app de Firebase
// const serviceAccount = require("./ruta/al/archivo-de-credenciales.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // Otras configuraciones de Firebase, si es necesario
// });

// const enviarNotificacionPush = async (token, titulo, cuerpo) => {
//   try {
//     const message = {
//       token,
//       notification: {
//         title: titulo,
//         body: cuerpo,
//       },
//     };
//     // Enviar la notificación push
//     const respuesta = await admin.messaging().send(message);
//     console.log("Notificación push enviada correctamente:", respuesta);
//     return respuesta;
//   } catch (error) {
//     console.error("Error al enviar la notificación push:", error);
//     throw new Error("Error al enviar la notificación push");
//   }
// };

// module.exports = { enviarNotificacionPush };
