const express = require("express");
const Notificacion = require("../models/notificacion"); 
const app = express();


app.use(express.json());

app.post("/notificaciones", async (req, res) => {
  try {
    const { nombre, telefono, torre, departamento, monto, fecha, concepto } = req.body;

    const nuevaNotificacion = new Notificacion({
      nombre,
      telefono,
      torre,
      departamento,
      monto,
      fecha,
      concepto,
    });

    await nuevaNotificacion.save();

    res.status(201).json({ mensaje: "Multa registrada exitosamente", Notificacion: nuevaNotificacion });
  } catch (error) {
    console.error("Error al registrar la multa:", error);
    res.status(500).json({ mensaje: "Error al registrar la multa" });
  }
});

app.get("/notificaciones/resumen", async (req, res) => {
  try {
    const { departamento } = req.query;  
    
    if (!departamento) {
      return res.status(400).json({ mensaje: "El departamento es requerido" });
    }

    const notificaciones = await Notificacion.find({ departamento });

    res.status(200).json({ notificaciones });
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    res.status(500).json({ mensaje: "Error al obtener las notificaciones" });
  }
});


app.delete("/notificaciones/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByIdAndDelete(id);

    if (!notificacion) {
      return res.status(404).json({ mensaje: "Notificación no encontrada" });
    }

    res.status(200).json({ mensaje: "Notificación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    res.status(500).json({ mensaje: "Error al eliminar la notificación" });
  }
});

  
  

module.exports = app;