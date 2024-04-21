// Importación de módulos y configuraciones necesarios para el servidor
const express = require("express");
const session = require('express-session');
const routesSolicitudes = require("../routes/solicitudes.routes");
const routesEgresos = require("../routes/egresos.routes");
const routesIngresos = require("../routes/ingresos.routes");
const routesCategorias = require("../routes/categorias.routes");
const routesTerceros = require("../routes/terceros.routes");
const routesUsers = require("../routes/user.routes");
const routesConsultas = require("../routes/consultas.routes");
const routesLogin = require("../routes/login.routes");
const companys = require("../routes/company.routes");
const estadoSolicitudes = require("../routes/estadoSolicitudes.routes")
const notification= require('../routes/notification.routes')
const saldoCajaRoutes= require('../routes/saldoDeCaja.routes')

const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require("path");


// Configuración del servidor Express
const appLittlebox = express();
const port = 4000;


appLittlebox.use(bodyParser.json({ limit: '50mb' })); // Increase limit to 50MB
appLittlebox.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// appLittlebox.set("view engine", "pug");
// appLittlebox.set("views", path.join(__dirname, "views"));

// Configuración de express-session
// appLittlebox.use(session({
//     secret: process.env.JWT_SECRET, // Secreto para la sesión
//     resave: false,
//     saveUninitialized: true,
// }));

appLittlebox.use(express.json()); // Habilitar el uso de JSON en las solicitudes HTTP
appLittlebox.use(cors()); // Configuración de CORS para permitir solicitudes desde otros dominios
appLittlebox.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rutas del servidor
appLittlebox.use(routesLogin);
appLittlebox.use(routesCategorias);
appLittlebox.use(routesSolicitudes);
appLittlebox.use(estadoSolicitudes);
appLittlebox.use(routesEgresos);
appLittlebox.use(routesIngresos);
appLittlebox.use(routesTerceros);
appLittlebox.use(routesUsers);
appLittlebox.use(companys)
appLittlebox.use(routesConsultas);
appLittlebox.use(notification)
appLittlebox.use(saldoCajaRoutes)

appLittlebox.set("port", process.env.PORT || port);

module.exports = appLittlebox;
