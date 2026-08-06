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
app.use('/api/productos', require('./routes/ProductoRoutes'));
app.use('/api/usuarios', require('./routes/UsuarioRoutes'));
app.use('/api/checkins', require('./routes/CheckinRoutes'));
app.use('/api/suscripciones', require('./routes/SuscripcionRoutes'));
app.use('/api/terapeutas', require('./routes/TerapeutaRoutes'));
app.use('/api/cajas-mensuales', require('./routes/CajaMensualRoutes'));
app.use('/api/sesiones', require('./routes/SesionRoutes'));
app.use('/api/pagos', require('./routes/PagoRoutes'));
app.use('/api/soporte-tickets', require('./routes/SoporteTicketRoutes'));
app.use('/api/calificaciones', require('./routes/CalificacionRoutes'));
app.use('/api/envios-logistica', require('./routes/EnvioLogisticaRoutes'));
app.use('/api/notificaciones', require('./routes/NotificacionRoutes'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Servidor API: http://localhost:" + PORT + "/api/productos");
});