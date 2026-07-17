require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo conectado");
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/api/productos', require('./routes/ProductoRoutes'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Servidor API: http://localhost:" + PORT + "/api/productos");
});