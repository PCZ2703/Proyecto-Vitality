const express = require('express');
const router = express.Router();
const Suscripcion = require('../models/Suscripcion');

router.get('/', async (req, res) => {
    try {
        const suscripciones = await Suscripcion.find();
        res.json(suscripciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const suscripcion = await Suscripcion.findById(req.params.id);
        res.json(suscripcion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaSuscripcion = new Suscripcion(req.body);
        const suscripcionGuardada = await nuevaSuscripcion.save();
        res.status(201).json({ codigo: 201, data: suscripcionGuardada, mensaje: "suscripcion almacenada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const suscripcionActualizada = await Suscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: suscripcionActualizada, mensaje: "suscripcion actualizada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Suscripcion.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "suscripcion eliminada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;