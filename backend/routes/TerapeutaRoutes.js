const express = require('express');
const router = express.Router();
const Terapeuta = require('../models/Terapeuta');

router.get('/', async (req, res) => {
    try {
        const terapeutas = await Terapeuta.find();
        res.json(terapeutas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const terapeuta = await Terapeuta.findById(req.params.id);
        res.json(terapeuta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoTerapeuta = new Terapeuta(req.body);
        const terapeutaGuardado = await nuevoTerapeuta.save();
        res.status(201).json({ codigo: 201, data: terapeutaGuardado, mensaje: "terapeuta almacenado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const terapeutaActualizado = await Terapeuta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: terapeutaActualizado, mensaje: "terapeuta actualizado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Terapeuta.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "terapeuta eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;