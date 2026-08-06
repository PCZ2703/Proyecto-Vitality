const mongoose = require('mongoose');

const envioLogisticaSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    transportista: {
        type: String,
        required: true
    },
    numeroSeguimiento: {
        type: String,
        required: true
    },
    estadoEntrega: {
        type: String,
        required: true,
        enum: ['Preparando', 'En transito', 'Entregado']
    }
});

module.exports = mongoose.model("EnvioLogistica", envioLogisticaSchema);