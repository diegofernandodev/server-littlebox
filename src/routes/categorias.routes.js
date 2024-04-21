const { Router } = require("express");
const router = Router();
const {
    obtenerCategorias,
    obtenerCategoriaId,
    guardarCategoria,
    eliminarCategoriaId,
    modificarCategoriaPorId,
} = require("../controller/categorias.controller");

// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las categorias
router.get("/obtenerTodasLasCategorias", verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategorias);

// Ruta para obtener una categoria por su ID
router.get("/obtenerCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategoriaId);

// Ruta para modificar una categoria por su ID
router.put("/modificarCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), modificarCategoriaPorId);

// Ruta para eliminar una categoria por su ID
router.delete("/eliminarCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), eliminarCategoriaId);

// Ruta para guardar una nueva categoria
router.post("/guardarCategoria",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), guardarCategoria);

module.exports = router;
