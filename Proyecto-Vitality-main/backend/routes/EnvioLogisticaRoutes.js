const express = require('express');
const router = express.Router();
const EnvioLogistica = require('../models/EnvioLogistica');

router.get('/', async (req, res) => {
    try {
        const envios = await EnvioLogistica.find();
        res.json(envios);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const envio = await EnvioLogistica.findById(req.params.id);
        res.json(envio);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoEnvio = new EnvioLogistica(req.body);
        const envioGuardado = await nuevoEnvio.save();
        res.status(201).json({ codigo: 201, data: envioGuardado, mensaje: "envio almacenado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const envioActualizado = await EnvioLogistica.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: envioActualizado, mensaje: "envio actualizado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await EnvioLogistica.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "envio eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;