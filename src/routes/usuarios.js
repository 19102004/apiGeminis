const express = require("express");
const Usuario = require("../models/usuario"); 
const Token = require('../models/token');

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
      const usuarios = await Usuario.find({}, "nombre password telefono tipo torre departamento");
        
      res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al obtener el resumen de usuarios:", error);
      res.status(500).json({ mensaje: "Error al obtener el resumen de usuarios" });
    }
  });

  

  app.get("/usuarios/perfil/:idUsuario", async (req, res) => {
    try {
      const { idUsuario } = req.params;
  
      const usuarios = await Usuario.find({ _id: idUsuario }, "nombre password telefono tipo torre departamento");
  
      res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al obtener el resumen de usuarios:", error);
      res.status(500).json({ mensaje: "Error al obtener el resumen de usuarios" });
    }
  });


  app.put("/usuarios/edit/:id", async (req, res) => {
    try {
      const { id } = req.params; 
      const { nombre, password, telefono } = req.body; 
  
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
     if (password && password !== usuario.password) {
      console.log("Contraseña diferente, eliminando todos los tokens...");

      await Token.deleteMany({ usuarioId: id });

      console.log("Todos los tokens han sido eliminados.");
    }
  
      usuario.nombre = nombre || usuario.nombre;
      usuario.password = password || usuario.password;
      usuario.telefono = telefono || usuario.telefono;
  
      await usuario.save();
  
      res.status(200).json({
        mensaje: "Usuario actualizado correctamente",
        usuario,
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
  });
  
  

  


  const jwt = require('jsonwebtoken');

  app.get("/usuarios/existe", async (req, res) => {
    console.log(req.query);

    try {
      const { telefono, password, recordar } = req.query;
  
      if (!telefono || !password) {
        return res.status(400).json({ mensaje: "El número de teléfono y la contraseña son requeridos" });
      }
  
      const usuario = await Usuario.findOne({ telefono, password });
  
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      const tokenTemporal = jwt.sign(
        { id: usuario._id, telefono: usuario.telefono, tipo: usuario.tipo },
        "tu_clave_secreta",
        { expiresIn: "3m" }
      );
  
      let tokenPermanente = null;
      
      if (recordar === "true") {
        tokenPermanente = jwt.sign(
          { id: usuario._id, telefono: usuario.telefono, tipo: usuario.tipo },
          "tu_clave_secreta_permanente",
          { expiresIn: "30d" }
        );
      }
  
      const nuevoToken = new Token({
        usuarioId: usuario._id,
        departamento: usuario.departamento,
        tokenTemporal,
        tokenPermanente
      });
  
      await nuevoToken.save();
  
      res.status(200).json({
        mensaje: "Usuario encontrado",
        usuario: {
          id: usuario._id,
          telefono: usuario.telefono,
          tipo: usuario.tipo,
          departamento: usuario.departamento
        },
        tokenTemporal,
        tokenPermanente
      });
  
    } catch (error) {
      console.error("Error al comprobar si el usuario existe:", error);
      res.status(500).json({ mensaje: "Error al comprobar si el usuario existe" });
    }
  });




  app.get('/usuarios/verificar-tokens/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;
    
    try {
        const tokens = await Token.find({ usuarioId: idUsuario });

        if (tokens.length === 0) {
            return res.status(404).json({ message: 'No hay tokens asociados al usuario' });
        }

        res.json({ message: 'Tokens encontrados', tokens });
        
    } catch (error) {
        console.error('Error al verificar los tokens:', error);
        res.status(500).json({ message: 'Error al verificar los tokens', error });
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
