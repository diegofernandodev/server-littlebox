// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');

// // Ruta para obtener la factura por su URL
// router.get('/factura', (req, res) => {
//   const facturaUrl = req.query.facturaUrl; // URL de la factura proporcionada como parámetro de consulta

//   if (!facturaUrl) {
//     return res.status(400).json({ error: 'URL de la factura no proporcionada' });
//   }

//   // Construir la ruta completa del archivo de la factura
//   const facturaPath = path.join(__dirname, '..', 'public', facturaUrl);

//   // Verificar si el archivo existe
//   if (!fs.existsSync(facturaPath)) {
//     return res.status(404).json({ error: 'Factura no encontrada' });
//   }

//   // Leer el archivo de la factura y enviarlo como respuesta
//   fs.readFile(facturaPath, (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error al leer la factura' });
//     }

//     // Enviar el archivo como respuesta
//     res.setHeader('Content-Type', 'application/pdf'); // Ajusta el tipo MIME según corresponda
//     res.send(data);
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

router.get('obtenerFactura/', facturaController.obtenerFacturaPorURL);
router.delete('eliminarFactura/:Id', facturaController.eliminarFactura);

module.exports = router;
