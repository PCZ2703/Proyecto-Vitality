const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        required: true,
        enum: ['Leida', 'No leida']
    }
});

module.exports = mongoose.model("Notificacion", notificacionSchema);