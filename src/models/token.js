const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  departamento: { type: String, required: true },
  tokenTemporal: { type: String, required: true },
  tokenPermanente: { type: String, required: false }, 
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
