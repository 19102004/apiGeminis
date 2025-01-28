const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  password: { type: String, required: true },
  telefono: { type: String, required: true },
  torre: { type: String, required: true },
  departamento: { type: String, required: true },
  tipo: {
    type: String,
    enum: ["Administrador", "Dueño", "Inquilino"],
    required: true,
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
