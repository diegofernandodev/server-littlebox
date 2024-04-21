const axios = require('axios');
const { apiUrl } = require('../config/environment');

exports.guardarFactura = async (factura, tenantId) => {
    // Generar un nombre único para la factura
    const facturaId = generateUniqueId();
  
    // Directorio donde se guardarán las facturas
    const directorioFacturas = path.join(__dirname, '..', 'public', 'facturas');
  
    // Crear el directorio si no existe
    if (!fs.existsSync(directorioFacturas)) {
      fs.mkdirSync(directorioFacturas, { recursive: true });
    }
  
    // Guardar la factura como un archivo en el sistema de archivos
    const facturaPath = path.join(directorioFacturas, `${facturaId}.pdf`);
  
    // Guardar el archivo
    fs.writeFileSync(facturaPath, factura);
  
    // Devolver el ID de la factura para su posterior referencia
    return facturaId;
  };
  
  // Función para generar un ID único para la factura
  function generateUniqueId() {
    // Implementa tu lógica para generar un ID único aquí
    // Por ejemplo, podrías utilizar la fecha actual junto con un número aleatorio
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }

exports.descargarFactura = async (facturaUrl, tenantId) => {
  try {
    const response = await axios.get(`${apiUrl}/factura`, {
      params: { facturaUrl, tenantId },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al descargar la factura');
  }
};

exports.eliminarFactura = async (facturaId, tenantId) => {
  try {
    const response = await axios.delete(`${apiUrl}/factura/${facturaId}`, {
      params: { tenantId }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la factura');
  }
};
