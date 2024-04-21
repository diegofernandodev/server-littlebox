const fs = require('fs');
const path = require('path');

exports.obtenerFacturaPorURL = (req, res) => {
  const facturaUrl = req.query.facturaUrl;

  if (!facturaUrl) {
    return res.status(400).json({ error: 'URL de la factura no proporcionada' });
  }

  const facturaPath = path.join(__dirname, '..', 'public', facturaUrl);

  if (!fs.existsSync(facturaPath)) {
    return res.status(404).json({ error: 'Factura no encontrada' });
  }

  fs.readFile(facturaPath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer la factura' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.send(data);
  });
};

exports.eliminarFactura = (req, res) => {
    const facturaId = req.params.facturaId;
  
    // Obtener la ruta del archivo de la factura
    const facturaPath = path.join(__dirname, '..', 'public', 'facturas', `${facturaId}.pdf`);
  
    // Verificar si el archivo de la factura existe
    if (!fs.existsSync(facturaPath)) {
      return res.status(404).json({ error: 'La factura no existe' });
    }
  
    // Eliminar el archivo de la factura
    fs.unlink(facturaPath, (err) => {
      if (err) {
        console.error('Error al eliminar la factura:', err);
        return res.status(500).json({ error: 'Error al eliminar la factura' });
      }
      res.status(200).json({ message: 'Factura eliminada correctamente' });
    });
  };
