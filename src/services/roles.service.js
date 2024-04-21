const rol = require('../models/roles.model');

const newRol = async (Rol) => {
    let newRol = new rol(Rol);
    return await newRol.save();
};

const getRoles = async () => {
    return await rol.find();
};

const getRoleNameById = async (roleId) => {
  try {
      const role = await rol.findById(roleId);
      if (!role) {
          throw new Error('Rol no encontrado');
      }
      return role.nameRol; // Acceder al nombre del rol correctamente
  } catch (error) {
      console.error('Error al obtener nombre del rol por ID:', error);
      throw new Error('Error interno del servidor');
  }
};


module.exports = {
    newRol,
    getRoles,
    getRoleNameById
};
