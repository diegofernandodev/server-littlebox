const appLittlebox = require("./config/server"); // Asegúrate de que la ruta sea correcta
require("./config/DatabaseLittleBox"); // Asegúrate de que la ruta sea correcta

const HOST = '0.0.0.0'; // Esto hace que el servidor escuche en todas las interfaces de red disponibles

appLittlebox.listen(appLittlebox.get("port"),HOST, ()=> {
    console.log('Server in running on port:', appLittlebox.get('port'))
}); // Usa appLittlebox en lugar de serverLittlebox
