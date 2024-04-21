const { movimientoDeCajaMenor, obtenerGastoRealMesActual, 
  obtenerTercerosMasUtilizados,
  obtenerCategoriaMasUtilizadas,
   } = require("../services/consultas.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");


const consultasController = {};

consultasController.movimientoDeCajaMenor = async (req, res) => {
    try {
        console.log("Body de la solicitud:", req.body);
        console.log("query de la solicitud:", req.query);
      const { fechaInicio, fechaFin, categoria, tercero } = req.body; // Cambiar req.body a req.query
      const tenantId = req.tenantId;
      
  
      const verMovimientoDeCaja = await movimientoDeCajaMenor(tenantId, fechaInicio, fechaFin, categoria, tercero);
      ResponseStructure.status = 200;
      ResponseStructure.message = "Movimiento de caja generado exitosamente";
      ResponseStructure.data = verMovimientoDeCaja;
  
      res.status(200).json(ResponseStructure);
  
    } catch (error) {
      ResponseStructure.status = 404;
      ResponseStructure.message = "Movimiento de caja no se pudo generar";
      ResponseStructure.data = error.message;
  
      res.status(404).json(ResponseStructure);
    }
  }
  

  consultasController.obtenerGastoRealMesActualC= async (req, res, next) => {
    const tenantId = req.user.tenantId; // Suponiendo que tienes un middleware de autenticación que agrega el tenantId al objeto de solicitud (req.user)
    
    try {
      const gastoRealMesActual = await obtenerGastoRealMesActual(tenantId);
      res.status(200).json({ gastoRealMesActual });
    } catch (error) {
      next(error);
    }
  };



  consultasController.obtenerTercerosMasUtilizadosC = async (req, res, next) => {
    try {
      const tenantId = req.user.tenantId; // Suponiendo que el middleware userAuthentication coloca el tenantId en req.user
      const tercerosMasUtilizados = await obtenerTercerosMasUtilizados(tenantId);
      res.status(200).json(tercerosMasUtilizados);
    } catch (error) {
      next(error);
    }
  };


  consultasController.obtenercategoriasMasUtilizadasC = async (req, res, next) => {
    try {
      const tenantId = req.user.tenantId; // Suponiendo que el middleware userAuthentication coloca el tenantId en req.user
      const categoriasMasUtilizados = await obtenerCategoriaMasUtilizadas(tenantId);
      res.status(200).json(categoriasMasUtilizados);
    } catch (error) {
      next(error);
    }
  };


  
  
module.exports = consultasController