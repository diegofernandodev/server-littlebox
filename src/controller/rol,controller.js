const Controller = {};

const {
    newRol,
    getRoles,
    getRoleNameById
} = require("../services/roles.service");


Controller.getRoles = async (req, res) => {
  const listRoles = await getRoles();
  res.json(listRoles); 
};

Controller.newRol = async (req, res) => {
  await newRol(req.body);
  res.send("Rol guardado exitosamente");
};

Controller.getRoleName = async (req, res) => {
  const { roleId } = req.params; // Obtener el ID del rol de los parámetros de la solicitud
  try {
    const roleName = await getRoleNameById(roleId);
    res.status(200).json({ roleName });
  } catch (error) {
    console.error('Error en el controlador al obtener nombre del rol por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = Controller;
