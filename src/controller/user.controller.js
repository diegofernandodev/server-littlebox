const { createUser, 
  loginUser, 
  getUsers,
  getUserById,
  activeUser,
  inactiveUser,
  DenyUser,
  changeUserPassword,
  generarCodigoRestablecimiento,
  enviarCorreoRestablecimiento,
  restablecerContraseña,
  logout,
  editUser,
  getUsersSuperU
  } = require('../services/user.services');

const User = require('../models/user.model');

const companyModel = require('../models/compay.model')

const rolModel= require ('../models/roles.model')
const bcrypt = require('bcrypt');
const ResponseStructure = require('../helpers/ResponseStructure')





const controller = {};

//crear usuario 
controller.postUser = async (req, res) => {
  await createUser(req, res);
};

//activar usuario
controller.activeUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const activedUser = await activeUser(userId); 
    res.status(200).json(activedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//inactivar
controller.inactiveUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const inactivedUser = await inactiveUser(userId); 
    res.status(200).json(inactivedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//denegar

//inactivar
controller.denyUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deniedUser = await DenyUser(userId); 
    res.status(200).json(deniedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//iniciar sesion
controller.postLogin = async (req, res) => {
  await loginUser(req, res);
};



controller.getUsers = async (req, res) => {
  try {
    const { tenantId } = req.params;

    let query = { tenantId: tenantId };
    
    // Si el rol es "gerente", listar usuarios en estado "activo"
    const gerenteRole = await rolModel.findOne({ rol: 'Administrador' });
    if (gerenteRole) {
      query.rol = gerenteRole._id;
      query.status = 'activo';
    } else {
      query.status = 'pendiente';
    }

    const listUsers = await getUsers(tenantId); // Llama a la función getUsers para obtener usuarios específicos para el tenantId
    
    res.json(listUsers); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

controller.getUsersSuperUC = async (req, res) => {
  try {
    const listUsers = await getUsersSuperU(); // Llama a getUsersSuperU sin ningún parámetro
    res.json(listUsers);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};


 
//usuario por id
controller.getUserId= async (req, res) => {
  try {
    const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la solicitud
    const user = await getUserById(userId); // Llamar al servicio para obtener el usuario por ID
    res.json({ user }); // Enviar el usuario como respuesta
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Cambiar contraseña
controller.changePassword = async (req, res) => {
  const userId = req.params.userId; // Corregir aquí
  const { newPassword } = req.body;
  try {
    await changeUserPassword(userId, newPassword);
    res.status(200).json({ message: 'Contraseña cambiada exitosamente', userId });
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//restablecer contraseña

controller.solicitarRestablecimiento = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await User.findOne({ email: email });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const codigoRestablecimiento = generarCodigoRestablecimiento();
    usuario.resetCode = codigoRestablecimiento;
    // Establecer la expiración del código de restablecimiento (por ejemplo, 1 hora)
    usuario.resetExpires = Date.now() + 3600000; // 1 hora en milisegundos
    await usuario.save();

    await enviarCorreoRestablecimiento(email, codigoRestablecimiento);

    res.json({ success: 'Solicitud de restablecimiento enviada con éxito' });
  } catch (error) {
    console.error('Error al solicitar restablecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

controller.restablecerContraseña = async (req, res) => {
  try {
    const { email, codigo, nuevaContraseña } = req.body;

    console.log(`Solicitud de restablecimiento de contraseña para ${email} con código ${codigo}`);

    const usuario = await User.findOne({ email: email, resetCode: codigo });

    if (!usuario) {
      return res.status(400).json({ error: 'El código de restablecimiento proporcionado es inválido.' });
    }

    // Verificar si el código ha caducado
    if (usuario.resetExpires < Date.now()) {
      return res.status(400).json({ error: 'El código de restablecimiento ha caducado. Solicita un nuevo restablecimiento.' });
    }

    // Restablecer la contraseña y limpiar el código
    usuario.password = await bcrypt.hash(nuevaContraseña, 12);
    usuario.resetCode = null;
    usuario.resetExpires = null;
    usuario.firstLogin = false;

    await usuario.save();

    console.log(`Contraseña restablecida con éxito para ${email}`);
    res.json({ success: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};



//cerrar sesion
controller.logout =async(req,res)=>{
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
// Función para editar datos de usuario
controller.editUsered = async (req, res) => {
  const userId = req.params.userId;
  const newData = req.body;
  try {
    const updatedUser = await editUser(userId, newData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al editar datos de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = controller;
