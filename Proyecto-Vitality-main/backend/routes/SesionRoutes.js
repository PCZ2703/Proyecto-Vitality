const express = require('express');
const router = express.Router();
const Sesion = require('../models/Sesion');

router.get('/', async (req, res) => {
    try {
        const sesiones = await Sesion.find();
        res.json(sesiones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const sesion = await Sesion.findById(req.params.id);
        res.json(sesion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaSesion = new Sesion(req.body);
        const sesionGuardada = await nuevaSesion.save();
        res.status(201).json({ codigo: 201, data: sesionGuardada, mensaje: "sesion almacenada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const sesionActualizada = await Sesion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: sesionActualizada, mensaje: "sesion actualizada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Sesion.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "sesion eliminada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;