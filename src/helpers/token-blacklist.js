// En tu directorio "helpers" o "config" o una carpeta similar
const revokedTokens = new Set();

function addToRevokedTokens(token) {
  revokedTokens.add(token);
}

function isTokenRevoked(token) {
  return revokedTokens.has(token);
}

module.exports = { addToRevokedTokens, isTokenRevoked };
