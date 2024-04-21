// Importación del módulo mongoose para interactuar con MongoDB
const mongoose = require("mongoose");

// Conexión a la base de datos MongoDB llamada "LittleBox" mongodb://localhost:27017/
mongoose

  .connect(process.env.DATABASE_MONGO, {
    // .connect("mongodb://127.0.0.1:27017/LittleBox", {

  useUnifiedTopology: true, // Se utiliza para manejar el nuevo motor de topología de MongoDB
    useNewUrlParser: true,    // Se utiliza para analizar correctamente las URL de conexión
  })
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.log("No fue posible realizar la conexión a la base de datos", error);
  });

