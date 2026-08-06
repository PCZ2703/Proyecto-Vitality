const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    metodoPago: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Completado', 'Pendiente', 'Rechazado']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    referenciaSuscripcion: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Pago", pagoSchema);