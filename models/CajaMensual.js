const mongoose = require('mongoose');

const cajaMensualSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    mes: {
        type: String,
        required: true
    },
    productosIncluidos: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("CajaMensual", cajaMensualSchema);