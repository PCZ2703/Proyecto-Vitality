const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');

router.get('/', async (req, res) => {
    try {
        const checkins = await Checkin.find();
        res.json(checkins);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const checkin = await Checkin.findById(req.params.id);
        res.json(checkin);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoCheckin = new Checkin(req.body);
        const checkinGuardado = await nuevoCheckin.save();
        res.status(201).json({ codigo: 201, data: checkinGuardado, mensaje: "checkin almacenado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const checkinActualizado = await Checkin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: checkinActualizado, mensaje: "checkin actualizado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Checkin.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "checkin eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;