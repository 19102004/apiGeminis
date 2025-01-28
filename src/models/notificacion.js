const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String, required: true },
    torre: { type: String, required: true },
    departamento: { type: String, required: true },
    monto: { type: Number, required: true },
    concepto: { type: String, required: true },
    fecha: { type: Date, required: true },
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);
