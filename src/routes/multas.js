const express = require("express");
const Multa = require("../models/multa"); 
const verificarToken = require("../middlewares/verificarToken");
const app = express();

app.use(express.json());

// Ruta para registrar una multa
app.post("/multas", verificarToken, async (req, res) => {
  try {
    const { nombre, telefono, torre, departamento, monto, fecha, concepto } = req.body;

    const nuevaMulta = new Multa({
      nombre,
      telefono,
      torre,
      departamento,
      monto,
      fecha,
      concepto,
    });

    await nuevaMulta.save();

    res.status(201).json({ mensaje: "Multa registrada exitosamente", multa: nuevaMulta });
  } catch (error) {
    console.error("Error al registrar la multa:", error);
    res.status(500).json({ mensaje: "Error al registrar la multa" });
  }
});

// Ruta para obtener un resumen de multas
app.get("/multas/resumen", verificarToken, async (req, res) => {
  try {
    const multas = await Multa.find({}, "nombre concepto fecha");

    res.status(200).json(multas);
  } catch (error) {
    console.error("Error al obtener el resumen de multas:", error);
    res.status(500).json({ mensaje: "Error al obtener el resumen de multas" });
  }
});

// Ruta para obtener notificaciones de multas
app.get("/multas/notificaciones", verificarToken, async (req, res) => {
  try {
    const { torre, departamento } = req.query;

    if (!torre || !departamento) {
      return res.status(400).json({ mensaje: "Torre y departamento son requeridos" });
    }

    if (isNaN(torre) || isNaN(departamento)) {
      return res.status(400).json({ mensaje: "Los valores de torre y departamento deben ser numéricos" });
    }

    const torreNum = Number(torre);
    const departamentoNum = Number(departamento);

    const multas = await Multa.find(
      { torre: torreNum, departamento: departamentoNum },
      "nombre concepto fecha"
    );

    if (multas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron multas para este usuario" });
    }

    res.status(200).json(multas);
  } catch (error) {
    console.error("Error al obtener el resumen de multas:", error);
    res.status(500).json({ mensaje: "Error al obtener el resumen de multas" });
  }
});

// Exporta la aplicación
module.exports = app;
