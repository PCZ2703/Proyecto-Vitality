const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Capsula', 'Infusion', 'Gota', 'Shampoo']
    },
    ingredientes: {
        type: [String],
        required: true
    },
    beneficios: {
        type: [String],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("Producto", productoSchema);