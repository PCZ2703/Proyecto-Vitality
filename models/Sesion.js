const mongoose = require('mongoose');

const sesionSchema = new mongoose.Schema({
    cliente: {
        type: String,
        required: true
    },
    terapeuta: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    notas: {
        type: String,
        default: ""
    },
    recomendaciones: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Sesion", sesionSchema);