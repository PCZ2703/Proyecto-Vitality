const express = require('express');
const router = express.Router();
const Pago = require('../models/Pago');

router.get('/', async (req, res) => {
    try {
        const pagos = await Pago.find();
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pago = await Pago.findById(req.params.id);
        res.json(pago);
    } catch (error) {
        res.status(500).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoPago = new Pago(req.body);
        const pagoGuardado = await nuevoPago.save();
        res.status(201).json({ codigo: 201, data: pagoGuardado, mensaje: "pago almacenado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const pagoActualizado = await Pago.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(202).json({ codigo: 202, data: pagoActualizado, mensaje: "pago actualizado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Pago.findByIdAndDelete(req.params.id);
        res.status(202).json({ codigo: 202, data: req.params.id, mensaje: "pago eliminado" });
    } catch (error) {
        res.status(400).json({ mensaje: error.message, mensajePersonalizado: "Se cayo el api" });
    }
});

module.exports = router;