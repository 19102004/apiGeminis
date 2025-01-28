const express = require("express");
const Usuario = require("../models/usuario"); 
const app = express();

app.use(express.json()); 


app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, password, telefono, torre, departamento, tipo } = req.body;

    const nuevoUsuario = new Usuario({
      nombre,
      password,
      telefono,
      torre,
      departamento,
      tipo,
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ mensaje: "Error al registrar el usuario" });
  }
});


app.get("/usuarios/resumen", async (req, res) => {
    try {
      const usuarios = await Usuario.find({}, "nombre telefono tipo");
  
      res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al obtener el resumen de usuarios:", error);
      res.status(500).json({ mensaje: "Error al obtener el resumen de usuarios" });
    }
  });


  const jwt = require('jsonwebtoken');

  app.get("/usuarios/existe", async (req, res) => {
    try {
      const { telefono, password } = req.query;
  
      if (!telefono || !password) {
        return res.status(400).json({ mensaje: "El número de teléfono y la contraseña son requeridos" });
      }
  
      const usuario = await Usuario.findOne({ telefono, password });
  
      if (usuario) {
        const token = jwt.sign(
          { id: usuario._id, telefono: usuario.telefono, tipo: usuario.tipo }, 
          'tu_clave_secreta', 
          { expiresIn: '1h' } 
        );
  
        res.status(200).json({
          mensaje: "Usuario encontrado",
          usuario: {
            id: usuario._id, 
            telefono: usuario.telefono,
            tipo: usuario.tipo,
            departamento: usuario.departamento, 
          },
          token, 
        });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error al comprobar si el usuario existe:", error);
      res.status(500).json({ mensaje: "Error al comprobar si el usuario existe" });
    }
  });
  
  
  
  
  app.get("/usuarios/depa", async (req, res) => {
    try {
      // Obtener el id del usuario desde la consulta (query) o desde el body (dependiendo de la implementación)
      const { id } = req.query;
  
      // Verificamos si se proporciona el id
      if (!id) {
        return res.status(400).json({ mensaje: "El ID del usuario es requerido" });
      }
  
      // Buscar el usuario por su id y extraer los campos deseados
      const usuario = await Usuario.findById(id, "nombre telefono tipo torre departamento");
  
      // Verificar si el usuario existe
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      // Enviar la respuesta con los datos del usuario
      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al obtener el resumen de usuarios:", error);
      res.status(500).json({ mensaje: "Error al obtener el resumen de usuarios" });
    }
  });
  
  
  

module.exports = app;
