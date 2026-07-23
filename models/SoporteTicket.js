const mongoose = require('mongoose');

const soporteTicketSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    asunto: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Abierto', 'En proceso', 'Resuelto']
    },
    respuesta: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("SoporteTicket", soporteTicketSchema);