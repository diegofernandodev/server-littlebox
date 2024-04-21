const mongoose = require("mongoose");

const {
  loginUser,
  resetPassword,
  restablecerPassword,
  logout
} = require("../services/login.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");


/**
 * Controlador para autenticar a un usuario utilizando las credenciales proporcionadas.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void}
 */
const loginController = {};

loginController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    ResponseStructure.status = 200;
    ResponseStructure.message = 'Login exitoso';
    ResponseStructure.data = result;
    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = 'Error al iniciar sesión';
    ResponseStructure.data = error.message;
    res.status(500).json(ResponseStructure);
  }
};

/**
 * Controlador para cerrar la sesión de un usuario revocando el token de autenticación.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void}
 */
loginController.logout =async(req,res)=>{
  try {
    const token = req.headers.authorization;
    // Realizar el logout usando el servicio
    const result = await logout(token);
    // Respondemos con éxito
    ResponseStructure.status = 200;
    ResponseStructure.message = 'Logout exitoso';
    ResponseStructure.data = result;
    res.status(200).json(ResponseStructure);
  } catch (error) {
    // Manejar errores
    ResponseStructure.status = 500;
    ResponseStructure.message = 'Error al cerrar sesión';
    ResponseStructure.data = error.message;
    res.status(500).json(ResponseStructure);
  }
}

/**
 * Controlador para solicitar un token de restablecimiento de contraseña para un usuario.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void}
 */
loginController.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const tenantId = req.tenantId;
    // Generar token y enviar correo
    const token = await resetPassword.generateToken(email, tenantId);
    await resetPassword.sendEmail(email, token);
    ResponseStructure.status = 200;
    ResponseStructure.message = 'Correo electrónico de restablecimiento de contraseña enviado correctamente.';
    ResponseStructure.data = { email };
    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = 'Error al solicitar el token de restablecimiento de contraseña.';
    ResponseStructure.data = error.message;
    res.status(500).json(ResponseStructure);
  }
};

/**
 * Controlador para restablecer la contraseña de un usuario utilizando un token de restablecimiento.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void}
 */
loginController.restablecerPassword = async (req, res) => {
  try {
    const {password} = req.body;
    const token = req.headers.authorization;
    if (!token || !password) {
      throw new Error('Falta el token o la nueva contraseña en la solicitud.');
    }
    // Restablecer la contraseña
    const user = await restablecerPassword.processResetToken(token, password);
    ResponseStructure.status = 200;
    ResponseStructure.message = 'Contraseña restablecida correctamente.';
    ResponseStructure.data = user;
    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = 'Error al restablecer la contraseña.';
    ResponseStructure.data = error.message;
    res.status(500).json(ResponseStructure);
  }
};

module.exports = loginController;