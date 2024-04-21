const passwordGenerator = require("password-generator");

const randomPassword = async () => {
  const password = passwordGenerator(8, false); // Genera una contraseña de 16 caracteres sin símbolos
  return password;
};

const generateRandomPassword = async () => {
  // Genera una contraseña aleatoria (puedes usar tu propia lógica para generarla)
  const random_Password = randomPassword();

  // Encripta la contraseña aleatoria antes de enviarla al usuario
  const hashedPassword = await bcrypt.hash(random_Password, 12);

  return { random_Password, hashedPassword };
};
module.exports = { randomPassword, generateRandomPassword };
