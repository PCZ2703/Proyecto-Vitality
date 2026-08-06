const express = require('express');
const router = express.Router();
const Calificacion = require('../models/Calificacion');

router.get('/', async (req, res) => {
    try {
        const calificaciones = await Calificacion.find();
        res.json(calificaciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const calificacion = await Calificacion.findById(req.params.id);
        res.json(calificacion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaCalificacion = new Calificacion(req.body);
        const calificacionGuardada = await nuevaCalificacion.save();
        res.status(201).json({ codigo: 201, data: calificacionGuardada, mensaje: "calificacion almacenada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const calificacionActualizada = await Calificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: calificacionActualizada, mensaje: "calificacion actualizada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Calificacion.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "calificacion eliminada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;