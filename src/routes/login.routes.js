const { Router } = require("express");
const router = Router();
const {
    loginUser,
    restablecerPassword
} = require("../controller/login.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');

router.get("/", (req, res) => {
  res.send("LittleBox");
});


// Ruta para iniciar sesión
router.post("/login", loginUser);



module.exports = router;