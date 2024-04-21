const express = require('express');
const router = express.Router();
const validarTokenMiddleware = require('../middleware/userAuthentication')
const checkRol = require('../middleware/roleAuth')

const {
    newRol,
    getRoles,
    getRoleName
} = require("../controller/rol,controller");

router.get("/getRoles", getRoles);
router.post("/newRol", newRol);
router.get('/getRolName/:roleId', getRoleName)

module.exports = router;
