// const { enviarNotificacionPush } = require("./pushNotification.service");

// const enviarNotificacion = async (req, res) => {
//   try {
//     const { token, titulo, cuerpo } = req.body;
//     // Validar los campos requeridos
//     if (!token || !titulo || !cuerpo) {
//       return res.status(400).json({ error: "Todos los campos son requeridos" });
//     }
//     // Enviar la notificación push
//     await enviarNotificacionPush(token, titulo, cuerpo);
//     return res
//       .status(200)
//       .json({ mensaje: "Notificación push enviada correctamente" });
//   } catch (error) {
//     console.error("Error al enviar la notificación push:", error);
//     return res
//       .status(500)
//       .json({ error: "Error al enviar la notificación push" });
//   }
// };

// module.exports = { enviarNotificacion };
