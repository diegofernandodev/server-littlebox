const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mail = require("@sendgrid/mail");
const { listaNegraService } = require("../services/blackList.service");
const { tokenSign, verifyToken } = require("../helpers/generateToken");

/**
 * Autentica al usuario con las credenciales proporcionadas y devuelve un token de autenticación.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<{ success: string, token: string, tenantId: string }>} - Objeto con información de éxito, token y tenantId.
 * @throws {Error} - Se lanza un error si las credenciales son incorrectas o si ocurre un error en el proceso.
 */
const loginUser = async (email, password) => {
  try {
    console.log(
      `Intentando iniciar sesión para el usuario con email: ${email}`,
    );

    // Verificar que el email coincida
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Error en usuario/contraseña: Usuario no encontrado.");
    }

    // Comparar la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Error en usuario/contraseña: Contraseña incorrecta.");
    }

    // Crear y devolver el token de autenticación
    const token = await tokenSign(user);
    return {
      success: "Login correcto",
      token,
      tenantId: user.tenantId,
      rol: user.rol,
    }; // Incluir tenantId en la respuesta
  } catch (error) {
    console.error(error);
    throw new Error(`Error al iniciar sesión: ${error.message}`);
  }
};

/**
 * Crea un token de autenticación utilizando la información del usuario.
 * @param {Object} user - Objeto de usuario con información como _id, email y tenantId.
 * @returns {string} - Token de autenticación.
 */
const crearToken = (user) => {
  const { _id, email, tenantId } = user;

  const payload = { userId: _id, email, tenantId };
  const secret = process.env.JWT_SECRET; // Reemplaza 'tu_secreto' con tu secreto real
  const options = { expiresIn: "1h" };

  const token = jwt.sign(payload, secret, options);
  return token;
};

/**
 * Cierra la sesión del usuario revocando un token y realizando otras operaciones de cierre de sesión.
 * @param {string} token - Token de autenticación a revocar.
 * @returns {Promise<{ success: boolean, message: string }>} - Objeto con información de éxito y mensaje.
 * @throws {Error} - Se lanza un error si ocurre un problema durante el proceso.
 */
const logout = async (token) => {
  try {
    // Verificar si el token está en la lista negra en la base de datos
    const tokenEnListaNegra = await listaNegraService.tokenEnListaNegra(token);
    if (tokenEnListaNegra) {
      console.log("Token ya revocado.");
      throw new Error("Token already revoked.");
    }

    // Agregar el token a la lista negra
    await listaNegraService.agregarToken(token);
    console.log("Token agregado a la lista negra:", token);

    // Otras operaciones de cierre de sesión según sea necesario

    return { success: true, message: "Logout successful." };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
};

/**
 * Objeto para manejar el proceso de restablecimiento de contraseña.
 */
const resetPassword = {
  /**
   * Genera un token de restablecimiento de contraseña y envía un correo electrónico al usuario.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} tenantId - ID del tenant al que pertenece el usuario.
   * @returns {Promise<string>} - Token de restablecimiento de contraseña.
   * @throws {Error} - Se lanza un error si el usuario no se encuentra o si ocurre un error durante el proceso.
   */
  generateToken: async (email, tenantId) => {
    try {
      const user = await User.findOne({ email, tenantId });

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      const token = await tokenSign(user);

      console.log("Token generado:", token);

      // Llama a la función sendEmail con el token y el usuario
      await resetPassword.sendEmail(email, user, token);

      return token;
    } catch (error) {
      console.error(
        "Error al generar el token de restablecimiento de contraseña:",
        error,
      );
      throw new Error(
        "Error al generar el token de restablecimiento de contraseña.",
      );
    }
  },

  /**
   * Envía un correo electrónico al usuario con un enlace para restablecer la contraseña.
   * @param {string} email - Correo electrónico del usuario.
   * @param {Object} token - Token de restablecimiento de contraseña.
   * @returns {Promise<{ success: boolean, message: string }>} - Objeto con información de éxito y mensaje.
   * @throws {Error} - Se lanza un error si ocurre un problema durante el envío del correo electrónico.
   */
  sendEmail: async (email, token) => {
    try {
      const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "littleboxx23@gmail.com",
          pass: "ccnh rvez uzho akcs",
        },
      };

      // Crea un transporte una vez
      const transport = nodemailer.createTransport(config);

      // Crea el enlace de restablecimiento de contraseña
      const url = `http://localhost:4000/newPassword?token=${token}`;

      const mensaje = {
        from: "littleboxx23@gmail.com",
        to: email,
        subject: "Restablecimiento de contraseña",
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace:\n${url}`,
      };

      // Envía el correo electrónico utilizando el mismo transporte
      const info = await transport.sendMail(mensaje);

      console.log("Correo electrónico enviado:", info);

      return {
        success: true,
        message: "Correo electrónico enviado correctamente.",
      };
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico.");
    }
  },
};

/**
 * Objeto para manejar el proceso de restablecimiento de contraseña.
 */
const restablecerPassword = {
  /**
   * Procesa un token de restablecimiento de contraseña y actualiza la contraseña del usuario.
   * @param {string} token - Token de restablecimiento de contraseña.
   * @param {string} password - Nueva contraseña del usuario.
   * @returns {Promise<Object>} - Objeto de usuario con la contraseña actualizada.
   * @throws {Error} - Se lanza un error si el token es inválido o si ocurre un problema durante el proceso.
   */
  processResetToken: async (token, password) => {
    try {
      // Decodificar el token para obtener la información del usuario (en este caso, el correo electrónico)
      const decodedToken = await verifyToken(token);

      // Buscar el usuario en la base de datos por el correo electrónico
      const user = await User.findOne({ email: decodedToken.email });

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      // Actualizar la contraseña del usuario
      user.password = await bcrypt.hash(password, 12);
      await user.save();

      return user;
    } catch (error) {
      console.error("Error al procesar el token:", error);
      throw new Error("Error al procesar el token.");
    }
  },
};

module.exports = {
  loginUser,
  resetPassword,
  restablecerPassword,
  crearToken,
  logout,
};
