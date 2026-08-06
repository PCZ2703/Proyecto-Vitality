const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    nivelEnergia: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    calidadSueno: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    digestion: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    animo: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Checkin", checkinSchema);