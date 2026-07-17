const mongoose = require('mongoose');

const suscripcionSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    cicloFacturacion: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Activa', 'Pausada', 'Cancelada']
    },
    historialCambios: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model("Suscripcion", suscripcionSchema);