const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Terapeuta', 'Producto']
    },
    referencia: {
        type: String,
        required: true
    },
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    resena: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Calificacion", calificacionSchema);