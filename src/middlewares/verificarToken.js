const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ mensaje: "Token no proporcionado" });
  }

  jwt.verify(token, "tu_clave_secreta", (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: "Token inválido" });
    }
    req.userId = decoded.id; 
    next(); 
  });
};

module.exports = verificarToken;
