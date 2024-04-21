const express = require('express');
const upload = require('../middleware/multerMiddleware');
const validarTokenMiddleware = require('../middleware/userAuthentication')
const checkRol = require('../middleware/roleAuth')
const { postUser, postLogin, getUsers, getUserId,activeUser, inactiveUser, denyUser, changePassword, solicitarRestablecimiento, restablecerContraseña, logout, editUsered,
    getUsersSuperUC} = require('../controller/user.controller');

const routes = express.Router();

routes.post('/registrer', upload.single('imgfirme'),   postUser);
routes.post('/iniciarSesion', postLogin);
routes.get('/getUsers/:tenantId',validarTokenMiddleware , checkRol(['Administrador','Gerente']),getUsers);
routes.put('/userActive/:id', validarTokenMiddleware , checkRol(['Administrador', 'Gerente', 'SuperUsuario']),  activeUser);
routes.put('/userInactive/:id', validarTokenMiddleware , checkRol(['Gerente', 'SuperUsuario']) ,inactiveUser);
routes.put('/userDeny/:id', validarTokenMiddleware , checkRol(['Gerente','Administrador']),  denyUser);
routes.put('/changePassword/:userId',  changePassword);
routes.post('/solicitar-restablecimiento', solicitarRestablecimiento);
routes.post('/restablecer-password', restablecerContraseña);
routes.post('/cerrar_sesion',validarTokenMiddleware,  logout)
routes.get('/getId/:userId', getUserId)
routes.put('/editUser/:userId', editUsered);
routes.get('/getUsersSuperU',validarTokenMiddleware , checkRol(['SuperUsuario']),getUsersSuperUC);

module.exports = routes;
