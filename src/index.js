const appLittlebox = require("./config/server"); // Asegúrate de que la ruta sea correcta
require("./config/DatabaseLittleBox"); // Asegúrate de que la ruta sea correcta

appLittlebox.listen(appLittlebox.get("port"), ()=> {
    console.log('Server in running on port:', appLittlebox.get('port'))
}); // Usa appLittlebox en lugar de serverLittlebox
