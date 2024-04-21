const {
    actualizarSaldoCaja,
    verificarSaldoCaja
} = require("../services/saldoDeCaja.Service");
const { ResponseStructure } = require("../helpers/ResponseStructure");


const saldoCajaController = {};


saldoCajaController.actualizarSaldoCaja = async (req, res) => {

    try {
        const tenantId = req.tenantId;
        const saldoCaja = await actualizarSaldoCaja(tenantId)

        ResponseStructure.status = 200;
        ResponseStructure.message = "Saldo de caja obtenido exitosamente";
        ResponseStructure.data = saldoCaja;

        res.status(200).json(ResponseStructure);
    } catch (error) {
        ResponseStructure.status = 404;
        ResponseStructure.message = "No se pudo obtener el saldo de caja";
        ResponseStructure.data = error.message;

        res.status(404).json(ResponseStructure);
    }

};


saldoCajaController.verificarSaldoC = async (req, res) => {
    try {
        const tenantId = req.user.tenantId; // Suponiendo que el tenantId está en el campo "tenantId" del usuario del token

        await verificarSaldoCaja(tenantId);

        res.status(200).json({ message: 'Verificación de saldo de caja completada' });
    } catch (error) {
        console.error('Error en el controlador de saldo de caja:', error);
        res.status(500).json({ error: 'Ocurrió un error al verificar el saldo de caja' });
    }
};

module.exports = saldoCajaController;