const mongoose = require('mongoose');

const terapeutaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    especialidad: {
        type: String,
        required: true
    },
    certificaciones: {
        type: [String],
        required: true
    },
    disponibilidadHoraria: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("Terapeuta", terapeutaSchema);