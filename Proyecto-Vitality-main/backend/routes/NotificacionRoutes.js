const express = require('express');
const router = express.Router();
const Notificacion = require('../models/Notificacion');

router.get('/', async (req, res) => {
    try {
        const notificaciones = await Notificacion.find();
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const notificacion = await Notificacion.findById(req.params.id);
        res.json(notificacion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaNotificacion = new Notificacion(req.body);
        const notificacionGuardada = await nuevaNotificacion.save();
        res.status(201).json({ codigo: 201, data: notificacionGuardada, mensaje: "notificacion almacenada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const notificacionActualizada = await Notificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: notificacionActualizada, mensaje: "notificacion actualizada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Notificacion.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "notificacion eliminada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;