require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const connectDB = require("./db");
const multas = require("./src/routes/multas");
const usuarios = require("./src/routes/usuarios");
const notificaciones = require("./src/routes/notificaciones");
const wasap = require("./src/routes/wasap");
const app = express();

//   http://localhost:5173  
connectDB();

app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.host; 
  if (origin === "https://condominio-geminis.vercel.app" || origin === "https://condominio-geminis.vercel.app") {
      next(); 
  } else {
      res.status(403).json({ error: 'Nel no tienes acceso' }); 
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", multas);
app.use("/api", usuarios);
app.use("/api", notificaciones);
app.use("/api", wasap);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); 
