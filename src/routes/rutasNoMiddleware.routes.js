const { Router } = require("express");
const router = Router();
const {
  guardarUsuario,
} = require("../controller/user.controller");

const {
  guardarEmpresa,
} = require("../controller/empresas.controller");


// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
// const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});



// Ruta para guardar una nuevo usuario
router.post("/guardarUsuario", guardarUsuario);

// Ruta para guardar una empresa por su ID
router.post("/guardarEmpresa",guardarEmpresa);




module.exports = router;
