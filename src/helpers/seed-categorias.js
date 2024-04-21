const categoriasPredeterminadas = [
  {
    nombre: "Papelería",
    global: true,
  },
  {
    nombre: "Cafetería",
    global: true,
  },
  {
    nombre: "Aseo",
    global: true,
  },
  {
    nombre: "Transporte",
    global: true,
  },
  {
    nombre: "Varios",
    global: true,
  },
];

const Categoria = require("../models/categoria.model");
const {obtenerCategorias} = require("../services/categoria.service")

const seedCategorias = async () => {
  try {
    // Verifica si las categorías predeterminadas ya están creadas
    const categorias = await obtenerCategorias();

    if (categorias.length === 0) {
      // Las categorías predeterminadas no están creadas, así que las crea
      await Categoria.insertMany(categoriasPredeterminadas);
      console.log("Categorías predeterminadas insertadas correctamente.");
    } else {
      // Las categorías predeterminadas ya están creadas, así que no hace nada
      console.log("Categorías predeterminadas ya están creadas.");
    }
  } catch (error) {
    console.error("Error al insertar categorías predeterminadas:", error);
  } finally {
    // Cierra la conexión a la base de datos u otras tareas finales si es necesario
    // ...
  }
};

// Llama a la función de semilla
module.exports = { seedCategorias };