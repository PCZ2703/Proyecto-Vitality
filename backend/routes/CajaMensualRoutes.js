const express = require('express');
const router = express.Router();
const CajaMensual = require('../models/CajaMensual');

router.get('/', async (req, res) => {
    try {
        const cajas = await CajaMensual.find();
        res.json(cajas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const caja = await CajaMensual.findById(req.params.id);
        res.json(caja);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaCaja = new CajaMensual(req.body);
        const cajaGuardada = await nuevaCaja.save();
        res.status(201).json({ codigo: 201, data: cajaGuardada, mensaje: "caja almacenada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const cajaActualizada = await CajaMensual.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: cajaActualizada, mensaje: "caja actualizada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await CajaMensual.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "caja eliminada" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;