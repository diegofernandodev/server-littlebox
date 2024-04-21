const jwt = require("jsonwebtoken");

const tokenSign = async (user) => {
  const { _id, email, tenantId, rol } = user;
  const payload = { userId: _id, email, tenantId, rol };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };
  const token = jwt.sign(payload, secret, options);
  return token;
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Puedes personalizar el manejo de errores según tus necesidades
    throw new Error("Token inválido o caducado");
  }
};

const decodeSign = (token) => {
  return jwt.decode(token, null);
};

module.exports = { tokenSign, decodeSign, verifyToken };
